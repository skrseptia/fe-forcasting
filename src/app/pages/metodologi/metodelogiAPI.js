const axios = require("axios").default;

const URL = `${process.env.REACT_APP_API_URL}/reports/metodologi`;

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

