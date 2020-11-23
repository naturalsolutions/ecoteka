import getConfig from "next/config";
import auth from "./auth";
import users from "./users";
import geofiles from "./geofiles";
import trees from "./trees";
import organization from "./organization";
import registrationLink from "./registrationLink";
import interventions from './intervention';

const {
  publicRuntimeConfig
} = getConfig();
const {
  apiUrl,
  tokenStorage,
  refreshTokenStorage
} = publicRuntimeConfig;

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
  patch,
  delete: _delete,
  getAuthorizationHeader,
  getToken,
};

export const apiRest = {
  auth: auth(publicRuntimeConfig.apiUrl, api),
  users: users(api),
  geofiles: geofiles(api),
  trees: trees(api),
  organization: organization(api),
  registrationLink: registrationLink(api),
  interventions: interventions(api),
  getToken,
};


function clean_storage() {
  localStorage.removeItem(tokenStorage);
  localStorage.removeItem(refreshTokenStorage)
}

async function getPayload(token) {
  let payload = null;
  try {
    let raw_base64_payload = token.split('.')[1]
    payload = JSON.parse(atob(raw_base64_payload))

  } catch (error) {
    payload = null
  }

  return payload
}

async function tokenStillValid(token) {
  let payload;

  payload = getPayload(token);
  if (payload && 'exp' in payload) {
    let now = new Date().getTime()
    let expirationDate = payload['exp'] * 1000
    if (now + 5000 < expirationDate) {
      return true
    }
  }

  return false

}


async function getNewAccessToken(refreshToken) {
  const path = '/auth/access_token'
  const requestOptions = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${refreshToken}`
    },
    body: null,
  };

  await fetch(`${apiUrl}${path}`, requestOptions)
    .then(async function (response) {
      const resp = await response.json()
      const newAccessToken = resp['access_token']
      localStorage.setItem(tokenStorage, newAccessToken);
    })
    .catch(async function (error) {
      clean_storage()
    });

}

async function getAuthorizationHeader() {
  let token;
  let headers = {};
  let refresh_token;

  if (typeof window !== "undefined") {
    refresh_token = localStorage.getItem(refreshTokenStorage);
  }

  if (refresh_token) {
    if (tokenStillValid(refresh_token)) {

      if (typeof window !== "undefined") {
        token = localStorage.getItem(tokenStorage);
      }
      if (token) {
        // access token in local storage
        if (tokenStillValid(token)) {
          // Access token still valid we return it
          headers = {
            Authorization: `Bearer ${getToken()}`
          };
          return headers;
        }
      } else {
        // try to fetch a new valid access token
        await getNewAccessToken(refresh_token);
        token = localStorage.getItem(tokenStorage);
        return {
          Authorization: `Bearer ${getToken()}`
        }
      }
    } else {
      clean_storage()
      //refresh token no more valid need to login
    }
  } else {
    clean_storage()
    //no refresh token need to login
  }

}

async function get(path, headers) {
  const requestOptions = {
    method: "GET",
    headers: {
      ...headers,
      ...await getAuthorizationHeader(),
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
      ...await getAuthorizationHeader(),
    },
    body: body,
  };
  return fetch(`${apiUrl}${path}`, requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

async function patch(path, headers, body) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      ...headers,
      ...await getAuthorizationHeader(),
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
      ...await getAuthorizationHeader(),
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
      ...await getAuthorizationHeader(),
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