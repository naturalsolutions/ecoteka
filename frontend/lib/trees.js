class Tree {
  constructor(api) {
    this.api = api;
  }

  async importFromGeofile(name) {
    const url = `trees/import-from-geofile?name=${name}`;
    const response = await this.api.post(url);
    const geofile = await response.json();

    return geofile;
  }
}

export default function userFactory(api) {
  return new Tree(api);
}
