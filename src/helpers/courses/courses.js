import axios from "../axios-config";

const getCourses = () => {
  return axios
    .get("/api/courses")
    .then((res) => res.data)
    .catch((error) => {
      throw error;
    });
};


export {
  getCourses,
};