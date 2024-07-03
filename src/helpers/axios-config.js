import axios from 'axios';

// axios.defaults.baseURL = "https://back-gameofteens.onrender.com";
axios.defaults.baseURL = 'http://127.0.0.1:8080';
axios.defaults.headers.common['Accept'] = 'application/json';

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
