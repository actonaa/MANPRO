import { supabase } from '../../config/supabaseClient.js';

export class AssetService {
  static async findAll(user: any) {
    // Siapkan query dasar
    let query = supabase.from('asset').select(`
      *,
      category:category_id(name),
      status:status_id(name),
      condition:condition_id(name),
      department:department_id(name)
    `);

    // === INILAH LOGIKA PENGGANTI RLS ANDA ===
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