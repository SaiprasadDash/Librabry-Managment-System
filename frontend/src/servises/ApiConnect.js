import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8081",
    headers: {
        "Content-Type": "application/json",
    },
});

// JWT Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

const apiconnect = {
    getData: async (url) => {
        const response = await api.get(url);
        return response.data;
    },
    postData: async (url, data) => {
        const response = await api.post(url, data);
        return response.data;
    },
    putData: async (url, data) => {
        const response = await api.put(url, data);
        return response.data;
    },
    patchData: async (url, data) => {
        const response = await api.patch(url, data);
        return response.data;
    },
    deleteData: async (url) => {
        const response = await api.delete(url);
        return response.data;
    },
};

export default apiconnect;