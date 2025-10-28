export interface User {
  sub: string;
  email: string;
  name?: string;
  role: { role_id: string; role_name: string };
  department?: { department_id: string; department_name: string };
  division?: string;
  section?: string | null;
  phone_number?: string;
  skills?: string[];
}

export interface Risk {
  id?: string;
  department_id?: string;
  asset_id?: string;
  approval_status?: "pending" | "verified" | "approved" | "rejected";
  revision_notes?: string;
  type: "aset" | "aktivitas" | "skenario";
  title: string;
  description?: string;
  cause?: string;
  impact?: string;
  related_process?: string;
  probability: number;
  impact_score: number;
  criteria?: string;
  entry_level?: number; // hasil P × D
  priority?: "low" | "medium" | "high";
  status?: "new" | "planned" | "in_progress" | "completed" | "accepted";
  created_by?: string;
  updated_by?: string;
  approved_by?: string;
  approved_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface RiskTreatment {
  id?: string;
  risk_id: string;
  strategy: "avoid" | "reduce" | "transfer" | "accept";
  action: string;
  action_owner?: string;
  target_date?: string;
  cost?: number;
  effectiveness?: string;
  residual_level?: number;
  status?: "planned" | "in_progress" | "completed" | "verified" | "rejected";
  created_by?: string;
  updated_by?: string;
  approved_by?: string;
  created_at?: string;
  updated_at?: string;
  new_probability?: number; // nilai setelah mitigasi
  new_impact_score?: number; // nilai setelah mitigasi
}
