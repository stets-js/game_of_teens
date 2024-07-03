import axios from '../axios-config';

const getAllMarathons = () => {
  return axios
    .get(`/api/marathon`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {getAllMarathons};
