class ForgotPassword {
  constructor(api) {
    this.api = api;
  }

  async generate(form) {
    try {
      const response = await this.api.post(
        `/forgot-password-link/generate/`,
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
  return new ForgotPassword(api);
}
