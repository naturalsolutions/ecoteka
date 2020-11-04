class Intervention {
  constructor(api) {
    this.api = api;
    this.basepath = "/interventions";
  }

  async get(id) {
    const url = `${this.basepath}/${id}`;
    const response = await this.api.get(url);

    return await response.json();
  }

  async post(model) {
    const url = `${this.basepath}/`;
    const response = await this.api.post(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async patch(id, model) {
    const url = `${this.basepath}/${id}`;
    const response = await this.api.patch(url, {}, JSON.stringify(model));

    return await response.json();
  }

  async delete(id) {
    const url = `${this.basepath}/${id}`;
    const response = await this.api.delete(url);

    return await response.json();
  }

  async getByYear(year) {
    try {
      const url = `${this.basepath}/year/${year}`;
      const response = await this.api.get(url);
      const body = await response.json();

      return body;
    } catch (e) {}
  }
}

export default function interventionFactory(api) {
  return new Intervention(api);
}
