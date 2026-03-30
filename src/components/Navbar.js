import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleColor = (role) => {
    if (role === 'admin') return 'danger';
    if (role === 'faculty') return 'warning';
    return 'success';
  };

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'faculty') return '/faculty';
    return '/student';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 100%)' }}>
      <div className="container-fluid">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold" to={getDashboardLink()}>
          <span style={{ fontSize: '1.5rem' }}>🎓</span>
          <span>EduCare</span>
          <span className="badge bg-light text-dark ms-1" style={{ fontSize: '0.6rem' }}>UNIFIED PLATFORM</span>
        </Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user?.role === 'admin' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/admin">🏠 Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/students">👨‍🎓 Students</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/faculty">👨‍🏫 Faculty</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/admin/institutions">🏛️ Institutions</Link></li>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.55)' }}>
                    📊 Analytics
                  </button>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/admin/analytics">📈 Platform Analytics</Link></li>
                    <li><Link className="dropdown-item" to="/admin/nirf">🏆 NIRF Calculator</Link></li>
                  </ul>
                </li>
                <li className="nav-item"><Link className="nav-link" to="/admin/search">🔍 Search</Link></li>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.55)' }}>
                    🤖 AI Tools
                  </button>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/ai/report-analyzer">📋 Report Analyzer</Link></li>
                    <li><Link className="dropdown-item" to="/ai/cgpa-predictor">📈 CGPA Predictor</Link></li>
                    <li><Link className="dropdown-item" to="/ai/attendance-risk">⚠️ Attendance Risk</Link></li>
                    <li><Link className="dropdown-item" to="/ai/performance-card">🎓 Performance Card</Link></li>
                    <li><Link className="dropdown-item" to="/ai/peer-comparison">👥 Peer Comparison</Link></li>
                  </ul>
                </li>
              </>
            )}
            {user?.role === 'faculty' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/faculty">🏠 Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/faculty/students">👨‍🎓 My Students</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/faculty/add-record">📝 Add Records</Link></li>
                <li className="nav-item dropdown">
                  <button className="nav-link dropdown-toggle btn btn-link" data-bs-toggle="dropdown" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.55)' }}>
                    🤖 AI Tools
                  </button>
                  <ul className="dropdown-menu">
                    <li><Link className="dropdown-item" to="/ai/report-analyzer">📋 Report Analyzer</Link></li>
                    <li><Link className="dropdown-item" to="/ai/cgpa-predictor">📈 CGPA Predictor</Link></li>
                    <li><Link className="dropdown-item" to="/ai/attendance-risk">⚠️ Attendance Risk</Link></li>
                    <li><Link className="dropdown-item" to="/ai/performance-card">🎓 Performance Card</Link></li>
                    <li><Link className="dropdown-item" to="/ai/peer-comparison">👥 Peer Comparison</Link></li>
                  </ul>
                </li>
              </>
            )}
            {user?.role === 'student' && (
              <>
                <li className="nav-item"><Link className="nav-link" to="/student">🏠 Dashboard</Link></li>
                <li className="nav-item"><Link className="nav-link" to="/student/schemes">🏛️ Govt. Schemes</Link></li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-3">
            {user && (
              <div className="d-flex align-items-center gap-2">
                <span className={`badge bg-${getRoleColor(user.role)} text-uppercase`}>{user.role}</span>
                <span className="text-white-50">{user.name}</span>
              </div>
            )}
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
