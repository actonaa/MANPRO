// src/modules/audit-finding/audit-finding.model.ts

// --- LAPORAN (FILES) ---
export interface AuditReport {
  id: string;
  title: string;
  description?: string | null;
  department_id?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  file_url: string;
  auditor_id: string;
  created_at: string;
  department?: {
    name: string;
  };
}

export type CreateReportDto = Omit<AuditReport, 'id' | 'created_at' | 'file_url' | 'auditor_id' | 'department'>;

// --- TEMUAN (COMMENTS) ---
export interface AuditFinding {
  id: string;
  entity_type: 'asset' | 'risk' | 'maintenance' | 'scenario' | 'report';
  entity_id: string;
  finding: string;        // Masalahnya apa
  recommendation?: string;// Sarannya apa
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'closed';
  auditor_id: string;
  created_at: string;
}

export type CreateFindingDto = Pick<
  AuditFinding, 
  'entity_type' | 'entity_id' | 'finding' | 'recommendation' | 'severity'
>;

// DTO untuk User Dinas merespon/mengubah status temuan
export type UpdateFindingDto = {
  status: 'resolved';
  notes?: string; // Catatan perbaikan (opsional)
};