import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import PatientList from './pages/patients/PatientList';
import DoctorList from './pages/doctors/DoctorList';
import LoginPage from './pages/auth/LoginPage';
import CreateUserPage from './pages/auth/CreateUserPage';
import './App.css';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<CreateUserPage />} />
                    <Route
                        path="/*"
                        element={
                            <PrivateRoute>
                                <div className="app-layout">
                                    <Navbar />
                                    <div className="main-content">
                                        <Routes>
                                            <Route path="/" element={<PatientList />} />
                                            <Route path="/doctors" element={
                                                <PrivateRoute roles={['ADMIN']}>
                                                    <DoctorList />
                                                </PrivateRoute>
                                            } />
                                        </Routes>
                                    </div>
                                </div>
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
