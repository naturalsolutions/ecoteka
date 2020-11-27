class Intervention {
  constructor(api) {
    this.api = api;
    this.basepath = "/organization/{organization_id}/interventions";
  }

  async get(id) {
    const url = `${this.basepath}/${id}`;
    const response = await this.api.get(url);

    return await response.json();
  }

  async post(organizationId, model) {
    const url = `${this.basepath.replace(
      "{organization_id}",
      organizationId
    )}/`;
    console.log(url);
    const response = await this.api.post(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async patch(id, model) {
    const url = `${this.basepath}/${id}`;
    const response = await this.api.patch(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async plan(id, date) {
    const url = `${this.basepath}/${id}`;
    const response = await this.api.patch(url, {}, JSON.stringify({ date }));

    return response;
  }

  async delete(id) {
    const url = `${this.basepath}/${id}`;
    const response = await this.api.delete(url);

    return await response.json();
  }

  async getByYear(organizationId, year) {
    try {
      const url = `${this.basepath.replace(
        "{organization_id}",
        organizationId
      )}/year/${year}`;
      const response = await this.api.get(url);
      const body = await response.json();

      return body;
    } catch (e) {}
  }
}

export default function interventionFactory(api) {
  return new Intervention(api);
}
