import { useState } from 'react';
import { createPatient, updatePatient } from '../../services/PatientService';
import './AddPatientForm.css';

const initialState = {
    name: '', email: '', mobileNo: '',
    address: '', birthDate: '', bloodGroup: '', gender: ''
};

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

function AddPatientForm({ onClose, onPatientAdded, onPatientUpdated, patient }) {
    const isEdit = !!patient;
    const [form, setForm] = useState(
        isEdit
            ? { name: patient.name, email: patient.email, mobileNo: patient.mobileNo,
                address: patient.address, birthDate: patient.birthDate,
                bloodGroup: patient.bloodGroup, gender: patient.gender }
            : initialState
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const request = isEdit
            ? updatePatient(patient.patientId, form)
            : createPatient(form);
        request
            .then(response => {
                isEdit ? onPatientUpdated(response.data) : onPatientAdded(response.data);
                onClose();
            })
            .catch(() => setError(`Failed to ${isEdit ? 'update' : 'add'} patient. Please try again.`))
            .finally(() => setLoading(false));
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3 data-icon="👤">{isEdit ? 'Edit Patient' : 'Add New Patient'}</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="patient-form">
                    <p className="form-section-label">Personal Info</p>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input id="name" name="name" value={form.name} onChange={handleChange} placeholder="Enter full name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="Enter email" required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="mobileNo">Mobile No</label>
                            <input id="mobileNo" name="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="Enter mobile number" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthDate">Birth Date</label>
                            <input id="birthDate" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required />
                        </div>
                    </div>
                    <p className="form-section-label">Medical Info</p>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="gender">Gender</label>
                            <select id="gender" name="gender" value={form.gender} onChange={handleChange} required>
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bloodGroup">Blood Group</label>
                            <select id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} required>
                                <option value="">Select blood group</option>
                                {bloodGroups.map(bg => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="form-group full-width">
                        <label htmlFor="address">Address</label>
                        <textarea id="address" name="address" value={form.address} onChange={handleChange} placeholder="Enter address" rows={3} required />
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Patient' : 'Add Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddPatientForm;
