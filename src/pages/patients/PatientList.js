import { useEffect, useState } from 'react';
import { getPatients } from '../../services/PatientService';
import AddPatientForm from './AddPatientForm';
import './PatientList.css';
import PatientDetailModal from './PatientDetailModal';


function PatientList() {
    const [patients, setPatients] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [editPatient, setEditPatient] = useState(null);


    useEffect(() => {
        getPatients()
            .then(response => setPatients(response.data))
            .catch(() => setError('Failed to load patients.'))
            .finally(() => setLoading(false));
    }, []);

    const handlePatientUpdated = (updated) => {
        setPatients(prev => prev.map(p => p.patientId === updated.patientId ? updated : p));
    };

    const handlePatientAdded = (newPatient) => {
        setPatients(prev => [newPatient, ...prev]);
    };

    return (
        <div className="patient-page">
            <div className="page-header">
                <div>
                    <h2>Patient Management</h2>
        
                </div>
                <button className="btn-add" onClick={() => setShowForm(true)}>
                    + Add Patient
                </button>
            </div>

            <div className="table-card">

                {loading && <p className="state-msg">Loading patients...</p>}
                {error && <p className="state-msg error">{error}</p>}

                {!loading && !error && (
                    <table className="patient-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Gender</th>
                                <th>Blood Group</th>
                                <th>Birth Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="empty-msg">No patients found</td>
                                </tr>
                            ) : (
                                patients.map((patient, index) => (
                                    <tr key={patient.patientId}>
                                        <td>{index + 1}</td>
                                        <td className="name-cell">{patient.name}</td>
                                        <td>{patient.email}</td>
                                        <td>{patient.mobileNo}</td>
                                        <td>{patient.gender}</td>
                                        <td>
                                            <span className="blood-badge">{patient.bloodGroup}</span>
                                        </td>
                                        <td>{patient.birthDate}</td>
                                        <td>
                                            <button className="btn-view" title="View Patient" onClick={() => setSelectedPatient(patient)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                            </button>
                                            <button className="btn-edit" title="Edit Patient" onClick={() => setEditPatient(patient)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
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
                <AddPatientForm
                    onClose={() => setShowForm(false)}
                    onPatientAdded={handlePatientAdded}
                />
            )}
            {editPatient && (
                <AddPatientForm
                    patient={editPatient}
                    onClose={() => setEditPatient(null)}
                    onPatientUpdated={handlePatientUpdated}
                />
                
            )}
            {selectedPatient !== null && (
                <PatientDetailModal
                    patient={selectedPatient}
                    onClose={() => setSelectedPatient(null)}
                />
            )}

        </div>
    );
}

export default PatientList;
