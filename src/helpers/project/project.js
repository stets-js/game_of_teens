import axios from "../axios-config";

const getProjectsByCourse = (courseId) => {
  return axios
    .get(`/api/projects/${courseId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};


export {
    getProjectsByCourse,
};
