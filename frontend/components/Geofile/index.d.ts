export default interface ETKGeofile {
  id: number;
  user_id: number;
  name: string;
  original_name: string;
  status: string;
  extension: string;
  checksum: string;
  count: 0;
  crs: string;
  driver: string;
  longitude_column: string;
  latitude_column: string;
  properties: string;
  uploaded_date: string;
  imported_date: string;
  importing_start: string;
  public: false;
}
