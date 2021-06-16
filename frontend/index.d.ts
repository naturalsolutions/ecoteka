export type TOrganizationMode = "private" | "open" | "participatory";

export interface IOrganization {
  id: number;
  name: string;
  slug: string;
  path: string;
  parent_id: number;
  total_trees: number;
  total_members: number;
  archived: boolean;
  featured: boolean;
  mode: TOrganizationMode;
  osm_id: number;
  population_size?: number;
  area_sq_km?: number;
  updated_at: string;
  created_at: string;
  current_user_role?: string;
}

export interface IUser {
  id: int;
  email: string;
  full_name: string;
  is_superuser: boolean;
  is_verified: boolean;
  organizations: IOrganization[];
}

export type FormMode = "edit" | "read";

export interface Tree {
  id: number;
  x?: number;
  y?: number;
  properties?: object;
  user_id?: number;
  organization_id?: number;
}

export interface IMember {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  status: string;
  hashed_password: string;
}

export interface Error {
  message: string;
  code: number;
}
