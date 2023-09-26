const getConfirmatorError = (state) => state.confirmator.error;
const getConfirmatorLoadings = (state) => state.confirmator.loading;
const getConfirmedAppointments = (state) => { 
// console.log(state);
// console.log(state.confirmator.appointments);
return state.confirmator.appointments;
}
// const getConfirmedManagersList = (state) => {
//   // console.log(state.confirmator.managers_list);
//   return state.confirmator.managers_list;
// }
const getConfirmedManagersList = (state) => {
  console.log(state.avaliable.managers_list);
  return state.avaliable.managers_list;
}
const getConfirmatorDate = (state) => state.confirmator.date.date;
const getConfirmatorWeekId = (state) => state.confirmator.date.week_id;
const getConfirmatorDay = (state) => state.confirmator.date.day;
const getConfirmatorHalf = (state) => state.confirmator.date.half;

export {
  getConfirmatorError,
  getConfirmatorHalf,
  getConfirmatorDay,
  getConfirmatorWeekId,
  getConfirmatorDate,
  getConfirmedAppointments,
  getConfirmedManagersList,
  getConfirmatorLoadings,
};
