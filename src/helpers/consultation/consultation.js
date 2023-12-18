import axios from "../axios-config";

const postConsultationResult = (slotId, result, groupId, message) => {
  return axios
    .post(
      message
        ? `/consultation_result/${slotId}/${result}/${groupId}/${message}`
        : `/consultation_result/${slotId}/${result}/${groupId}/no-text`
    )
    .then((res) => {
      const responseData = {
        ...res.data,
        action: "attended",
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
