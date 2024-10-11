import axios from "axios";
axios.defaults.withCredentials = true;
const apiRequest = axios.create({
  baseURL: "https://homingdotcom-api.vercel.app/api",
  withCredentials: true,
});

export default apiRequest;
