import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <img src={`${process.env.PUBLIC_URL}/logo.png`} alt="AyuLekha" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'contain' }} />
                <span className="brand-name">AyuLekha</span>
            </div>
            <ul className="navbar-links">
                <li className="nav-item"><NavLink to="/" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Patients</NavLink></li>
                <li className="nav-item"><NavLink to="/doctors" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Doctors</NavLink></li>
                <li className="nav-item"><a href="#" className="nav-link">Dashboard</a></li>
                <li className="nav-item"><NavLink to="/appointments" className={({isActive}) => 'nav-link' + (isActive ? ' active' : '')}>Appointments</NavLink></li>
                <li className="nav-item"><a href="#" className="nav-link">Billing</a></li>
                <li className="nav-item"><a href="#" className="nav-link">Reports</a></li>
            </ul>
            <div className="navbar-right">
                <span className="admin-badge">{user?.role}</span>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );
}

export default Navbar;
