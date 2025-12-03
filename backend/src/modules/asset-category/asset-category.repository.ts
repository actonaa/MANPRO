import { supabase } from '../../config/supabaseClient.js';
import type {
  AssetCategory,
  CreateAssetCategoryDto,
  UpdateAssetCategoryDto,
} from './asset-category.model.js';

export class AssetCategoryRepository {
  
  static async findAll(): Promise<AssetCategory[]> {
    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Supabase error (findAll asset_categories):', error.message);
        throw error;
      }
      return data || [];
    } catch (err: any) {
      console.error('Fatal Repository Error (findAll asset_categories):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async findById(id: string): Promise<AssetCategory | null> {
    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        console.error('Supabase error (findById asset_categories):', error.message);
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (findById asset_categories):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async create(dto: CreateAssetCategoryDto): Promise<AssetCategory> {
    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .insert(dto)
        .select()
        .single();

      if (error) {
        console.error('Supabase error (create asset_category):', error.message);
        throw error;
      }
      if (!data) throw new Error('Gagal membuat kategori, tidak ada data kembali.');
      
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (create asset_category):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async update(
    id: string,
    dto: UpdateAssetCategoryDto,
  ): Promise<AssetCategory | null> {
    try {
      const { data, error } = await supabase
        .from('asset_categories')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        console.error('Supabase error (update asset_category):', error.message);
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (update asset_category):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error, count } = await supabase
        .from('asset_categories')
        .delete({ count: 'exact' }) // Meminta jumlah baris
        .eq('id', id);

      if (error) {
        console.error('Supabase error (delete asset_category):', error.message);
        // Error '23503' = foreign key violation
        if (error.code === '23503') {
           throw new Error('Kategori ini tidak dapat dihapus karena sedang digunakan (kemungkinan oleh sub-kategori atau aset).');
        }
        throw error;
      }
      return (count || 0) > 0;
    } catch (err: any) {
      console.error('Fatal Repository Error (delete asset_category):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }
}