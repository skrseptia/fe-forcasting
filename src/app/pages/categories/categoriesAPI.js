const axios = require("axios").default;

const URL = `${process.env.REACT_APP_API_URL}`;

export const getAll = (payload) => {
  return axios
    .get(`${URL}/categories`, {
      params: payload,
    })
    .catch((error) => {
      if (error.response) {
        return error.response;
      } else if (error.request) {
        console.log(error.request);
      } else {
        console.log(error.message);
      }
    });
};

export const getId = (id) => {
  return axios
    .get(`${URL}/categories/${id}`, {
      params: id,
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

export const createItem = (payload) => {
  return axios.post(`${URL}/categories`, payload).catch((error) => {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
  });
};
export const updateItem = (id, payload) => {
  return axios.put(`${URL}/categories/${id}`, payload).catch((error) => {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
  });
};

export const deleteById = (id) => {
  return axios.delete(`${URL}/categories/${id}`).catch((error) => {
    if (error.response) {
      return error.response.data;
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log(error.message);
    }
  });
};
