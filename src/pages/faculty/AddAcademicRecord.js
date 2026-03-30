import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { studentAPI } from '../../services/api';

const AddAcademicRecord = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [record, setRecord] = useState({
    semester: 1, year: 2026, sgpa: '', cgpa: '', backlogs: 0,
  });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const res = await studentAPI.getAll({ limit: 50 });
      setStudents(res.data.students || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setRecord({ ...record, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return setError('Please select a student');
    setError(''); setSuccess(''); setSubmitting(true);
    try {
      await studentAPI.addAcademicRecord(selectedStudent, record);
      setSuccess('Academic record added successfully!');
      setRecord({ semester: 1, year: 2026, sgpa: '', cgpa: '', backlogs: 0 });
      setSelectedStudent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add record');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedStudentData = students.find(s => s._id === selectedStudent);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>📝 Add Academic Record</h4>
          <p className="text-muted small">Enter semester results for students</p>
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-7">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                {success && <div className="alert alert-success py-2">✅ {success}</div>}
                {error && <div className="alert alert-danger py-2">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold small">Select Student *</label>
                    {loading ? (
                      <div className="spinner-border spinner-border-sm text-primary" />
                    ) : (
                      <select className="form-select" value={selectedStudent}
                        onChange={e => setSelectedStudent(e.target.value)} required style={{ borderRadius: 8 }}>
                        <option value="">— Choose a student —</option>
                        {students.map(s => (
                          <option key={s._id} value={s._id}>
                            {s.user?.name} ({s.usn || 'No USN'}) — {s.department}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Semester *</label>
                      <select name="semester" className="form-select" value={record.semester}
                        onChange={handleChange} style={{ borderRadius: 8 }}>
                        {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Academic Year *</label>
                      <select name="year" className="form-select" value={record.year}
                        onChange={handleChange} style={{ borderRadius: 8 }}>
                        {[2022,2023,2024,2025,2026].map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">SGPA (0–10) *</label>
                      <input name="sgpa" type="number" step="0.01" min="0" max="10"
                        className="form-control" placeholder="e.g. 8.75"
                        value={record.sgpa} onChange={handleChange} required style={{ borderRadius: 8 }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">CGPA (0–10) *</label>
                      <input name="cgpa" type="number" step="0.01" min="0" max="10"
                        className="form-control" placeholder="e.g. 8.50"
                        value={record.cgpa} onChange={handleChange} required style={{ borderRadius: 8 }} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold small">Backlogs</label>
                      <input name="backlogs" type="number" min="0"
                        className="form-control" value={record.backlogs}
                        onChange={handleChange} style={{ borderRadius: 8 }} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100 mt-4 py-2 fw-semibold"
                    disabled={submitting} style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
                    {submitting ? <><span className="spinner-border spinner-border-sm me-2" />Saving...</> : '💾 Save Academic Record'}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Student Preview */}
          <div className="col-12 col-lg-5">
            {selectedStudentData ? (
              <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>👨‍🎓 Student Info</h6>
                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted small">Name</span>
                    <span className="fw-semibold small">{selectedStudentData.user?.name}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted small">USN</span>
                    <span className="fw-semibold small">{selectedStudentData.usn || '—'}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted small">Department</span>
                    <span className="fw-semibold small">{selectedStudentData.department}</span>
                  </div>
                  <div className="mb-2 d-flex justify-content-between">
                    <span className="text-muted small">Program</span>
                    <span className="fw-semibold small">{selectedStudentData.program}</span>
                  </div>
                  <div className="mb-3 d-flex justify-content-between">
                    <span className="text-muted small">Current Sem</span>
                    <span className="fw-semibold small">Sem {selectedStudentData.currentSemester}</span>
                  </div>
                  <hr />
                  <h6 className="fw-bold mb-2" style={{ color: '#1a237e', fontSize: '0.85rem' }}>Existing Records</h6>
                  {selectedStudentData.academicRecords?.length > 0 ? (
                    selectedStudentData.academicRecords.map((rec, i) => (
                      <div key={i} className="d-flex justify-content-between mb-1 p-2 rounded" style={{ background: '#f8f9fa', fontSize: '0.8rem' }}>
                        <span>Sem {rec.semester} ({rec.year})</span>
                        <span className="fw-bold">SGPA: {rec.sgpa} | CGPA: {rec.cgpa}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted small">No records yet</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm text-center py-5" style={{ borderRadius: 12 }}>
                <div style={{ fontSize: '3rem' }}>👨‍🎓</div>
                <p className="text-muted mt-2 small">Select a student to preview their info and existing records</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddAcademicRecord;
