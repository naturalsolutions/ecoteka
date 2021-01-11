import axios from "axios";
import getConfig from "next/config";
import { useRouter } from "next/router";
import useLocalStorage from "@/lib/hooks/useLocalStorage";
import createAuthRefreshInterceptor from "axios-auth-refresh";

export default function useApi() {
  const { publicRuntimeConfig } = getConfig();
  const { tokenStorage, refreshTokenStorage } = publicRuntimeConfig;
  const { apiUrl } = publicRuntimeConfig;
  const router = useRouter();
  const [accessToken, setAccessToken] = useLocalStorage(tokenStorage);
  const [refreshToken, setRefreshToken] = useLocalStorage(refreshTokenStorage);

  if (
    (!accessToken || !refreshToken) &&
    typeof window !== "undefined" &&
    router.pathname !== "/signin"
  ) {
    router.push("/signin");
  }

  let ecotekaV1 = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // This Axios instance is private;
  // Use it only to get (or hope to get) a "/auth/refresh_token" successfull response
  let _ecotekaV1ForRefresh = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
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
        router.push("/signin");
        return Promise.reject();
      });

  createAuthRefreshInterceptor(ecotekaV1, refreshAuthLogic, {
    statusCodes: [401, 422],
  });

  const api = {
    apiETK: ecotekaV1,
    apiGBIF: gbif,
  };

  return {
    api,
  };
}
