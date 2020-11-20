export interface IOrganization {
  id: number;
  name: string;
  slug: string;
  path: string;
  parent_id: number;
};

export interface IUser {
  id: int;
  email: string;
  full_name: string;
  is_superuser: boolean;
  is_verified: boolean;
  currentOrganization?: IOrganization;
  organizations: IOrganization[];
}