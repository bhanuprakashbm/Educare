import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { institutionAPI } from '../../services/api';

const Institutions = () => {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    aisheCode: '', name: '', type: 'Affiliated College',
    'address.city': '', 'address.state': '',
    principalName: '', email: '', phone: '',
    'accreditation.naaacGrade': 'Not Accredited',
    'compliance.ugcApproved': false, 'compliance.aicteApproved': false,
  });

  useEffect(() => { fetchInstitutions(); }, []);

  const fetchInstitutions = async () => {
    setLoading(true);
    try {
      const res = await institutionAPI.getAll();
      setInstitutions(res.data.institutions);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      const payload = {
        aisheCode: formData.aisheCode,
        name: formData.name,
        type: formData.type,
        address: { city: formData['address.city'], state: formData['address.state'] },
        principalName: formData.principalName,
        email: formData.email,
        phone: formData.phone,
        accreditation: { naaacGrade: formData['accreditation.naaacGrade'] },
        compliance: {
          ugcApproved: formData['compliance.ugcApproved'],
          aicteApproved: formData['compliance.aicteApproved'],
        },
      };
      await institutionAPI.create(payload);
      setSuccess('Institution created successfully!');
      setShowModal(false);
      fetchInstitutions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create institution');
    }
  };

  const gradeColor = (grade) => {
    if (['A++', 'A+'].includes(grade)) return 'success';
    if (['A', 'B++'].includes(grade)) return 'primary';
    if (['B+', 'B'].includes(grade)) return 'warning';
    return 'secondary';
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Institution Management</h4>
            <p className="text-muted small mb-0">Total: {total} institutions</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}
            style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>
            + Add Institution
          </button>
        </div>

        {success && <div className="alert alert-success py-2">{success}</div>}

        <div className="row g-3">
          {loading ? (
            <div className="col-12 text-center py-5"><div className="spinner-border text-primary" /></div>
          ) : institutions.length === 0 ? (
            <div className="col-12">
              <div className="card border-0 shadow-sm text-center py-5" style={{ borderRadius: 12 }}>
                <p className="text-muted">No institutions yet. Add your first institution!</p>
              </div>
            </div>
          ) : institutions.map((inst) => (
            <div key={inst._id} className="col-12 col-md-6 col-lg-4">
              <div className="card border-0 shadow-sm h-100" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary small">{inst.type}</span>
                    {inst.accreditation?.naaacGrade && (
                      <span className={`badge bg-${gradeColor(inst.accreditation.naaacGrade)}`}>
                        NAAC: {inst.accreditation.naaacGrade}
                      </span>
                    )}
                  </div>
                  <h6 className="fw-bold mb-1" style={{ color: '#1a237e' }}>{inst.name}</h6>
                  <p className="text-muted small mb-2">
                    <code>{inst.aisheCode}</code> · {inst.address?.city}, {inst.address?.state}
                  </p>
                  <div className="d-flex gap-2 flex-wrap">
                    {inst.compliance?.ugcApproved && <span className="badge bg-success bg-opacity-10 text-success small">✓ UGC</span>}
                    {inst.compliance?.aicteApproved && <span className="badge bg-info bg-opacity-10 text-info small">✓ AICTE</span>}
                    {inst.nirf?.rank && <span className="badge bg-warning bg-opacity-10 text-warning small">NIRF #{inst.nirf.rank}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0" style={{ borderRadius: 12 }}>
                <div className="modal-header border-0">
                  <h5 className="modal-title fw-bold" style={{ color: '#1a237e' }}>Add New Institution</h5>
                  <button className="btn-close" onClick={() => setShowModal(false)} />
                </div>
                <div className="modal-body">
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}
                  <form onSubmit={handleSubmit}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">AISHE Code *</label>
                        <input name="aisheCode" className="form-control" placeholder="e.g. C-12345" value={formData.aisheCode} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Institution Name *</label>
                        <input name="name" className="form-control" placeholder="Full name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Type</label>
                        <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                          {['University', 'Autonomous College', 'Affiliated College', 'Deemed University', 'IIT', 'NIT'].map(t => <option key={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">NAAC Grade</label>
                        <select name="accreditation.naaacGrade" className="form-select" value={formData['accreditation.naaacGrade']} onChange={handleChange}>
                          {['A++', 'A+', 'A', 'B++', 'B+', 'B', 'C', 'Not Accredited'].map(g => <option key={g}>{g}</option>)}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">City</label>
                        <input name="address.city" className="form-control" placeholder="City" value={formData['address.city']} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">State</label>
                        <input name="address.state" className="form-control" placeholder="State" value={formData['address.state']} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Principal Name</label>
                        <input name="principalName" className="form-control" placeholder="Principal" value={formData.principalName} onChange={handleChange} />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label small fw-semibold">Email</label>
                        <input name="email" type="email" className="form-control" placeholder="institution@email.com" value={formData.email} onChange={handleChange} />
                      </div>
                      <div className="col-12">
                        <div className="d-flex gap-4">
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="compliance.ugcApproved"
                              checked={formData['compliance.ugcApproved']} onChange={handleChange} id="ugc" />
                            <label className="form-check-label small" htmlFor="ugc">UGC Approved</label>
                          </div>
                          <div className="form-check">
                            <input className="form-check-input" type="checkbox" name="compliance.aicteApproved"
                              checked={formData['compliance.aicteApproved']} onChange={handleChange} id="aicte" />
                            <label className="form-check-label small" htmlFor="aicte">AICTE Approved</label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-end mt-4">
                      <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary" style={{ background: '#1a237e', border: 'none' }}>Create Institution</button>
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

export default Institutions;
