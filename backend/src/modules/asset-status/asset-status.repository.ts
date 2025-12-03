import { supabase } from '../../config/supabaseClient.js';
import type {
  AssetStatus,
  CreateAssetStatusDto,
  UpdateAssetStatusDto,
} from './asset-status.model.js';

export class AssetStatusRepository {
  /**
   * Mengambil semua status aset dari database
   */
  static async findAll(): Promise<AssetStatus[]> {
    try {
      const { data, error } = await supabase
        .from('asset_statuses')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Supabase error (findAll asset_statuses):', error.message);
        throw error;
      }

      return data || [];
    } catch (err: any) {
      console.error('Fatal Repository Error (findAll asset_statuses):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  /**
   * Mencari satu status aset berdasarkan ID
   */
  static async findById(id: string): Promise<AssetStatus | null> {
    try {
      const { data, error } = await supabase
        .from('asset_statuses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        // Jika kode error = 'PGRST116' (PostgREST), itu berarti 'No rows found'
        // Ini kita anggap sebagai 'null' (tidak ditemukan), bukan error
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Supabase error (findById asset_statuses):', error.message);
        throw error;
      }

      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (findById asset_statuses):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  /**
   * Membuat status aset baru
   */
  static async create(dto: CreateAssetStatusDto): Promise<AssetStatus> {
    try {
      const { data, error } = await supabase
        .from('asset_statuses')
        .insert(dto)
        .select() // Penting: untuk mengembalikan baris yang baru dibuat
        .single(); // Kita hanya memasukkan satu, jadi ambil satu

      if (error) {
        console.error('Supabase error (create asset_status):', error.message);
        throw error;
      }
      
      if (!data) {
        throw new Error('Gagal membuat status aset, tidak ada data yang dikembalikan.');
      }

      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (create asset_status):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  /**
   * Memperbarui status aset berdasarkan ID
   */
  static async update(
    id: string,
    dto: UpdateAssetStatusDto,
  ): Promise<AssetStatus | null> {
    try {
      const { data, error } = await supabase
        .from('asset_statuses')
        .update(dto)
        .eq('id', id)
        .select() // Kembalikan data yang sudah diupdate
        .single();

      if (error) {
        // 'PGRST116' juga berlaku di sini jika ID tidak ditemukan untuk diupdate
        if (error.code === 'PGRST116') {
          return null;
        }
        console.error('Supabase error (update asset_status):', error.message);
        throw error;
      }

      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (update asset_status):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  /**
   * Menghapus status aset berdasarkan ID
   * Mengembalikan boolean (true jika berhasil)
   */
  static async delete(id: string): Promise<boolean> {
    try {
      const { error, count } = await supabase
        .from('asset_statuses')
        .delete({ count: 'exact' }) // 👈 TAMBAHKAN INI
        .eq('id', id);

      if (error) {
        console.error('Supabase error (delete asset_status):', error.message);
        // Cek error foreign key constraint (jika status masih dipakai)
        if (error.code === '23503') {
           throw new Error('Status ini tidak dapat dihapus karena sedang digunakan oleh aset.');
        }
        throw error;
      }

      // 'count' sekarang akan berisi jumlah baris yang dihapus (misal: 1)
      // (1 || 0) > 0 akan menjadi true
      return (count || 0) > 0;

    } catch (err: any) {
      console.error('Fatal Repository Error (delete asset_status):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }
}