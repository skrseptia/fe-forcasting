const axios = require("axios").default;

const URL = `${process.env.REACT_APP_API_URL}/reports/dashboard`;
const URL_CHART = `${process.env.REACT_APP_API_URL}/reports/chart`;

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

export const getChart = (payload) => {
  return axios
    .get(URL_CHART, {
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
export const getId = (id) => {
  return axios.get(`${URL}/${id}`, {
    params: id,
  });
};

export const createItem = (payload) => {
  return axios.post(URL, payload).catch((error) => {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
  });
};
export const updateItem = (payload) => {
  return axios.put(URL, payload).catch((error) => {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
  });
};

export const deleteById = (payload) => {
  return axios.delete(URL, payload).catch((error) => {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
  });
};

// export const deleteById = (id) => {
//   return axios.delete(`${URL}/${id}`);
// };
