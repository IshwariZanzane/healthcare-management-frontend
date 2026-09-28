import axios from 'axios';

const API_URL = 'http://localhost:8080/patients';

export const getPatients = () => {
    return axios.get(API_URL);
};

export const createPatient = (patient) => { 
    return axios.post(API_URL, patient);    
}

export const getPatientById = (patientId) => {
    return axios.get(`${API_URL}/${patientId}`);
}

export const updatePatient = (patientId, patient) => {
    return axios.put(`${API_URL}/${patientId}`, patient);
}