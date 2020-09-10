class RegistrationLink {
  constructor(api) {
    this.api = api;
  }

  async verification(uuid) {
    const response = await this.api.get(
      `/registration_link/verification/${uuid}`
    );

    return response;
  }
}

export default function userFactory(api) {
  return new RegistrationLink(api);
}
