import axios from '../axios-config';

const getAllMarathons = (options = null) => {
  return axios
    .get(`/api/marathon${options ? `?${options}` : ''}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};
const getMarathonById = id => {
  return axios
    .get(`/api/marathon/${id}`)
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
const addBlockToMarathon = async (marathonId, data) => {
  try {
    const response = await axios.post(`/api/marathon/${marathonId}/block`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const deleteBlockById = async (marathonId, blockId, data) => {
  try {
    const response = await axios.delete(`/api/marathon/${marathonId}/block/${blockId}`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const updateBlockById = async (marathonId, blockId, data) => {
  try {
    const response = await axios.patch(`/api/marathon/${marathonId}/block/${blockId}`, data);
    return response.data;
  } catch (error) {
    console.error('API error:', error);
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
    const response = await axios.patch(
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

const confirmProjectToBlock = async (marathonId, blockId, projectId) => {
  try {
    const response = await axios.post(
      `/api/marathon/${marathonId}/block/${blockId}/projects/${projectId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const sendMessage = async (marathonId, blockId, projectId, body) => {
  try {
    const response = await axios.post(
      `/api/marathon/${marathonId}/block/${blockId}/projects/${projectId}/messages`,
      body
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const getAllMessages = async (marathonId, blockId, projectId) => {
  try {
    const response = await axios.get(
      `/api/marathon/${marathonId}/block/${blockId}/projects/${projectId}/messages`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
const addNewJuryOrCriteria = async ({marathonId, criteriaId, jureId}) => {
  try {
    const response = await axios.patch(`/api/marathon/${marathonId}/`, {criteriaId, jureId});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  addNewJuryOrCriteria,
  sendMessage,
  getAllMessages,
  getAllMarathons,
  getProjectByTeamId,
  addBlockToMarathon,
  subscribeToMarathon,
  getProjectsFromBlock,
  createProjectToBlock,
  updateBlockProject,
  getMarathonById,
  getProjectFromBlockById,
  confirmProjectToBlock,
  deleteBlockById,
  updateBlockById
};
