import axios from '../axios-config';

const getAllMentorHours = () => {
  return axios
    .get(`/api/mentorHours`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {getAllMentorHours};
