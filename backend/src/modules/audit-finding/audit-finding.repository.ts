// src/modules/audit-finding/audit-finding.repository.ts
import { supabase } from "../../config/supabaseClient.js";
import type { AuditFinding, AuditReport } from "./audit-finding.model.js";

export class AuditFindingRepository {

  // === LAPORAN (FILES) ===

  static async createReport(data: Partial<AuditReport>): Promise<AuditReport> {
    const { data: res, error } = await supabase
      .from("audit_reports")
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return res;
  }

  static async findAllReports(): Promise<AuditReport[]> {
    // 1. Ambil semua laporan
    const { data: reports, error } = await supabase
      .from("audit_reports")
      .select("*")
      .order("created_at", { ascending: false });
      
    if (error) throw error;
    if (!reports || reports.length === 0) return [];

    // 2. Kumpulkan semua ID Departemen unik
    const deptIds = [...new Set(reports.map((r: any) => r.department_id).filter(Boolean))];

    // 3. Ambil nama departemen (Manual Join)
    let deptMap: Record<string, string> = {};
    
    if (deptIds.length > 0) {
      const { data: depts } = await supabase
        .from("department") // Sesuaikan nama tabel
        .select("department_id, department_name") // Sesuaikan nama kolom
        .in("department_id", deptIds);
        
      depts?.forEach((d: any) => {
         deptMap[d.department_id] = d.department_name;
      });
    }

    // 4. Gabungkan data
    return reports.map((r: any) => ({
      ...r,
      department: r.department_id ? { name: deptMap[r.department_id] || 'Unknown' } : null
    }));
  }

  /**
   * Upload File Laporan ke Bucket Supabase
   */
  static async uploadReportFile(fileName: string, buffer: Buffer, mimeType: string): Promise<string> {
    const { error } = await supabase.storage
      .from('audit_documents') // ⚠️ Pastikan buat bucket ini di Supabase
      .upload(fileName, buffer, { contentType: mimeType, upsert: true });

    if (error) throw error;
    
    const { data } = supabase.storage.from('audit_documents').getPublicUrl(fileName);
    return data.publicUrl;
  }

  // === TEMUAN (COMMENTS) ===

  static async createFinding(data: Partial<AuditFinding>): Promise<AuditFinding> {
    const { data: res, error } = await supabase
      .from("audit_findings")
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return res;
  }

  /**
   * Ambil temuan berdasarkan Entity (misal: semua temuan untuk Aset ID xxx)
   */
  static async findByEntity(type: string, id: string): Promise<AuditFinding[]> {
    const { data, error } = await supabase
      .from("audit_findings")
      .select("*")
      .eq("entity_type", type)
      .eq("entity_id", id)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data || [];
  }

  static async updateFindingStatus(id: string, status: string): Promise<void> {
    const { error } = await supabase
      .from("audit_findings")
      .update({ status })
      .eq("id", id);
    if (error) throw error;
  }
}