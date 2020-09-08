import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();
const { tokenStorage } = publicRuntimeConfig;

class Auth {
  constructor(url) {
    this.url = url;
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

  logout() {
    localStorage.removeItem(tokenStorage);
  }
}

export default function authFactory(url) {
  return new Auth(url);
}
