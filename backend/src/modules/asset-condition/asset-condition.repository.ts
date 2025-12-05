import { supabase } from '../../config/supabaseClient.js';
import type {
  AssetCondition,
  CreateAssetConditionDto,
  UpdateAssetConditionDto,
} from './asset-condition.model.js';

export class AssetConditionRepository {
  
  static async findAll(): Promise<AssetCondition[]> {
    try {
      const { data, error } = await supabase
        .from('asset_conditions')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Supabase error (findAll asset_conditions):', error.message);
        throw error;
      }
      return data || [];
    } catch (err: any) {
      console.error('Fatal Repository Error (findAll asset_conditions):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async findById(id: string): Promise<AssetCondition | null> {
    try {
      const { data, error } = await supabase
        .from('asset_conditions')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        console.error('Supabase error (findById asset_conditions):', error.message);
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (findById asset_conditions):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async create(dto: CreateAssetConditionDto): Promise<AssetCondition> {
    try {
      const { data, error } = await supabase
        .from('asset_conditions')
        .insert(dto)
        .select()
        .single();

      if (error) {
        console.error('Supabase error (create asset_condition):', error.message);
        throw error;
      }
      if (!data) throw new Error('Gagal membuat kondisi, tidak ada data kembali.');
      
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (create asset_condition):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async update(
    id: string,
    dto: UpdateAssetConditionDto,
  ): Promise<AssetCondition | null> {
    try {
      const { data, error } = await supabase
        .from('asset_conditions')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        console.error('Supabase error (update asset_condition):', error.message);
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (update asset_condition):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error, count } = await supabase
        .from('asset_conditions')
        .delete({ count: 'exact' }) // Meminta jumlah baris
        .eq('id', id);

      if (error) {
        console.error('Supabase error (delete asset_condition):', error.message);
        // Error '23503' = foreign key violation
        if (error.code === '23503') {
           throw new Error('Kondisi ini tidak dapat dihapus karena sedang digunakan oleh aset.');
        }
        throw error;
      }
      return (count || 0) > 0;
    } catch (err: any) {
      console.error('Fatal Repository Error (delete asset_condition):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }
}