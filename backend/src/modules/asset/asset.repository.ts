import { error } from "console";
import { supabase } from "../../config/supabaseClient.js";
import type { Asset, CreateAssetDto, pubclicAsset, UpdateAssetDto, MaintenancePlanningData } from "./asset.model.js";

const publicSelectFromView = `
  id, name, barcode, serial_number, lokasi, merk_type, vendor, hostname, ip_address, os, version, deploy_date, material, specification, bmd_code, 
  parent_id, department_id, status_id, category_id, sub_category_id,
  condition_id, status, category, sub_category, department, division, section, condition, parent
`;

export class AssetRepository {
  // === Metode untuk API Publik ===
  static async findAllPublic(): Promise<Partial<Asset>[]> {
    try {
      const { data, error } = await supabase
      .from("assets_detailed") // <-- GANTI KE VIEW
      .select(publicSelectFromView) // <-- Gunakan string select baru
      .eq('approval_status', 'approved')
      .neq('status_id', '6494a4a6-41e6-42b5-be69-b587a0371c4f') 
      .order('name', { ascending: true });
      
      if (error) {
        console.error("Supabase query error:", error.message);
        throw error;
      }

      return data || [];
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown repository error'; 
      console.error("Fatal Repository Error (findAllPublic):", errorMessage);
      throw new Error(`Repository Error: ${errorMessage}`);
    }   
  }

  static async findByIdPublic(id: string): Promise<Partial<Asset> | null> {
    try {
      const { data, error } = await supabase
      .from("assets_detailed") 
      .select(publicSelectFromView) 
      .eq('id', id)
      .eq('approval_status', 'approved')
      .neq('status_id', '6494a4a6-41e6-42b5-be69-b587a0371c4f')
      .single();
    
    if (error) {
        if (error.code === 'PGRST116') return null;
        console.error("Supabase query error:", error.message);
        throw error;
    }
    return data; 
    } catch (err: any) {
      const errorMessage = err.message || 'Unknown repository error'; 
      console.error("Fatal Repository Error (findByIdPublic):", errorMessage);
      throw new Error(`Repository Error: ${errorMessage}`);
    }
  }
  // === Metode untuk mengambil data ===
  static async findAll(): Promise<Asset[]> {
    const { data, error } = await supabase.from("assets_detailed").select("*");
    if (error) throw error;
    return data || [];
  }

  static async findAllByDepartmentId(departmentId: string): Promise<Asset[]> {
    try {
      const { data, error } = await supabase
        .from('assets_detailed')
        .select('*')
        .eq('department_id', departmentId); 

      if (error) {
        console.error("Supabase error in findAllByDepartmentId:", error.message);
        throw error;
      }
      return data || [];
    } catch (err: any) {
      console.error("Fatal Repository Error (findAllByDepartmentId):", err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }


  static async findDepartmentIdByName(name: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('department') // <-- Sesuaikan nama tabel departemen Anda
        .select('department_id')
        .eq('department_name', name) // <-- Cari berdasarkan nama
        .single();

      if (error) {
        console.error("Supabase error finding department by name:", error.message);
        return null;
      }
      
      return data ? data.department_id : null;

    } catch (err: any) {
      console.error("Repo error findDepartmentIdByName:", err.message);
      return null;
    }
  }

  static async findById(id: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from("assets_detailed") // <-- GANTI KE VIEW
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      if (error.code === 'PGRST116') return null; // 'single()' tidak menemukan data
      throw error;
    }
    return data;
  }

  static async findByBarcode(barcode: string): Promise<Asset | null> {
    const { data, error } = await supabase
      .from("assets_detailed") 
      .select("*") 
      .eq("barcode", barcode)
      .single();
    if (error) {
       if (error.code === 'PGRST116') return null; 
       console.error("Supabase error in findByBarcode:", error.message);
       throw error;
    }
    return data;
}

