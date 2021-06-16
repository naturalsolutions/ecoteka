import axios from "axios";
import getConfig from "next/config";
import { useRouter } from "next/router";

export default function useApi() {
  const { publicRuntimeConfig } = getConfig();
  const {
    tokenStorage,
    refreshTokenStorage,
    meiliMasterKey,
    apiUrl,
    meiliApiUrl,
  } = publicRuntimeConfig;
  const router = useRouter();

  let ecotekaV1 = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  ecotekaV1.interceptors.request.use(
    async (config) => {
      const token = localStorage.getItem(tokenStorage);

      if (token) {
        config.headers.common.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  ecotekaV1.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;

      if (error.response.status === 422 && !config._retry) {
        config._retry = true;
        const refreshToken = window.localStorage.getItem(refreshTokenStorage);

        const { status, data } = await ecotekaV1.post(
          "/auth/refresh_token",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        if (status === 200) {
          window.localStorage.setItem(tokenStorage, data.access_token);
          window.localStorage.setItem(refreshTokenStorage, data.refresh_token);
          config.headers.Authorization = `Bearer ${data.access_token}`;
        }

        return ecotekaV1(config);
      }

      router.push("/");

      return Promise.reject(error);
    }
  );

  // Axios instance to retrieve results from ecoTeka search engine;
  let meiliApi = axios.create({
    baseURL: meiliApiUrl,
    headers: {
      "Content-Type": "application/json",
      "X-Meili-API-Key": meiliMasterKey,
    },
  });

  // https://www.gbif.org/developer/summary
  // Only for GET requests;
  // POST, PUT, and DELETE requests require GBIF API HTTP Basic Authentication
  let gbif = axios.create({
    baseURL: "https://api.gbif.org/v1/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // DOC: https://eol.org/docs/what-is-eol/classic-apis
  let eol = axios.create({
    baseURL: "https://eol.org/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  //
  let wikispecies = axios.create({
    baseURL: "https://species.wikimedia.org/api/rest_v1",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const api = {
    apiETK: ecotekaV1,
    apiMeili: meiliApi,
    apiGBIF: gbif,
    apiEOL: eol,
    apiWikispecies: wikispecies,
  };

  return {
    api,
  };
}
