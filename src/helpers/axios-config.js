import axios from "axios";


axios.defaults.baseURL = "https://king-prawn-app-hnaei.ondigitalocean.app";
axios.defaults.headers.common["Accept"] = "application/json";

axios.interceptors.request.use(
    config => {
      const token = localStorage.getItem('got');
      
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
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
        localStorage.removeItem('got');
      }
  
      return Promise.reject(error);
    }
  );

export default axios;
