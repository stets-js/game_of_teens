import axios from '../axios-config';

const getTeamAsMember = (userId, marathonId) => {
  return axios
    .get(`/api/teams?memberId=${userId}&marathonId=${marathonId}`)
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const postTeam = (userId, marathonId) => {
  return axios
    .post(`/api/teams`, {leader: userId, marathon: marathonId})
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const sendInviteToTeam = (teamId, playerId, marathonId) => {
  return axios
    .post(`/api/teams/${teamId}/invite`, {playerId, marathonId})
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

const getInvites = teamId => {
  return axios.get(`/api/teams/${teamId}/invite`);
};
const getMyInvites = marathonId => {
  return axios.get(`/api/users/myInvites/${marathonId}`);
};

const deleteInvite = (teamId, inviteId) => {
  return axios.delete(`/api/teams/${teamId}/invite`, {data: {id: inviteId}});
};
const acceptInvite = (teamId, inviteId, marathon, playerId) => {
  return axios.patch(`/api/teams/${teamId}/invite`, {invintationId: inviteId, marathon, playerId});
};
export {
  getTeamAsMember,
  postTeam,
  sendInviteToTeam,
  getInvites,
  getMyInvites,
  deleteInvite,
  acceptInvite
};
