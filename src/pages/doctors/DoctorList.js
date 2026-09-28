import { useEffect, useState } from 'react';
import { getDoctors, deleteDoctor } from '../../services/DoctorService';
import { useAuth } from '../../context/AuthContext';
import DoctorFormModal from './DoctorFormModal';
import '../patients/PatientList.css';

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editDoctor, setEditDoctor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    useEffect(() => {
        getDoctors()
            .then(res => setDoctors(res.data))
            .catch(() => setError('Failed to load doctors.'))
            .finally(() => setLoading(false));
    }, []);

    const handleDoctorAdded = (newDoctor) => setDoctors(prev => [newDoctor, ...prev]);

    const handleDoctorUpdated = (updated) =>
        setDoctors(prev => prev.map(d => d.doctorId === updated.doctorId ? updated : d));

    const handleDelete = (doctorId) => {
        if (!window.confirm('Delete this doctor?')) return;
        deleteDoctor(doctorId).then(() =>
            setDoctors(prev => prev.filter(d => d.doctorId !== doctorId))
        );
    };

    return (
        <div className="patient-page">
            <div className="page-header">
                <div><h2>Doctor Management</h2></div>
                {isAdmin && <button className="btn-add" onClick={() => setShowForm(true)}>+ Add Doctor</button>}
            </div>

            <div className="table-card">
                {loading && <p className="state-msg">Loading doctors...</p>}
                {error && <p className="state-msg error">{error}</p>}

                {!loading && !error && (
                    <table className="patient-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Speciality</th>
                                <th>Education</th>
                                <th>Mobile</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.length === 0 ? (
                                <tr><td colSpan="7" className="empty-msg">No doctors found</td></tr>
                            ) : (
                                doctors.map((doctor, index) => (
                                    <tr key={doctor.doctorId}>
                                        <td>{index + 1}</td>
                                        <td className="name-cell">{doctor.name}</td>
                                        <td>{doctor.department}</td>
                                        <td>
                                            <span className="blood-badge">{doctor.speciality}</span>
                                        </td>
                                        <td>{doctor.education}</td>
                                        <td>{doctor.mobileNo}</td>
                                        <td>
                                            {isAdmin && (
                                            <>
                                            <button className="btn-edit" title="Edit Doctor" onClick={() => setEditDoctor(doctor)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                                                </svg>
                                            </button>
                                            <button className="btn-delete" title="Delete Doctor" onClick={() => handleDelete(doctor.doctorId)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                    <path d="M10 11v6M14 11v6"/>
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                                </svg>
                                            </button>
                                            </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {showForm && (
                <DoctorFormModal
                    onClose={() => setShowForm(false)}
                    onDoctorAdded={handleDoctorAdded}
                />
            )}
            {editDoctor && (
                <DoctorFormModal
                    doctor={editDoctor}
                    onClose={() => setEditDoctor(null)}
                    onDoctorUpdated={handleDoctorUpdated}
                />
            )}
        </div>
    );
}

export default DoctorList;
