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
  const [accessToken, setAccessToken] = useLocalStorage(
    tokenStorage,
    localStorage.getItem(tokenStorage)
  );
  const [refreshToken, setRefreshToken] = useLocalStorage(
    refreshTokenStorage,
    localStorage.getItem(refreshTokenStorage)
  );

  if (!accessToken || !refreshToken) {
    router.push("/signin");
  }

  let ecotekaV1ForRefresh = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });
  let ecotekaV1 = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  // https://www.gbif.org/developer/summary
  // Only for GET requests; POST, PUT, and DELETE requests require authentication through GBIF API HTTP Basic Authentication
  let gbif = axios.create({
    baseURL: "https://api.gbif.org/v1/",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const refreshAuthLogic = (failedRequest) =>
    ecotekaV1ForRefresh
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

  return {
    ecotekaV1,
    gbif,
  };
}
