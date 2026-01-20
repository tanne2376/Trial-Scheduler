const LandingPage = () => {
  return (
      <div style={{ textAlign: 'center', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '3rem', color: '#1e40af' }}>Amazing Landing Page</h1>
        <p style={{ fontSize: '1.2rem', color: '#475569', margin: '1rem auto' }}>
          Wow! Look at this stunning landing page and all the incredible animations. [[incredible animations]]
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