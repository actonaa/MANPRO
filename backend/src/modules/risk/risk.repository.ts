import { supabase } from "../../config/supabaseClient.js";
import type { Risk, RiskTreatment } from "./risk.model.js";

const baseSelect = `
  *,
  asset:asset_id(name, lokasi),
  department:department_id(name)
`;

export class RiskRepository {
  
  // === Read Methods ===
  static async findAll(): Promise<Risk[]> {
    const { data, error } = await supabase.from("risks_detailed").select("*");;
    if (error) throw error;
    return data || [];
  }

  static async findAllByDepartmentId(departmentId: string): Promise<Risk[]> {
      const { data, error } = await supabase
      .from('risks_detailed') // <-- BENAR: Baca dari VIEW
      .select('*') 
      .eq('department_id', departmentId); 

    if (error) {
        console.error("Supabase error in findAllByDepartmentId:", error.message);
        throw new Error(`Repository Error: ${error.message}`);
    }
    return data || [];
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

  static async findById(id: string): Promise<Risk | null> {
    const { data, error } = await supabase
      .from("risks_detailed")
      .select("*")
      .eq("id", id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findByIdSimple(id: string): Promise<Partial<Risk> | null> {
    const { data, error } = await supabase
      .from("risks_detailed") // <-- Ganti ke VIEW
      .select("id, department_id, approval_status, status")
      .eq("id", id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  // 2. Helper untuk mengambil data aset saat MENGUPDATE risiko
  static async findRiskParentAsset(riskId: string): Promise<{ department_id: string } | null> {
    const { data, error } = await supabase
      .from("risk")
      // ❗️ Join ke tabel 'asset' (bukan view)
      .select("asset:asset_id ( department_id )") 
      .eq("id", riskId)
      .single();
    
    if (error || !data || !(data as any).asset) return null;
    return { department_id: (data as any).asset.department_id };
  }

  static async findAssetPermissionData(assetId: string): Promise<{ approval_status: string, department_id: string } | null> {
    const { data, error } = await supabase
      // ❗️ Ambil dari tabel 'asset' (bukan view)
      .from("asset") 
      .select("approval_status, department_id") // 👈 Ambil ID
      .eq("id", assetId)
      .single();
      
    if (error) {
      if (error.code !== 'PGRST116') throw error;
      return null;
    }
    return data;
  }
  
  // === Write Methods (Risk) ===
  static async createRisk(riskData: Partial<Risk>): Promise<Risk> {
    if (riskData.asset_id) {
      const { data: asset, error: assetError } = await supabase
        .from("assets_detailed") // Cek ke VIEW aset
        .select("id")
        .eq("id", riskData.asset_id)
        .single();

      if (assetError || !asset) {
        throw new Error(`Validasi Gagal: Asset ID "${riskData.asset_id}" tidak ditemukan.`);
      }
    } else {
      throw new Error("Validasi Gagal: asset_id wajib diisi untuk membuat Risk.");
    }

    // 2. Tulis ke tabel 'risk' asli
    const { data: newRisk, error: insertError } = await supabase
      .from("risk")
      .insert([riskData])
      .select("id") // Hanya ambil ID
      .single();
      
    if (insertError) throw insertError;
    if (!newRisk) throw new Error("Gagal membuat risk, tidak ada ID dikembalikan.");

    // 3. Baca data lengkap dari VIEW 'risks_detailed'
    const fullData = await this.findById(newRisk.id);
    if (!fullData) throw new Error("Gagal mengambil data risk setelah dibuat.");
    
    return fullData;
  }

  static async updateRisk(id: string, riskData: Partial<Risk>): Promise<Risk> {
    if (riskData.asset_id) {
      const { data: asset, error: assetError } = await supabase
        .from("assets_detailed") // Cek ke VIEW aset
        .select("id")
        .eq("id", riskData.asset_id)
        .single();

      if (assetError || !asset) {
        throw new Error(`Validasi Gagal: Asset ID "${riskData.asset_id}" tidak ditemukan.`);
      }
    }

    // 2. Tulis ke tabel 'risk' asli
    const { error: updateError } = await supabase
      .from("risk")
      .update(riskData)
      .eq("id", id);
      
    if (updateError) throw updateError;
    // 3. Baca data lengkap dari VIEW 'risks_detailed'
    const fullData = await this.findById(id);
    if (!fullData) throw new Error("Gagal mengambil data risk setelah diupdate.");
    
    return fullData;
  }

  // === Write Methods (Risk Treatment) ===
  static async createTreatments(treatments: Partial<RiskTreatment>[]): Promise<RiskTreatment[]> {
    const { data, error } = await supabase
      .from("risk_treatment")
      .insert(treatments)
      .select();
    if (error) throw error;
    return data || [];
  }
  
  static async createTreatment(treatment: Partial<RiskTreatment>): Promise<RiskTreatment> {
     const { data, error } = await supabase
      .from("risk_treatment")
      .insert([treatment])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
  
  static async updateTreatment(id: string, treatment: Partial<RiskTreatment>): Promise<RiskTreatment> {
     const { data, error } = await supabase
      .from("risk_treatment")
      .update(treatment)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async findTreatmentById(id: string): Promise<RiskTreatment | null> {
    const { data, error } = await supabase
      .from("risk_treatment")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      // Jika tidak ditemukan (PGRST116) atau error lain, kembalikan null
      if (error.code !== 'PGRST116') {
        console.error("findTreatmentById error:", error.message);
      }
      return null;
    }
    return data;
  }
}