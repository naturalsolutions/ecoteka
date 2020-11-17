class Organization {
  constructor(api) {
    this.api = api;
  }

  async get(id) {
    const url = `/organization/${id}`;
    const response = await this.api.get(url);
    
    return await response.json();
  }

  async members(id) {
    const url = `/users`;
    const response = await this.api.get(url);

    return await response.json();
  }

  async parents(id) {
    const url = `/organization/${id}/path`;
    const response = await this.api.get(url);

    return await response.json();
  }

  async teams(id) {
    const url = `/organization/${id}/teams`;
    const response = await this.api.get(url);

    return await response.json();
  }
}

export default function userFactory(api) {
  return new Organization(api);
}
