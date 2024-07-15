import axios from '../axios-config';

const getAllNews = () => {
  return axios
    .get(`/api/news`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const createNews = data => {
  return axios
    .post(`/api/news`, data)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
export {getAllNews, createNews};
