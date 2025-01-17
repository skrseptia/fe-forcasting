export default function setupAxios(axios, store) {
  axios.interceptors.request.use(
    config => {
      const {
        auth: { authToken }
      } = store.getState();

      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
        // config.headers["ngrok-skip-browser-warning"] = true;
      }

      return config;
    },
    err => Promise.reject(err)
  );
}
