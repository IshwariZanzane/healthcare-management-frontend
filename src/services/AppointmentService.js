import axios from 'axios';

const API_URL = 'http://localhost:8080/appointment';

export const getAppointments = () => axios.get(API_URL);
export const getAppointmentsByDoctor = (doctorId) => axios.get(`${API_URL}/doctor/${doctorId}`);
export const getAppointmentsByPatient = (patientId) => axios.get(`${API_URL}/patient/${patientId}`);
export const createAppointment = (data) => axios.post(API_URL, data);
export const updateAppointment = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteAppointment = (id) => axios.delete(`${API_URL}/${id}`);
