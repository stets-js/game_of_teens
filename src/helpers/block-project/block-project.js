import axios from '../axios-config';

const patchOrCreateBlockProject = credentials => {
  return axios
    .post(`/api/block-projects`, credentials)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const getMyBlockProject = (blockId, marathonId, team) => {
  return axios
    .get(`/api/block-projects/${blockId}?team=${team}&marathonId=${marathonId}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {getMyBlockProject, patchOrCreateBlockProject};
