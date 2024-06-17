import axios from "../axios-config";


  const loginUser = (credentials) => {
    return axios
      .post("/api/auth/login", credentials)
      .then((res) => {

        localStorage.setItem('got', res.data.token);
        return res.data
      })
      .catch((error) => {
        throw error;
      });
  };

export {
  loginUser,
}