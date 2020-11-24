class Geofiles {
  constructor(api) {
    this.api = api;
  }

  async get(organizationId, name) {
    const response = await this.api.get(
      `/organization/${organizationId}/geo_files/${name}`
    );
    const json = await response.json();

    return json;
  }

  async getAll(organizationId) {
    const response = await this.api.get(
      `/organization/${organizationId}/geo_files/`
    );
    const json = await response.json();

    return json;
  }

  upload(organizationId, file, { onProgress, onLoad, onError }) {
    const formData = new FormData();

    formData.append("file", file, file.name);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => onProgress(e);
    xhr.onload = () => onLoad(xhr);
    xhr.onerror = () => onError(xhr);

    xhr.open(
      "POST",
      `${this.api.url}/organization/${organizationId}/geo_files/upload`,
      true
    );
    xhr.setRequestHeader("Authorization", `Bearer ${this.api.getToken()}`);
    xhr.send(formData);

    return xhr;
  }

  async update(organizationId, geofile) {
    const body = JSON.stringify(geofile);
    const response = await this.api.put(
      `/organization/${organizationId}/geo_files/`,
      {},
      body
    );

    if (response.status === 200) {
      const newGeofile = await response.json();

      return newGeofile;
    }
  }

  async delete(organizationId, name) {
    const response = await this.api.delete(
      `/organization/${organizationId}/geo_files/${name}`
    );

    if (response.status === 200) {
      return true;
    }

    return false;
  }
}

export default function userFactory(api) {
  return new Geofiles(api);
}
