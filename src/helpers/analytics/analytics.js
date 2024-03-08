import axios from "../axios-config";

axios.create({
  withCredentials: true,
});

const pushToGoogleSheet = (credentials, endpoint) => {
    return axios
      .post(`/${endpoint}`, credentials)
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  };

  export {
    pushToGoogleSheet,
  };