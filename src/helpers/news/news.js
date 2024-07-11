import axios from '../axios-config';

const getAllNews = () => {
  return axios
    .get(`/api/news`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {getAllNews};
