import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import { institutionAPI, studentAPI } from '../../services/api';

const COLORS = ['#1a237e', '#1565c0', '#0288d1', '#00838f', '#2e7d32'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [studentStats, setStudentStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, studentRes] = await Promise.all([
          institutionAPI.getAnalytics(),
          studentAPI.getStats(),
        ]);
        setAnalytics(analyticsRes.data);
        setStudentStats(studentRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
          <div className="text-center">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-muted">Loading dashboard data...</p>
          </div>
        </div>
      </>
    );
  }

  const overview = analytics?.overview || {};
  const deptData = analytics?.studentsByDept?.map(d => ({ name: d._id, count: d.count })) || [];
  const statusData = studentStats?.statusBreakdown?.map(s => ({ name: s._id, value: s.count })) || [];

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Admin Dashboard</h4>
            <p className="text-muted small mb-0">Unified Educational Data Management Platform</p>
          </div>
          <div className="d-flex gap-2">
            <Link to="/admin/students" className="btn btn-sm btn-outline-primary" style={{ borderRadius: 8 }}>+ Add Student</Link>
            <Link to="/admin/faculty" className="btn btn-sm btn-primary" style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>+ Add Faculty</Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <StatCard title="Total Institutions" value={overview.totalInstitutions ?? 0} icon="🏛️" color="primary" subtitle="Registered on platform" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard title="Total Students" value={overview.totalStudents ?? 0} icon="👨‍🎓" color="success" subtitle={`${overview.activeStudents ?? 0} active`} />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard title="Total Faculty" value={overview.totalFaculty ?? 0} icon="👨‍🏫" color="warning" subtitle={`${overview.activeFaculty ?? 0} active`} />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard title="Placement Rate" value={`${overview.placementRate ?? 0}%`} icon="💼" color="info" subtitle={`${overview.placedStudents ?? 0} placed`} />
          </div>
        </div>

        {/* Charts Row */}
        <div className="row g-3 mb-4">
          {/* Department-wise Students */}
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Students by Department</h6>
                {deptData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={deptData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1a237e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center" style={{ height: 250 }}>
                    <p className="text-muted">No student data yet. <Link to="/admin/students">Add students</Link></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Student Status Pie */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Student Status Breakdown</h6>
                {statusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                        {statusData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="d-flex align-items-center justify-content-center" style={{ height: 250 }}>
                    <p className="text-muted">No data available yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="row g-3">
          {[
            { to: '/admin/students', icon: '👨‍🎓', label: 'Manage Students', desc: 'View, add, update student records' },
            { to: '/admin/faculty', icon: '👨‍🏫', label: 'Manage Faculty', desc: 'Faculty profiles & APAR tracking' },
            { to: '/admin/institutions', icon: '🏛️', label: 'Institutions', desc: 'AISHE codes & NIRF compliance' },
            { to: '/admin/analytics', icon: '📊', label: 'Analytics', desc: 'Real-time institutional analytics' },
          ].map(({ to, icon, label, desc }) => (
            <div key={to} className="col-6 col-lg-3">
              <Link to={to} className="text-decoration-none">
                <div className="card border-0 shadow-sm h-100 text-center p-3" style={{ borderRadius: 12, cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: '2.5rem' }}>{icon}</div>
                  <h6 className="fw-bold mt-2 mb-1" style={{ color: '#1a237e' }}>{label}</h6>
                  <p className="text-muted small mb-0">{desc}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
