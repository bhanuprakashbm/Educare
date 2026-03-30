import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(formData.email, formData.password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'faculty') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex" style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)' }}>
      {/* Left Panel */}
      <div className="d-none d-lg-flex col-lg-6 flex-column justify-content-center align-items-center text-white p-5">
        <div className="text-center">
          <div style={{ fontSize: '5rem' }}>🎓</div>
          <h1 className="fw-bold display-5 mt-3">EduCare</h1>
          <p className="lead opacity-75 mt-2">Unified Educational Data Management &amp; Institutional Performance Analytics</p>
          <hr className="opacity-25 my-4" />
          <div className="d-flex gap-4 justify-content-center text-center">
            {[['🏛️', 'Institutions'], ['👨‍🎓', 'Students'], ['👨‍🏫', 'Faculty']].map(([icon, label]) => (
              <div key={label}>
                <div style={{ fontSize: '2rem' }}>{icon}</div>
                <small className="opacity-75">{label}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="col-12 col-lg-6 d-flex align-items-center justify-content-center p-4">
        <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 440, borderRadius: 16 }}>
          <div className="card-body p-5">
            <div className="text-center mb-4">
              <span style={{ fontSize: '2.5rem' }}>🎓</span>
              <h4 className="fw-bold mt-2 mb-0" style={{ color: '#1a237e' }}>Welcome Back</h4>
              <p className="text-muted small mt-1">Sign in to your EduCare account</p>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-semibold small">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: 8 }}
                />
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold small">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  style={{ borderRadius: 8 }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={loading}
                style={{ borderRadius: 8, background: '#1a237e', border: 'none' }}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2" />Signing in...</>
                ) : 'Sign In'}
              </button>
            </form>

            <p className="text-center text-muted small mt-4 mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-decoration-none fw-semibold" style={{ color: '#1a237e' }}>
                Register here
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
