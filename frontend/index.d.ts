export interface IOrganization {
  id: number;
  name: string;
  slug: string;
  path: string;
  parent_id: number;
  total_trees: number;
  total_members: number;
  archived: boolean;
}

export interface IUser {
  id: int;
  email: string;
  full_name: string;
  is_superuser: boolean;
  is_verified: boolean;
  currentOrganization?: IOrganization;
  organizations: IOrganization[];
}

export interface ITree {
  id: number;
  x: number;
  y: number;
  properties: object;
  user_id: number;
  organization_id: number;
}

export interface IMember {
  id: number;
  email: string;
  full_name?: string;
  role: string;
  status: string;
  hashed_password: string;
}
