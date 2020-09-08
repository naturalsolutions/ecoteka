import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const api = {
    get,
    post,
    put,
    delete: _delete
};

function getAuthorizationHeader() {
    const { tokenStorage } = publicRuntimeConfig;
    let session;
    let headers = {};
    if (typeof window !== 'undefined') {
        session = localStorage.getItem(tokenStorage)
    }
    if (session) {
        headers = { Authorization : `Bearer ${session}` }
    }

    return headers

}

async function get(url, headers) {
    const requestOptions = {
        method: 'GET',
        headers: {
            ...headers,
            ...getAuthorizationHeader()
        }
    };

    return fetch(url, requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

async function post(url, headers, body) {
    const requestOptions = {
        method: 'POST',
        headers: {
            ...headers,
            ...getAuthorizationHeader()
        },
        body: body
    };
    return fetch(url, requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

async function put(url, headers, body) {
    const requestOptions = {
        method: 'PUT',
        headers: {
            ...headers,
            ...getAuthorizationHeader()
        },
        body: body
    };
    return fetch(url, requestOptions)
    .then(handleResponse)
    .catch(handleError);;
}

// prefixed with underscored because delete is a reserved word in javascript
async function _delete(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: {
            ...getAuthorizationHeader()
        }
    };
    return fetch(url, requestOptions)
    .then(handleResponse)
    .catch(handleError);
}

// helper functions

async function handleResponse(response) {
    return response
}

async function handleError(error) {
    return error;
}


export default api;