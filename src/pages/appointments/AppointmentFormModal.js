import { useState, useEffect } from 'react';
import { getPatients } from '../../services/PatientService';
import { getDoctors } from '../../services/DoctorService';
import { createAppointment, updateAppointment } from '../../services/AppointmentService';
import '../patients/AddPatientForm.css';

const STATUS_OPTIONS = ['SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];

const initialState = {
    patientId: '', doctorId: '', startTime: '', endTime: '', reason: '', status: 'SCHEDULED'
};

function AppointmentFormModal({ onClose, onAppointmentAdded, onAppointmentUpdated, appointment }) {
    const isEdit = !!appointment;
    const [form, setForm] = useState(
        isEdit
            ? {
                patientId: appointment.patientId,
                doctorId: appointment.doctorId,
                startTime: appointment.startTime.slice(0, 16),
                endTime: appointment.endTime.slice(0, 16),
                reason: appointment.reason || '',
                status: appointment.status
            }
            : initialState
    );
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getPatients().then(res => setPatients(res.data));
        getDoctors().then(res => setDoctors(res.data));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const payload = {
            patientId: Number(form.patientId),
            doctorId: Number(form.doctorId),
            startTime: form.startTime + ':00',
            endTime: form.endTime + ':00',
            reason: form.reason,
            status: form.status
        };
        try {
            if (isEdit) {
                const res = await updateAppointment(appointment.appmtId, payload);
                onAppointmentUpdated(res.data);
            } else {
                const res = await createAppointment(payload);
                onAppointmentAdded(res.data);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} appointment.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3 data-icon="📅">{isEdit ? 'Edit Appointment' : 'New Appointment'}</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <form onSubmit={handleSubmit} className="patient-form">
                    <p className="form-section-label">Participants</p>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="patientId">Patient</label>
                            <select id="patientId" name="patientId" value={form.patientId} onChange={handleChange} required>
                                <option value="">Select patient</option>
                                {patients.map(p => (
                                    <option key={p.patientId} value={p.patientId}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="doctorId">Doctor</label>
                            <select id="doctorId" name="doctorId" value={form.doctorId} onChange={handleChange} required>
                                <option value="">Select doctor</option>
                                {doctors.map(d => (
                                    <option key={d.doctorId} value={d.doctorId}>{d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <p className="form-section-label">Schedule & Details</p>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startTime">Start Time</label>
                            <input id="startTime" name="startTime" type="datetime-local" value={form.startTime} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endTime">End Time</label>
                            <input id="endTime" name="endTime" type="datetime-local" value={form.endTime} onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select id="status" name="status" value={form.status} onChange={handleChange} required>
                                {STATUS_OPTIONS.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="reason">Reason</label>
                            <input id="reason" name="reason" value={form.reason} onChange={handleChange} placeholder="e.g. Routine checkup" />
                        </div>
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Appointment' : 'Book Appointment'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AppointmentFormModal;
