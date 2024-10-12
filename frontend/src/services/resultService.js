import axios from 'axios';

const API_URL = 'http://localhost:8080/api/result';

const getAllResult = async () => {
    return axios.get(API_URL);
};

const getResultById = async (id) => {
    return axios.get(`${API_URL}/${id}`);
};
const getResultByStudentId = async (id) => {
    return axios.get(`${API_URL}/student/${id}`);
};

const createResult = async (result) => {
    return axios.post(API_URL, result);
};

const updateResult = async (id, result) => {
    return axios.put(`${API_URL}/${id}`, result);
};

const deleteResult = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export {
    getAllResult,
    getResultById,
    getResultByStudentId,
    createResult,
    updateResult,
    deleteResult
}