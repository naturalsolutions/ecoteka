class Users {
  constructor(api) {
    this.api = api;
  }

  async me() {
    try {
      const response = await this.api.get("/users/me");

      if (response.ok) {
        const user = await response.json();

        if (user.detail) {
          return null;
        }

        return user;
      }

      return false;
    } catch (e) {
      return Error(e.message);
    }
  }

  async updateMe(form) {
    try {
      const response = await this.api.put(
        `/users/me`,
        {},
        JSON.stringify(form)
      );
      const json = await response.json();

      return { response, json };
    } catch (e) {
      return {};
    }
  }
}

export default function userFactory(api) {
  return new Users(api);
}
