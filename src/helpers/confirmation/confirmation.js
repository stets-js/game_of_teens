import axios from "../axios-config";
import {jwtDecode} from "jwt-decode";

const getCurrentConfirmatorData = () => {
  return axios
    .get(`/current_confirmation`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getConfirmatorWeekData = (weekId, dayId, halfId) => {
  return axios
    .get(`/get_confirmation/${weekId}/${dayId}/${halfId}/`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const setConfirmation = (slot_id, status, message) => {
  const url = window.location.href.split('/');
  // const confirmatorId = +url[url.length-1];
  const {user_name, role, id } = jwtDecode(localStorage.getItem('booking'));
  return axios
    .post(
      message
        ? `/set_confirmation/${slot_id}/${status}/${message}/${id}/`
        : `/set_confirmation/${slot_id}/${status}/${id}/`
    )
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "confirmed",
      };

      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      );

      return res.data;
    })
    .catch((error) => {
      throw error;
    });
};

const setCancelConfirmation = (slot_id, status, message) => {
  const url = window.location.href.split('/');
  // const confirmatorId = +url[url.length-1];
  const {user_name, role, id } = jwtDecode(localStorage.getItem('booking'));
  return axios
    .post(
      message
        ? `/set_cancel_confirmation/${slot_id}/${status}/${message}/${id}/`
        : `/set_cancel_confirmation/${slot_id}/${status}/${id}/`
    )
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "canceled",
      };

      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      );

      return res.data;
    })
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

const delteConfirmation = (managerId, weekId, weekDay, hour, newStatus, message) => {
  const req_url = encodeURIComponent(window.location.href);
  return axios
    .post(`/update_slot/${managerId}/${weekId}/${weekDay}/${hour}/${newStatus}`, {req_url})
    .then((res) => {
      const {user_name, role, id } = jwtDecode(localStorage.getItem('booking'));
      if(res.data.message === "Appointment successfully removed"){
      const responseData = {
        ...res.data,
        action: "deleted",
        canceled_by: user_name,
        canceled_message: message,
      };

      axios.post(
        "https://zohointegration.goit.global/GoITeens/booking/index.php",
        JSON.stringify(responseData),
        { headers: { "Content-Type": "application/json" }}
      );
      }

      return res.data;
      })
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
  delteConfirmation,
};
