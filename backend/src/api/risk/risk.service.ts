import { supabase } from '../../config/supabaseClient.js';

export class RiskService {
  static async findAll(user: any) {
    // Siapkan query dasar
    let query = supabase.from('risk').select(`
      *,
      asset:asset_id(name, lokasi),
      department:department_id(name)
    `);

    // === INILAH LOGIKA PENGGANTI RLS ANDA UNTUK RISIKO ===
    const userRole = user.role?.role_name?.toLowerCase().replace(/ /g, '_');
    
    // Jika peran BUKAN admin atau auditor, tambahkan filter berdasarkan dinas
    if (userRole !== 'admin_diskominfo' && userRole !== 'auditor') {
      query = query.eq('department_id', user.dinas);
    }
    // =======================================

    const { data, error } = await query;

    if (error) throw error;
    return data;
  }
}