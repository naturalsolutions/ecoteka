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

  async get(id) {
    const url = `trees/${id}`;
    const response = await this.api.get(url);

    return await response.json();
  }

  async post(model) {
    const url = `trees/`;
    const response = await this.api.post(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async getCentroidFromOrganization(organization) {
    const url = `/trees/get-centroid-organization/${organization}`;
    const response = await this.api.get(url);

    return await response.json();
  }

  async patch(id, model) {
    const url = `trees/${id}`;
    const response = await this.api.patch(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async delete(id) {
    const url = `trees/${id}`;
    const response = await this.api.delete(url);

    return await response.json();
  }
}

export default function userFactory(api) {
  return new Tree(api);
}
