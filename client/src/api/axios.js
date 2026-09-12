import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/todos";
export const apiClient = axios.create({
    baseURL: API_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    },
    
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        throw error;
    }
);