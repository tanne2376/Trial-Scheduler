import { useState, useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import PatientDashboard from './pages/PatientDashboard';
import Layout from './components/Layout';

// --- Main App Component ---
export default function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        {/* Landing Page is now the default root */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Login Page is moved to /login */}
        <Route path="/login" element={!user ? <LoginPage setUser={setUser} /> : <Navigate to={`/${user.role}`} />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/admin" element={user?.role === 'admin' ? <Layout user={user} setUser={setUser}><AdminDashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/trialManager" element={user?.role === 'trialManager' ? <Layout user={user} setUser={setUser}><ManagerDashboard /></Layout> : <Navigate to="/login" />} />
        <Route path="/patient" element={user?.role === 'patient' ? <Layout user={user} setUser={setUser}><PatientDashboard /></Layout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}