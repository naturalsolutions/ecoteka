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

  async post(model) {
    const url = `trees/add`;
    const response = await this.api.post(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async getCentroidFromOrganization(organization) {
    const url = `/trees/get-centroid-organization/${organization}`;
    const response = await this.api.get(url);

    return await response.json();
  }
}

export default function userFactory(api) {
  return new Tree(api);
}
