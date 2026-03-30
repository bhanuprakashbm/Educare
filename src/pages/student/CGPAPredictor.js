import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { studentAPI } from '../../services/api';
import axios from 'axios';

const CGPAPredictor = () => {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    studentAPI.getAll({ limit: 50 }).then(res => setStudents(res.data.students || []));
  }, []);

  const handlePredict = async () => {
    if (!selectedId) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.post('/ai/predict-cgpa', { studentId: selectedId });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  const trendColor = { Improving: '#2e7d32', Stable: '#1565c0', Declining: '#c62828' };
  const confidenceColor = { High: 'success', Medium: 'warning', Low: 'danger' };
  const readinessColor = { Ready: 'success', 'Needs Improvement': 'warning', 'At Risk': 'danger' };

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (payload.predicted) {
      return <circle cx={cx} cy={cy} r={8} fill="#ff9800" stroke="white" strokeWidth={2} />;
    }
    return <circle cx={cx} cy={cy} r={5} fill="#1a237e" stroke="white" strokeWidth={2} />;
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>CGPA Trend Predictor</h4>
          <p className="text-muted small">AI-powered semester performance prediction using historical academic data</p>
        </div>

        {/* Student Selector */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold small">Select Student</label>
                <select className="form-select" value={selectedId} onChange={e => { setSelectedId(e.target.value); setResult(null); }} style={{ borderRadius: 8 }}>
                  <option value="">— Choose a student to predict —</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.user?.name} ({s.usn || 'No USN'}) — {s.program} · Sem {s.currentSemester}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={handlePredict}
                  disabled={!selectedId || loading} style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Predicting...</> : 'Predict with AI'}
                </button>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2 small mt-3">{error}</div>}
          </div>
        </div>

        {result && (
          <>
            {/* Prediction Summary Cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                  <p className="text-muted small mb-1">Predicted SGPA</p>
                  <h3 className="fw-bold mb-0" style={{ color: '#1a237e' }}>{result.prediction.predictedSGPA}</h3>
                  <p className="text-muted small mb-0">Next Semester</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                  <p className="text-muted small mb-1">Predicted CGPA</p>
                  <h3 className="fw-bold mb-0" style={{ color: '#1565c0' }}>{result.prediction.predictedCGPA}</h3>
                  <p className="text-muted small mb-0">Cumulative</p>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                  <p className="text-muted small mb-1">Trend</p>
                  <h5 className="fw-bold mb-1" style={{ color: trendColor[result.prediction.trend] }}>
                    {result.prediction.trend === 'Improving' ? '↑' : result.prediction.trend === 'Declining' ? '↓' : '→'} {result.prediction.trend}
                  </h5>
                  <span className={`badge bg-${confidenceColor[result.prediction.confidence]}`} style={{ fontSize: '0.7rem' }}>
                    {result.prediction.confidence} Confidence
                  </span>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                  <p className="text-muted small mb-1">Graduation CGPA</p>
                  <h3 className="fw-bold mb-0" style={{ color: '#0288d1' }}>{result.prediction.graduationCGPAPrediction}</h3>
                  <span className={`badge bg-${readinessColor[result.prediction.placementReadiness] || 'secondary'}`} style={{ fontSize: '0.65rem' }}>
                    {result.prediction.placementReadiness}
                  </span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-bold mb-0" style={{ color: '#1a237e' }}>
                    Performance Trend — {result.student?.name}
                  </h6>
                  <div className="d-flex gap-3 align-items-center" style={{ fontSize: '0.75rem' }}>
                    <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#1a237e', marginRight: 4 }} />Actual</span>
                    <span><span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: '50%', background: '#ff9800', marginRight: 4 }} />Predicted</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={result.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="semester" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val, name) => [val, name === 'sgpa' ? 'SGPA' : 'CGPA']} />
                    <Legend formatter={(val) => val === 'sgpa' ? 'SGPA' : 'CGPA'} />
                    <ReferenceLine y={7} stroke="#e65100" strokeDasharray="4 4" label={{ value: 'Min Target (7.0)', fontSize: 10, fill: '#e65100' }} />
                    <Line type="monotone" dataKey="sgpa" stroke="#1a237e" strokeWidth={2.5} dot={<CustomDot />} connectNulls />
                    <Line type="monotone" dataKey="cgpa" stroke="#0288d1" strokeWidth={2} strokeDasharray={result.chartData.some(d => d.predicted) ? "0" : "0"} dot={<CustomDot />} connectNulls />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="row g-3">
              {/* Trend Analysis */}
              <div className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>AI Trend Analysis</h6>
                    <p className="text-muted small">{result.prediction.trendAnalysis}</p>
                    <p className="fw-semibold small mb-2">Key Factors:</p>
                    {result.prediction.keyFactors?.map((f, i) => (
                      <div key={i} className="d-flex gap-2 mb-1">
                        <span style={{ color: '#1a237e' }}>&#8594;</span>
                        <span className="small">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Suggestions */}
              <div className="col-12 col-md-6">
                <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>AI Suggestions</h6>
                    {result.prediction.suggestions?.map((s, i) => (
                      <div key={i} className="d-flex align-items-start gap-2 mb-2 p-2 rounded" style={{ background: '#f0f4ff' }}>
                        <span className="fw-bold" style={{ color: '#1a237e', minWidth: 20 }}>{i + 1}.</span>
                        <span className="small">{s}</span>
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

export default CGPAPredictor;
