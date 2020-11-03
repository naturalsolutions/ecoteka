class Organization {
  constructor(api) {
    this.api = api;
  }

  async get(id) {
    const url = `/organization/${id}`;
    const response = await this.api.get(url);

    return response;
  }
}

export default function userFactory(api) {
  return new Organization(api);
}
