import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const [data, setData] = useState("Loading...");
  useEffect(() => { getData(); }, []);

  const getData = async () => {
    console.log("getData Called");
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/admin-only-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Data received:", res.data);
      setData(res.data.message);
    } catch (err) {
      console.error("Access Denied or Server Error", err);
      setData("Error: Could not fetch data.");
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Admin Dashboard</h1>
      <div className="card">
        <h3>Secure Data from Server:</h3>
        <p style={{ color: 'green', fontWeight: 'bold' }}>{data}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;