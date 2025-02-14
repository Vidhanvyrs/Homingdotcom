import axios from "axios";
const apiRequest = axios.create({
  baseURL: "https://homingdotcom.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
