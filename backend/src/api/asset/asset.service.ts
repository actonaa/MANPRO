import { supabase } from '../../config/supabaseClient.js';
import bwipjs from 'bwip-js';
import { v4 as uuidv4 } from 'uuid';
import { NotificationService } from "../notification/notification.service.js";
import { AuditService } from "../audit/audit.service.js";

export class AssetService {
  //Base SELECT reusable
  static baseSelect() {
    return `
      *,
      category:category_id (name),
      sub_category:sub_category_id (name),
      status:status_id(name),
      condition:condition_id(name),
      department:department_id(name)
    `;
  }
  //Helper reusable untuk role-based filter
  static applyUserFilter(query: any, user: any) {
    if (user.role_name !== 'admin_diskominfo' && user.role_name !== 'auditor') {
      query = query.eq('department_id', user.department_id);
    }
    return query;
  }
  static async findAll(user: any) {
    let query = supabase.from('asset').select(this.baseSelect());
    query = this.applyUserFilter(query, user);

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findById(id: string, user: any) {
    let query = supabase
      .from('asset')
      .select(this.baseSelect())
      .eq('id', id);

    query = this.applyUserFilter(query, user);

    const { data, error } = await query.single();
    if (error) throw error;
    return data;
  }

  static async findByBarcode(barcode: string, user: any) {
    let query = supabase
      .from('asset')
      .select(this.baseSelect())
      .eq('barcode', barcode);

    query = this.applyUserFilter(query, user);

    const { data, error } = await query.single();
    if (error) throw error;

    return data;
  }

  //User Service - (Create)
  static async create(assetData: any, user: any) {
    try {
      if (user.role_name !== 'admin_diskominfo' && user.role_name !== 'auditor') {
        assetData.department_id = user.department_id;
      }

      assetData.approval_status = "pending";
      assetData.status_id = '6494a4a6-41e6-42b5-be69-b587a0371c4f';

      const barcodeValue = `AST-${Date.now()}-${uuidv4().slice(0, 6)}`;
      const barcodeBuffer = await bwipjs.toBuffer({
        bcid: 'code128',
        text: barcodeValue,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      });

      const filePath = `assets/${barcodeValue}.png`;
      const { error: uploadError } = await supabase.storage
        .from('barcodes')
        .upload(filePath, barcodeBuffer, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      if (!process.env.SUPABASE_URL) {
        throw new Error("SUPABASE_URL is not defined in environment variables");
      }
      
      const barcodeUrl = `${process.env.SUPABASE_URL!}/storage/v1/object/public/barcodes/${filePath}`;

      assetData.barcode = barcodeValue;
      assetData.barcode_image_url = barcodeUrl;

      const { data, error } = await supabase
        .from('asset')
        .insert([assetData])
        .select()
        .single();

      if (error) throw error;

      // 🔔 Kirim notifikasi internal
      await NotificationService.notifyRoles(
        ["verifikator_dinas"], // Role penerima
        `Aset baru dibuat oleh ${user.name}: ${data.name}`,
        "info",
        `/assets/${data.id}`
      );

      // 📜 Catat audit log
      await AuditService.log(user, "CREATE", "asset", data.id, null, data);

      return data;
      
    } catch (error: any) {
      console.error("Error creating asset with barcode:", error);
      throw new Error(error.message);
    }
  }

  //User Service - (Update)
  static async update(id: string, assetData: any, user: any) {
    const { data: existingAsset, error: fetchError } = await supabase
      .from('asset')
      .select('id, department_id, approval_status')
      .eq('id', id)
      .single();

    if (fetchError || !existingAsset) {
      throw new Error('Aset tidak ditemukan.');
    }

    // User biasa hanya bisa ubah aset di dinasnya sendiri
    if (user.role_name !== 'admin_diskominfo') {
      if (existingAsset.department_id !== user.department_id) {
        throw new Error('Anda tidak memiliki akses untuk mengubah aset ini.');
      }

      assetData.approval_status = 'pending';
    }

    delete assetData.department_id;
    delete assetData.id;

    const { data, error } = await supabase
      .from('asset')
      .update(assetData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  //User Service - (Req-Delete)
  static async requestDelete(id: string, reason: string, user: any) {
  //Cek apakah aset milik dinas user
  const { data: asset, error: fetchError } = await supabase
    .from("asset")
    .select("id, department_id, approval_status")
    .eq("id", id)
    .single();

  if (fetchError || !asset) throw new Error("Aset tidak ditemukan.");
  if (user.role_name !== "admin_diskominfo" && asset.department_id !== user.department_id)
    throw new Error("Anda tidak memiliki akses untuk menghapus aset ini.");

  //Update status approval jadi pending_delete
  const { data, error } = await supabase
    .from("asset")
    .update({
      approval_status: "pending_delete",
      revision_notes: reason,
      status_id: (await supabase
        .from("asset_statuses")
        .select("id")
        .eq("name", "akan dihapus")
        .single()
      ).data?.id
    })
    .eq("id", id)
    .select()
    .single();

    if (error) throw error;
    return data;
  }

  //Verfikator Service
  static async verifyAsset(id: string, approval_status: string, notes: string | null, user: any) {
    if (user.role_name !== "verifikator")
      throw new Error("Hanya verifikator dinas yang dapat memverifikasi aset.");

    const { data: asset, error: fetchError } = await supabase
      .from("asset")
      .select("id, department_id, approval_status")
      .eq("id", id)
      .single();

    if (fetchError || !asset) throw new Error("Aset tidak ditemukan.");
    if (asset.department_id !== user.department_id)
      throw new Error("Anda tidak memiliki akses ke aset dinas lain.");

    // 🔹 Validasi status
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(approval_status)) {
      throw new Error(`Status tidak valid. Pilihan: ${validStatuses.join(", ")}`);
    }

    // 🔹 Siapkan data update
    const updateData: any = {
      approval_status: approval_status,
      revision_notes: notes || null,
      approved_by: user.sub,
      approved_at: new Date().toISOString(),
    };

    // Jika disetujui → ubah jadi aktif
    if (approval_status === "approved") {
      updateData.status_id = "1b2ccf3a-3b0a-4662-a742-cf52039d98d4"; // ID "Aktif"
    }

    // 🔹 Update ke database
    const { data, error } = await supabase
      .from("asset")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
