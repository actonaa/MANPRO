// src/modules/risk-treatment/risk-treatment.repository.ts
import { supabase } from "../../config/supabaseClient.js";
import type { RiskTreatment } from "./risk-treatment.model.js";

// Tipe helper dari kode service Anda
interface RiskRelation {
  department_id: string;
}

export class RiskTreatmentRepository {
  static async findRiskDepartment(riskId: string): Promise<string | null> {
    const unwrap = (val: any) => Array.isArray(val) ? val[0] : val;

    const { data, error } = await supabase
      .from("risk")
      .select(`
        asset:asset_id ( department_id ), 
        scenario:scenario_id (
           scenario_asset ( asset ( department_id ) )
        )
      `) 
      .eq("id", riskId)
      .limit(1);
    
    if (error || !data || data.length === 0) {
        if (error) console.error("❌ Error findRiskDepartment:", error.message);
        return null;
    }

    const risk = data[0];

    // --- JALUR 1: RISIKO ASET ---
    const asset = unwrap(risk?.asset); 
    
    if (asset?.department_id) {
        return asset.department_id;
    }

    // --- JALUR 2: RISIKO SKENARIO ---
    const scenario = unwrap(risk?.scenario);
    
    if (scenario?.scenario_asset?.length) {
        for (const sa of scenario.scenario_asset) {
            const innerAsset = unwrap(sa.asset);
            if (innerAsset?.department_id) {
                return innerAsset.department_id;
            }
        }
    }

    return null; 
  }

  static async findDepartmentIdByName(name: string): Promise<string | null> {
      try {
        const { data, error } = await supabase
          .from('department') // <-- Sesuaikan nama tabel departemen Anda
          .select('department_id')
          .eq('department_name', name) // <-- Cari berdasarkan nama
          .single();
  
        if (error) {
          console.error("Supabase error finding department by name:", error.message);
          return null;
        }
        
        return data ? data.department_id : null;
  
      } catch (err: any) {
        console.error("Repo error findDepartmentIdByName:", err.message);
        return null;
      }
    }

  /**
   * Mengambil department_id dari risk parent DARI treatment
   */
  static async findTreatmentParentDepartment(treatmentId: string): Promise<string | null> {
    const unwrap = (val: any) => Array.isArray(val) ? val[0] : val;

    // 1. Query Deep: Treatment -> Risk -> (Asset OR Scenario)
    const { data, error } = await supabase
      .from("risk_treatment")
      .select(`
        risk:risk_id (
            asset:asset_id ( department_id ),
            scenario:scenario_id (
                scenario_asset ( asset ( department_id ) )
            )
        )
      `)
      .eq("id", treatmentId)
      .limit(1);
      
    if (error || !data || data.length === 0) {
        return null;
    }

    const treatment = data[0];
    const risk = unwrap(treatment?.risk);

    if (!risk) return null;

    // --- JALUR 1: RISIKO ASET ---
    const asset = unwrap(risk?.asset);
    if (asset?.department_id) {
        return asset.department_id;
    }

    // --- JALUR 2: RISIKO SKENARIO ---
    const scenario = unwrap(risk?.scenario);
    if (scenario?.scenario_asset?.length) {
        for (const sa of scenario.scenario_asset) {
            const innerAsset = unwrap(sa.asset);
            if (innerAsset?.department_id) {
                return innerAsset.department_id;
            }
        }
    }

    return null;
  }

  /**
   * Membuat satu treatment baru
   */
  static async create(payload: Partial<RiskTreatment>): Promise<RiskTreatment> {
    const { data, error } = await supabase
      .from("risk_treatment")
      .insert([payload])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  /**
   * Mengupdate satu treatment
   */
  static async update(id: string, payload: Partial<RiskTreatment>): Promise<RiskTreatment> {
    const { data, error } = await supabase
      .from("risk_treatment")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  }

  static async findAllByRiskId(riskId: string): Promise<RiskTreatment[]> {
    const { data, error } = await supabase
      .from("risk_treatment")
      .select("*") // Ambil semua kolom treatment
      .eq("risk_id", riskId)
      .order("created_at", { ascending: true }); // Urutkan

    if (error) throw error;
    return data || [];
  }
}