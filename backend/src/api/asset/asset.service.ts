import { supabase } from '../../config/supabaseClient.js';

export class AssetService {
  static async findAll(user: any) {
    let query = supabase.from('asset').select(`
      *,
      category:category_id(name),
      sub_category:sub_category_id(name),
      status:status_id(name),
      condition:condition_id(name),
      department:department_id(name)
    `);

    if (user.role_name !== 'admin_diskominfo' && user.role_name !== 'auditor') {
      query = query.eq('department_id', user.department_id);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findById(id: string, user: any) {
    let query = supabase.from('asset').select(`
      *,
      category:category_id(name),
      sub_category:sub_category_id(name),
      status:status_id(name),
      condition:condition_id(name),
      department:department_id(name)
    `).eq('id', id);

    if (user.role_name !== 'admin_diskominfo' && user.role_name !== 'auditor') {
      query = query.eq('department_id', user.department_id); //
    }

    const { data, error } = await query.single();
    if (error) throw error;
    return data;
  }

  static async create(assetData: any, user: any) {
    if (user.role_name !== 'admin_diskominfo' && user.role_name !== 'auditor') {
      assetData.department_id = user.department_id; 
    }
    assetData.approval_status = "pending";
    assetData.status_id = '6494a4a6-41e6-42b5-be69-b587a0371c4f';

    const { data, error } = await supabase
      .from('asset')
      .insert([assetData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

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
    if (user.role_name !== 'admin_diskominfo' && user.role_name !== 'auditor') {
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

  static async requestDelete(id: string, reason: string, user: any) {
  // 1️⃣ Cek apakah aset milik dinas user
  const { data: asset, error: fetchError } = await supabase
    .from("asset")
    .select("id, department_id, approval_status")
    .eq("id", id)
    .single();

  if (fetchError || !asset) throw new Error("Aset tidak ditemukan.");
  if (user.role_name !== "admin_diskominfo" && asset.department_id !== user.department_id)
    throw new Error("Anda tidak memiliki akses untuk menghapus aset ini.");

  // 2️⃣ Update status approval jadi pending_delete
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
}
