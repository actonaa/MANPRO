import { supabase } from '../../config/supabaseClient.js';
import type {
  ImpactArea,
  CreateImpactAreaDto,
  UpdateImpactAreaDto,
} from './impact-area.model.js';

export class ImpactAreaRepository {
  
  static async findAll(): Promise<ImpactArea[]> {
    try {
      const { data, error } = await supabase
        .from('impact_area')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err: any) {
      console.error('Fatal Repository Error (findAll impact_area):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async findById(id: string): Promise<ImpactArea | null> {
    try {
      const { data, error } = await supabase
        .from('impact_area')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        throw error;
      }
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (findById impact_area):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async create(dto: CreateImpactAreaDto): Promise<ImpactArea> {
    try {
      const { data, error } = await supabase
        .from('impact_area')
        .insert(dto)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Gagal membuat impact area.');
      return data;
    } catch (err: any) {
      console.error('Fatal Repository Error (create impact_area):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async update(
    id: string,
    dto: UpdateImpactAreaDto,
  ): Promise<ImpactArea | null> {
    try {
      const { data, error } = await supabase
        .from('impact_area')
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
      console.error('Fatal Repository Error (update impact_area):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  static async delete(id: string): Promise<boolean> {
    try {
      const { error, count } = await supabase
        .from('impact_area')
        .delete({ count: 'exact' })
        .eq('id', id);

      if (error) {
        if (error.code === '23503') { // Foreign key violation
           throw new Error('Impact area ini tidak dapat dihapus karena sedang digunakan oleh data risiko.');
        }
        throw error;
      }
      return (count || 0) > 0;
    } catch (err: any) {
      console.error('Fatal Repository Error (delete impact_area):', err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }
}