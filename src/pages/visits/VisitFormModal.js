import { useState, useEffect } from 'react';
import { getPatients } from '../../services/PatientService';
import { getDoctors } from '../../services/DoctorService';
import { getAppointments } from '../../services/AppointmentService';
import { createVisit, updateVisit } from '../../services/VisitService';
import '../patients/AddPatientForm.css';

const initialState = {
    patientId: '', doctorId: '', appointmentId: '',
    visitTime: '', weight: '', height: '',
    bloodPressure: '', symptoms: '', diagnosis: '', prescription: '', notes: ''
};

function VisitFormModal({ onClose, onVisitAdded, onVisitUpdated, visit }) {
    const isEdit = !!visit;
    const [form, setForm] = useState(
        isEdit
            ? {
                patientId: visit.patientId,
                doctorId: visit.doctorId,
                appointmentId: visit.appointmentId,
                visitTime: visit.visitTime ? visit.visitTime.slice(0, 16) : '',
                weight: visit.weight,
                height: visit.height,
                bloodPressure: visit.bloodPressure || '',
                symptoms: visit.symptoms || '',
                diagnosis: visit.diagnosis || '',
                prescription: visit.prescription || '',
                notes: visit.notes || ''
            }
            : initialState
    );
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        getPatients().then(res => setPatients(res.data));
        getDoctors().then(res => setDoctors(res.data));
        getAppointments().then(res => setAppointments(res.data));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        const payload = {
            patientId: Number(form.patientId),
            doctorId: Number(form.doctorId),
            appointmentId: Number(form.appointmentId),
            visitTime: form.visitTime + ':00',
            weight: Number(form.weight),
            height: Number(form.height),
            bloodPressure: form.bloodPressure,
            symptoms: form.symptoms,
            diagnosis: form.diagnosis,
            prescription: form.prescription,
            notes: form.notes
        };
        try {
            if (isEdit) {
                const res = await updateVisit(visit.visitId, payload);
                onVisitUpdated(res.data);
            } else {
                const res = await createVisit(payload);
                onVisitAdded(res.data);
            }
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} visit.`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h3 data-icon="🏥">{isEdit ? 'Edit Visit' : 'New Visit'}</h3>
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
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="appointmentId">Appointment</label>
                            <select id="appointmentId" name="appointmentId" value={form.appointmentId} onChange={handleChange} required>
                                <option value="">Select appointment</option>
                                {appointments.map(a => (
                                    <option key={a.appmtId} value={a.appmtId}>#{a.tokenNumber} — {a.patientName}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="visitTime">Visit Time</label>
                            <input id="visitTime" name="visitTime" type="datetime-local" value={form.visitTime} onChange={handleChange} required />
                        </div>
                    </div>
                    <p className="form-section-label">Vitals</p>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="weight">Weight (kg)</label>
                            <input id="weight" name="weight" type="number" step="0.1" value={form.weight} onChange={handleChange} placeholder="e.g. 70.5" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="height">Height (cm)</label>
                            <input id="height" name="height" type="number" step="0.1" value={form.height} onChange={handleChange} placeholder="e.g. 175" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bloodPressure">Blood Pressure</label>
                            <input id="bloodPressure" name="bloodPressure" value={form.bloodPressure} onChange={handleChange} placeholder="e.g. 120/80" />
                        </div>
                    </div>
                    <p className="form-section-label">Clinical Notes</p>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="symptoms">Symptoms</label>
                            <input id="symptoms" name="symptoms" value={form.symptoms} onChange={handleChange} placeholder="e.g. Fever, cough" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="diagnosis">Diagnosis</label>
                            <input id="diagnosis" name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="e.g. Viral fever" />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="prescription">Prescription</label>
                            <input id="prescription" name="prescription" value={form.prescription} onChange={handleChange} placeholder="e.g. Paracetamol 500mg" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="notes">Notes</label>
                            <input id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Additional notes" />
                        </div>
                    </div>
                    {error && <p className="form-error">{error}</p>}
                    <div className="form-actions">
                        <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Saving...' : isEdit ? 'Update Visit' : 'Add Visit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default VisitFormModal;
