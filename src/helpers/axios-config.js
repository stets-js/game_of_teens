import axios from "axios";
axios.defaults.baseURL = "https://king-prawn-app-hnaei.ondigitalocean.app";
axios.defaults.headers.common["Accept"] = "application/json";

const bookingToken = localStorage.getItem('booking');
if (bookingToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${bookingToken}`;
}
export default axios;
