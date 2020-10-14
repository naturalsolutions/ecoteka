import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { tokenStorage } = publicRuntimeConfig;

class Auth {
  constructor(url, api) {
    this.url = url;
    this.api = api;
  }

  async accessToken({ username, password }) {
    try {
      const body = new FormData();

      body.append("username", username);
      body.append("password", password);

      const response = await fetch(`${this.url}/auth/login/access-token`, {
        method: "POST",
        body,
      });

      const { access_token: accessToken } = await response.json();

      localStorage.setItem(tokenStorage, accessToken);

      return accessToken;
    } catch (e) {
      return e.message;
    }
  }

  async register(data) {
    try {
      const response = await this.api.post(
        "/auth/register/",
        {},
        JSON.stringify(data)
      );
      const json = await response.json();

      return { response, json };
    } catch (e) {
      return {};
    }
  }

  logout() {
    localStorage.removeItem(tokenStorage);
  }
}

export default function authFactory(url, api) {
  return new Auth(url, api);
}
