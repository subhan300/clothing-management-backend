import axios from "axios";

//  http://localhost:3977/api
// "https://system-backend-three.vercel.app";
// let url="http://localhost:3977/api" || "https://clothing-management-pink.vercel.app/";
let url="https://clothing-management-pink.vercel.app/";


export const baseURL = url;

export const API = axios.create({
  baseURL,
});

export const Headers = (token) =>{
  API.defaults.headers.post["Content-Type"] = "application/json";
  API.defaults.headers.post["token"] = localStorage.getItem("token");
  API.defaults.headers.get["token"] = localStorage.getItem("token");
  return token
    ? {
        Accept: "application/json",
        "Content-Type": "application/json",
        token: token,
      }
    : {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
};
