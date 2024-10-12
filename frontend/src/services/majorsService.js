import axios from 'axios';

const API_URL = 'http://localhost:8080/api/majors';

const getAllMajors = async () => {
    return axios.get(API_URL);
};

const getMajorsById = async (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createMajors = async (majors) => {
    return axios.post(API_URL, majors);
};

const updateMajors = async (id, majors) => {
    return axios.put(`${API_URL}/${id}`, majors);
};

const deleteMajors = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export {
    getAllMajors,
    getMajorsById,
    createMajors,
    updateMajors,
    deleteMajors
}