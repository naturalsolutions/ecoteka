class Organizations {
  constructor(api) {
    this.api = api;
  }

  async getAll() {
    try {
      const response = await this.api.get("/organizations/");

      if (response.ok) {
        const json = await response.json();
        return json;
      }

      return false;
    } catch (e) {
      return Error(e.message);
    }
  }
}

export default function userFactory(api) {
  return new Organizations(api);
}
