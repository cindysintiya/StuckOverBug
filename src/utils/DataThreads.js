import axios from "axios";
import { apiNode } from "./url";

export const getThreads = (filter = "") => {
  return axios.post(`${apiNode}/thread/all`, {filter});
}

export const postThread = (data) => {
  return axios.post(`${apiNode}/thread/posting`, data);
}

export const findThread = (id) => {
  return axios.post(`${apiNode}/thread/detail`, {id});
}

export const closeThread = (id) => {
  return axios.post(`${apiNode}/thread/closed`, {id});
}

export const statusColor = (statusCode) => {
  switch (statusCode) {
    case 3:
      return "danger";
    case 2:
      return "warning";
    case 1:
      return "info";
    case 0:
      return "";
    default:
      return "primary";
  }
}

export const statusName = {
  "-1": "Not Found",
  0: "Closed",
  1: "Just for Fun",
  2: "Regular Question",
  3: "Extremely Urgent",
}