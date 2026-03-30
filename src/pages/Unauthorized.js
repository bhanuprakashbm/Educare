import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const goBack = () => {
    if (user?.role === 'admin') navigate('/admin');
    else if (user?.role === 'faculty') navigate('/faculty');
    else navigate('/student');
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{ background: '#f8f9fa' }}>
      <div className="text-center p-5">
        <div style={{ fontSize: '5rem' }}>🚫</div>
        <h2 className="fw-bold mt-3" style={{ color: '#1a237e' }}>Access Denied</h2>
        <p className="text-muted">You don't have permission to access this page.</p>
        <button className="btn btn-primary mt-3" onClick={goBack}
          style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
