import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { facultyAPI } from '../../services/api';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

// ── Colour helpers ────────────────────────────────────────────
const gradeColor = { Outstanding: '#1b5e20', 'Very Good': '#1565c0', Good: '#0288d1', Average: '#e65100', 'Below Average': '#b71c1c' };

// ── Sub-component: APAR Score Generator Tab ──────────────────
const APARGeneratorTab = () => {
  const [form, setForm] = useState({
    name: '', designation: 'Assistant Professor', department: '',
    teachingHours: 16, studentsHandled: 60, publications: 3,
    patents: 0, projects: 0, feedbackScore: 8,
    workshopsAttended: 2, workshopsConducted: 1,
    yearsExperience: 5, adminWork: '', extraCurricular: '',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fc = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setResult(null); setLoading(true);
    try {
      const res = await axios.post('/ai/apar-score', form);
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.message || 'AI analysis failed'); }
    finally { setLoading(false); }
  };

  const radarData = result ? [
    { subject: 'Teaching (40)', score: result.apariResult?.parameters?.teachingLearning?.score || 0, max: 40 },
    { subject: 'Research (30)', score: result.apariResult?.parameters?.research?.score || 0, max: 30 },
    { subject: 'Admin (15)', score: result.apariResult?.parameters?.administration?.score || 0, max: 15 },
    { subject: 'Development (15)', score: result.apariResult?.parameters?.professionalDevelopment?.score || 0, max: 15 },
  ] : [];

  return (
    <div className="row g-3">
      <div className={`col-12 ${result ? 'col-lg-4' : 'col-lg-6 offset-lg-3'}`}>
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Faculty Details for APAR Evaluation</h6>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-2">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Faculty Name *</label>
                  <input name="name" className="form-control form-control-sm" value={form.name} onChange={fc} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Designation</label>
                  <select name="designation" className="form-select form-select-sm" value={form.designation} onChange={fc}>
                    {['Professor','Associate Professor','Assistant Professor','Lecturer','HOD'].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Department *</label>
                  <input name="department" className="form-control form-control-sm" value={form.department} onChange={fc} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Years of Experience</label>
                  <input name="yearsExperience" type="number" className="form-control form-control-sm" value={form.yearsExperience} onChange={fc} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Teaching Hours/Week</label>
                  <input name="teachingHours" type="number" className="form-control form-control-sm" value={form.teachingHours} onChange={fc} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Students Handled</label>
                  <input name="studentsHandled" type="number" className="form-control form-control-sm" value={form.studentsHandled} onChange={fc} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Feedback Score /10</label>
                  <input name="feedbackScore" type="number" step="0.1" min="0" max="10" className="form-control form-control-sm" value={form.feedbackScore} onChange={fc} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Publications</label>
                  <input name="publications" type="number" className="form-control form-control-sm" value={form.publications} onChange={fc} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Patents</label>
                  <input name="patents" type="number" className="form-control form-control-sm" value={form.patents} onChange={fc} />
                </div>
                <div className="col-md-4">
                  <label className="form-label small fw-semibold">Funded Projects</label>
                  <input name="projects" type="number" className="form-control form-control-sm" value={form.projects} onChange={fc} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">FDPs Attended</label>
                  <input name="workshopsAttended" type="number" className="form-control form-control-sm" value={form.workshopsAttended} onChange={fc} />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">FDPs Conducted</label>
                  <input name="workshopsConducted" type="number" className="form-control form-control-sm" value={form.workshopsConducted} onChange={fc} />
                </div>
                <div className="col-12">
                  <label className="form-label small fw-semibold">Administrative Work</label>
                  <input name="adminWork" className="form-control form-control-sm" placeholder="e.g. Exam coordinator, HOD" value={form.adminWork} onChange={fc} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3 py-2 fw-semibold"
                disabled={loading} style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Generating APAR Score...</> : 'Generate AI APAR Score'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {result && (
        <div className="col-12 col-lg-8">
          {/* Score Banner */}
          <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1a237e, #1565c0)' }}>
            <div className="card-body p-4 text-white d-flex justify-content-between align-items-center">
              <div>
                <p className="opacity-75 small mb-1">{result.faculty?.name} · {result.faculty?.designation} · {result.faculty?.department}</p>
                <h2 className="fw-bold mb-1">{result.apariResult?.overallAPARScore}/100</h2>
                <span className="badge px-3 py-2" style={{ background: gradeColor[result.apariResult?.grade] || '#666', fontSize: '0.9rem' }}>
                  {result.apariResult?.grade}
                </span>
                <p className="opacity-75 small mt-2 mb-0">{result.apariResult?.summary}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: 80, height: 80, background: 'rgba(255,255,255,0.15)', fontSize: '2rem', fontWeight: 900 }}>
                  {result.apariResult?.overallAPARScore}
                </div>
                <div className="mt-2">
                  <span className={`badge ${result.apariResult?.promotionEligibility ? 'bg-success' : 'bg-warning text-dark'}`}>
                    {result.apariResult?.promotionEligibility ? 'Promotion Eligible' : 'Not Yet Eligible'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-3">
            {/* Radar Chart */}
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Parameter Breakdown</h6>
                  <ResponsiveContainer width="100%" height={220}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                      <PolarRadiusAxis tick={{ fontSize: 9 }} />
                      <Radar dataKey="score" stroke="#1a237e" fill="#1a237e" fillOpacity={0.3} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Parameter Scores */}
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Detailed Scores</h6>
                  {result.apariResult?.parameters && Object.entries(result.apariResult.parameters).map(([key, val]) => (
                    <div key={key} className="mb-3">
                      <div className="d-flex justify-content-between mb-1">
                        <span className="small fw-semibold text-muted text-capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="small fw-bold" style={{ color: '#1a237e' }}>{val.score}/{val.maxScore}</span>
                      </div>
                      <div className="progress" style={{ height: 8, borderRadius: 8 }}>
                        <div className="progress-bar" style={{ width: `${(val.score / val.maxScore) * 100}%`, background: '#1a237e', borderRadius: 8 }} />
                      </div>
                      <p className="text-muted mb-0 mt-1" style={{ fontSize: '0.72rem' }}>{val.remarks}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-2" style={{ color: '#1b5e20' }}>Strengths</h6>
                  {result.apariResult?.strengths?.map((s, i) => (
                    <div key={i} className="d-flex gap-2 mb-1"><span className="text-success">&#10003;</span><span className="small">{s}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-2" style={{ color: '#b71c1c' }}>Areas for Improvement</h6>
                  {result.apariResult?.areasForImprovement?.map((a, i) => (
                    <div key={i} className="d-flex gap-2 mb-1"><span className="text-danger">&#9888;</span><span className="small">{a}</span></div>
                  ))}
                  <h6 className="fw-bold mb-2 mt-3" style={{ color: '#1a237e' }}>Recommendations</h6>
                  {result.apariResult?.recommendations?.map((r, i) => (
                    <div key={i} className="d-flex gap-2 mb-1"><span style={{ color: '#1a237e' }}>&#8594;</span><span className="small">{r}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Sub-component: Faculty List Tab ──────────────────────────
const FacultyListTab = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    user: '', aparId: '', employeeId: '', department: '', designation: 'Assistant Professor', status: 'active',
  });

  useEffect(() => { fetchFaculty(); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await facultyAPI.getAll({ page, limit: 10 });
      setFaculty(res.data.faculty);
      setTotal(res.data.total);
      setTotalPages(res.data.totalPages);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    try {
      await facultyAPI.create(formData);
      setSuccess('Faculty created!'); setShowModal(false);
      setFormData({ user: '', aparId: '', employeeId: '', department: '', designation: 'Assistant Professor', status: 'active' });
      fetchFaculty();
    } catch (err) { setError(err.response?.data?.message || 'Failed'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this faculty member?')) return;
    try { await facultyAPI.delete(id); fetchFaculty(); }
    catch (err) { alert(err.response?.data?.message || 'Failed'); }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted small mb-0">Total: {total} faculty members</p>
        <button className="btn btn-primary btn-sm" onClick={() => setShowModal(true)}
          style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>+ Add Faculty</button>
      </div>
      {success && <div className="alert alert-success py-2 small">{success}</div>}
      <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
        <div className="card-body p-0">
          {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" /></div> : (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead style={{ background: '#e8eaf6' }}>
                  <tr>
                    <th className="py-3 px-4">Name</th><th>APAR ID</th><th>Department</th>
                    <th>Designation</th><th>APAR Score</th><th>Publications</th><th>Status</th><th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faculty.length === 0 ? (
                    <tr><td colSpan={8} className="text-center py-5 text-muted">No faculty found. Add your first faculty member!</td></tr>
                  ) : faculty.map((f) => (
                    <tr key={f._id}>
                      <td className="px-4 py-3 fw-semibold">{f.user?.name || '—'}</td>
                      <td><code>{f.aparId}</code></td>
                      <td>{f.department}</td>
                      <td><span className="badge bg-light text-dark border">{f.designation}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <div className="progress flex-grow-1" style={{ height: 6 }}>
                            <div className="progress-bar" style={{ width: `${f.performance?.overallAPARScore || 0}%`, background: '#1a237e' }} />
                          </div>
                          <small className="fw-bold">{f.performance?.overallAPARScore || 0}</small>
                        </div>
                      </td>
                      <td>{f.publications?.length || 0}</td>
                      <td><span className={`badge ${f.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>{f.status}</span></td>
                      <td><button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f._id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        {totalPages > 1 && (
          <div className="card-footer bg-white d-flex justify-content-between align-items-center px-4 py-3">
            <button className="btn btn-sm btn-outline-primary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Prev</button>
            <span className="text-muted small">Page {page} of {totalPages}</span>
            <button className="btn btn-sm btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next</button>
          </div>
        )}
      </div>
      {showModal && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0" style={{ borderRadius: 12 }}>
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold" style={{ color: '#1a237e' }}>Add New Faculty</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label small fw-semibold">User ID</label>
                      <input name="user" className="form-control" placeholder="MongoDB User ID"
                        value={formData.user} onChange={e => setFormData({ ...formData, user: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">APAR ID</label>
                      <input name="aparId" className="form-control" placeholder="APAR ID"
                        value={formData.aparId} onChange={e => setFormData({ ...formData, aparId: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Employee ID</label>
                      <input name="employeeId" className="form-control" placeholder="Employee ID"
                        value={formData.employeeId} onChange={e => setFormData({ ...formData, employeeId: e.target.value })} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Department</label>
                      <input name="department" className="form-control" placeholder="Department"
                        value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold">Designation</label>
                      <select name="designation" className="form-select" value={formData.designation}
                        onChange={e => setFormData({ ...formData, designation: e.target.value })}>
                        {['Professor','Associate Professor','Assistant Professor','Lecturer','HOD','Principal','Director'].map(d => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="d-flex gap-2 justify-content-end mt-4">
                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary" style={{ background: '#1a237e', border: 'none' }}>Create Faculty</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -- Sub-component: Research Impact Analyzer Tab --------------
const ResearchAnalyzerTab = () => {
  const [form, setForm] = useState({ name: '', department: '' });
  const [pubs, setPubs] = useState([{ title: '', journal: '', year: 2024, impactFactor: '', type: 'journal' }]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addPub = () => setPubs([...pubs, { title: '', journal: '', year: 2024, impactFactor: '', type: 'journal' }]);
  const removePub = (i) => setPubs(pubs.filter((_, idx) => idx !== i));
  const updatePub = (i, field, val) => setPubs(pubs.map((p, idx) => idx === i ? { ...p, [field]: val } : p));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setResult(null); setLoading(true);
    try {
      const res = await axios.post('/ai/research-impact', { ...form, publications: pubs.filter(p => p.title) });
      setResult(res.data);
    } catch (err) { setError(err.response?.data?.message || 'Analysis failed'); }
    finally { setLoading(false); }
  };

  const impactColor = { High: '#1b5e20', Medium: '#e65100', Low: '#b71c1c' };

  return (
    <div className="row g-3">
      <div className={`col-12 ${result ? 'col-lg-5' : 'col-lg-7 offset-lg-2'}`}>
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div className="card-body p-4">
            <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Research Publications Input</h6>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-2 mb-3">
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Faculty Name *</label>
                  <input className="form-control form-control-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label small fw-semibold">Department *</label>
                  <input className="form-control form-control-sm" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required />
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="form-label small fw-semibold mb-0">Publications ({pubs.length})</label>
                <button type="button" className="btn btn-outline-primary btn-sm" onClick={addPub} style={{ borderRadius: 6, fontSize: '0.75rem' }}>+ Add</button>
              </div>
              <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                {pubs.map((p, i) => (
                  <div key={i} className="p-2 mb-2 rounded border" style={{ background: '#f8f9fa' }}>
                    <div className="row g-1">
                      <div className="col-12">
                        <input className="form-control form-control-sm" placeholder="Publication title *" value={p.title} onChange={e => updatePub(i, 'title', e.target.value)} />
                      </div>
                      <div className="col-6">
                        <input className="form-control form-control-sm" placeholder="Journal/Conference" value={p.journal} onChange={e => updatePub(i, 'journal', e.target.value)} />
                      </div>
                      <div className="col-3">
                        <input type="number" className="form-control form-control-sm" placeholder="Year" value={p.year} onChange={e => updatePub(i, 'year', e.target.value)} />
                      </div>
                      <div className="col-3">
                        <input type="number" step="0.1" className="form-control form-control-sm" placeholder="IF" value={p.impactFactor} onChange={e => updatePub(i, 'impactFactor', e.target.value)} />
                      </div>
                      <div className="col-8">
                        <select className="form-select form-select-sm" value={p.type} onChange={e => updatePub(i, 'type', e.target.value)}>
                          {['journal','conference','book','patent'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-4">
                        {pubs.length > 1 && <button type="button" className="btn btn-outline-danger btn-sm w-100" onClick={() => removePub(i)} style={{ fontSize: '0.7rem' }}>Remove</button>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary w-100 mt-3 py-2 fw-semibold"
                disabled={loading} style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
                {loading ? <><span className="spinner-border spinner-border-sm me-2" />Analyzing Research...</> : 'Analyze Research Impact'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {result && (
        <div className="col-12 col-lg-7">
          <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1a237e, #1565c0)' }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="opacity-75 small mb-1">{result.faculty?.name} � {result.faculty?.department}</p>
                  <h4 className="fw-bold mb-1">Impact Score: {result.impact?.overallImpactScore}/100</h4>
                  <span className="badge px-3 py-2 me-2" style={{ background: impactColor[result.impact?.impactLevel] || '#666' }}>{result.impact?.impactLevel} Impact</span>
                  <p className="opacity-75 small mt-2 mb-0">{result.impact?.summary}</p>
                </div>
                <div className="text-end">
                  <div className="small opacity-75">H-Index Est.</div>
                  <div style={{ fontSize: '2rem', fontWeight: 900 }}>{result.impact?.hIndexEstimate}</div>
                  <div className="small opacity-75">~{result.impact?.totalCitationsEstimate} citations</div>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-2" style={{ color: '#1a237e', fontSize: '0.85rem' }}>Research Themes</h6>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {result.impact?.researchThemes?.map((t, i) => <span key={i} className="badge px-2" style={{ background: '#e8eaf6', color: '#1a237e', fontSize: '0.75rem' }}>{t}</span>)}
                  </div>
                  <h6 className="fw-bold mb-2" style={{ color: '#1b5e20', fontSize: '0.85rem' }}>Strengths</h6>
                  {result.impact?.researchStrengths?.map((s, i) => <div key={i} className="d-flex gap-1 mb-1"><span className="text-success small">&#10003;</span><span style={{ fontSize: '0.78rem' }}>{s}</span></div>)}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-2" style={{ color: '#1a237e', fontSize: '0.85rem' }}>Funding Opportunities</h6>
                  {result.impact?.fundingOpportunities?.map((f, i) => <div key={i} className="d-flex gap-1 mb-1"><span style={{ color: '#1a237e' }}>&#8594;</span><span style={{ fontSize: '0.78rem' }}>{f}</span></div>)}
                  <h6 className="fw-bold mb-2 mt-3" style={{ color: '#e65100', fontSize: '0.85rem' }}>Improvement Areas</h6>
                  {result.impact?.improvementAreas?.map((a, i) => <div key={i} className="d-flex gap-1 mb-1"><span className="text-warning">&#9888;</span><span style={{ fontSize: '0.78rem' }}>{a}</span></div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// -- Sub-component: Workload Visualizer Tab -------------------
const WorkloadVisualizerTab = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const COLORS = ['#1a237e', '#1565c0', '#0288d1', '#00838f', '#2e7d32'];

  const fetchWorkload = async () => {
    setLoading(true); setError('');
    try {
      const res = await axios.get('/ai/faculty-workload');
      setData(res.data);
    } catch (err) { setError(err.response?.data?.message || 'Failed to fetch workload data'); }
    finally { setLoading(false); }
  };

  const balanceColor = { 'Well Balanced': 'success', 'Moderately Balanced': 'warning', 'Imbalanced': 'danger' };

  return (
    <div>
      <div className="text-center mb-4">
        <button className="btn btn-primary px-5 py-2 fw-semibold" onClick={fetchWorkload}
          disabled={loading} style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
          {loading ? <><span className="spinner-border spinner-border-sm me-2" />AI Analyzing Workload...</> : 'Run AI Workload Analysis'}
        </button>
        <p className="text-muted small mt-2">Analyzes all active faculty and generates AI-powered workload insights</p>
      </div>
      {error && <div className="alert alert-danger py-2">{error}</div>}
      {data && (
        <>
          <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1a237e, #1565c0)' }}>
            <div className="card-body p-4 text-white d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-1">AI Workload Assessment</h6>
                <p className="opacity-75 small mb-2">{data.aiInsights?.overallAssessment}</p>
                <span className={`badge bg-${balanceColor[data.aiInsights?.workloadBalance] || 'secondary'} px-3 py-2`}>{data.aiInsights?.workloadBalance}</span>
              </div>
              <div className="text-center">
                <div style={{ fontSize: '2.5rem', fontWeight: 900 }}>{data.totalFaculty}</div>
                <div className="opacity-75 small">Active Faculty</div>
              </div>
            </div>
          </div>
          <div className="row g-3 mb-4">
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>APAR Score by Faculty</h6>
                  {data.workloadData?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={data.workloadData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        <Tooltip content={({ active, payload }) => active && payload?.length ? (
                          <div className="bg-white border rounded p-2 shadow-sm" style={{ fontSize: '0.75rem' }}>
                            <p className="fw-bold mb-1">{payload[0]?.payload?.fullName}</p>
                            <p className="mb-0">APAR: {payload[0]?.value}</p>
                            <p className="mb-0 text-muted">{payload[0]?.payload?.designation}</p>
                          </div>
                        ) : null} />
                        <Bar dataKey="aparScore" radius={[4,4,0,0]}>
                          {data.workloadData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p className="text-muted text-center py-4">No faculty data available</p>}
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Department-wise Faculty & Avg APAR</h6>
                  {data.deptChartData?.length > 0 ? (
                    <ResponsiveContainer width="100%" height={240}>
                      <BarChart data={data.deptChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="department" tick={{ fontSize: 9 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <Tooltip />
                        <Bar dataKey="faculty" name="Faculty Count" fill="#1a237e" radius={[4,4,0,0]} />
                        <Bar dataKey="avgApar" name="Avg APAR" fill="#0288d1" radius={[4,4,0,0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <p className="text-muted text-center py-4">No department data</p>}
                </div>
              </div>
            </div>
          </div>
          <div className="row g-3">
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Redistribution Suggestions</h6>
                  {data.aiInsights?.redistributionSuggestions?.map((s, i) => (
                    <div key={i} className="d-flex gap-2 mb-2 p-2 rounded" style={{ background: '#f0f4ff' }}>
                      <span style={{ color: '#1a237e', minWidth: 16 }}>{i + 1}.</span>
                      <span className="small">{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#c62828' }}>Overloaded Faculty</h6>
                  {data.aiInsights?.overloadedFaculty?.length ? data.aiInsights.overloadedFaculty.map((f, i) => (
                    <div key={i} className="badge bg-danger bg-opacity-10 text-danger d-block mb-1 py-2 text-start">{f}</div>
                  )) : <p className="text-muted small">None identified</p>}
                  <h6 className="fw-bold mb-2 mt-3" style={{ color: '#1b5e20' }}>Hiring Recommendations</h6>
                  {data.aiInsights?.hiringRecommendations?.map((r, i) => (
                    <div key={i} className="d-flex gap-2 mb-1"><span style={{ color: '#1a237e' }}>&#8594;</span><span className="small">{r}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Optimization Tips</h6>
                  {data.aiInsights?.optimizationTips?.map((t, i) => (
                    <div key={i} className="d-flex gap-2 mb-2 p-2 rounded" style={{ background: '#e8f5e9' }}>
                      <span className="text-success fw-bold">&#10003;</span>
                      <span className="small">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// -- Main Faculty Page -----------------------------------------
const Faculty = () => {
  const [activeTab, setActiveTab] = useState('list');
  const tabs = [
    { id: 'list', label: 'Faculty List', badge: null },
    { id: 'apar', label: 'AI APAR Generator', badge: { text: 'AI', color: 'primary' } },
    { id: 'research', label: 'Research Impact', badge: { text: 'AI', color: 'success' } },
    { id: 'workload', label: 'Workload Visualizer', badge: { text: 'AI', color: 'warning' } },
  ];

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Faculty Management</h4>
          <p className="text-muted small mb-0">Manage faculty records with AI-powered performance evaluation</p>
        </div>
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
          <div className="card-body p-0">
            <div className="d-flex overflow-auto" style={{ borderBottom: '2px solid #e8eaf6' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className="btn btn-link text-decoration-none px-4 py-3 fw-semibold"
                  style={{ color: activeTab === tab.id ? '#1a237e' : '#999', borderBottom: activeTab === tab.id ? '2px solid #1a237e' : '2px solid transparent', borderRadius: 0, whiteSpace: 'nowrap', fontSize: '0.88rem', marginBottom: '-2px' }}>
                  {tab.badge && <span className={`badge bg-${tab.badge.color} me-1`} style={{ fontSize: '0.6rem' }}>{tab.badge.text}</span>}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {activeTab === 'list' && <FacultyListTab />}
        {activeTab === 'apar' && <APARGeneratorTab />}
        {activeTab === 'research' && <ResearchAnalyzerTab />}
        {activeTab === 'workload' && <WorkloadVisualizerTab />}
      </div>
    </>
  );
};

export default Faculty;
