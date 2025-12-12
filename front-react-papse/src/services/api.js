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

// Generic patient functions
export const createInscricao = (data) => {
    return axios.post(`${API_URL}/pacientes`, data);
};

export const updateInscricao = (id, data) => {
    return axios.put(`${API_URL}/pacientes/${id}`, data);
};

export const getInscricaoById = (id) => {
    return axios.get(`${API_URL}/pacientes/${id}`);
};

// List specific functions
export const getListaEspera = () => {
    return axios.get(`${API_URL}/listaespera`);
};

export const createListaEspera = (data) => {
    return axios.post(`${API_URL}/listaespera`, data);
};

export const deleteListaEspera = (id) => {
    return axios.delete(`${API_URL}/listaespera/${id}`);
};

export const getListaRegular = () => {
    return axios.get(`${API_URL}/listaregular`);
};

export const createListaRegular = (data) => {
    return axios.post(`${API_URL}/listaregular`, data);
};

export const deleteListaRegular = (id) => {
    return axios.delete(`${API_URL}/listaregular/${id}`);
};

export const getProtocolos = () => {
    return axios.get(`${API_URL}/protocolos`);
};

export const createProtocolo = (data) => {
    return axios.post(`${API_URL}/protocolos`, data);
};

export const deleteProtocolo = (id) => {
    return axios.delete(`${API_URL}/protocolos/${id}`);
};

export const getRegulares = () => {
    return axios.get(`${API_URL}/regular`);
};

export const createRegular = (data) => {
    return axios.post(`${API_URL}/regular`, data);
};

export const deleteRegular = (id) => {
    return axios.delete(`${API_URL}/regular/${id}`);
};

export const getBolsistas = () => {
    return axios.get(`${API_URL}/colaboradores`);
};

// Facade for backward compatibility or easier usage
export const fetchInscricoes = (status = null) => {
    if (status === 'lista_de_espera') return getListaEspera();
    if (status === 'espera_regulares') return getListaRegular();
    if (status === 'atendimento_protocolo') return getProtocolos();
    if (status === 'atendimento_regular') return getRegulares();

    // Fallback to generic patients endpoint (returns all)
    return axios.get(`${API_URL}/pacientes`);
};
