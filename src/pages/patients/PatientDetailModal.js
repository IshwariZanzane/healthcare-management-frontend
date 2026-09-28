import './PatientDetailModal.css';

function PatientDetailModal({ patient, onClose }) {

    return (
        <div className="modal-overlay">
            <div className="detail-modal">
                <div className="modal-header">
                    <h3>Patient Details</h3>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>
                <div className="detail-body">
                    {patient && (
                        <>
                            <div className="detail-avatar">
                                {patient.name.charAt(0).toUpperCase()}
                            </div>
                            <h4 className="detail-name">{patient.name}</h4>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Patient ID</span>
                                    <span className="detail-value">#{patient.patientId}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Gender</span>
                                    <span className="detail-value">{patient.gender}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Email</span>
                                    <span className="detail-value">{patient.email}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Mobile</span>
                                    <span className="detail-value">{patient.mobileNo}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Birth Date</span>
                                    <span className="detail-value">{patient.birthDate}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Blood Group</span>
                                    <span className="blood-badge">{patient.bloodGroup}</span>
                                </div>
                                <div className="detail-item full">
                                    <span className="detail-label">Address</span>
                                    <span className="detail-value">{patient.address}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PatientDetailModal;
