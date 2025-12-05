import { supabase } from "../../config/supabaseClient.js";
import type { Scenario, CreateScenarioDto, UpdateScenarioDto } from "./scenario.model.js";
import type { NormalizedUser } from '../../types/index.js';

export class ScenarioRepository {

  /**
   * Mengambil skenario lengkap (dari VIEW)
   */
  static async findById(id: string): Promise<Scenario | null> {
    // ❗️ Pastikan VIEW 'scenarios_detailed' Anda sudah dibuat
    const { data, error } = await supabase
      .from("scenarios_detailed") 
      .select("*") 
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("ScenarioRepository.findById error:", error.message);
      throw error;
    }
    return data;
  }

  /**
   * Mengambil semua skenario (dari VIEW)
   */
  static async findAll(): Promise<Scenario[]> {
    const { data, error } = await supabase
      .from("scenarios_detailed")
      .select("*")
      .order("name", { ascending: true }); // 👈 Tambahan: urutkan berdasarkan nama
    
    if (error) {
      console.error("ScenarioRepository.findAll error:", error.message);
      throw error;
    }
    return data || [];
  }

  /**
   * Memanggil fungsi 'create_scenario_with_assets' (Transaksi)
   */
  static async create(payload: CreateScenarioDto, user: NormalizedUser): Promise<Scenario> {
    const { name, description, owner_position_id, asset_ids } = payload;
    
    const { data, error } = await supabase.rpc('create_scenario_with_assets', {
      _name: name,
      _description: description,
      _owner_position_id: owner_position_id,
      _asset_ids: asset_ids
      // _created_by: user.user_id (Tambahkan ini jika fungsi SQL Anda menerimanya)
    });

    if (error) {
       console.error("ScenarioRepository.create error:", error.message);
       throw error;
    }
    
    // RPC mengembalikan baris 'scenario' baru
    return data; 
  }

  /**
   * Memanggil fungsi 'update_scenario_with_assets' (Transaksi)
   * ❗️ Pastikan Anda sudah membuat fungsi SQL 'update_scenario_with_assets'
   */
  static async update(id: string, payload: UpdateScenarioDto): Promise<Scenario> {
     const { name, description, owner_position_id, asset_ids } = payload;
     
     const { data, error } = await supabase.rpc('update_scenario_with_assets', {
       _scenario_id: id,
       _name: name,
       _description: description,
       _owner_position_id: owner_position_id,
       _asset_ids: asset_ids
     });

     if (error) {
       console.error("ScenarioRepository.update error:", error.message);
       throw error;
     }
     return data;
   }

  /**
   * Menghapus skenario
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("scenario")
      .delete()
      .eq("id", id);
      
    if (error) {
       console.error("ScenarioRepository.delete error:", error.message);
       throw error;
    }
  }

  // --- Helper Functions for Permissions ---

  /**
   * 🆕 [Helper 1] Mengambil ID departemen berdasarkan NAMA
   */
  static async findDepartmentIdByName(deptName: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("department") // 👈 Ganti 'department' jika nama tabel Anda beda
      .select("department_id")       // 👈 Ganti 'id' jika nama kolom ID Anda beda
      .eq("department_name", deptName) // 👈 Ganti 'name' jika nama kolom NAMA Anda beda
      .single();
    
    if (error || !data) {
      if (error && error.code !== 'PGRST116') console.error(error);
      return null;
    }
    return data.department_id;
  }

  /**
   * 🚀 OPTIMASI: Ambil skenario yang difilter langsung oleh Database
   */
  static async findAllByDepartmentId(deptId: string): Promise<Scenario[]> {
    const { data, error } = await supabase.rpc('get_scenarios_by_department', {
      _user_dept_id: deptId
    });

    if (error) throw error;
    return data || [];
  }

  /**
   * 🆕 [Helper 2] Memeriksa departemen dari semua aset yang ditautkan.
   */
  static async areAllAssetsInDepartment(
    assetIds: string[], 
    userDeptId: string
  ): Promise<boolean> {
    
    const { data, error } = await supabase
      .from("asset")
      .select("department_id")
      .in("id", assetIds);

    if (error) throw error;
    if (!data || data.length === 0) return false; // Tidak ada aset yang ditemukan

    for (const asset of data) {
      if (asset.department_id !== userDeptId) {
        return false; // Ditemukan aset dari departemen lain
      }
    }
    
    return true; // Semua aset aman, milik departemen user
  }

  /**
   * 🆕 [Helper 3] Mengambil ID departemen dari skenario yang ada
   */
  static async getScenarioDepartmentId(scenarioId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("scenario_asset")
      .select("asset ( department_id )") // Join ke asset
      .eq("scenario_id", scenarioId)
      .limit(1) // 👈 Cukup ambil 1
      .single();

    if (error || !data || !(data as any).asset) return null;
    return (data as any).asset.department_id;
  }
}