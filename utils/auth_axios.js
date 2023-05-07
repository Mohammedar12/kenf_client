import axios from "axios"; 
import { ServerURI } from "@/config";

const instance = axios.create({
  baseURL : ServerURI,
  headers: {
    "Content-Type": "application/json",
    "timeout" : 3000,
  }, 
  withCredentials: true
});

export default instance;