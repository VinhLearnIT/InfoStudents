import axios from 'axios';

const API_URL = 'http://localhost:8080/api/classsd';

const getAllClassSD = async () => {
    return axios.get(API_URL);
};

const getClassSDById = async (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createClassSD = async (classSD) => {
    return axios.post(API_URL, classSD);
};

const updateClassSD = async (id, classSD) => {
    return axios.put(`${API_URL}/${id}`, classSD);
};

const deleteClassSD = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export {
    getAllClassSD,
    getClassSDById,
    createClassSD,
    updateClassSD,
    deleteClassSD
}