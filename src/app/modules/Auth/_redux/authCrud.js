import axios from "axios";

export const LOGIN_URL = `${process.env.REACT_APP_API_URL}/login`;
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = `${process.env.REACT_APP_API_URL}/forgot-password`;
export const ME_URL = `${process.env.REACT_APP_API_URL}/users/me`;

export function login(email, password) {
  return axios.post(LOGIN_URL, { email, password }).catch((error) => {
    if (error.response) {
      return error.response;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
  });
}

export function register(email, fullname, username, password) {
  return axios.post(REGISTER_URL, { email, fullname, username, password });
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(ME_URL);
}
