class Tree {
  constructor(api) {
    this.api = api;
  }

  async importFromGeofile(organizationId, name) {
    const url = `/organization/${organizationId}/trees/import?name=${name}`;
    const response = await this.api.post(url);
    const geofile = await response.json();

    return geofile;
  }

  async get(organizationId, id) {
    const url = `/organization/${organizationId}/trees/${id}`;
    const response = await this.api.get(url);

    return await response.json();
  }

  async post(organizationId, payload) {
    const url = `/organization/${organizationId}/trees/`;
    const response = await this.api.post(url, {}, JSON.stringify(payload));

    return await response.json();
  }

  async put(organizationId, id, payload) {
    const url = `/organization/${organizationId}/trees/${id}`;
    const response = await this.api.put(url, {}, JSON.stringify(payload));

    return response;
  }

  async bulkDelete(organizationId, trees) {
    const url = `/organization/${organizationId}/trees/bulk_delete`;
    const response = await this.api.delete(url, {}, trees);

    return await response.json();
  }

  async delete(organizationId, id) {
    const url = `/organization/${organizationId}/trees/${id}`;
    const response = await this.api.delete(url);

    return await response.json();
  }

  async export(organizationId, format) {
    const url = `/organization/${organizationId}/trees/export/?format=${format}`;
    return await this.api.get(url);
  }

  async getInterventions(organizationId, treeId) {
    // TODO : use real endpoints
    const url = `/organization/${organizationId}/trees/${treeId}/interventions`;
    const response = await this.api.get(url);

    return await response.json();
  }
}

export default function userFactory(api) {
  return new Tree(api);
}
