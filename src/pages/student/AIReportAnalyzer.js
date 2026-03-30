import { useState } from 'react';
import Navbar from '../../components/Navbar';
import axios from 'axios';

const AIReportAnalyzer = () => {
  const [form, setForm] = useState({ reportText: '', studentName: '', department: '', program: '', semester: '' });
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setAnalysis(null); setLoading(true);
    try {
      const res = await axios.post('/ai/analyze-report', form);
      setAnalysis(res.data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || 'AI analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const riskColor = { Low: 'success', Medium: 'warning', High: 'danger' };
  const gradeColor = { A: '#1b5e20', B: '#1565c0', C: '#e65100', D: '#b71c1c', F: '#b71c1c' };
  const priorityColor = { High: 'danger', Medium: 'warning', Low: 'success' };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>AI Academic Report Analyzer</h4>
          <p className="text-muted small">Paste student academic data — Gemini AI generates deep insights, risk assessment & action plan</p>
        </div>

        <div className="row g-4">
          {/* Input Panel */}
          <div className={`col-12 ${analysis ? 'col-lg-4' : 'col-lg-6 offset-lg-3'}`}>
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Student Information</h6>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-2 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Student Name</label>
                      <input name="studentName" className="form-control form-control-sm" placeholder="Full name"
                        value={form.studentName} onChange={handleChange} style={{ borderRadius: 8 }} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Semester</label>
                      <select name="semester" className="form-select form-select-sm" value={form.semester} onChange={handleChange} style={{ borderRadius: 8 }}>
                        <option value="">Select</option>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Department</label>
                      <input name="department" className="form-control form-control-sm" placeholder="e.g. MCA"
                        value={form.department} onChange={handleChange} style={{ borderRadius: 8 }} />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-semibold">Program</label>
                      <input name="program" className="form-control form-control-sm" placeholder="e.g. MCA, B.E"
                        value={form.program} onChange={handleChange} style={{ borderRadius: 8 }} />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Academic Report / Data *</label>
                    <textarea name="reportText" className="form-control" rows={10}
                      placeholder={`Paste student academic data here. Examples:\n- Subject marks: Math 85/100, DS 78/100, DBMS 92/100\n- SGPA: 8.4, CGPA: 8.1, Backlogs: 0\n- Attendance: 82%\n- Semester 1: 8.2 SGPA, Semester 2: 8.7 SGPA\n- Placed at Infosys, 4.5 LPA\n\nThe more data you provide, the better the analysis!`}
                      value={form.reportText} onChange={handleChange} required
                      style={{ borderRadius: 8, fontSize: '0.85rem' }} />
                  </div>
                  <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold"
                    disabled={loading} style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Gemini AI is analyzing...</>
                    ) : 'Analyze with Gemini AI'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="col-12 col-lg-8">
              {/* Header Card */}
              <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1a237e, #1565c0)' }}>
                <div className="card-body p-4 text-white">
                  <div className="row align-items-center">
                    <div className="col-8">
                      <p className="opacity-75 small mb-1">{form.studentName || 'Student'} · {form.department} · {form.program}</p>
                      <h5 className="fw-bold mb-1">{analysis.headline || analysis.performanceSummary?.slice(0, 60)}</h5>
                      <p className="opacity-75 small mb-0">{analysis.performanceSummary}</p>
                    </div>
                    <div className="col-4 text-end">
                      <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: gradeColor[analysis.overallGrade] || 'white', background: 'rgba(255,255,255,0.95)', borderRadius: 12, padding: '0.5rem 1rem', display: 'inline-block' }}>
                        {analysis.overallGrade}
                      </div>
                      <p className="mt-2 mb-0 small opacity-75">Overall Grade</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-3">
                {/* Risk Level */}
                <div className="col-6 col-lg-3">
                  <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                    <p className="text-muted small mb-1">Risk Level</p>
                    <span className={`badge bg-${riskColor[analysis.riskLevel] || 'secondary'} px-3 py-2`} style={{ fontSize: '0.9rem' }}>
                      {analysis.riskLevel}
                    </span>
                  </div>
                </div>
                {/* Predicted CGPA */}
                <div className="col-6 col-lg-3">
                  <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                    <p className="text-muted small mb-1">Predicted CGPA</p>
                    <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>{analysis.predictedNextSemesterCGPA}</h4>
                  </div>
                </div>
                {/* Scholarship */}
                <div className="col-6 col-lg-3">
                  <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                    <p className="text-muted small mb-1">Scholarship</p>
                    <span className={`badge bg-${analysis.scholarshipEligibility ? 'success' : 'secondary'} px-3 py-2`} style={{ fontSize: '0.85rem' }}>
                      {analysis.scholarshipEligibility ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </div>
                </div>
                {/* Academic Standing */}
                <div className="col-6 col-lg-3">
                  <div className="card border-0 shadow-sm text-center p-3 h-100" style={{ borderRadius: 12 }}>
                    <p className="text-muted small mb-1">Standing</p>
                    <p className="fw-bold small mb-0" style={{ color: '#1a237e' }}>{analysis.academicStanding || 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-3">
                {/* Strengths */}
                <div className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#1b5e20' }}>Strengths</h6>
                      {analysis.strengths?.map((s, i) => (
                        <div key={i} className="d-flex align-items-start gap-2 mb-2">
                          <span className="text-success fw-bold mt-1">&#10003;</span>
                          <span className="small">{s}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Weaknesses */}
                <div className="col-12 col-md-6">
                  <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                    <div className="card-body p-4">
                      <h6 className="fw-bold mb-3" style={{ color: '#b71c1c' }}>Areas of Concern</h6>
                      {analysis.weaknesses?.map((w, i) => (
                        <div key={i} className="d-flex align-items-start gap-2 mb-2">
                          <span className="text-danger fw-bold mt-1">&#9888;</span>
                          <span className="small">{w}</span>
                        </div>
                      ))}
                      {analysis.riskFactors?.length > 0 && (
                        <>
                          <p className="text-muted small fw-semibold mt-3 mb-2">Risk Factors</p>
                          {analysis.riskFactors.map((r, i) => (
                            <div key={i} className="d-flex align-items-start gap-2 mb-1">
                              <span className="text-warning fw-bold mt-1">&#9679;</span>
                              <span className="small">{r}</span>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Plan */}
              {analysis.actionPlan?.length > 0 && (
                <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12 }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>AI-Generated Action Plan</h6>
                    {analysis.actionPlan.map((item, i) => (
                      <div key={i} className="d-flex align-items-start gap-3 mb-3 p-3 rounded" style={{ background: '#f8f9fa' }}>
                        <span className={`badge bg-${priorityColor[item.priority] || 'secondary'} mt-1`} style={{ minWidth: 60, textAlign: 'center' }}>{item.priority}</span>
                        <div className="flex-grow-1">
                          <p className="fw-semibold small mb-0">{item.action}</p>
                          <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Timeline: {item.timeline}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Suitability */}
              {analysis.careerSuitability?.length > 0 && (
                <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Career Suitability</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {analysis.careerSuitability.map((c, i) => (
                        <span key={i} className="badge px-3 py-2" style={{ background: '#e8eaf6', color: '#1a237e', fontSize: '0.85rem' }}>{c}</span>
                      ))}
                    </div>
                    {analysis.recommendations?.length > 0 && (
                      <div className="mt-3">
                        <p className="fw-semibold small mb-2">Recommendations</p>
                        {analysis.recommendations.map((r, i) => (
                          <div key={i} className="d-flex gap-2 mb-1">
                            <span style={{ color: '#1a237e' }}>&#8594;</span>
                            <span className="small">{r}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AIReportAnalyzer;
