import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CreateUserPage.css';

const BASE = 'http://localhost:8080';

const initialForm = {
    email: '', password: '', role: 'RECEPTIONIST',
    name: '', department: '', speciality: '', education: '', mobileNo: ''
};

function CreateUserPage() {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const userRes = await axios.post(`${BASE}/users`, {
                email: form.email,
                password: form.password,
                role: form.role
            });

            if (form.role === 'DOCTOR') {
                await axios.post(`${BASE}/doctors`, {
                    userId: userRes.data.userId,
                    name: form.name,
                    department: form.department,
                    speciality: form.speciality,
                    education: form.education,
                    mobileNo: form.mobileNo
                });
            }

            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create user. Email may already exist.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-user-container" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/login_page.png)` }}>
            <div className="create-user-card">
                <div className="create-user-header">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="AyuLekha" className="create-user-logo" />
                    <h2>AyuLekha</h2>
                    <p>Add a new Doctor or Receptionist</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Role</label>
                        <select name="role" value={form.role} onChange={handleChange}>
                            <option value="RECEPTIONIST">Receptionist</option>
                            <option value="DOCTOR">Doctor</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="Enter email" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input name="password" type="password" value={form.password} onChange={handleChange} required placeholder="Enter password" />
                    </div>

                    {form.role === 'DOCTOR' && (
                        <div className="doctor-fields">
                            <div className="section-label">Doctor Profile</div>
                            <div className="form-group">
                                <label>Full Name</label>
                                <input name="name" value={form.name} onChange={handleChange} required placeholder="Dr. John Smith" />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Department</label>
                                    <input name="department" value={form.department} onChange={handleChange} placeholder="Cardiology" />
                                </div>
                                <div className="form-group">
                                    <label>Speciality</label>
                                    <input name="speciality" value={form.speciality} onChange={handleChange} placeholder="Heart Surgery" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Education</label>
                                    <input name="education" value={form.education} onChange={handleChange} placeholder="MBBS, MD" />
                                </div>
                                <div className="form-group">
                                    <label>Mobile No</label>
                                    <input name="mobileNo" value={form.mobileNo} onChange={handleChange} placeholder="9876543210" />
                                </div>
                            </div>
                        </div>
                    )}

                    {error && <div className="form-error">{error}</div>}

                    <div className="form-actions">
                        <button type="button" className="btn-secondary" onClick={() => navigate('/login')}>Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Account'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateUserPage;
