import axios from "axios";

export const axiosInstance = axios.create({
    headers:{
        "Content-Type":"application/json"
    },
    auth:`Bearer ${localStorsge.getItem("token")}`,
    baseURL:"http://localhost:3000"
})