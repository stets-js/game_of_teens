import axios from '../axios-config';

const getAllMarathons = () => {
  return axios
    .get(`/api/marathon`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const subscribeToMarathon = (userId, marathonId) => {
  return axios.post(`/api/users/${userId}/subscribe/${marathonId}`);
};
export {getAllMarathons, subscribeToMarathon};
