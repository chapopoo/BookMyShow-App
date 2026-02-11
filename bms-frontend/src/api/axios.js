import axios from "axios";

export const axiosInstance = axios.create({
    headers:{
        "Content-Type":"application/json"
    },
    baseURL:"http://localhost:3000"
})

// Request interceptor: Attach the latest token from localStorage to every API request
// This is critical because tokens change when users log in/out
// Without this, axios would use the old token that was set at initialization time
// which would cause "get-current-user" to return the previously logged-in user
axiosInstance.interceptors.request.use(
    (config) => {
        // Read token from localStorage on every single request
        // This ensures we always send the current/latest token
        const token = localStorage.getItem("token");
        if (token) {
            // Attach token to Authorization header with Bearer scheme
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

