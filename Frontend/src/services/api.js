import axios from "axios";

const api = axios.create({
  baseURL: "https://project-ads-production-9aeb.up.railway.app",
});

export default api;