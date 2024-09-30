import axios from "axios";
import { apiNode } from "./url";

export const getComments = (refId) => {
  return axios.post(`${apiNode}/comment/byId`, {refId});
}

export const postComment = (data) => {
  return axios.post(`${apiNode}/comment/posting`, data);
}