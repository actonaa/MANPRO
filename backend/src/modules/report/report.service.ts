import { ReportRepository } from "./report.repository.js";
import ExcelJS from 'exceljs';
import type { ReportFilterDto } from "./report.model.js";

export class ReportService {

  static async generateComprehensiveExcel(filters: ReportFilterDto) {
    // 1. Ambil Data
    const rawData = await ReportRepository.getComprehensiveData(filters);

    // 2. Setup Excel
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Laporan Aset & Risiko');

    sheet.columns = [
      { header: 'Nama Aset', key: 'asset', width: 30 },
      { header: 'Departemen', key: 'dept', width: 25 },
      { header: 'Status Aset', key: 'status', width: 15 },
      { header: 'Nilai Aset', key: 'value', width: 20 },
      
      { header: 'Judul Risiko', key: 'risk_title', width: 25 },
      { header: 'Level', key: 'risk_level', width: 10 },
      { header: 'Jenis', key: 'risk_type', width: 10 },

      { header: 'Tgl Maint.', key: 'maint_date', width: 15 },
      { header: 'Biaya Maint.', key: 'maint_cost', width: 15 },
      { header: 'Status Maint.', key: 'maint_status', width: 15 },
    ];

    // Style Header
    sheet.getRow(1).font = { bold: true };
    
    // 3. Flattening Data (1 Baris per Event)
    rawData.forEach((asset: any) => {
      const baseRow = {
        asset: asset.name,
        dept: asset.department_name,
        status: asset.status?.name || '-',
        value: asset.acquisition_value || 0
      };

      // Gabungkan array risk dan maintenance untuk di-loop
      const maxRows = Math.max(asset.risk.length, asset.maintenance_logs.length, 1);

      for (let i = 0; i < maxRows; i++) {
        const risk = asset.risk[i] || {};
        const maint = asset.maintenance_logs[i] || {};

        sheet.addRow({
          ...baseRow,
          // Data Risk
          risk_title: risk.title || '-',
          risk_level: risk.entry_level || '-',
          risk_type: risk.type_of_risk || '-',
          // Data Maintenance
          maint_date: maint.scheduled_date || '-',
          maint_cost: maint.cost || 0,
          maint_status: maint.status || '-'
        });
      }
      sheet.addRow({}); // Jarak antar aset
    });

    return workbook;
  }

  // Helper untuk membuat workbook standar
  private static createWorkbook(sheetName: string, columns: any[]) {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(sheetName);
    sheet.columns = columns;
    sheet.getRow(1).font = { bold: true };
    return { workbook, sheet };
  }

