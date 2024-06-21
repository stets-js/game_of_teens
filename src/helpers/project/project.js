import axios from "../axios-config";

const getProjectsByCourse = (courseId) => {
  return axios
    .get(`/api/projects/${courseId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};
const updateProject = (projectId, formData) => {
  return axios
    .patch(`/api/projects/${projectId}`, formData)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};
const confirmProject = (projectId) => {
  return axios
    .patch(`/api/projects/${projectId}/confirm`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};
const confirmAllProjects = (formData) => {
  return axios
    .post(`/api/projects/confirm`, formData)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export {
    getProjectsByCourse,
    updateProject,
    confirmProject,
    confirmAllProjects
};
