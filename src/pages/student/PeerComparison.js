import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { studentAPI } from '../../services/api';
import axios from 'axios';

const PeerComparison = () => {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    studentAPI.getAll({ limit: 50 }).then(res => setStudents(res.data.students || []));
  }, []);

  const handleCompare = async () => {
    if (!selectedId) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.post('/ai/peer-comparison', { studentId: selectedId });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Comparison failed');
    } finally {
      setLoading(false);
    }
  };

  const perfColor = { 'Above Average': '#1b5e20', Average: '#1565c0', 'Below Average': '#c62828' };
  const barColors = ['#1a237e', '#1565c0', '#2e7d32'];

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Peer Comparison Analysis</h4>
          <p className="text-muted small">Compare student performance vs department average and top performer</p>
        </div>

        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-7">
                <label className="form-label fw-semibold small">Select Student</label>
                <select className="form-select" value={selectedId}
                  onChange={e => { setSelectedId(e.target.value); setResult(null); }} style={{ borderRadius: 8 }}>
                  <option value="">— Choose a student to compare —</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.user?.name} ({s.usn || 'No USN'}) — {s.department} · {s.program}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={handleCompare}
                  disabled={!selectedId || loading} style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Analyzing...</> : 'Compare with AI'}
                </button>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2 small mt-3">{error}</div>}
          </div>
        </div>

        {result && (
          <>
            {/* Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                  <p className="text-muted small mb-1">Department Rank</p>
                  <h2 className="fw-bold mb-0" style={{ color: '#1a237e' }}>#{result.comparison.rank}</h2>
                  <p className="text-muted small mb-0">of {result.comparison.totalStudents} students</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                  <p className="text-muted small mb-1">Percentile</p>
                  <h2 className="fw-bold mb-0" style={{ color: '#2e7d32' }}>{result.comparison.percentile}%</h2>
                  <p className="text-muted small mb-0">Better than peers</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                  <p className="text-muted small mb-1">vs Dept Average</p>
                  <h4 className="fw-bold mb-1" style={{ color: result.aiInsight?.gapFromAverage >= 0 ? '#1b5e20' : '#c62828' }}>
                    {result.aiInsight?.gapFromAverage >= 0 ? '+' : ''}{result.aiInsight?.gapFromAverage?.toFixed(2)}
                  </h4>
                  <span className="badge" style={{ background: perfColor[result.aiInsight?.performanceVsDept] || '#9e9e9e', color: 'white', fontSize: '0.65rem' }}>
                    {result.aiInsight?.performanceVsDept}
                  </span>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                  <p className="text-muted small mb-1">Gap from Topper</p>
                  <h4 className="fw-bold mb-0" style={{ color: '#c62828' }}>
                    {result.aiInsight?.gapFromTopper?.toFixed(2)}
                  </h4>
                  <p className="text-muted small mb-0">SGPA points</p>
                </div>
              </div>
            </div>

            <div className="row g-3">
              {/* Bar Chart */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>SGPA Comparison</h6>
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={result.chartData} barSize={50}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val) => [val, 'Avg SGPA']} />
                        <Bar dataKey="sgpa" radius={[6, 6, 0, 0]}>
                          {result.chartData.map((_, i) => <Cell key={i} fill={barColors[i]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    {/* Legend */}
                    <div className="d-flex justify-content-center gap-4 mt-2">
                      {result.chartData.map((d, i) => (
                        <div key={i} className="d-flex align-items-center gap-1" style={{ fontSize: '0.75rem' }}>
                          <div style={{ width: 12, height: 12, borderRadius: 3, background: barColors[i] }} />
                          <span>{d.name}: {d.sgpa}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="col-12 col-lg-6">
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1a237e, #1565c0)' }}>
                  <div className="card-body p-4 text-white">
                    <h6 className="fw-bold mb-2">AI Insight</h6>
                    <p className="opacity-75 small mb-0">{result.aiInsight?.insight}</p>
                  </div>
                </div>

                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12, background: '#e8f5e9' }}>
                  <div className="card-body p-3">
                    <p className="fw-semibold small mb-0" style={{ color: '#1b5e20' }}>
                      {result.aiInsight?.motivationalMessage}
                    </p>
                  </div>
                </div>

                <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Improvement Plan</h6>
                    {result.aiInsight?.improvementPlan?.map((step, i) => (
                      <div key={i} className="d-flex align-items-start gap-2 mb-2 p-2 rounded" style={{ background: '#f0f4ff' }}>
                        <span className="fw-bold rounded-circle d-flex align-items-center justify-content-center text-white"
                          style={{ minWidth: 22, height: 22, background: '#1a237e', fontSize: '0.7rem', flexShrink: 0 }}>{i + 1}</span>
                        <span className="small">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default PeerComparison;