  // 1. Excel Risiko
  static async generateRiskExcel() {
    const data = await ReportRepository.getRiskDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan Risiko', [
      { header: 'Judul Risiko', key: 'title', width: 30 },
      { header: 'Aset', key: 'asset', width: 25 },
      { header: 'Departemen', key: 'dept', width: 20 },
      { header: 'Kategori', key: 'cat', width: 20 },
      { header: 'Level', key: 'level', width: 10 },
      { header: 'Status', key: 'status', width: 15 },
    ]);

    data.forEach((item: any) => {
      sheet.addRow({
        title: item.title,
        asset: item.asset?.name || '-',
        dept: item.asset?.department?.name || '-', // Akses nested
        cat: item.risk_category?.name || '-',
        level: item.entry_level,
        status: item.status
      });
    });
    return workbook;
  }

  // 2. Excel Maintenance
  static async generateMaintenanceExcel() {
    const data = await ReportRepository.getMaintenanceDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan Pemeliharaan', [
      { header: 'Aset', key: 'asset', width: 25 },
      { header: 'Tgl Jadwal', key: 'sched', width: 15 },
      { header: 'Tgl Selesai', key: 'comp', width: 15 },
      { header: 'Tipe', key: 'type', width: 15 },
      { header: 'Vendor', key: 'vendor', width: 20 },
      { header: 'Biaya', key: 'cost', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
    ]);

    data.forEach((item: any) => {
      sheet.addRow({
        asset: item.asset?.name || '-',
        sched: item.scheduled_date,
        comp: item.completion_date || '-',
        type: item.type,
        vendor: item.vendor || '-',
        cost: item.cost || 0,
        status: item.status
      });
    });
    return workbook;
  }

  // 3. Excel Skenario
  static async generateScenarioExcel() {
    const data = await ReportRepository.getScenarioDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan Skenario', [
      { header: 'Nama Skenario', key: 'name', width: 35 },
      { header: 'Deskripsi', key: 'desc', width: 40 },
      { header: 'Pemilik (Jabatan)', key: 'owner', width: 25 },
      { header: 'Jumlah Aset', key: 'count', width: 15 },
      { header: 'Daftar Aset', key: 'assets', width: 50 },
    ]);

    data.forEach((item: any) => {
      // Gabungkan nama aset jadi string koma
      const assetNames = item.assets ? item.assets.map((a: any) => a.name).join(', ') : '-';
      
      sheet.addRow({
        name: item.name,
        desc: item.description,
        owner: item.owner_position?.name || '-',
        count: item.assets?.length || 0,
        assets: assetNames
      });
    });
    return workbook;
  }

  // 4. Excel Audit
  static async generateAuditExcel() {
    const data = await ReportRepository.getAuditDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan Audit', [
      { header: 'Waktu', key: 'time', width: 20 },
      { header: 'User', key: 'user', width: 20 },
      { header: 'Email', key: 'email', width: 25 },
      { header: 'Aksi', key: 'action', width: 15 },
      { header: 'Modul', key: 'table', width: 15 },
      { header: 'IP Address', key: 'ip', width: 15 },
    ]);

    data.forEach((item: any) => {
      sheet.addRow({
        time: new Date(item.created_at).toLocaleString(),
        user: item.user_name,
        email: item.user_email,
        action: item.action,
        table: item.table_name,
        ip: item.ip_address
      });
    });
    return workbook;
  }

  // 1. Excel Aset (Inventory)
  static async generateAssetExcel() {
    const data = await ReportRepository.getAssetDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan Aset', [
      { header: 'Barcode', key: 'barcode', width: 15 },
      { header: 'Nama Aset', key: 'name', width: 30 },
      { header: 'Serial Number', key: 'sn', width: 20 },
      { header: 'Kategori', key: 'cat', width: 20 },
      { header: 'Departemen', key: 'dept', width: 20 },
      { header: 'Lokasi', key: 'loc', width: 20 },
      { header: 'Kondisi', key: 'cond', width: 15 },
      { header: 'Nilai Perolehan', key: 'val', width: 20 },
      { header: 'Tahun', key: 'year', width: 10 },
    ]);

    data.forEach((item: any) => {
      sheet.addRow({
        barcode: item.barcode,
        name: item.name,
        sn: item.serial_number,
        cat: item.category?.name || '-', // Karena pakai View
        dept: item.department?.name || '-',
        loc: item.lokasi,
        cond: item.condition?.name || '-',
        val: item.acquisition_value,
        year: item.acquisition_date ? new Date(item.acquisition_date).getFullYear() : '-'
      });
    });
    return workbook;
  }

  // 2. Excel Penghapusan (Disposal)
  static async generateDeletionExcel() {
    const data = await ReportRepository.getDeletionDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan Penghapusan', [
      { header: 'Nama Aset', key: 'name', width: 30 },
      { header: 'Barcode', key: 'barcode', width: 15 },
      { header: 'Departemen', key: 'dept', width: 20 },
      { header: 'Nilai Aset', key: 'val', width: 20 },
      { header: 'Status Pengajuan', key: 'status', width: 20 },
      { header: 'Catatan/Alasan', key: 'notes', width: 40 },
    ]);

    data.forEach((item: any) => {
      sheet.addRow({
        name: item.name,
        barcode: item.barcode,
        dept: item.department?.name || '-',
        val: item.acquisition_value,
        status: item.approval_status.replace('_', ' ').toUpperCase(),
        notes: item.revision_notes || '-'
      });
    });
    return workbook;
  }

  // 3. Excel Insiden
  static async generateIncidentExcel() {
    const data = await ReportRepository.getIncidentDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan Aset Terdampak Insiden', [
      { header: 'ID Tiket Insiden', key: 'ticket', width: 20 },
      { header: 'Aset Terdampak', key: 'asset', width: 30 },
      { header: 'Barcode', key: 'barcode', width: 15 },
      { header: 'Departemen', key: 'dept', width: 20 },
      { header: 'Status Aset Saat Ini', key: 'status', width: 20 },
      { header: 'Terakhir Update', key: 'date', width: 20 },
    ]);

    data.forEach((item: any) => {
      sheet.addRow({
        ticket: item.linked_incident_id,
        asset: item.name,
        barcode: item.barcode,
        dept: item.department?.name || '-',
        status: item.status?.name || '-',
        date: new Date(item.updated_at).toLocaleDateString()
      });
    });
    return workbook;
  }

  // 4. Excel RFC
  static async generateRFCExcel() {
    const data = await ReportRepository.getRFCDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan Aset Terdampak RFC', [
      { header: 'ID Change (RFC)', key: 'rfc', width: 20 },
      { header: 'Aset', key: 'asset', width: 30 },
      { header: 'Barcode', key: 'barcode', width: 15 },
      { header: 'Departemen', key: 'dept', width: 20 },
      { header: 'Status Aset', key: 'status', width: 20 },
      { header: 'Terakhir Update', key: 'date', width: 20 },
    ]);

    data.forEach((item: any) => {
      sheet.addRow({
        rfc: item.linked_change_id,
        asset: item.name,
        barcode: item.barcode,
        dept: item.department?.name || '-',
        status: item.status?.name || '-',
        date: new Date(item.updated_at).toLocaleDateString()
      });
    });
    return workbook;
  }

  // 5. Excel SDM
  static async generateHRExcel() {
    const data = await ReportRepository.getHRDataForExport();
    const { workbook, sheet } = this.createWorkbook('Laporan SDM', [
      { header: 'NIP', key: 'nip', width: 20 },
      { header: 'Nama Pegawai', key: 'name', width: 30 },
      { header: 'Jabatan', key: 'pos', width: 25 },
      { header: 'Bidang/Divisi', key: 'div', width: 25 },
      { header: 'No. HP', key: 'phone', width: 15 },
      { header: 'Keahlian (Skill)', key: 'skills', width: 40 },
    ]);

    data.forEach((item: any) => {
      // Gabungkan skill jadi satu string koma
      const skillList = item.hr_skill 
        ? item.hr_skill.map((s: any) => s.skill?.skill_name).filter(Boolean).join(', ') 
        : '-';

      sheet.addRow({
        nip: item.nip,
        name: item.name,
        pos: item.position?.position_name || '-',
        div: item.division?.division_name || '-',
        phone: item.phone_number,
        skills: skillList
      });
    });
    return workbook;
  }
}