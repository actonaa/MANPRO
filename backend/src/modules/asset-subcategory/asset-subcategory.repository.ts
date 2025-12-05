import { supabase } from '../../config/supabaseClient.js';
import type {
  CreateAssetSubCategoryDto,
  UpdateAssetSubCategoryDto,
  EnrichedAssetSubCategory,
} from './asset-subcategory.model.js';

// String helper untuk select data + relasinya
const selectEnriched = '*, asset_categories(id, name)';

export class AssetSubCategoryRepository {
  
  static async findAll(): Promise<EnrichedAssetSubCategory[]> {
    try {
      const { data, error } = await supabase
        .from('asset_subcategories')
        .select(selectEnriched) // Ambil data relasi
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Fatal Repository Error (findAll asset_subcategories):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  // Method baru untuk filter by category_id
  static async findAllByCategoryId(categoryId: string): Promise<EnrichedAssetSubCategory[]> {
    try {
      const { data, error } = await supabase
        .from('asset_subcategories')
        .select(selectEnriched)
        .eq('category_id', categoryId)
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Fatal Repository Error (findAllByCategoryId):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async findById(id: string): Promise<EnrichedAssetSubCategory | null> {
    try {
      const { data, error } = await supabase
        .from('asset_subcategories')
        .select(selectEnriched)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (findById asset_subcategories):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async create(dto: CreateAssetSubCategoryDto): Promise<EnrichedAssetSubCategory> {
    try {
      const { data, error } = await supabase
        .from('asset_subcategories')
        .insert(dto)
        .select(selectEnriched) // Ambil data + relasi
        .single();

      if (error) throw error;
      if (!data) throw new Error('Gagal membuat sub-kategori.');
      
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (create asset_subcategory):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async update(
    id: string,
    dto: UpdateAssetSubCategoryDto,
  ): Promise<EnrichedAssetSubCategory | null> {
    try {
      const { data, error } = await supabase
        .from('asset_subcategories')
        .update(dto)
        .eq('id', id)
        .select(selectEnriched) // Ambil data + relasi
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (update asset_subcategory):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error, count } = await supabase
        .from('asset_subcategories')
        .delete({ count: 'exact' })
        .eq('id', id);

      if (error) {
        if (error.code === '23503') {
           throw new Error('Sub-kategori ini tidak dapat dihapus karena sedang digunakan oleh aset.');
        }
        throw error;
      }
      return (count || 0) > 0;
    } catch (err: any) {
      console.error('Fatal Repository Error (delete asset_subcategory):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }
}