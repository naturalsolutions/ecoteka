import axios from "axios";
import LocalStorage from "@/lib/services/storage";
import getConfig from "next/config";
import { useRouter } from "next/router";

export const useApi = () => {
  const { publicRuntimeConfig } = getConfig();
  const { apiUrl } = publicRuntimeConfig;
  const router = useRouter();

  const localStorageService = LocalStorage.getService();

  // Request interceptor
  axios.interceptors.request.use(
    (config) => {
      const token = localStorageService.getAccessToken();
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
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
      console.log(error.config);
      console.log(error.response);
      if (
        error.response.status === 422 &&
        error.response.data.detail === "Signature has expired" &&
        originalRequest.url != "/auth/access_token" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;
        console.log("Retry!");

        return axios
          .post("/auth/access_token", {
            access_token: localStorageService.getRefreshToken(),
            token_type: "Bearer",
          })
          .then((res) => {
            if (res.status === 200) {
              /// according to API docs
              const token = res;
              localStorageService.setAccesToken(res.data);
              localStorageService.setRefeshToken(res.data);
              axios.defaults.headers.common["Authorization"] =
                "Bearer " + localStorageService.getAccessToken();

              return axios(originalRequest);
            }
          });
      }

      if (
        error.response.status === 422 &&
        error.response.data.detail === "Signature has expired" &&
        originalRequest.url === "/auth/access_token"
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
