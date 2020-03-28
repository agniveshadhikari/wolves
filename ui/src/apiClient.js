import axios from "axios";
import { serviceUrls } from "constants.js";

const localStorage = window.localStorage;

const authClient = axios.create({
  baseURL: global.DeploymentConfig.authBaseUrl,
  timeout: 5000
});

export const apiClient = axios.create({
  baseURL: global.DeploymentConfig.apiBaseUrl,
  timeout: 5000
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  config => {
    config.headers.Authorization =
      "Bearer " + localStorage.getItem("access-token");
    return config;
  },
  error => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  response => response,
  async function(error) {
    if (error.response.status === 401) {
      await refreshToken();
      return apiClient.request(error.config);
    } else {
      return Promise.reject(error);
    }
  }
);

export function login(username, password, successCallback, failureCallback) {
  // make a post request to the getAccessToken endpoint
  authClient
    .post(serviceUrls.acquireToken, {
      username,
      password
    })
    // resolve the request
    .then(function(response) {
      // set access and refresh tokens to localStorage
      console.log("here");
      localStorage.setItem("access-token", response.data.access);
      localStorage.setItem("refresh-token", response.data.refresh);
      successCallback();
    })
    // handle auth errors
    .catch(error => {
      console.log(error);
      failureCallback(error);
    });
}

export function logout() {
  // remove the access and refresh tokens from localStorage
  // remove header for apiClient
}

async function refreshToken() {
  // read the refresh token from localStorage
  const refreshToken = localStorage.getItem("refresh-token");

  // make a post request to the refreshToken endpoint with refresh token
  try {
    const response = await authClient.post(serviceUrls.refreshToken, {
      refresh: refreshToken
    });

    // set accesstoken to localStorage
    localStorage.setItem("access-token", response.data.access);
  } catch (error) {
    // handle refresh errors
    console.error("Couldn't refresh access-token. Got error", error);
    throw error;
  }
}

export default apiClient;
