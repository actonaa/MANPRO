// src/modules/risk/risk.service.ts
import { RiskRepository } from "./risk.repository.js";
import type { Risk, RiskTreatment, CreateRiskDto, CreateTreatmentDto, RiskWithTreatmentsPayload, UpdateRiskDto, UpdateTreatmentDto } from "./risk.model.js";
import type { NormalizedUser } from "../../types/index.js";
import { NotificationService } from '../notification/notification.service.js';
import { AuditService } from '../audit/audit.service.js';

// Helper Roles
const isAdmin = (user: NormalizedUser) => 
  user.role_name === 'admin_diskominfo' || user.role_name === 'auditor';
  
const isVerifikator = (user: NormalizedUser) => 
  user.role_name === 'verifikator';
  
const isAdminDiskominfo = (user: NormalizedUser) => 
  user.role_name === 'admin_diskominfo';

// const calculateRiskType = (entryLevel: number): 'positif' | 'negatif' => {
//   return entryLevel >= 15 ? 'positif' : 'negatif';
// };

export class RiskService {

  private static async checkPermission(user: NormalizedUser, riskId: string): Promise<void> {
    if (isAdmin(user)) return; // Admin boleh

    // 1. Dapatkan ID departemen user (dari nama di JWT)
    if (!user.department_name) throw new Error("Token tidak memiliki department_name");
    const userDeptId = await RiskRepository.findDepartmentIdByName(user.department_name);
    if (!userDeptId) throw new Error(`Departemen '${user.department_name}' tidak ditemukan di database`);

    // 2. Ambil ID departemen aset
    const assetData = await RiskRepository.findRiskParentAsset(riskId);
    if (!assetData || !assetData.department_id) {
      throw new Error("Risiko tidak ditemukan atau tidak tertaut ke aset yang valid.");
    }
    
    // 3. Bandingkan ID vs ID
    if (assetData.department_id !== userDeptId) { 
      throw new Error("Anda tidak memiliki akses ke risiko ini.");
    }
  }

  // === Find Methods ===
  
  static async findAll(user: NormalizedUser): Promise<Risk[]> {
    if (isAdmin(user)) {
      return RiskRepository.findAll();
    }
    if (!user.department_name) {
      return []; 
    } // User non-admin tanpa departemen
    const departmentId = await RiskRepository.findDepartmentIdByName(user.department_name);
    if (!departmentId) return [];
    return RiskRepository.findAllByDepartmentId(departmentId);
  }

  static async findById(id: string, user: NormalizedUser): Promise<Risk | null> {
    const risk = await RiskRepository.findById(id);
    if (!risk) return null;

    if (isAdmin(user) || risk.department?.name === user.department_name) {
      return risk;
    }
    
    // Ditemukan tapi tidak punya akses
    throw new Error("Anda tidak memiliki akses untuk melihat risiko ini.");
  }

  // === CUD Methods (Simple) ===

