import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { tokenStorage, refreshTokenStorage } = publicRuntimeConfig;

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

      const response = await fetch(`${this.url}/auth/login`, {
        method: "POST",
        body,
      });

      const resp = await response.json();
      const accessToken = resp["access_token"];
      const refreshToken = resp["refresh_token"];

      localStorage.setItem(tokenStorage, accessToken);
      localStorage.setItem(refreshTokenStorage, refreshToken);

      return {
        access_token: accessToken,
      };
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

      return {
        response,
        json,
      };
    } catch (e) {
      return {};
    }
  }
}

export default function authFactory(url, api) {
  return new Auth(url, api);
}
