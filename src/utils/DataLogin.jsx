import axios from "axios";
import { apiNode } from "./url"

export const postLogin = (data) => {
  return axios.post(`${apiNode}/user/login`, data);
}

export const postRegister = (data) => {
  return axios.post(`${apiNode}/user/register`, data);
}