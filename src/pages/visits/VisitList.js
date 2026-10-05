import { useEffect, useState } from 'react';
import { getVisits, deleteVisit } from '../../services/VisitService';
import VisitFormModal from './VisitFormModal';
import '../patients/PatientList.css';

function formatDateTime(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
}

function VisitList() {
    const [visits, setVisits] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editVisit, setEditVisit] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        getVisits()
            .then(res => setVisits(res.data))
            .catch(() => setError('Failed to load visits.'))
            .finally(() => setLoading(false));
    }, []);

    const handleAdded = (v) => setVisits(prev => [v, ...prev]);
    const handleUpdated = (updated) =>
        setVisits(prev => prev.map(v => v.visitId === updated.visitId ? updated : v));

    const handleDelete = (id) => {
        if (!window.confirm('Delete this visit?')) return;
        deleteVisit(id).then(() =>
            setVisits(prev => prev.filter(v => v.visitId !== id))
        );
    };

    return (
        <div className="patient-page">
            <div className="page-header">
                <div><h2>Visit Management</h2></div>
                <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Visit</button>
            </div>

            <div className="table-card">
                {loading && <p className="state-msg">Loading visits...</p>}
                {error && <p className="state-msg error">{error}</p>}

                {!loading && !error && (
                    <table className="patient-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Visit Time</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Token</th>
                                <th>Weight</th>
                                <th>Height</th>
                                <th>BP</th>
                                <th>Diagnosis</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visits.length === 0 ? (
                                <tr><td colSpan="10" className="empty-msg">No visits found</td></tr>
                            ) : (
                                visits.map((v, index) => (
                                    <tr key={v.visitId}>
                                        <td>{index + 1}</td>
                                        <td>{formatDateTime(v.visitTime)}</td>
                                        <td>{v.patientName}</td>
                                        <td>{v.doctorName}</td>
                                        <td>#{v.tokenNumber}</td>
                                        <td>{v.weight ? `${v.weight} kg` : '-'}</td>
                                        <td>{v.height ? `${v.height} cm` : '-'}</td>
                                        <td>{v.bloodPressure || '-'}</td>
                                        <td>{v.diagnosis || '-'}</td>
                                        <td>
                                            <button className="btn-edit" title="Edit" onClick={() => setEditVisit(v)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                            <button className="btn-delete" title="Delete" onClick={() => handleDelete(v.visitId)}>
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
                <VisitFormModal
                    onClose={() => setShowForm(false)}
                    onVisitAdded={handleAdded}
                />
            )}
            {editVisit && (
                <VisitFormModal
                    visit={editVisit}
                    onClose={() => setEditVisit(null)}
                    onVisitUpdated={handleUpdated}
                />
            )}
        </div>
    );
}

export default VisitList;
