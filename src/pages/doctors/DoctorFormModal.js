import { useState } from 'react';
import axios from 'axios';
import { updateDoctor } from '../../services/DoctorService';
import '../patients/AddPatientForm.css';

const BASE = 'http://localhost:8080';

const initialState = { email: '', password: '', name: '', department: '', speciality: '', education: '', mobileNo: '' };

function DoctorFormModal({ onClose, onDoctorAdded, onDoctorUpdated, doctor }) {
    const isEdit = !!doctor;
    const [form, setForm] = useState(
        isEdit
            ? { email: '', password: '', name: doctor.name, department: doctor.department, speciality: doctor.speciality, education: doctor.education, mobileNo: doctor.mobileNo }
            : initialState
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            if (isEdit) {
                const res = await updateDoctor(doctor.doctorId, {
                    userId: doctor.userId,
                    name: form.name,
                    department: form.department,
                    speciality: form.speciality,
                    education: form.education,
                    mobileNo: form.mobileNo
                });
                onDoctorUpdated(res.data);
            } else {
                // Step 1: create user with DOCTOR role
                const userRes = await axios.post(`${BASE}/users`, {
                    email: form.email,
                    password: form.password,
                    role: 'DOCTOR'
                });
                // Step 2: create doctor linked to that user
                const doctorRes = await axios.post(`${BASE}/doctors`, {
                    userId: userRes.data.userId,
                    name: form.name,
                    department: form.department,
                    speciality: form.speciality,
                    education: form.education,
                    mobileNo: form.mobileNo
                });
                onDoctorAdded(doctorRes.data);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'add'} doctor. Email may already exist.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3 data-icon="👨‍⚕️">{isEdit ? 'Edit Doctor' : 'Add New Doctor'}</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="patient-form">
                    {!isEdit && (
                        <>
                            <p className="form-section-label">Login Credentials</p>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="demail">Email</label>
                                    <input id="demail" name="email" type="email" value={form.email} onChange={handleChange} placeholder="doctor@ayulekha.com" required />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="dpassword">Password</label>
                                    <input id="dpassword" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Set password" required />
                                </div>
                            </div>
                        </>
                    )}
                    <p className="form-section-label">Doctor Info</p>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="dname">Full Name</label>
                            <input id="dname" name="name" value={form.name} onChange={handleChange} placeholder="Dr. John Smith" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="dmobileNo">Mobile No</label>
                            <input id="dmobileNo" name="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="9876543210" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input id="department" name="department" value={form.department} onChange={handleChange} placeholder="Cardiology" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="speciality">Speciality</label>
                            <input id="speciality" name="speciality" value={form.speciality} onChange={handleChange} placeholder="Heart Surgery" required />
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="education">Education</label>
                        <input id="education" name="education" value={form.education} onChange={handleChange} placeholder="MBBS, MD" required />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Doctor' : 'Add Doctor'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DoctorFormModal;
