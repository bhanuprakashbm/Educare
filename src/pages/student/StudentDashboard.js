import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { studentAPI } from '../../services/api';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await studentAPI.getAll({ limit: 1 });
        if (res.data.students?.length > 0) setProfile(res.data.students[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        {/* Welcome Banner */}
        <div className="card border-0 shadow-sm mb-4 p-4"
          style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}>
          <div className="text-white">
            <h4 className="fw-bold mb-1">👋 Welcome, {user?.name}!</h4>
            <p className="opacity-75 mb-0">Student Portal — Track your academic journey</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
        ) : (
          <div className="row g-3">
            {/* Academic Info */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>📋 My Profile</h6>
                  {profile ? (
                    <div>
                      <div className="mb-2 d-flex justify-content-between">
                        <span className="text-muted small">USN</span>
                        <span className="fw-semibold small">{profile.usn || '—'}</span>
                      </div>
                      <div className="mb-2 d-flex justify-content-between">
                        <span className="text-muted small">Department</span>
                        <span className="fw-semibold small">{profile.department}</span>
                      </div>
                      <div className="mb-2 d-flex justify-content-between">
                        <span className="text-muted small">Program</span>
                        <span className="fw-semibold small">{profile.program}</span>
                      </div>
                      <div className="mb-2 d-flex justify-content-between">
                        <span className="text-muted small">Batch</span>
                        <span className="fw-semibold small">{profile.batch}</span>
                      </div>
                      <div className="mb-2 d-flex justify-content-between">
                        <span className="text-muted small">Semester</span>
                        <span className="fw-semibold small">Sem {profile.currentSemester}</span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <span className="text-muted small">Status</span>
                        <span className={`badge ${profile.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                          {profile.status}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted small">Profile not set up yet. Contact admin.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Attendance */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4 text-center">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>📅 Attendance</h6>
                  {profile ? (
                    <>
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <svg width="120" height="120" viewBox="0 0 120 120">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#e8eaf6" strokeWidth="12" />
                          <circle cx="60" cy="60" r="50" fill="none"
                            stroke={profile.attendance?.percentage >= 75 ? '#2e7d32' : '#c62828'}
                            strokeWidth="12"
                            strokeDasharray={`${(profile.attendance?.percentage || 0) * 3.14} 314`}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)" />
                        </svg>
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                          <span className="fw-bold fs-4">{profile.attendance?.percentage || 0}%</span>
                        </div>
                      </div>
                      <p className="text-muted small mt-2">
                        {profile.attendance?.attendedClasses || 0} / {profile.attendance?.totalClasses || 0} classes
                      </p>
                      {(profile.attendance?.percentage || 0) < 75 && (
                        <div className="alert alert-warning py-1 small">⚠️ Below 75% attendance!</div>
                      )}
                    </>
                  ) : (
                    <p className="text-muted small">No attendance data</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Performance */}
            <div className="col-12 col-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>🎓 Academic Records</h6>
                  {profile?.academicRecords?.length > 0 ? (
                    profile.academicRecords.map((rec, i) => (
                      <div key={i} className="mb-3 p-2 rounded" style={{ background: '#f8f9fa' }}>
                        <div className="d-flex justify-content-between">
                          <span className="small fw-semibold">Sem {rec.semester} ({rec.year})</span>
                          <span className="badge bg-primary">{rec.sgpa} SGPA</span>
                        </div>
                        <div className="d-flex justify-content-between mt-1">
                          <span className="text-muted small">CGPA</span>
                          <span className="small fw-semibold">{rec.cgpa}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small">No academic records yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Placement Status */}
            {profile?.placement?.isPlaced && (
              <div className="col-12">
                <div className="card border-0 shadow-sm" style={{ borderRadius: 12, borderLeft: '4px solid #2e7d32' }}>
                  <div className="card-body p-4 d-flex align-items-center gap-3">
                    <span style={{ fontSize: '2.5rem' }}>💼</span>
                    <div>
                      <h6 className="fw-bold mb-0" style={{ color: '#1b5e20' }}>🎉 Placed!</h6>
                      <p className="mb-0 text-muted small">
                        {profile.placement.company} · {profile.placement.role} · ₹{profile.placement.package} LPA
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default StudentDashboard;
