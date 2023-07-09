//const {axiosInstance} = require(".");
import {axiosInstance} from '.';
import axios from 'axios';

export const RegisterUser = async (payload) => {
    try{
        const response = await axiosInstance.post("/api/users/register", payload);
        return response.data;
    }catch(error){
        return error.response;
    }
}

export const LoginUser = async (payload) => {
    try{
        const response = await axiosInstance.post("/api/users/login", payload);
        return response.data;
    }catch(error){
        return error;
    }
}
export const GetCurrentUser = async () => {
     try{
    const response = await axiosInstance.get( "/api/users/get-current-user");
    return response.data;
     }catch(error){
        return error;
     }
  }

export const GetUser = async () => {
    try{
        const token = localStorage.getItem('token')
        const response =  await axios.get("/api/users/get-current-user",
        {headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${token}`
        }}
        )
        return response.data


    }catch(error){
        return error;
    }
}