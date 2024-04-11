import { Axios } from "axios";

export const apiClient = new Axios({
  baseURL: "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

export * from "./wallet";
export * from "./task";
