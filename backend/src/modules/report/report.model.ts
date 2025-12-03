export interface ReportFilterDto {
  startDate?: string; 
  endDate?: string;
  department_id?: string;
  status_asset?: string; 
  format: 'excel'; 
}