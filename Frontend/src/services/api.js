import axios from "axios";

const api = axios.create({
  baseURL: "https://project-ads-production.up.railway.app",
});

export default api;