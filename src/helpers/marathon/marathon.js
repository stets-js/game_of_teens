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

const getProjectsFromBlock = async (marathonId, blockId) => {
  try {
    const response = await axios.get(`/api/marathon/${marathonId}/block/${blockId}/projects`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Создание проекта в конкретном блоке
const createProjectToBlock = async (marathonId, blockId, newProject) => {
  try {
    const response = await axios.post(
      `/api/marathon/${marathonId}/block/${blockId}/projects`,
      newProject
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateBlockProject = async (marathonId, blockId, projectId, updatedProject) => {
  try {
    const response = await axios.put(
      `/api/marathon/${marathonId}/block/${blockId}/projects/${projectId}`,
      updatedProject
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProjectFromBlockById = async (marathonId, blockId, projectId) => {
  try {
    const response = await axios.get(
      `/api/marathon/${marathonId}/block/${blockId}/projects/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getProjectByTeamId = async (marathonId, blockId, teamId) => {
  try {
    const response = await axios.get(`/api/marathon/${marathonId}/block/${blockId}/team/${teamId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export {
  getAllMarathons,
  getProjectByTeamId,
  subscribeToMarathon,
  getProjectsFromBlock,
  createProjectToBlock,
  updateBlockProject,
  getProjectFromBlockById
};
