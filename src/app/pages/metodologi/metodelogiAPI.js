const axios = require("axios").default;

const URL = `${process.env.REACT_APP_API_URL}/reports/exponential-smoothing`;
const URL_2 = `${process.env.REACT_APP_API_URL}/reports/monthly-exponential-smoothing`;
const URL_3 = `${process.env.REACT_APP_API_URL}/reports/arima`;

export const getAll = (payload) => {
  return axios
    .get(URL, {
      params: payload,
    })
    .catch((error) => {
      if (error.response) {
        return error.response.data;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
    });
};

export const getAllMonthly = (payload) => {
  return axios
    .get(URL_2, {
      params: payload,
    })
    .catch((error) => {
      if (error.response) {
        return error.response.data;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
    });
};


export const getArima = (payload) => {
  return axios
    .get(URL_3, {
      params: payload,
    })
    .catch((error) => {
      if (error.response) {
        return error.response.data;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
    });
};