  static async findPublicByBarcode(barcode: string): Promise<pubclicAsset | null> {
    const { data, error } = await supabase
      .from("assets_detailed") 
      .select(publicSelectFromView) 
      .eq("barcode", barcode)
      .single();
      if (error) {
        if (error.code === 'PGRST116') return null; // Tidak ditemukan
        console.error("Supabase error in findPublicByBarcode:", error.message);
        throw error;
      }
      return data;
  }

  static async isStatusLinkable(statusId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("asset_statuses") 
        .select("id") 
        .eq("id", statusId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
            console.error("isStatusLinkable error:", error.message);
        }
        return false;
      }
      
      return data != null;

    } catch (err) {
      return false;
    }
  }

  static async linkAndUpdateStatus(
    id: string, 
    payload: Partial<Asset>
  ): Promise<Partial<Asset> | null> { // 👈 UBAH TIPE RETURN DI SINI
    
    try {
      // Kita gabungkan UPDATE dan SELECT dari tabel 'asset' dasar
      const { data, error } = await supabase
        .from("asset") // 👈 Update tabel 'asset' asli
        .update(payload)
        .eq("id", id)
        // 👈 Select HANYA field yang relevan (ini akan cocok dengan Partial<Asset>)
        .select("id, status_id,  linked_change_id, linked_incident_id, revision_notes, status_id(name)") 
        .single();

      if (error) {
        // Ini akan menangkap 'PGRST116' (not found) atau error lainnya
        console.error("Supabase error linkAndUpdateStatus:", error.message);
        throw error;
      }

      return data; // 'data' sekarang adalah { id: "...", status_id: "...", ... }

    } catch (err: any) {
      console.error("Fatal Repository Error (linkAndUpdateStatus):", err.message);
      throw new Error(`Repository Error: ${err.message}`);
    }
  }

  // === Metode untuk Mutasi Data (CUD)
  static async create(assetData: Partial<CreateAssetDto>): Promise<Asset> {
    if (assetData.department_id) {
      const { data: dept, error: deptError } = await supabase
        .from("department") // Cek ke foreign table 'department'
        .select("department_id")
        .eq("department_id", assetData.department_id)
        .single();

      if (deptError || !dept) {
        // Jika tidak ada, lempar error. JANGAN INSERT.
        throw new Error(`Validasi Gagal: Department ID "${assetData.department_id}" tidak ditemukan di SSO.`);
      }
    }
    const { data: newAsset, error: insertError } = await supabase
      .from("asset")
      .insert([assetData])
      .select("id")
      .single();
    if (insertError) {
      console.error("Supabase insert error:", insertError.message);
      throw insertError;
    }
    if (!newAsset) throw new Error("Gagal membuat aset, tidak ada data yang dikembalikan.");

    const { data: fullData, error: selectError } = await supabase
      .from("assets_detailed")
      .select("*")
      .eq("id", newAsset.id)
      .single();
    
    if (selectError) {
      console.error("Supabase select (post-create) error:", selectError.message);
      throw selectError;
    }

    return fullData;
  }

  static async update(id: string, assetData: Partial<UpdateAssetDto>): Promise<Asset> {
    const { error: updateError } = await supabase
      .from("asset")
      .update(assetData)
      .eq("id", id); 

    if (updateError) {
      console.error("Supabase update error:", updateError.message);
      throw updateError;
    }

    const { data: fullData, error: selectError } = await supabase
      .from("assets_detailed")
      .select("*")
      .eq("id", id)
      .single();
    
    if (selectError) {
      console.error("Supabase select (post-update) error:", selectError.message);
      throw selectError;
    }

    return fullData;
  }
  
  // === Metode Helper (dari kode Anda) ===
  static async findStatusIdByName(name: string): Promise<string | null> {
    const { data, error } = await supabase
      .from("asset_statuses")
      .select("id")
      .eq("name", name)
      .single();
    if (error || !data) return null;
    return data.id;
  }

  static async uploadBarcode(filePath: string, barcodeBuffer: Buffer): Promise<string> {
    const { error: uploadError } = await supabase.storage
      .from("barcodes")
      .upload(filePath, barcodeBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) throw uploadError;
    
    if (!process.env.SUPABASE_URL) {
      throw new Error("SUPABASE_URL is not defined");
    }
    
    return `${process.env.SUPABASE_URL}/storage/v1/object/public/barcodes/${filePath}`;
  }

  /**
   * Upload file ke Supabase Storage (Public Bucket)
   * @param folderPath - Path folder (misal: 'uploads/')
   * @param fileName - Nama file unik
   * @param fileBuffer - Buffer dari Multer
   * @param contentType - Mimetype (image/jpeg, application/pdf)
   */
  static async uploadFile(
    folderPath: string,
    fileName: string,
    fileBuffer: Buffer,
    contentType: string
  ): Promise<string> {
    const bucketName = 'asset-attachments'; // Pastikan nama ini SAMA dengan di Supabase
    const fullPath = `${folderPath}${fileName}`;

    // 1. Upload File
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fullPath, fileBuffer, {
        contentType: contentType,
        upsert: true // Timpa jika ada file dengan nama persis sama
      });

    if (uploadError) {
      console.error(`Supabase Upload Error: ${uploadError.message}`);
      throw new Error("Gagal mengunggah file ke server.");
    }

    // 2. Ambil Public URL (Karena Bucket PUBLIC)
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fullPath);

    return data.publicUrl; // Return string URL lengkap (https://...)
  }
  
  static async findForMaintenancePlanning(assetId: string): Promise<MaintenancePlanningData | null> {
    // 1. Ambil Asset, Risk, dan Treatment (TANPA JOIN ke Department)
    const { data: assetData, error } = await supabase
      .from("asset")
      .select(`
        id,
        name,
        location:lokasi,
        department_id,
        
        risk (
          id,
          title,
          entry_level,
          priority,
          status,
          risk_treatment (
            id,
            action,
            strategy,
            target_date,
            status
          )
        )
      `)
      .eq("id", assetId)
      .neq("risk.status", "closed")
      .single();

    if (error) throw error;
    if (!assetData) return null;

    // 2. Ambil Nama Departemen secara Manual (Manual Join)
    let departmentObj = null;
    
    // TypeScript sekarang seharusnya mengenali 'department_id' karena parser error hilang
    if (assetData.department_id) {
      const { data: dept } = await supabase
        .from("department")
        .select("department_name") 
        .eq("department_id", assetData.department_id) 
        .single();
      
      if (dept) {
        departmentObj = { name: dept.department_name };
      }
    }

    // 3. Gabungkan Data
    const result: MaintenancePlanningData = {
      id: assetData.id,
      name: assetData.name,
      location: assetData.location,
      department: departmentObj,
      risk: (assetData as any).risk
    };

    return result;
  }
  
  static async updateMany(
    assetIds: string[], 
    payload: Partial<Asset>
  ): Promise<Asset[]> {
    
    // 1. Update tabel asset
    const { data: updatedIds, error: updateError } = await supabase
      .from("asset")
      .update(payload)
      .in("id", assetIds) // 👈 Kunci Bulk Update
      .select("id");

    if (updateError) throw updateError;
    if (!updatedIds || updatedIds.length === 0) return [];

    // 2. Ambil data lengkap dari View (untuk dikembalikan ke Service)
    const { data: fullAssets, error: selectError } = await supabase
      .from("assets_detailed")
      .select("*")
      .in("id", assetIds); // Ambil semua yang baru diupdate

    if (selectError) throw selectError;
    
    return fullAssets || [];
  }

  /**
   * 🆕 Ambil banyak aset (untuk snapshot 'data_before')
   */
  static async findManyByIds(assetIds: string[]): Promise<Asset[]> {
    const { data, error } = await supabase
      .from("assets_detailed")
      .select("*")
      .in("id", assetIds);
      
    if (error) throw error;
    return data || [];
  }
}