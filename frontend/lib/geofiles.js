class Geofiles {
  constructor(api) {
    this.api = api;
  }

  upload(file, { onProgress, onLoad, onError }) {
    const formData = new FormData();

    formData.append("file", file, file.name);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (e) => onProgress(e);
    xhr.onload = () => onLoad(xhr);
    xhr.onerror = () => onError(xhr);

    xhr.open("POST", `${this.api.url}/geo_files/upload`, true);
    xhr.setRequestHeader("Authorization", `Bearer ${this.api.getToken()}`);
    xhr.send(formData);

    return xhr;
  }

  async update(geofile) {
    const body = JSON.stringify(geofile);
    const response = await this.api.put("/geo_files", {}, body);

    if (response.status === 200) {
      const newGeofile = await response.json();

      return newGeofile;
    }
  }
}

export default function userFactory(api) {
  return new Geofiles(api);
}
