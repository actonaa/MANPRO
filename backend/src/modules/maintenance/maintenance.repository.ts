import { supabase } from "../../config/supabaseClient.js";
import type { MaintenanceLog, MaintenanceRelatedAsset} from "./maintenance.model.js";

// Tipe helper untuk data yang di-join
interface LogWithAssetPermission {
  asset_id: string;
  asset: {
    department_id: string;
  } | null;
}

export class MaintenanceRepository {

    /**
   * 🆕 (ADMIN) Ambil semua log, bisa difilter
   * static async findAll(filters: { status?: string }): Promise<MaintenanceLog[]> {
    let query = supabase.from("maintenance_logs").select("*");

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query.order("scheduled_date", { ascending: true });
    if (error) throw error;
    return data || [];
  }
   */

  static async findDepartmentsByIds(ids: string[]): Promise<Record<string, string>> {
    if (ids.length === 0) return {};

    const { data, error } = await supabase
      .from("department")
      .select("department_id, department_name")
      .in("department_id", ids);

    if (error) {
      console.error("Error fetching departments:", error.message);
      return {};
    }

    // Ubah array menjadi Map/Object agar mudah di-lookup: { "id": "name" }
    const deptMap: Record<string, string> = {};
    data.forEach((d: any) => {
      deptMap[d.department_id] = d.department_name;
    });

    return deptMap;
  }

  /**
   * 🆕 (ADMIN) Ambil semua log dengan Detail LENGKAP (Risk + Treatment)
   */
  static async findAll(filters: { status?: string }): Promise<MaintenanceLog[]> {
    let query = supabase
      .from("maintenance_logs")
      .select(`
        *,
        asset:asset_id (
          name, barcode, serial_number, lokasi, department_id
        ),
        risk:risk_id (
            title, entry_level, priority, status,
            risk_treatment ( id, action, strategy, target_date, status )
          )
      `);

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query.order("scheduled_date", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  /**
   * 🆕 (VERIFIKATOR) Ambil log per departemen dengan Detail LENGKAP
   */
  static async findAllByDepartment(
    departmentId: string, 
    filters: { status?: string }
  ): Promise<MaintenanceLog[]> {
    
    let query = supabase
      .from("maintenance_logs")
      .select(`
        *,
        asset!inner (
          name, barcode, serial_number, lokasi, department_id
        ),
        risk:risk_id (
            title, entry_level, priority, status,
            risk_treatment ( id, action, strategy, target_date, status )
          )
      `)
      .eq("asset.department_id", departmentId);

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query.order("scheduled_date", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async findById(id: string): Promise<MaintenanceLog | null> {
    // 1. Query Utama: Maintenance -> Asset -> Risk -> Treatment
    const { data, error } = await supabase
      .from("maintenance_logs")
      .select(`
        *,
        asset:asset_id (
          name,
          barcode,
          serial_number,
          lokasi,
          department_id
        ),
        risk:risk_id (
            title,
            entry_level,
            priority,
            status,
            risk_treatment (
               id,
               action,
               strategy,
               target_date,
               status
            )
          )
      `)
      .eq("id", id)
      .single();

    if (error) {
       if (error.code !== 'PGRST116') { 
         console.error("MaintenanceRepository.findById error:", error.message);
         throw error;
       }
       return null;
    }

    // 2. Manual Join untuk Nama Departemen
    // Karena asset.department_id ada, kita cari namanya
    const assetData = data.asset as unknown as MaintenanceRelatedAsset; // Casting sementara
    
    if (assetData && assetData.department_id) {
        const { data: dept } = await supabase
            .from("department")
            .select("department_name")
            .eq("department_id", assetData.department_id)
            .single();
            
        if (dept) {
            // Tempelkan nama departemen ke objek asset
            assetData.department = { name: dept.department_name };
        }
    }

    // 3. Kembalikan data lengkap
    // (assetData sudah dimutasi/diupdate dengan nama departemen di langkah 2)
    return data as MaintenanceLog;
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
   * 🆕 (VERIFIKATOR) Ambil semua log untuk departemen tertentu
   * static async findAllByDepartment(
    departmentId: string, 
    filters: { status?: string }
  ): Promise<MaintenanceLog[]> {
    
    // Gunakan inner join untuk memfilter berdasarkan department_id aset
    let query = supabase
      .from("maintenance_logs")
      .select("*, asset!inner(name, serial_number, lokasi, department_id)")
      .eq("asset.department_id", departmentId);

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    const { data, error } = await query.order("scheduled_date", { ascending: true });
    if (error) throw error;
    return data || [];
  }
   */
  

  /**
   * Helper untuk mengambil departemen aset (untuk cek izin)
   */
  static async findAssetDepartment(assetId: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("asset")
      .select("department_id")
      .eq("id", assetId)
      .single();
    if (error || !data) return null;
    return data.department_id;
  }

  /**
   * Helper untuk mengambil data izin dari maintenance log yang ada
   */
  static async findLogPermissionData(id: string): Promise<LogWithAssetPermission | null> {
    const { data, error } = await supabase
      .from("maintenance_logs")
      .select("asset_id, asset:asset_id(department_id)")
      .eq("id", id)
      .single();
      
    if (error || !data) return null;
    
    // Pastikan kita mengembalikan format yang konsisten
    const typedData = data as unknown as LogWithAssetPermission;
    return typedData;
  }

  /**
   * Mengambil semua log untuk satu aset
   */
  static async findByAssetId(assetId: string): Promise<MaintenanceLog[]> {
    const { data, error } = await supabase
      .from("maintenance_logs")
      .select(`
        *,
        asset:asset_id (
          name,
          barcode,
          serial_number,
          lokasi,
          department_id
        ),
        risk:risk_id (
            title,
            entry_level,
            priority,
            status,
            risk_treatment (
               id,
               action,
               strategy,
               target_date,
               status
            )
          )
      `)
      .eq("asset_id", assetId)
      .order("scheduled_date", { ascending: true });
      
    if (error) throw error;
    return data || [];
  }

  /**
   * Membuat log baru
   */
  static async create(payload: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
    const { data, error } = await supabase
      .from("maintenance_logs")
      .insert([payload])
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  static async uploadProof(
    fileName: string,
    fileBuffer: Buffer,
    contentType: string
  ): Promise<string> {
    const bucketName = 'asset-attachments'; // Gunakan bucket public yang sama
    const folderPath = 'maintenance/';      // Folder khusus maintenance
    const fullPath = `${folderPath}${fileName}`;

    const { error } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, fileBuffer, {
        contentType: contentType,
        upsert: true
      });

    if (error) {
      console.error(`Maintenance Upload Error: ${error.message}`);
      throw new Error("Gagal mengunggah bukti pemeliharaan.");
    }

    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fullPath);

    return data.publicUrl;
  }

  /**
   * Mengupdate log
   */
  static async update(id: string, payload: Partial<MaintenanceLog>): Promise<MaintenanceLog> {
    const { data, error } = await supabase
      .from("maintenance_logs")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  /**
   * Menghapus log
   */
  static async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("maintenance_logs")
      .delete()
      .eq("id", id);
    if (error) throw error;
  }
  
  /**
   * Helper untuk side-effect: update status aset
   */
  static async updateAssetStatus(assetId: string, statusId: string): Promise<void> {
    const { error } = await supabase
      .from("asset")
      .update({ status_id: statusId })
      .eq("id", assetId);
    if (error) console.error("Gagal update status aset:", error.message);
    // Kita tidak melempar error di sini agar proses utama tidak gagal
  }
}