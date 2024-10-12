import axios from 'axios';

const API_URL = 'http://localhost:8080/api/department';

const getAllDepartment = async () => {
    return axios.get(API_URL);
};

const getDepartmentById = async (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const createDepartment = async (department) => {
    return axios.post(API_URL, department);
};

const updateDepartment = async (id, department) => {
    return axios.put(`${API_URL}/${id}`, department);
};

const deleteDepartment = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export {
    getAllDepartment,
    getDepartmentById,
    createDepartment,
    updateDepartment,
    deleteDepartment
}