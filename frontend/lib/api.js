import getConfig from "next/config";
import Auth from "./auth";
import Users from "./users";

const { publicRuntimeConfig } = getConfig();
const { apiUrl, tokenStorage } = publicRuntimeConfig;

const api = {
  get,
  post,
  put,
  delete: _delete,
};

export const apiRest = {
  auth: Auth(publicRuntimeConfig.apiUrl),
  users: Users(api),
  getToken: function () {
    let token = null;

    if (typeof window !== "undefined") {
      token = localStorage.getItem(tokenStorage);
    }

    return token;
  },
};

function getAuthorizationHeader() {
  let token;
  let headers = {};

  if (typeof window !== "undefined") {
    token = localStorage.getItem(tokenStorage);
  }

  if (token) {
    headers = { Authorization: `Bearer ${token}` };
  }

  return headers;
}

async function get(path, headers) {
  const requestOptions = {
    method: "GET",
    headers: {
      ...headers,
      ...getAuthorizationHeader(),
    },
  };

  return fetch(`${apiUrl}${path}`, requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

async function post(url, headers, body) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...headers,
      ...getAuthorizationHeader(),
    },
    body: body,
  };
  return fetch(url, requestOptions).then(handleResponse).catch(handleError);
}

async function put(url, headers, body) {
  const requestOptions = {
    method: "PUT",
    headers: {
      ...headers,
      ...getAuthorizationHeader(),
    },
    body: body,
  };
  return fetch(url, requestOptions).then(handleResponse).catch(handleError);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      ...getAuthorizationHeader(),
    },
  };
  return fetch(url, requestOptions).then(handleResponse).catch(handleError);
}

// helper functions

async function handleResponse(response) {
  return response;
}

async function handleError(error) {
  return error;
}

export default api;
