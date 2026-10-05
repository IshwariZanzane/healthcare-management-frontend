import axios from 'axios';

const API_URL = 'http://localhost:8080/visits';

export const getVisits = () => axios.get(API_URL);
export const getVisitsByPatient = (patientId) => axios.get(`${API_URL}/patient/${patientId}`);
export const getVisitsByDoctor = (doctorId) => axios.get(`${API_URL}/doctor/${doctorId}`);
export const createVisit = (data) => axios.post(API_URL, data);
export const updateVisit = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteVisit = (id) => axios.delete(`${API_URL}/${id}`);