  static async create(riskData: CreateRiskDto, user: NormalizedUser): Promise<Risk> {
    const asset = await RiskRepository.findAssetPermissionData(riskData.asset_id);
    
    if (!asset) throw new Error("Aset tidak ditemukan.");
    if (asset.approval_status !== "approved")
      throw new Error("Risiko hanya bisa ditambahkan untuk aset yang sudah disetujui.");

    // 2. ❗️ Cek Izin Departemen Aset (Nama vs Nama)
    if (!isAdmin(user)) {
      if (!user.department_name) throw new Error("Token tidak memiliki department_name");
      const userDeptId = await RiskRepository.findDepartmentIdByName(user.department_name);
      if (!userDeptId) throw new Error(`Departemen '${user.department_name}' tidak ditemukan`);

      // Bandingkan ID aset dengan ID user
      if (asset.department_id !== userDeptId) {
        throw new Error("Anda tidak memiliki akses untuk menambah risiko ke aset ini.");
      }
    }

    // 3. Siapkan data (Sudah benar, tanpa 'department_id')
    const dataToCreate: Partial<Risk> = { ...riskData };
    dataToCreate.approval_status = "pending";
    dataToCreate.status = "new";
    const entryLevel = (riskData.probability || 0) * (riskData.impact_score || 0);
    dataToCreate.entry_level = entryLevel;
    //dataToCreate.type_of_risk = calculateRiskType(entryLevel);
    if (!riskData.type_of_risk) {
       throw new Error("Jenis Risiko (Positif/Negatif) wajib dipilih.");
    }
    // Validasi nilai input
    if (!['positif', 'negatif'].includes(riskData.type_of_risk)) {
       throw new Error("Jenis Risiko harus bernilai 'positif' atau 'negatif'.");
    }
    dataToCreate.type_of_risk = riskData.type_of_risk;

    const newRisk = await RiskRepository.createRisk(dataToCreate);

    void NotificationService.notifyRoles({
      roles: ["verifikator"], 
      senderId: user.user_id,
      category: 'Risk',
      title: 'Risiko Baru Diajukan',
      message: `Risiko baru "${newRisk.title || 'Tanpa Judul'}" diajukan oleh ${user.name || user.email}.`,
      link: `/risks/${newRisk.id}`,
      type: 'info'
    });

    // 4. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "CREATE",
      table_name: "risk",
      record_id: newRisk.id,
      data_before: null,
      data_after: newRisk,
      ip_address: user.ip_address || null
    });

    return newRisk;
  }
  
  static async update(id: string, riskData: UpdateRiskDto, user: NormalizedUser): Promise<Risk> {
    await this.checkPermission(user, id);

    const oldRisk = await RiskRepository.findById(id); // Perlu data lama
      if (!oldRisk) throw new Error("Risiko tidak ditemukan.");
    
    const dataToUpdate: Partial<Risk> = { ...riskData };
    let needsReverification = false;

    if (!isAdminDiskominfo(user)) {
      dataToUpdate.approval_status = "pending";
      needsReverification = true;
    }

    if (riskData.probability || riskData.impact_score) {
      const oldRisk = await RiskRepository.findById(id); // Perlu data lama

      if (!oldRisk) throw new Error("Risiko tidak ditemukan saat mencoba menghitung ulang level.");
      // Gunakan nilai baru, atau fallback ke nilai lama jika tidak disediakan
      const prob = riskData.probability ?? oldRisk.probability;
      const impact = riskData.impact_score ?? oldRisk.impact_score;
      
      const entryLevel = prob * impact;
      dataToUpdate.entry_level = entryLevel;
      //dataToUpdate.type_of_risk = calculateRiskType(entryLevel);
      if (!riskData.type_of_risk) {
       throw new Error("Jenis Risiko (Positif/Negatif) wajib dipilih.");
      }
      // Validasi nilai input
      if (!['positif', 'negatif'].includes(riskData.type_of_risk)) {
        throw new Error("Jenis Risiko harus bernilai 'positif' atau 'negatif'.");
      }
      dataToUpdate.type_of_risk = riskData.type_of_risk;
    }

    const updatedRisk = await RiskRepository.updateRisk(id, dataToUpdate);

    if (needsReverification) {
      void NotificationService.notifyRoles({
        roles: ["verifikator"], 
        senderId: user.user_id,
        category: 'Risk',
        title: 'Risiko Diperbarui',
        message: `Risiko "${oldRisk.title}" telah diperbarui oleh ${user.name || user.email} dan perlu diverifikasi ulang.`,
        link: `/risks/${id}`,
        type: 'warning' // Kuning karena status kembali pending
      });
    }
    // 5. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "UPDATE",
      table_name: "risk",
      record_id: id,
      data_before: oldRisk,     // Data sebelum edit
      data_after: updatedRisk,  // Data sesudah edit
      ip_address: user.ip_address || null
    });

    return updatedRisk;
  }
  
  static async createRiskWithTreatments(payload: RiskWithTreatmentsPayload, user: NormalizedUser) {
    const { risk: riskData, treatments } = payload;
    if (!riskData || !treatments || treatments.length === 0)
      throw new Error("Data risiko dan minimal satu treatment harus diisi.");

    // 1. ❗️ Validasi aset & Cek Izin (Sama seperti 'create')
    const asset = await RiskRepository.findAssetPermissionData(riskData.asset_id as string);
    if (!asset) throw new Error("Aset tidak ditemukan.");
    if (asset.approval_status !== "approved")
      throw new Error("Risiko hanya bisa ditambahkan untuk aset yang sudah disetujui.");
    if (!isAdmin(user)) {
      if (!user.department_name) throw new Error("Token tidak memiliki department_name");
      const userDeptId = await RiskRepository.findDepartmentIdByName(user.department_name);
      if (!userDeptId) throw new Error(`Departemen '${user.department_name}' tidak ditemukan`);

      // Bandingkan ID aset dengan ID user
      if (asset.department_id !== userDeptId) {
        throw new Error("Anda tidak memiliki akses untuk menambah risiko ke aset ini.");
      }
    }

    // 2. Siapkan data Risk (Sama seperti 'create')
    const riskToCreate: Partial<Risk> = { ...riskData };
    riskToCreate.approval_status = "pending";
    riskToCreate.status = "new";
    riskToCreate.created_by = user.user_id;
    const entryLevel = (riskData.probability || 0) * (riskData.impact_score || 0);
    riskToCreate.entry_level = entryLevel;
    //riskToCreate.type_of_risk = calculateRiskType(entryLevel);
    if (!riskData.type_of_risk) {
       throw new Error("Jenis Risiko (Positif/Negatif) wajib dipilih.");
    }
    riskToCreate.type_of_risk = riskData.type_of_risk;

    // 3. Buat Risk
    const newRisk = await RiskRepository.createRisk(riskToCreate);

    // 4. Siapkan & Validasi Treatments (Logika dari 'risk-treatment.service')
    const treatmentPayloads: Partial<RiskTreatment>[] = [];
    for (const t of treatments) {
      // ❗️ Validasi Strategi
      // if (newRisk.type_of_risk === 'positif' && t.strategy !== 'accept') {
      //   throw new Error(`Risiko Positif (Entry Level >= 15) hanya boleh menggunakan strategi 'accept'. Ditemukan: '${t.strategy}'`);
      // }
      
      const { new_probability, new_impact_score } = t;
      const residual_level = (new_probability && new_impact_score) ? (new_probability * new_impact_score) : null;
      
      treatmentPayloads.push({
        ...t,
        risk_id: newRisk.id,
        residual_level: residual_level,
        created_by: user.user_id // Atau 'planned'
      });
    }
    
    // 5. Buat Treatments
    const newTreatments = await RiskRepository.createTreatments(treatmentPayloads);
    
    void NotificationService.notifyRoles({
      roles: ["verifikator"], 
      senderId: user.user_id,
      category: 'Risk',
      title: 'Risiko Baru Diajukan',
      message: `Risiko baru "${newRisk.title}" beserta penanganannya diajukan oleh ${user.name || user.email}.`,
      link: `/risks/${newRisk.id}`,
      type: 'info'
    });

    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "CREATE",
      table_name: "risk",
      record_id: newRisk.id,
      data_before: null,
      // Simpan snapshot lengkap (Risk + Treatments) agar informatif
      data_after: { risk: newRisk, treatments: newTreatments }, 
      ip_address: user.ip_address || null
    });

    return { risk: newRisk, treatments: newTreatments };
  }
  
  static async updateRiskWithTreatments(id: string, payload: RiskWithTreatmentsPayload, user: NormalizedUser) {
  const { risk: riskData, treatments } = payload;

    const oldRisk = await RiskRepository.findById(id);
    if (!oldRisk) throw new Error("Risiko tidak ditemukan.");  
    // 1. ❗️ Cek Izin (Sama seperti 'update')
    await this.checkPermission(user, id);

    // 2. Update Risk (Sama seperti 'update')
    const riskToUpdate: Partial<Risk> = { ...riskData };
    let needsReverification = false;
    if (!isAdmin(user)) {
      riskToUpdate.approval_status = "pending";
      needsReverification = true;
    }

    // Ambil data 'jenis_risiko' yang MUNGKIN baru
    // let finalTypeOfrisk: 'positif' | 'negatif';
    
    if (riskData.probability || riskData.impact_score) {
      if (!oldRisk) throw new Error("Risiko tidak ditemukan saat mencoba menghitung ulang level.");
      const prob = riskData.probability ?? oldRisk.probability;
      const impact = riskData.impact_score ?? oldRisk.impact_score;
      const entryLevel = prob * impact;
      riskToUpdate.entry_level = entryLevel;
      // finalTypeOfrisk = calculateRiskType(entryLevel); // 👈 Ambil jenis baru
      //riskToUpdate.type_of_risk = finalTypeOfrisk;
    } 
    // else {
    //   finalTypeOfrisk = oldRisk?.type_of_risk || 'negatif'; // 👈 Ambil jenis lama
    // }
    if (riskData.type_of_risk) {
        if (!['positif', 'negatif'].includes(riskData.type_of_risk)) {
            throw new Error("Jenis Risiko harus bernilai 'positif' atau 'negatif'.");
        }
        riskToUpdate.type_of_risk = riskData.type_of_risk;
    }

    const updatedRisk = await RiskRepository.updateRisk(id, riskToUpdate);

    // 3. Update/Create Treatments (Logika dari 'risk-treatment.service')
    const updatedTreatments: RiskTreatment[] = [];
    for (const t of treatments as UpdateTreatmentDto[]) {
      
      // ❗️ Validasi Strategi
      // const strategyToValidate = t.strategy || (await RiskRepository.findTreatmentById(t.id as string))?.strategy;
      // if (finalTypeOfrisk === 'positif' && strategyToValidate !== 'accept') {
      //   throw new Error(`Risiko Positif (Entry Level >= 15) hanya boleh menggunakan strategi 'accept'. Ditemukan: '${strategyToValidate}'`);
      // }

      // Hitung residual
      const residual = (t.new_probability && t.new_impact_score) 
        ? (t.new_probability * t.new_impact_score) 
        : (t as RiskTreatment).residual_level || null;

      if (t.id) {
        // Update
        const treatmentUpdateData = { 
        ...t, 
        residual_level: residual,
        updated_by: user.user_id,
          updated_at: new Date().toISOString()
        };
        delete (treatmentUpdateData as any).id;
        const updated = await RiskRepository.updateTreatment(t.id, treatmentUpdateData);
        updatedTreatments.push(updated);
      } else {
        // Create
        const treatmentCreateData = { 
          ...t, 
          risk_id: id, 
          residual_level: residual, 
          status: "planned",
          created_by: user.user_id,
        } as Partial<RiskTreatment>;
        const created = await RiskRepository.createTreatment(treatmentCreateData);
        updatedTreatments.push(created);
      }
    }

    if (needsReverification) {
      void NotificationService.notifyRoles({
        roles: ["verifikator"], 
        senderId: user.user_id,
        category: 'Risk',
        title: 'Risiko Diperbarui (Perlu Verifikasi)',
        message: `Risiko "${oldRisk.title}" beserta penanganannya telah diperbarui oleh ${user.name || user.email}.`,
        link: `/risks/${id}`,
        type: 'warning'
      });
    }

    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "UPDATE",
      table_name: "risk",
      record_id: id,
      data_before: oldRisk, // Data risiko sebelum update
      // Data sesudah update (Gabungan Risk + Treatments baru)
      data_after: { risk: updatedRisk, treatments: updatedTreatments }, 
      ip_address: user.ip_address || null
    });

    return { risk: updatedRisk, treatments: updatedTreatments };
  }
  
  // === Approval Methods ===
  static async verifyRisk(id: string, approval_status: string, notes: string | null, user: NormalizedUser) {
    if (!isVerifikator(user))
      throw new Error("Hanya verifikator dinas yang dapat memverifikasi risiko.");

    // 1. ❗️ Cek Izin baru (menggunakan helper checkPermission)
    await this.checkPermission(user, id);

    const oldRisk = await RiskRepository.findById(id);
    if (!oldRisk) throw new Error("Risiko tidak ditemukan.");

    // 2. ❗️ Mengisi '... (sisa logika 'verifyRisk') ...'
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(approval_status)) {
      throw new Error(`Status tidak valid. Pilihan: ${validStatuses.join(", ")}`);
    }

    const updateData: Partial<Risk> = {
      approval_status: approval_status as 'approved' | 'rejected', // TypeScript casting
      revision_notes: notes || null,
      approved_by: user.user_id, 
      approved_at: new Date().toISOString()
    };

    // 🌟 LOGIKA BARU: Jika diverifikasi, risiko dianggap AKTIF/DIRENCANAKAN
    if (approval_status === "approved") {
      updateData.status = "planned"; 
    }

    // 6. Update Database
    const updatedRisk = await RiskRepository.updateRisk(id, updateData);

    if (oldRisk.created_by) {
        if (approval_status === 'approved') {
            // Kasus DISETUJUI
            void NotificationService.notifyUser({
                userId: oldRisk.created_by,
                senderId: user.user_id,
                category: 'Risk',
                title: 'Risiko Disetujui',
                message: `Risiko "${oldRisk.title}" telah disetujui oleh verifikator dan masuk status Planned.`,
                notes: notes,
                link: `/risks/${id}`,
                type: 'success'
            });
        } else {
            // Kasus DITOLAK
            void NotificationService.notifyUser({
                userId: oldRisk.created_by,
                senderId: user.user_id,
                category: 'Risk',
                title: 'Risiko Ditolak',
                message: `Pengajuan risiko "${oldRisk.title}" ditolak oleh verifikator.`,
                notes: notes, // Alasan penolakan
                link: `/risks/${id}`,
                type: 'error'
            });
        }
    }
    // 7. 🚀 AUDIT TRAIL
    void AuditService.log({
      user_id: user.user_id,
      user_name: user.name || user.email,
      user_email: user.email,
      action: "APPROVE", 
      table_name: "risk",
      record_id: id,
      data_before: oldRisk,
      data_after: updatedRisk,
      ip_address: user.ip_address || null
    });

    return updatedRisk;
  }

  /* 
  static async approveRisk(id: string, approval_status: string, notes: string | null, user: NormalizedUser) {
    if (!isAdminDiskominfo(user))
      throw new Error("Hanya admin Diskominfo yang dapat memberikan persetujuan akhir risiko.");

    const risk = await RiskRepository.findByIdSimple(id);
    if (!risk) throw new Error("Risiko tidak ditemukan.");
    if (risk.approval_status !== "verified")
      throw new Error("Risiko belum diverifikasi, tidak dapat disetujui final.");
      
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(approval_status))
      throw new Error(`Status tidak valid. Pilihan: ${validStatuses.join(", ")}`);

    const updateData: Partial<Risk> = {
      approval_status: approval_status as 'approved' | 'rejected' ,
      revision_notes: notes || null,
    };
    if (approval_status === "approved") {
      updateData.status = "planned"; // "planned" adalah tipe yang valid
    }
    
    return RiskRepository.updateRisk(id, updateData);
  }
  */
}