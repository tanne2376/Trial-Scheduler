const Layout = ({ user, setUser, children }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div style={{ 
      width: '100%', 
      minHeight: '100vh', 
      fontFamily: 'sans-serif',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <nav style={{ 
        width: '100%', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        borderBottom: '1px solid #ddd', 
        padding: '1rem 2rem', 
        boxSizing: 'border-box' 
      }}>
        <h2 style={{ cursor: 'pointer', color: '#1e40af', margin: 0 }} onClick={() => navigate('/')}>Trial App</h2>
        <div>
          <span style={{ marginRight: '1rem' }}>Logged in as: <strong>{user?.username}</strong></span>
          <button onClick={handleLogout} style={{ cursor: 'pointer' }}>Logout</button>
        </div>
      </nav>
      
      <div style={{ 
        flex: 1, 
        width: '100%', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '2rem',
        boxSizing: 'border-box'
      }}>
        <div style={{ width: '100%', maxWidth: '900px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {children}
        </div>
      </div>
    </div>
  );
};