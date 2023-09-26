import axios from "../axios-config";

const getCourses = () => {
  return axios
    .get("/courses")
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const postCourse = (credentials) => {
  return axios
    .post("/register_course", credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const putCourse = (credentials, id) => {
  return axios
    .put(`/update_course/${id}`, credentials)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const deleteCourse = (id) => {
  return axios
    .delete(`/remove_course/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const getManagerCourses = (id) => {
  return axios
    .get(`/manager/courses/${id}`)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

const postManagerCourses = (id, coursesList) => {

  return axios
    .post(`/manager/courses/${id}`, coursesList)
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};

export {
  getCourses,
  postManagerCourses,
  postCourse,
  putCourse,
  deleteCourse,
  getManagerCourses,
};
