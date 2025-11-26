import axios from "axios";

const doxtokAxios = axios.create({
  baseURL: import.meta.env.VITE_DOXTOK_SERVER_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default doxtokAxios;
