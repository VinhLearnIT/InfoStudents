import axios from 'axios';

const API_URL = 'http://localhost:8080/api/students';

const getAllStudents = async () => {
    return axios.get(API_URL);
};

const getStudentById = async (id) => {
    return axios.get(`${API_URL}/${id}`);
};

const loginStudent = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/login`, formData);
        return response;
    } catch (error) {
        if (error.response.status === 404) {
            return { status: 404 };
        }
        throw error;
    }
};

const createStudent = async (student) => {
    return axios.post(API_URL, student);
};

const changePassword = async (formData) => {
    return axios.post(`${API_URL}/change-password`, formData);
};

const updateStudent = async (id, student) => {
    return axios.put(`${API_URL}/${id}`, student);
};

const deleteStudent = async (id) => {
    return axios.delete(`${API_URL}/${id}`);
};

export {
    getAllStudents,
    getStudentById,
    loginStudent,
    changePassword,
    createStudent,
    updateStudent,
    deleteStudent
}