import { supabase } from "../../config/supabaseClient.js";
import type { Request } from "express";

export class AuditService {
  /**
   * Catat log aktivitas user
   */
  static async log(
    user: { id?: string } | null,
    action: string,
    table: string,
    record_id: string,
    before: object | null = null,
    after: object | null = null,
    req?: Request
  ): Promise<void> {
    try {
      const logEntry = {
        user_id: user?.id || null,
        action,
        table_name: table,
        record_id,
        data_before: before ? JSON.stringify(before) : null,
        data_after: after ? JSON.stringify(after) : null,
        ip_address: req?.ip || null,
        user_agent: req?.headers?.["user-agent"] || null,
      };

      const { error } = await supabase.from("audit_log").insert([logEntry]);
      if (error) throw error;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Gagal mencatat audit log:", err.message);
      } else {
        console.error("Gagal mencatat audit log: error tidak dikenal");
      }
    }
  }
}
