import axios from "../axios-config";

const getCurrentConfirmatorData = () => {
  return axios
    .get(`/get_current_avaliable_manager`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getConfirmatorWeekData = (weekId, dayId, halfId) => {
  return (
    axios
      .get(`/get_avaliable_manager/${weekId}/${dayId}/${halfId}`)
      // .get(`/get_confirmation_manager/${weekId}/${dayId}/${halfId}`)
      // .get(`/avaliable_managers_list/${weekId}/${dayId}`)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        throw error;
      })
  );
};

const setConfirmation = (slot_id, status, message) => {
  return axios
    .post(
      message
        ? `/set_confirmation/${slot_id}/${status}/${message}`
        : `/set_confirmation/${slot_id}/${status}`
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setCancelConfirmation = (slot_id, status, message) => {
  return axios
    .post(
      message
        ? `/set_cancel_confirmation/${slot_id}/${status}/${message}`
        : `/set_cancel_confirmation/${slot_id}/${status}`
    )
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setPostponedConfirmation = (slot_id, appointment_id) => {
  return axios
    .post(`/set_postpone_confirmation/${slot_id}/${appointment_id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const removeSlot = (slot_id, reason) => {
  const url = window.location.href.split('/');
  const confirmatorId = +url[url.length-1];
  return axios
    .delete(`remove_slot/${slot_id}/${reason}/${confirmatorId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export {
  setPostponedConfirmation,
  getCurrentConfirmatorData,
  getConfirmatorWeekData,
  setConfirmation,
  setCancelConfirmation,
  removeSlot,
};
