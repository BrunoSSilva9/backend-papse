import axios from 'axios';

const API_URL = '/api';

export const login = (matricula, senha) => {
    return axios.post(`${API_URL}/login`, { matricula, senha_: senha });
};

// Add interceptor to include token in requests
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const fetchInscricoes = (status = null) => {
    const url = status ? `${API_URL}/pacientes?status=${status}` : `${API_URL}/pacientes`;
    return axios.get(url);
};

export const createInscricao = (data) => {
    return axios.post(`${API_URL}/pacientes`, data);
};

export const updateInscricao = (id, data) => {
    return axios.put(`${API_URL}/pacientes/${id}`, data);
};

export const getInscricaoById = (id) => {
    return axios.get(`${API_URL}/pacientes/${id}`);
};
