export type TMemberRole =
  | "admin"
  | "owner"
  | "manager"
  | "contributor"
  | "reader"
  | "guest";

export interface TMember {
  id: number;
  full_name?: string;
  email: string;
  status?: string;
  is_superuser: boolean;
  is_verified: boolean;
  role: TMemberRole;
}
