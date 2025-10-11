import { supabase } from '../../config/supabaseClient.js';

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
  // 1️⃣ Set department otomatis
  if (user.role_name !== "admin_diskominfo" && user.role_name !== "auditor") {
    riskData.department_id = user.department_id;
  }

  // 2️⃣ Pastikan aset sudah disetujui
  const { data: asset, error: assetErr } = await supabase
    .from("asset")
    .select("id, approval_status")
    .eq("id", riskData.asset_id)
    .single();

  if (assetErr || !asset) throw new Error("Aset tidak ditemukan.");
  if (asset.approval_status !== "approved")
    throw new Error("Risiko hanya bisa ditambahkan untuk aset yang sudah disetujui.");

  // 3️⃣ Set default field
  riskData.approval_status = "pending";
  riskData.status = "new";
  riskData.entry_level = riskData.probability * riskData.impact_score;

  // 4️⃣ Simpan ke DB
  const { data, error } = await supabase
    .from("risk")
    .insert([riskData])
    .select()
    .single();

    if (error) throw error;
    return data;
}

static async update(id: string, riskData: any, user: any) {
  // 1️⃣ Hanya risiko milik departemen user yang boleh diupdate
  const { data: existing, error: fetchErr } = await supabase
    .from("risk")
    .select("department_id, approval_status")
    .eq("id", id)
    .single();

  if (fetchErr || !existing) throw new Error("Risiko tidak ditemukan.");
  if (existing.department_id !== user.department_id)
    throw new Error("Anda tidak memiliki akses untuk mengubah risiko ini.");

  // 2️⃣ Jika user bukan diskominfo → set approval pending lagi
  if (user.role_name !== "admin_diskominfo") {
    riskData.approval_status = "pending";
  }

  // 3️⃣ Hitung ulang level risiko
  if (riskData.probability && riskData.impact_score) {
    riskData.entry_level = riskData.probability * riskData.impact_score;
  }

  // 4️⃣ Update
  const { data, error } = await supabase
    .from("risk")
    .update(riskData)
    .eq("id", id)
    .select()
    .single();

    if (error) throw error;
    return data;
  }
}