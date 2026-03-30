import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await studentAPI.getAll({ limit: 5 });
        setStudents(res.data.students || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Welcome Banner */}
        <div className="card border-0 shadow-sm mb-4 p-4" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1a237e, #1565c0)' }}>
          <div className="text-white">
            <h4 className="fw-bold mb-1">👋 Welcome, {user?.name}!</h4>
            <p className="opacity-75 mb-0">Faculty Portal — Manage your students and track performance</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: 'My Students', value: students.length, icon: '👨‍🎓', color: '#e8eaf6' },
            { label: 'Active Students', value: students.filter(s => s.status === 'active').length, icon: '✅', color: '#e8f5e9' },
            { label: 'Departments', value: [...new Set(students.map(s => s.department))].length, icon: '🏢', color: '#fff3e0' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="col-6 col-lg-4">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-body p-4 d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 52, height: 52, background: color, fontSize: '1.5rem' }}>{icon}</div>
                  <div>
                    <p className="text-muted small mb-0">{label}</p>
                    <h3 className="fw-bold mb-0" style={{ color: '#1a237e' }}>{value}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Students */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Recent Students</h6>
            {loading ? (
              <div className="text-center py-4"><div className="spinner-border text-primary spinner-border-sm" /></div>
            ) : students.length === 0 ? (
              <p className="text-muted text-center py-3">No students assigned yet</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead><tr>
                    <th>Name</th><th>USN</th><th>Department</th><th>Program</th><th>Semester</th><th>Status</th>
                  </tr></thead>
                  <tbody>
                    {students.map(s => (
                      <tr key={s._id}>
                        <td className="fw-semibold">{s.user?.name || '—'}</td>
                        <td>{s.usn || '—'}</td>
                        <td>{s.department}</td>
                        <td>{s.program}</td>
                        <td>Sem {s.currentSemester}</td>
                        <td><span className={`badge ${s.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{s.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
