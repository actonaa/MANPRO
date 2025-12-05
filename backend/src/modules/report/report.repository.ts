import { supabase } from "../../config/supabaseClient.js";
import type { ReportFilterDto } from "./report.model.js";

export class ReportRepository {

  static async getComprehensiveData(filters: ReportFilterDto) {
    // 1. Query Utama (Asset -> Risk -> Maintenance)
    let query = supabase
      .from("asset")
      .select(`
        name, barcode, status_id, department_id, acquisition_date, acquisition_value,
        
        -- Join Status Aset (Asumsi ada FK ke asset_statuses)
        status:status_id ( name ),

        -- Join Risk
        risk (
           title, entry_level, type_of_risk,
           scenario:scenario_id ( name )
        ),

        -- Join Maintenance
        maintenance_logs (
           type, scheduled_date, completion_date, cost, status
        )
      `);

    // 2. Filter
    if (filters.department_id) {
      query = query.eq("department_id", filters.department_id);
    }
    if (filters.startDate) {
      query = query.gte("acquisition_date", filters.startDate);
    }
    if (filters.endDate) {
      query = query.lte("acquisition_date", filters.endDate);
    }

    const { data, error } = await query;
    if (error) throw error;
    if (!data) return [];

    // 3. Manual Join Department & Formatting
    // Kita ambil semua unique department ID
    const deptIds = [...new Set(data.map((d: any) => d.department_id).filter(Boolean))];
    
    let deptMap: Record<string, string> = {};
    
    if (deptIds.length > 0) {
      const { data: depts } = await supabase
        .from("department")
        .select("department_id, department_name")
        .in("department_id", deptIds);
      
      depts?.forEach((d: any) => {
        deptMap[d.department_id] = d.department_name;
      });
    }

    // Gabungkan nama departemen ke data aset
    return data.map((asset: any) => ({
      ...asset,
      department_name: deptMap[asset.department_id] || '-'
    }));
  }
  // 1. Data Khusus Risiko
  static async getRiskDataForExport() {
    const { data, error } = await supabase
      .from("risk")
      .select(`
        title, type, probability, impact_score, entry_level, status, type_of_risk,
        asset:asset_id ( name, department:department_id(name) ),
        risk_category:risk_category_id ( name )
      `);
    if (error) throw error;
    return data || [];
  }

  // 2. Data Khusus Maintenance
  static async getMaintenanceDataForExport() {
    const { data, error } = await supabase
      .from("maintenance_logs")
      .select(`
        type, scheduled_date, completion_date, vendor, cost, status, notes,
        asset:asset_id ( name, barcode, department:department_id(name) )
      `);
    if (error) throw error;
    return data || [];
  }

  // 3. Data Khusus Skenario
  static async getScenarioDataForExport() {
    // Mengambil skenario beserta daftar asetnya
    const { data, error } = await supabase
      .from("scenarios_detailed") // Pakai VIEW yang sudah kita buat
      .select("*");
    if (error) throw error;
    return data || [];
  }

  // 4. Data Audit Log
  static async getAuditDataForExport() {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("created_at, user_name, user_email, action, table_name, ip_address")
      .order("created_at", { ascending: false })
      .limit(1000); // Batasi agar tidak meledak
    if (error) throw error;
    return data || [];
  }

  /**
   * 1. Laporan Aset (General Inventory)
   */
  static async getAssetDataForExport() {
    const { data, error } = await supabase
      .from("assets_detailed") // Gunakan View agar mudah (sudah ada join nama)
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  }

  /**
   * 2. Laporan Penghapusan (Disposal / Decommissioning)
   * Mengambil aset yang status approval-nya terkait penghapusan
   */
  static async getDeletionDataForExport() {
    const { data, error } = await supabase
      .from("asset")
      .select(`
        name, barcode, serial_number, acquisition_value, approval_status, revision_notes,
        department:department_id ( name ),
        category:category_id ( name )
      `)
      // Filter status yang berhubungan dengan delete
      .in("approval_status", ["pending_delete", "verified_delete", "approved_delete"]);

    if (error) throw error;
    return data || [];
  }

  /**
   * 3. Laporan Insiden (Aset yang terdampak Insiden)
   * Filter aset yang memiliki linked_incident_id
   */
  static async getIncidentDataForExport() {
    const { data, error } = await supabase
      .from("asset")
      .select(`
        name, barcode, linked_incident_id, status:status_id(name), department:department_id(name), updated_at
      `)
      .not("linked_incident_id", "is", null); // Hanya yang ada insiden

    if (error) throw error;
    return data || [];
  }

  /**
   * 4. Laporan RFC (Aset yang terdampak Change)
   * Filter aset yang memiliki linked_change_id
   */
  static async getRFCDataForExport() {
    const { data, error } = await supabase
      .from("asset")
      .select(`
        name, barcode, linked_change_id, status:status_id(name), department:department_id(name), updated_at
      `)
      .not("linked_change_id", "is", null); // Hanya yang ada RFC

    if (error) throw error;
    return data || [];
  }

  /**
   * 5. Laporan SDM (Human Resources & Skills)
   */
  static async getHRDataForExport() {
    // Kita butuh join ke Position, Division, dan Skills
    const { data, error } = await supabase
      .from("human_resources")
      .select(`
        name, nip, phone_number, 
        position:position_id ( position_name ),
        division:division_id ( division_name ),
        hr_skill (
           skill:skill_id ( skill_name ),
           certificate_number
        )
      `);
      
    if (error) throw error;
    return data || [];
  }
}