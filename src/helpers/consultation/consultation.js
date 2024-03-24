import axios from "../axios-config";
import {jwtDecode} from "jwt-decode";

const postConsultationResult = (slotId, result, groupId, message, unsuccessfulMessage, course) => {
  const formattedMessage = message || ""; 
  const formattedUnsuccessfulMessage = unsuccessfulMessage || "";

  const data = {
    slot_id: slotId,
    consultation_result: +result,
    group_id: groupId,
    message: formattedMessage,
    unsuccessful_message: formattedUnsuccessfulMessage,
    course
  };

  return axios.post("/consultation_result", data)
    .then((res) => {
      const {user_name, role, id, zoho_id } = jwtDecode(localStorage.getItem('booking'));
      const responseData = {
        ...res.data,
        action: "attended",
        zoho_id: zoho_id,
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


const postStartConsultation = (weekId, dayIndex, slotHour, managerId) => {
  return axios
    .post(`/start_consultation/${weekId}/${dayIndex}/${slotHour}/${managerId}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export { postConsultationResult, postStartConsultation };
