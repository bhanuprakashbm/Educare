import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { studentAPI } from '../../services/api';
import axios from 'axios';

const PerformanceCard = () => {
  const [students, setStudents] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    studentAPI.getAll({ limit: 50 }).then(res => setStudents(res.data.students || []));
  }, []);

  const handleGenerate = async () => {
    if (!selectedId) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.post('/ai/performance-card', { studentId: selectedId });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate performance card');
    } finally {
      setLoading(false);
    }
  };

  const ratingColor = {
    Excellent: '#1b5e20', Good: '#1565c0', Average: '#e65100',
    'Below Average': '#b71c1c', Poor: '#b71c1c',
  };

  const ratingBg = {
    Excellent: '#e8f5e9', Good: '#e8eaf6', Average: '#fff3e0',
    'Below Average': '#ffebee', Poor: '#ffebee',
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Smart Performance Card</h4>
          <p className="text-muted small">AI generates a comprehensive performance card for any student</p>
        </div>

        {/* Selector */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
          <div className="card-body p-4">
            <div className="row g-3 align-items-end">
              <div className="col-12 col-md-7">
                <label className="form-label fw-semibold small">Select Student</label>
                <select className="form-select" value={selectedId}
                  onChange={e => { setSelectedId(e.target.value); setResult(null); }} style={{ borderRadius: 8 }}>
                  <option value="">— Choose a student —</option>
                  {students.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.user?.name} ({s.usn || 'No USN'}) — {s.department} · {s.program}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-3">
                <button className="btn btn-primary w-100 py-2 fw-semibold" onClick={handleGenerate}
                  disabled={!selectedId || loading} style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
                  {loading ? <><span className="spinner-border spinner-border-sm me-2" />Generating...</> : 'Generate AI Card'}
                </button>
              </div>
            </div>
            {error && <div className="alert alert-danger py-2 small mt-3">{error}</div>}
          </div>
        </div>

        {result && (
          <div className="row g-3">
            {/* Performance Card */}
            <div className="col-12 col-lg-8">
              {/* Header */}
              <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ background: 'linear-gradient(135deg, #1a237e, #1565c0)', padding: '2rem' }}>
                  <div className="d-flex justify-content-between align-items-start text-white">
                    <div>
                      <h4 className="fw-bold mb-1">{result.student.name}</h4>
                      <p className="opacity-75 mb-1 small">{result.student.usn} · {result.student.institution}</p>
                      <p className="opacity-75 mb-1 small">{result.student.department} · {result.student.program} · Batch {result.student.batch}</p>
                      <p className="opacity-75 mb-0 small">{result.student.email}</p>
                    </div>
                    <div className="text-center">
                      <div style={{ background: ratingBg[result.aiCard.performanceRating], borderRadius: 12, padding: '0.75rem 1.25rem' }}>
                        <div style={{ fontSize: '1.8rem', fontWeight: 900, color: ratingColor[result.aiCard.performanceRating], lineHeight: 1 }}>
                          {result.aiCard.ratingScore}/100
                        </div>
                        <div style={{ color: ratingColor[result.aiCard.performanceRating], fontWeight: 700, fontSize: '0.8rem', marginTop: 4 }}>
                          {result.aiCard.performanceRating}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 p-3 rounded text-white" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <p className="small fw-semibold mb-1 opacity-75">AI HEADLINE</p>
                    <p className="mb-0 fw-bold">{result.aiCard.headline}</p>
                  </div>
                </div>
                {/* Stats Row */}
                <div className="row g-0 border-top">
                  {[
                    { label: 'Avg SGPA', value: result.student.avgSGPA },
                    { label: 'Latest CGPA', value: result.student.latestCGPA },
                    { label: 'Attendance', value: `${result.student.attendance}%` },
                    { label: 'Backlogs', value: result.student.totalBacklogs },
                    { label: 'Semester', value: `Sem ${result.student.semester}` },
                    { label: 'Schemes', value: result.student.schemes },
                  ].map(({ label, value }) => (
                    <div key={label} className="col-4 col-md-2 text-center p-3 border-end">
                      <div className="fw-bold" style={{ color: '#1a237e' }}>{value}</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-2" style={{ color: '#1a237e' }}>AI Summary</h6>
                  <p className="text-muted small mb-3">{result.aiCard.summary}</p>
                  <div className="p-3 rounded" style={{ background: '#e8f5e9', borderLeft: '4px solid #2e7d32' }}>
                    <p className="fw-semibold small mb-0" style={{ color: '#1b5e20' }}>{result.aiCard.overallVerdict}</p>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                {/* Key Highlights */}
                <div className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#1b5e20' }}>Key Highlights</h6>
                      {result.aiCard.keyHighlights?.map((h, i) => (
                        <div key={i} className="d-flex gap-2 mb-2">
                          <span className="text-success fw-bold">&#10003;</span>
                          <span className="small">{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Areas of Concern */}
                <div className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#b71c1c' }}>Areas of Concern</h6>
                      {result.aiCard.areasOfConcern?.length > 0 ? result.aiCard.areasOfConcern.map((c, i) => (
                        <div key={i} className="d-flex gap-2 mb-2">
                          <span className="text-danger fw-bold">&#9888;</span>
                          <span className="small">{c}</span>
                        </div>
                      )) : <p className="text-muted small">No major concerns identified.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-12 col-lg-4">
              {/* Career Recommendations */}
              <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Career Recommendations</h6>
                  {result.aiCard.careerRecommendations?.map((r, i) => (
                    <div key={i} className="d-flex gap-2 mb-2 p-2 rounded" style={{ background: '#f0f4ff' }}>
                      <span style={{ color: '#1a237e' }}>&#8594;</span>
                      <span className="small">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Next Steps</h6>
                  {result.aiCard.nextSteps?.map((s, i) => (
                    <div key={i} className="d-flex align-items-start gap-2 mb-2 p-2 rounded" style={{ background: '#f8f9fa' }}>
                      <span className="fw-bold rounded-circle d-flex align-items-center justify-content-center text-white"
                        style={{ minWidth: 22, height: 22, background: '#1a237e', fontSize: '0.7rem' }}>{i + 1}</span>
                      <span className="small">{s}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Standing */}
              <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-body p-4 text-center">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Academic Standing</h6>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: ratingColor[result.aiCard.performanceRating] }}>
                    {result.aiCard.ratingScore}
                  </div>
                  <div className="text-muted small">out of 100</div>
                  <div className="progress mt-3" style={{ height: 12, borderRadius: 8 }}>
                    <div className="progress-bar" style={{ width: `${result.aiCard.ratingScore}%`, background: ratingColor[result.aiCard.performanceRating], borderRadius: 8 }} />
                  </div>
                  <div className="mt-2">
                    <span className="badge px-3 py-2" style={{ background: ratingBg[result.aiCard.performanceRating], color: ratingColor[result.aiCard.performanceRating], fontSize: '0.85rem' }}>
                      {result.aiCard.academicStanding}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PerformanceCard;
