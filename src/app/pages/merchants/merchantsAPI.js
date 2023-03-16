const axios = require("axios").default;

const URL = `${process.env.REACT_APP_API_TEMP}`;

export const getAll = (payload) => {
  return axios
    .get(`${URL}/merchants`, {
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
    .get(`${URL}/merchants/${id}`, {
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
  return axios.post(`${URL}/merchants`, payload).catch((error) => {
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
  return axios.put(`${URL}/merchants/:id`, payload).catch((error) => {
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
