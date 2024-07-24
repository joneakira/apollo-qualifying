import axios, { AxiosInstance } from "axios";

const apiInstance: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 1000,
});

export default apiInstance;
