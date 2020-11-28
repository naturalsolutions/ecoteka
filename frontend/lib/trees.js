class Tree {
  constructor(api) {
    this.api = api;
  }

  async importFromGeofile(organizationId, name) {
    const url = `/organization/${organizationId}/trees/import-from-geofile?name=${name}`;
    const response = await this.api.post(url);
    const geofile = await response.json();

    return geofile;
  }

  async get(organizationId, id) {
    const url = `/organization/${organizationId}/trees/${id}`;
    const response = await this.api.get(url);

    return await response.json();
  }

  async post(model) {
    const url = `/trees/`;
    const response = await this.api.post(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async patch(id, model) {
    const url = `/trees/${id}`;
    const response = await this.api.patch(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async delete(id) {
    const url = `/trees/${id}`;
    const response = await this.api.delete(url);

    return await response.json();
  }

  async getInterventions(treeId) {
    // TODO : use real endpoints
    const url = `/assets/mock/trees_1_interventions.json`;
    const response = await fetch(url, {
      method: "GET",
    });

    return await response.json();
  }
}

export default function userFactory(api) {
  return new Tree(api);
}
