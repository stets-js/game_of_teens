import axios from '../axios-config';

const getProjectsByCourse = courseId => {
  return axios
    .get(`/api/projects/${courseId}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const updateProject = (projectId, formData) => {
  return axios
    .patch(`/api/projects/${projectId}`, formData)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const confirmProject = projectId => {
  return axios
    .patch(`/api/projects/${projectId}/confirm`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const confirmAllProjects = formData => {
  return axios
    .post(`/api/projects/confirm`, formData)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const createScores = async ({projectId, marathonId}) => {
  try {
    const response = await axios.patch(`/api/projects`, {
      projectId,
      marathonId
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
export {getProjectsByCourse, createScores, updateProject, confirmProject, confirmAllProjects};
