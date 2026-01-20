const ManagerDashboard = () => {
  const token = localStorage.getItem('token');
  const [data, setData] = useState('Loading...');

  useEffect(() => { getData(); }, []);

  const getData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/manager-only-data', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data.message);
    } catch (err) {
      console.error(err);
      setData('Error: Could not fetch manager data.');
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>Manager Dashboard</h1>
      <div className="card">
        <h3>Secure Data from Server:</h3>
        <p style={{ color: 'green', fontWeight: 'bold' }}>{data}</p>
      </div>
    </div>
  );
};