class ForgotPasswordLink {
  constructor(api) {
    this.api = api;
  }

  async changeForgotPassword(uuid, form) {
    try {
      const response = await this.api.post(
        `/forgot-password-link/${uuid}`,
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
  return new ForgotPasswordLink(api);
}
