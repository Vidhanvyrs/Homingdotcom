import axios from "axios";
const apiRequest = axios.create({
  baseURL: "https://homingdotcombackend.onrender.com/api",
  withCredentials: true,
});

export default apiRequest;
