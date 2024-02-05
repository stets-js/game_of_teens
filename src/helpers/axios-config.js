import axios from "axios";
axios.defaults.baseURL = "https://king-prawn-app-hnaei.ondigitalocean.app";
axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.request.use(
    config => {
      const bookingToken = localStorage.getItem('booking');
      if (bookingToken) {
        config.headers['Authorization'] = `Bearer ${bookingToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
  
  axios.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('booking');
      }
  
      return Promise.reject(error);
    }
  );

export default axios;
