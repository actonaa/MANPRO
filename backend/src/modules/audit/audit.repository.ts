import { supabase } from "../../config/supabaseClient.js";
import type { AuditLog } from "./audit.model.js";

export class AuditRepository {
  static async findAll(): Promise<AuditLog[]> {
    const { data, error } = await supabase
      .from("audit_log")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(100); 

    if (error) throw error;
    return data || [];
  }

  static async create(log: Partial<AuditLog>): Promise<void> {
    const { error } = await supabase.from("audit_log").insert([log]);
    if (error) console.error("Gagal menyimpan Audit Log:", error.message);
  }
}