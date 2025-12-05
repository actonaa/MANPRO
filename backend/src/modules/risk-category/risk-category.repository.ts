import { supabase } from '../../config/supabaseClient.js';
import type {
  RiskCategory,
  CreateRiskCategoryDto,
  UpdateRiskCategoryDto,
} from './risk-category.model.js';

export class RiskCategoryRepository {
  
  static async findAll(): Promise<RiskCategory[]> {
    try {
      const { data, error } = await supabase
        .from('risk_category')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Fatal Repository Error (findAll risk_category):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async findById(id: string): Promise<RiskCategory | null> {
    try {
      const { data, error } = await supabase
        .from('risk_category')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (findById risk_category):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async create(dto: CreateRiskCategoryDto): Promise<RiskCategory> {
    try {
      const { data, error } = await supabase
        .from('risk_category')
        .insert(dto)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Gagal membuat kategori risiko.');
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (create risk_category):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async update(
    id: string,
    dto: UpdateRiskCategoryDto,
  ): Promise<RiskCategory | null> {
    try {
      const { data, error } = await supabase
        .from('risk_category')
        .update(dto)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (update risk_category):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error, count } = await supabase
        .from('risk_category')
        .delete({ count: 'exact' })
        .eq('id', id);

      if (error) {
        if (error.code === '23503') { // Foreign key violation
           throw new Error('Kategori risiko ini tidak dapat dihapus karena sedang digunakan oleh data risiko.');
        }
        throw error;
      }
      return (count || 0) > 0;
    } catch (err: any) {
      console.error('Fatal Repository Error (delete risk_category):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }
}