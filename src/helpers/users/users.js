import axios from '../axios-config';

const getUsers = options => {
  return axios
    .get(`/api/users${options ? '?' + options : ''}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const createUser = cred => {
  return axios
    .post(`/api/users`, cred)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
export {getUsers, createUser};
