import axios from "axios";
import LocalStorage from "@/lib/services/storage";
import getConfig from "next/config";
import { useRouter } from "next/router";

export const useApi = () => {
  const { publicRuntimeConfig } = getConfig();
  const { apiUrl } = publicRuntimeConfig;
  const router = useRouter();

  const localStorageService = LocalStorage.getService();

  const accessToken = localStorageService.getAccessToken();
  const refreshToken = localStorageService.getRefreshToken();

  // TODO Send messages to User with snackbars

  if (!accessToken || !refreshToken) {
    router.push("/signin");
  }

  let axiosForRefresh = axios.create({
    baseURL: apiUrl,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${refreshToken}`,
    },
  });

  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorageService.getAccessToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
      config.headers["Content-Type"] = "application/json";
      config.baseURL = apiUrl;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  // Response interceptor
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    function (error) {
      const originalRequest = error.config;
      if (
        error.response.status === 401 ||
        (error.response.status === 422 &&
          error.response.data.detail === "Signature has expired" &&
          originalRequest.url != "/auth/refresh_token" &&
          !originalRequest._retry)
      ) {
        originalRequest._retry = true;

        // !! Need fix : Error 422 is raised if access_token or refresh_token are missing
        return axiosForRefresh.post("/auth/refresh_token", {}).then((res) => {
          if (res.status === 200) {
            const { access_token, refresh_token } = res.data;
            localStorageService.setAccessToken(access_token);
            localStorageService.setRefreshToken(refresh_token);
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${access_token}`;

            return axios(originalRequest);
          }
        });
      }

      if (
        error.response.status === 401 ||
        (error.response.status === 422 &&
          error.response.data.detail === "Signature has expired" &&
          originalRequest.url === "/auth/refresh_token")
      ) {
        router.push("/signin");
        return Promise.reject(error);
      }
      return Promise.reject(error);
    }
  );

  // WIP
  const getUsers = async () => {
    const res = await axios.get("/users");
    return res;
  };

  return {
    getUsers,
  };
};
