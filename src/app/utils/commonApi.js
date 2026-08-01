// apiRequest.js
import axios from "axios";

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const apiRequest = async (endpoint, method, data = null, customHeaders = {}) => {
    const token = localStorage.getItem("token");
    try {
        const headers = {
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...customHeaders,
        };

        const config = {
            url: `${BASE_URL}${endpoint}`,
            method,
            headers,
            data,
            timeout: 30000,
        };

        const response = await axios(config);
        return response.data;
    } catch (error) {
        console.error(`API Error [${method} ${endpoint}]`, error);
        throw error;
    }
};
