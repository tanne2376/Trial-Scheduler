import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// --- NEW: Generic Landing Page ---
const LandingPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '3rem', color: '#1e40af' }}>TrialFlow</h1>
      <p style={{ fontSize: '1.2rem', color: '#475569', maxWidth: '600px', margin: '1rem auto' }}>
        The next generation of clinical trial scheduling. Streamline protocols, 
        manage participant windows, and ensure compliance with ease.
      </p>
      <div style={{ marginTop: '2rem' }}>
        <Link to="/login">
          <button style={{ padding: '1rem 2rem', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '5px' }}>
            Login to Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

// --- Updated Layout (Added a Home Link) ---
const Layout = ({ user, setUser, children }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #ddd', paddingBottom: '1rem' }}>
        <h2 style={{ cursor: 'pointer', color: '#1e40af' }} onClick={() => navigate('/')}>TrialFlow</h2>
        <div>
          <span style={{ marginRight: '1rem' }}>Logged in as: <strong>{user?.username}</strong></span>
          <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>
      {children}
    </div>
  );
};

// --- Login Page (Same as before, just updated path logic) ---
const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { username, password });
      setUser(response.data);
      navigate(`/${response.data.role}`);
    } catch (err) {
      setError("Invalid credentials. Try admin_user / admin123");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '5rem', fontFamily: 'sans-serif' }}>
      <h2>Login to your Account</h2>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto', gap: '1rem' }}>
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '10px' }} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px' }} />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#1e293b', color: 'white' }}>Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p><Link to="/">← Back to Home</Link></p>
    </div>
  );
};

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
        <Route path="/admin" element={user?.role === 'admin' ? <Layout user={user} setUser={setUser}><h1>Admin Dashboard</h1></Layout> : <Navigate to="/login" />} />
        <Route path="/TrialManager" element={user?.role === 'TrialManager' ? <Layout user={user} setUser={setUser}><h1>Coordinator Dashboard</h1></Layout> : <Navigate to="/login" />} />
        <Route path="/patient" element={user?.role === 'patient' ? <Layout user={user} setUser={setUser}><h1>Patient Portal</h1></Layout> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}