import axios from "../axios-config";

// const postConsultationResult = (slotId, result, groupId, message, unsuccessfulMessage, course) => {
//   const formattedMessage = message || ""; 
//   const formattedUnsuccessfulMessage = unsuccessfulMessage || "";

//   const endpointPath = `/consultation_result/${slotId}/${result}/${groupId}/${formattedMessage}/${formattedUnsuccessfulMessage}/${course}`;
//   return axios
//     .post(
//       endpointPath
//     )
//     .then((res) => {
//       const responseData = {
//         ...res.data,
//         action: "attended",
//       };

//       axios.post(
//         "https://zohointegration.goit.global/GoITeens/booking/index.php",
//         JSON.stringify(responseData),
//         { headers: { "Content-Type": "application/json" }}
//       );

//       return res.data;
//     })
//     .catch((error) => {
//       throw error;
//     });
// };

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
