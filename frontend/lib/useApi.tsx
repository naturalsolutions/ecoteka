import axios from "axios";
import getConfig from "next/config";
import { useRouter } from "next/router";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { useEffect, useState } from "react";

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
  const [accessToken, setAccessToken] = useLocalStorage(tokenStorage);
  const [refreshToken, setRefreshToken] = useLocalStorage(refreshTokenStorage);

  // const allowedRoutes = ["/", "/signin", "/forgot", "/users/set_password"];

  useEffect(() => {
    // if (
    //   (!accessToken || !refreshToken) &&
    //   !allowedRoutes.includes(router.route)
    // ) {
    //   localStorage.clear();
    //   router.push("/signin");
    // }
    if (accessToken) {
      ecotekaV1.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${accessToken}`;
    }

    if (!accessToken) {
      delete ecotekaV1.defaults.headers.common["Authorization"];
    }
  }, [accessToken]);

  let ecotekaV1 = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (accessToken) {
    ecotekaV1.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${accessToken}`;
  }

  if (!accessToken) {
    delete ecotekaV1.defaults.headers.common["Authorization"];
  }

  // This Axios instance is private;
  // Use it only to get (or hope to get) a "/auth/refresh_token" successfull response
  let _ecotekaV1ForRefresh = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

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

  const refreshAuthLogic = (failedRequest) =>
    // We got here because accessToken has expired
    // Overwriting headers in failedRequest will not help us to get a "/auth/refresh_token" successfull response
    // We could have used Axios reponse interceptors to reset defaut Authorization header...
    // But we choose to use a dedicated Axios instance to make code clearer

    _ecotekaV1ForRefresh
      .post("/auth/refresh_token")
      .then((tokenRefreshResponse) => {
        const { access_token, refresh_token } = tokenRefreshResponse.data;
        setAccessToken(access_token);
        setRefreshToken(refresh_token);
        failedRequest.response.config.headers[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return Promise.resolve();
      })
      .catch((error) => {
        // console.log("RefreshToken request error");
        router.push("/signin");
      });

  createAuthRefreshInterceptor(ecotekaV1, refreshAuthLogic, {
    statusCodes: [422],
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
