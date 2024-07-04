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

const sendInviteToTeam = (teamId, playerId) => {
  return axios
    .post(`/api/teams/${teamId}/invite`, {playerId})
    .then(res => res.data)
    .catch(error => {
      throw error;
    });
};

export {getTeamAsMember, postTeam, sendInviteToTeam};
