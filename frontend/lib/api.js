import getConfig from "next/config";
import auth from "./auth";
import users from "./users";
import geofiles from "./geofiles";
import trees from "./trees";
import registrationLink from "./registrationLink";

const { publicRuntimeConfig } = getConfig();
const { apiUrl, tokenStorage } = publicRuntimeConfig;

function getToken() {
  let token = null;

  if (typeof window !== "undefined") {
    token = localStorage.getItem(tokenStorage);
  }

  return token;
}

const api = {
  url: apiUrl,
  get,
  post,
  put,
  delete: _delete,
  getAuthorizationHeader,
  getToken,
};

export const apiRest = {
  auth: auth(publicRuntimeConfig.apiUrl, api),
  users: users(api),
  geofiles: geofiles(api),
  trees: trees(api),
  registrationLink: registrationLink(api),
  getToken,
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

async function post(path, headers, body) {
  const requestOptions = {
    method: "POST",
    headers: {
      ...headers,
      ...getAuthorizationHeader(),
    },
    body: body,
  };
  return fetch(`${apiUrl}${path}`, requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

async function put(path, headers, body) {
  const requestOptions = {
    method: "PUT",
    headers: {
      ...headers,
      ...getAuthorizationHeader(),
    },
    body: body,
  };
  return fetch(`${apiUrl}${path}`, requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(path) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      ...getAuthorizationHeader(),
    },
  };
  return fetch(`${apiUrl}${path}`, requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

// helper functions

async function handleResponse(response) {
  return response;
}

async function handleError(error) {
  return error;
}

export default api;
