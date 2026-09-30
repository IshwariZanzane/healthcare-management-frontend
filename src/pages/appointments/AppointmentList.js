import { useEffect, useState } from 'react';
import { getAppointments, deleteAppointment } from '../../services/AppointmentService';
import AppointmentFormModal from './AppointmentFormModal';
import '../patients/PatientList.css';

const STATUS_COLORS = {
    SCHEDULED:  { background: '#E3F2FD', color: '#1565C0' },
    COMPLETED:  { background: '#E8F5E9', color: '#2E7D32' },
    CANCELLED:  { background: '#FFEBEE', color: '#C62828' },
    NO_SHOW:    { background: '#FFF8E1', color: '#F57F17' },
};

function formatDateTime(dt) {
    if (!dt) return '-';
    const d = new Date(dt);
    return d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editAppointment, setEditAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getAppointments()
            .then(res => setAppointments(res.data))
            .catch(() => setError('Failed to load appointments.'))
            .finally(() => setLoading(false));
    }, []);

    const handleAdded = (a) => setAppointments(prev => [a, ...prev]);

    const handleUpdated = (updated) =>
        setAppointments(prev => prev.map(a => a.appmtId === updated.appmtId ? updated : a));

    const handleDelete = (id) => {
        if (!window.confirm('Delete this appointment?')) return;
        deleteAppointment(id).then(() =>
            setAppointments(prev => prev.filter(a => a.appmtId !== id))
        );
    };

    return (
        <div className="patient-page">
            <div className="page-header">
                <div><h2>Appointment Management</h2></div>
                <button className="btn-add" onClick={() => setShowForm(true)}>+ Book Appointment</button>
            </div>

            <div className="table-card">
                {loading && <p className="state-msg">Loading appointments...</p>}
                {error && <p className="state-msg error">{error}</p>}

                {!loading && !error && (
                    <table className="patient-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Token</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.length === 0 ? (
                                <tr><td colSpan="9" className="empty-msg">No appointments found</td></tr>
                            ) : (
                                appointments.map((a, index) => (
                                    <tr key={a.appmtId}>
                                        <td>{index + 1}</td>
                                        <td><span className="blood-badge">#{a.tokenNumber}</span></td>
                                        <td className="name-cell">{a.patientName}</td>
                                        <td>{a.doctorName}</td>
                                        <td>{formatDateTime(a.startTime)}</td>
                                        <td>{formatDateTime(a.endTime)}</td>
                                        <td>{a.reason || '-'}</td>
                                        <td>
                                            <span className="blood-badge" style={STATUS_COLORS[a.status] || {}}>
                                                {a.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn-edit" title="Edit" onClick={() => setEditAppointment(a)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                            <button className="btn-delete" title="Delete" onClick={() => handleDelete(a.appmtId)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                    <path d="M10 11v6M14 11v6"/>
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showForm && (
                <AppointmentFormModal
                    onClose={() => setShowForm(false)}
                    onAppointmentAdded={handleAdded}
                />
            )}
            {editAppointment && (
                <AppointmentFormModal
                    appointment={editAppointment}
                    onClose={() => setEditAppointment(null)}
                    onAppointmentUpdated={handleUpdated}
                />
            )}
        </div>
    );
}

export default AppointmentList;
