import { supabase } from '../../config/supabaseClient.js';
import type { Risk, RiskTreatment } from "../../types/model.js";

interface RiskRelation {
  department_id: string;
}

export class RiskTreatmentService {
  /** ✅ Create Treatment */
  static async createTreatment(payload: RiskTreatment, user: any) {
    // ambil data risk + cek department
    const { data: risk, error: riskErr } = await supabase
      .from("risk")
      .select("id, department_id, approval_status")
      .eq("id", payload.risk_id)
      .single();

    if (riskErr || !risk) throw new Error("Risk tidak ditemukan.");
    if (
      user.role_name !== "admin_diskominfo" &&
      user.department_id !== risk.department_id
    ) {
      throw new Error("Tidak boleh menambah treatment untuk risk ini.");
    }

    // simpan treatment
    const { data, error } = await supabase
      .from("risk_treatment")
      .insert([{ ...payload, status: "pending" }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  /** ✅ Update Treatment */
  static async updateTreatment(id: string, payload: any, user: any) {
    const { data: existing, error: findErr } = await supabase
      .from("risk_treatment")
      .select("risk (department_id)")
      .eq("id", id)
      .single();

    if (findErr || !existing) throw new Error("Treatment tidak ditemukan.");

    // Ambil department dari relasi risk
    const riskData = existing.risk as RiskRelation | RiskRelation[];
    const departmentId = Array.isArray(riskData)
      ? riskData[0]?.department_id
      : riskData?.department_id;

    if (
      user.role_name !== "admin_diskominfo" &&
      user.department_id !== departmentId
    ) {
      throw new Error("Anda tidak boleh mengubah treatment ini.");
    }

    const { data, error } = await supabase
      .from("risk_treatment")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
