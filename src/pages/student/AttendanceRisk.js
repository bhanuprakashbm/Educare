import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';

const AttendanceRisk = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { fetchRisk(); }, []);

  const fetchRisk = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get('/ai/attendance-risk');
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attendance risk data');
    } finally {
      setLoading(false);
    }
  };

  const riskColor = { Critical: 'danger', High: 'warning', Medium: 'info' };
  const riskBg = { Critical: '#ffebee', High: '#fff3e0', Medium: '#e3f2fd' };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Attendance Risk Alert System</h4>
            <p className="text-muted small mb-0">AI identifies at-risk students and generates intervention strategies</p>
          </div>
          <button className="btn btn-outline-primary btn-sm" onClick={fetchRisk} style={{ borderRadius: 8 }}>
            Refresh Analysis
          </button>
        </div>

        {error && <div className="alert alert-danger py-2">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-muted">AI is analyzing attendance patterns...</p>
          </div>
        ) : data && (
          <>
            {/* Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: 12 }}>
                  <h3 className="fw-bold mb-0" style={{ color: '#1a237e' }}>{data.summary?.total || 0}</h3>
                  <p className="text-muted small mb-0">Total Students</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: 12, borderTop: '3px solid #c62828' }}>
                  <h3 className="fw-bold mb-0 text-danger">{data.summary?.atRisk || 0}</h3>
                  <p className="text-muted small mb-0">At Risk (&lt;75%)</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: 12, borderTop: '3px solid #2e7d32' }}>
                  <h3 className="fw-bold mb-0 text-success">{data.summary?.safe || 0}</h3>
                  <p className="text-muted small mb-0">Safe (&ge;75%)</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: 12 }}>
                  <h3 className="fw-bold mb-0" style={{ color: '#e65100' }}>
                    {data.summary?.total ? Math.round((data.summary.atRisk / data.summary.total) * 100) : 0}%
                  </h3>
                  <p className="text-muted small mb-0">Risk Rate</p>
                </div>
              </div>
            </div>

            {data.riskStudents?.length === 0 ? (
              <div className="card border-0 shadow-sm text-center py-5" style={{ borderRadius: 12 }}>
                <h5 className="text-success fw-bold">All students have healthy attendance!</h5>
                <p className="text-muted">No students are below the 75% threshold.</p>
              </div>
            ) : (
              <div className="row g-3">
                {/* Risk Students List */}
                <div className="col-12 col-lg-7">
                  <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>At-Risk Students</h6>
                      {data.riskStudents.map((s, i) => (
                        <div key={i} className="mb-3 p-3 rounded" style={{ background: riskBg[s.riskLevel] || '#f8f9fa' }}>
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div>
                              <p className="fw-bold mb-0 small">{s.name}</p>
                              <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{s.department} · {s.program} · Sem {s.semester}</p>
                            </div>
                            <span className={`badge bg-${riskColor[s.riskLevel]}`}>{s.riskLevel}</span>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <div className="progress flex-grow-1" style={{ height: 10, borderRadius: 8 }}>
                              <div className={`progress-bar bg-${riskColor[s.riskLevel]}`}
                                style={{ width: `${s.attendance}%`, borderRadius: 8 }} />
                            </div>
                            <span className="fw-bold small" style={{ minWidth: 45 }}>{s.attendance}%</span>
                          </div>
                          <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.72rem' }}>
                            {s.attendedClasses} / {s.totalClasses} classes attended
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="col-12 col-lg-5">
                  <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1a237e, #1565c0)' }}>
                    <div className="card-body p-4 text-white">
                      <h6 className="fw-bold mb-2">AI Assessment</h6>
                      <p className="opacity-75 small mb-0">{data.aiInsights?.overallRiskAssessment}</p>
                    </div>
                  </div>

                  {data.aiInsights?.interventionStrategies?.length > 0 && (
                    <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12 }}>
                      <div className="card-body p-4">
                        <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Intervention Strategies</h6>
                        {data.aiInsights.interventionStrategies.map((s, i) => (
                          <div key={i} className="d-flex gap-2 mb-2 p-2 rounded" style={{ background: '#f0f4ff' }}>
                            <span className="fw-bold" style={{ color: '#1a237e', minWidth: 20 }}>{i + 1}.</span>
                            <span className="small">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.aiInsights?.individualActions?.length > 0 && (
                    <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                      <div className="card-body p-4">
                        <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Individual Action Items</h6>
                        {data.aiInsights.individualActions.map((item, i) => (
                          <div key={i} className="mb-2 p-2 rounded" style={{ background: '#f8f9fa' }}>
                            <div className="d-flex justify-content-between mb-1">
                              <span className="fw-semibold small">{item.student}</span>
                              <span className={`badge bg-${riskColor[item.riskLevel] || 'secondary'}`} style={{ fontSize: '0.65rem' }}>{item.riskLevel}</span>
                            </div>
                            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>{item.suggestedAction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AttendanceRisk;
