import axios from "axios";
axios.defaults.baseURL = "https://king-prawn-app-hnaei.ondigitalocean.app";
axios.defaults.headers.common["Accept"] = "application/json";

export default axios;
