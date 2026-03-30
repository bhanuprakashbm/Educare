import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'faculty') navigate('/faculty');
      else navigate('/student');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4"
      style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)' }}>
      <div className="card border-0 shadow-lg w-100" style={{ maxWidth: 480, borderRadius: 16 }}>
        <div className="card-body p-5">
          <div className="text-center mb-4">
            <span style={{ fontSize: '2.5rem' }}>🎓</span>
            <h4 className="fw-bold mt-2 mb-0" style={{ color: '#1a237e' }}>Create Account</h4>
            <p className="text-muted small mt-1">Join the EduCare platform</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 small">⚠️ {error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="John Doe"
                value={formData.name} onChange={handleChange} required style={{ borderRadius: 8 }} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Email Address</label>
              <input type="email" name="email" className="form-control" placeholder="your@email.com"
                value={formData.email} onChange={handleChange} required style={{ borderRadius: 8 }} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold small">Role</label>
              <select name="role" className="form-select" value={formData.role} onChange={handleChange} style={{ borderRadius: 8 }}>
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="row g-3 mb-4">
              <div className="col-6">
                <label className="form-label fw-semibold small">Password</label>
                <input type="password" name="password" className="form-control" placeholder="Min 6 chars"
                  value={formData.password} onChange={handleChange} required style={{ borderRadius: 8 }} />
              </div>
              <div className="col-6">
                <label className="form-label fw-semibold small">Confirm Password</label>
                <input type="password" name="confirmPassword" className="form-control" placeholder="Repeat password"
                  value={formData.confirmPassword} onChange={handleChange} required style={{ borderRadius: 8 }} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading} style={{ borderRadius: 8, background: '#1a237e', border: 'none' }}>
              {loading ? <><span className="spinner-border spinner-border-sm me-2" />Creating account...</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-muted small mt-4 mb-0">
            Already have an account?{' '}
            <Link to="/login" className="text-decoration-none fw-semibold" style={{ color: '#1a237e' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
