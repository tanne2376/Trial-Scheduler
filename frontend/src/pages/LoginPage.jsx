import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/login', { username, password });
      localStorage.setItem('token', response.data.token);
      setUser(response.data);
      navigate(`/${response.data.role}`);
    } catch (err) {
      setError("Invalid credentials.");
    }
  };

  return (

      <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100%',
      fontFamily: 'sans-serif' 
    }}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Login to your Account</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', width: '300px', margin: 'auto', gap: '1rem' }}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} style={{ padding: '10px' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ padding: '10px' }} />
          <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '4px' }}>
            Login
          </button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        <p style={{ marginTop: '1.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', color: '#2563eb' }}>← Back to Home</Link>
        </p>
      </div>
    </div>
  );

};

export default LoginPage;