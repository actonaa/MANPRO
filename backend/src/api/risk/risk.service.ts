import { supabase } from '../../config/supabaseClient.js';
import type { Risk, RiskTreatment } from "../../types/model.js";

export class RiskService {
  static async findAll(user: any) {
    let query = supabase.from('risk').select(`
      *,
      asset:asset_id(name, lokasi),
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
    let query = supabase.from('risk').select(`
      *,
      asset:asset_id(name, lokasi),
      department:department_id(name)
    `).eq('id', id);

    if (user.role_name !== 'admin_diskominfo' && user.role_name !== 'auditor') {
      query = query.eq('department_id', user.department_id);
    }

    const { data, error } = await query.single(); // .single() untuk mendapatkan satu objek

    if (error) throw error;
    return data;
  }

  static async create(riskData: any, user: any) {
  //Set department otomatis
  if (user.role_name !== "admin_diskominfo") {
    riskData.department_id = user.department_id;
  }

  //Pastikan aset sudah disetujui
  const { data: asset, error: assetErr } = await supabase
    .from("asset")
    .select("id, approval_status")
    .eq("id", riskData.asset_id)
    .single();

  if (assetErr || !asset) throw new Error("Aset tidak ditemukan.");
  if (asset.approval_status !== "approved")
    throw new Error("Risiko hanya bisa ditambahkan untuk aset yang sudah disetujui.");

  //Set default field
  riskData.approval_status = "pending";
  riskData.status = "new";
  riskData.entry_level = riskData.probability * riskData.impact_score;

  //Simpan ke DB
  const { data, error } = await supabase
    .from("risk")
    .insert([riskData])
    .select()
    .single();

    if (error) throw error;
    return data;
}

static async update(id: string, riskData: any, user: any) {
  //Hanya risiko milik departemen user yang boleh diupdate
  const { data: existing, error: fetchErr } = await supabase
    .from("risk")
    .select("department_id, approval_status")
    .eq("id", id)
    .single();

  if (fetchErr || !existing) throw new Error("Risiko tidak ditemukan.");
  if (existing.department_id !== user.department_id)
    throw new Error("Anda tidak memiliki akses untuk mengubah risiko ini.");

  //Jika user bukan diskominfo → set approval pending lagi
  if (user.role_name !== "admin_diskominfo") {
    riskData.approval_status = "pending";
  }

  //Hitung ulang level risiko
  if (riskData.probability && riskData.impact_score) {
    riskData.entry_level = riskData.probability * riskData.impact_score;
  }

  //Update
  const { data, error } = await supabase
    .from("risk")
    .update(riskData)
    .eq("id", id)
    .select()
    .single();

    if (error) throw error;
    return data;
  }

  static async createRiskWithTreatments( { risk, treatments }: { risk: Risk; treatments: RiskTreatment[] },
    user: any
  ) {
    if (!risk || !treatments || treatments.length === 0)
      throw new Error("Data risiko dan minimal satu treatment harus diisi.");

    //Set departemen otomatis
    if (user.role_name !== "admin_diskominfo") {
      risk.department_id = user.department_id;
    }

    //Validasi aset
    const { data: asset, error: assetErr } = await supabase
      .from("asset")
      .select("id, approval_status")
      .eq("id", risk.asset_id)
      .single();

    if (assetErr || !asset) throw new Error("Aset tidak ditemukan.");
    if (asset.approval_status !== "approved")
      throw new Error("Risiko hanya bisa ditambahkan untuk aset yang disetujui.");

    //Hitung nilai risiko awal
    risk.entry_level = risk.probability * risk.impact_score;
    risk.status = "new";
    risk.approval_status = "pending";
    risk.created_by = user.id;

    //Simpan risiko utama
    const { data: newRisk, error: riskErr } = await supabase
      .from("risk")
      .insert([risk])
      .select()
      .single();

    if (riskErr) throw riskErr;

    //Simpan treatment
    const treatmentPayloads = treatments.map((t) => ({
      risk_id: newRisk.id,
      strategy: t.strategy,
      action: t.action,
      action_owner: t.action_owner,
      target_date: t.target_date,
      cost: t.cost || null,
      effectiveness: t.effectiveness || null,
      new_probability: t.new_probability || null,
      new_impact_score: t.new_impact_score || null,
      residual_level:
        t.new_probability && t.new_impact_score
          ? t.new_probability * t.new_impact_score
          : null,
      status: "new",
      created_by: user.any,
    }));

    const { data: treatmentData, error: treatmentErr } = await supabase
      .from("risk_treatment")
      .insert(treatmentPayloads)
      .select();

    if (treatmentErr) throw treatmentErr;

    return { risk: newRisk, treatments: treatmentData };
  }

  static async updateRiskWithTreatments(
    id: string,
    { risk, treatments }: { risk: Risk; treatments: RiskTreatment[] },
    user: any
  ) {
    //Ambil risiko lama
    const { data: existing, error: fetchErr } = await supabase
      .from("risk")
      .select("id, department_id, approval_status")
      .eq("id", id)
      .single();

    if (fetchErr || !existing) throw new Error("Risiko tidak ditemukan.");
    if (
      user.role_name !== "admin_diskominfo" &&
      existing.department_id !== user.department_id
    ) {
      throw new Error("Anda tidak memiliki akses untuk mengubah risiko ini.");
    }

    // 🧩 2️⃣ Set status approval kembali pending jika bukan admin
    if (user.role_name !== "admin_diskominfo") {
      risk.approval_status = "pending";
    }

    // 🧩 3️⃣ Hitung ulang level risiko
    if (risk.probability && risk.impact_score) {
      risk.entry_level = risk.probability * risk.impact_score;
    }

    risk.updated_by = user.id;
    risk.updated_at = new Date().toISOString();

    // 🧩 4️⃣ Update data risiko
    const { data: updatedRisk, error: updateErr } = await supabase
      .from("risk")
      .update(risk)
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    // 🧩 5️⃣ Kelola risk_treatment (update/insert)
    const updatedTreatments: RiskTreatment[] = [];

    for (const t of treatments) {
      // Hitung residual level kalau ada perubahan
      const residual =
        t.new_probability && t.new_impact_score
          ? t.new_probability * t.new_impact_score
          : t.residual_level || null;

      if (t.id) {
        // 🔁 Update treatment lama
        const { data: updated, error: upErr } = await supabase
          .from("risk_treatment")
          .update({
            strategy: t.strategy,
            action: t.action,
            action_owner: t.action_owner,
            target_date: t.target_date,
            cost: t.cost || null,
            effectiveness: t.effectiveness || null,
            new_probability: t.new_probability || null,
            new_impact_score: t.new_impact_score || null,
            residual_level: residual,
            updated_by: user.id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", t.id)
          .select()
          .single();

        if (upErr) throw upErr;
        updatedTreatments.push(updated);
      } else {
        // ➕ Tambahkan treatment baru
        const { data: created, error: insErr } = await supabase
          .from("risk_treatment")
          .insert([
            {
              risk_id: id,
              strategy: t.strategy,
              action: t.action,
              action_owner: t.action_owner,
              target_date: t.target_date,
              cost: t.cost || null,
              effectiveness: t.effectiveness || null,
              residual_level: residual,
              status: "planned",
              created_by: user.id,
            },
          ])
          .select()
          .single();

        if (insErr) throw insErr;
        updatedTreatments.push(created);
      }
    }

    // 🧩 6️⃣ Kembalikan hasil
    return {
      message: "Risiko dan perlakuan berhasil diperbarui.",
      risk: updatedRisk,
      treatments: updatedTreatments,
    };
  }

  static async verifyRisk(id: string, approval_status: string, notes: string | null, user: any) {
    if (user.role_name !== "verifikator")
      throw new Error("Hanya verifikator dinas yang dapat memverifikasi risiko.");

    const { data: risk, error: fetchError } = await supabase
      .from("risk")
      .select("id, department_id, approval_status")
      .eq("id", id)
      .single();

    if (fetchError || !risk) throw new Error("Risiko tidak ditemukan.");
    if (risk.department_id !== user.department_id)
      throw new Error("Anda tidak memiliki akses untuk memverifikasi risiko dari dinas lain.");

     // 🔹 Validasi status
    const validStatuses = ["verified", "approved", "rejected"];
    if (!validStatuses.includes(approval_status)) {
      throw new Error(`Status tidak valid. Pilihan: ${validStatuses.join(", ")}`);
    }

    // 🔹 Siapkan data update
    const updateData: any = {
      approval_status: approval_status,
      revision_notes: notes || null,
    };

    const { data, error } = await supabase
      .from("risk")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
  static async approveRisk(id: string, approval_status: string, notes: string | null, user: any) {
    if (user.role_name !== "admin_diskominfo")
      throw new Error("Hanya admin Diskominfo yang dapat memberikan persetujuan akhir risiko.");

    const { data: risk, error: fetchError } = await supabase
      .from("risk")
      .select("id, approval_status")
      .eq("id", id)
      .single();

    if (fetchError || !risk) throw new Error("Risiko tidak ditemukan.");
    if (risk.approval_status !== "verified")
      throw new Error("Risiko belum diverifikasi, tidak dapat disetujui final.");

     // 🔹 Validasi status
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(approval_status)) {
      throw new Error(`Status tidak valid. Pilihan: ${validStatuses.join(", ")}`);
    }

    // 🔹 Siapkan data update
    const updateData: any = {
      approval_status: approval_status,
      approved_by: user.sub,
      approved_at: new Date().toISOString(),
    };

    // Jika disetujui → ubah jadi aktif
    if (approval_status === "approved") {
      updateData.status = "planned"; // ID "Aktif"
    }

    const { data, error } = await supabase
      .from("risk")
      .update({
        approval_status: approval_status,
        revision_notes: notes || null,
        approved_by: user.sub,
        approved_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}