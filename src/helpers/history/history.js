import axios from "../axios-config";

axios.create({
    withCredentials: true,
  });

  const getHistory = (month) => {
    return axios
      .get(`/history_logs/${month}`)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  };

const getAppointmentHistory = (credentials) => {
  return axios
    .post(`/appointment_history`, credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getSlotsHistory = (manager_name) => {
  return axios
    .get(`/history_slots/${manager_name}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export { getHistory, getAppointmentHistory, getSlotsHistory };
