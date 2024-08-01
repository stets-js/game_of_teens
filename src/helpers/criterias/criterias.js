import axios from '../axios-config';

const getAllCriterias = (options = null) => {
  return axios
    .get(`/api/criterias${options ? `?${options}` : ''}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const createCriteria = cred => {
  return axios.post(`/api/criterias`, cred);
};
export {createCriteria, getAllCriterias};
