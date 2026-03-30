import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { studentAPI } from '../../services/api';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user: '', aadharNumber: '', usn: '', department: '', program: '', batch: '', admissionYear: '', currentSemester: 1, status: 'active',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => { fetchStudents(); }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getAll({ page, limit: 10 });
      setStudents(res.data.students);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await studentAPI.create(formData);
      setSuccess('Student created successfully!');
      setShowModal(false);
      setFormData({ user: '', aadharNumber: '', usn: '', department: '', program: '', batch: '', admissionYear: '', currentSemester: 1, status: 'active' });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create student');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await studentAPI.delete(id);
      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete student');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Student Management</h4>
            <p className="text-muted small mb-0">Total: {total} students</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}
            style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
            + Add Student
          </button>
        </div>

        {success && <div className="alert alert-success py-2">{success}</div>}
        {error && <div className="alert alert-danger py-2">{error}</div>}

        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div className="card-body p-0">
            {loading ? (
              <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: '#e8eaf6' }}>
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th>USN</th>
                      <th>Department</th>
                      <th>Program</th>
                      <th>Batch</th>
                      <th>Semester</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length === 0 ? (
                      <tr><td colSpan={8} className="text-center py-5 text-muted">No students found. Add your first student!</td></tr>
                    ) : students.map((s) => (
                      <tr key={s._id}>
                        <td className="px-4 py-3 fw-semibold">{s.user?.name || '—'}</td>
                        <td>{s.usn || '—'}</td>
                        <td>{s.department}</td>
                        <td>{s.program}</td>
                        <td>{s.batch}</td>
                        <td>Sem {s.currentSemester}</td>
                        <td>
                          <span className={`badge ${s.status === 'active' ? 'bg-success' : s.status === 'graduated' ? 'bg-primary' : 'bg-secondary'}`}>
                            {s.status}
                          </span>
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="card-footer bg-white d-flex justify-content-between align-items-center px-4 py-3">
              <button className="btn btn-sm btn-outline-primary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>← Prev</button>
              <span className="text-muted small">Page {page} of {totalPages}</span>
              <button className="btn btn-sm btn-outline-primary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next →</button>
            </div>
          )}
        </div>

        {/* Add Student Modal */}
        {showModal && (
          <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0" style={{ borderRadius: 12 }}>
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-bold" style={{ color: '#1a237e' }}>Add New Student</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">User ID (linked account)</label>
                        <input name="user" className="form-control" placeholder="MongoDB User ID" value={formData.user} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Aadhar Number</label>
                        <input name="aadharNumber" className="form-control" placeholder="12-digit Aadhar" value={formData.aadharNumber} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">USN</label>
                        <input name="usn" className="form-control" placeholder="e.g. 1DA23CS027" value={formData.usn} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Department</label>
                        <input name="department" className="form-control" placeholder="e.g. Computer Science" value={formData.department} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Program</label>
                        <input name="program" className="form-control" placeholder="e.g. B.E, MCA" value={formData.program} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Batch</label>
                        <input name="batch" className="form-control" placeholder="e.g. 2022-2026" value={formData.batch} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Admission Year</label>
                        <input name="admissionYear" type="number" className="form-control" placeholder="e.g. 2022" value={formData.admissionYear} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Current Semester</label>
                        <input name="currentSemester" type="number" min={1} max={12} className="form-control" value={formData.currentSemester} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-end mt-4">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ background: '#1a237e', border: 'none' }}>Create Student</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Students;
