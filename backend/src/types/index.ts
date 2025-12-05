export interface CustomJwtPayload {
  sub: string;
  email: string;
  name?: string;
  role?: string;
  department?: string;
  division?: string;
  section?: string | null;
  position?: string;
  phone_number?: string;
  skills?: string[];
  iat: number;
  exp: number;
}

export interface NormalizedUser {
  user_id: string;   
  email: string;
  name: string | null;
  role_name: string | null;
  department_name: string | null;
  division: string | null;
  section: string | null;
  position?: string | null;
  phone_number: string | null;
  skills: string[];
  ip_address?: string;
}