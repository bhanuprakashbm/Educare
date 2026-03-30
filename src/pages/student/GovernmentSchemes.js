import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { studentAPI } from '../../services/api';

const AVAILABLE_SCHEMES = [
  { name: 'Post Matric Scholarship', ministry: 'Ministry of Social Justice', amount: 25000, category: 'SC/ST', deadline: '2026-10-31', description: 'Scholarship for SC/ST students pursuing post-matric education' },
  { name: 'Merit Scholarship', ministry: 'Ministry of Education', amount: 40000, category: 'Merit', deadline: '2026-09-30', description: 'For students with SGPA above 8.5 in previous semester' },
  { name: 'Central Sector Scholarship', ministry: 'Ministry of Education', amount: 20000, category: 'Merit-cum-Means', deadline: '2026-11-15', description: 'For students from families with income below 8 LPA' },
  { name: 'Pragati Scholarship (Girls)', ministry: 'AICTE', amount: 50000, category: 'Women', deadline: '2026-08-31', description: 'For girl students in AICTE approved technical institutions' },
  { name: 'Saksham Scholarship', ministry: 'AICTE', amount: 50000, category: 'Differently Abled', deadline: '2026-08-31', description: 'For differently abled students in technical programs' },
  { name: 'PM Scholarship Scheme', ministry: 'Ministry of Home Affairs', amount: 36000, category: 'Defence', deadline: '2026-10-15', description: 'For wards of ex-servicemen / coast guard' },
  { name: 'Minority Scholarship', ministry: 'Ministry of Minority Affairs', amount: 30000, category: 'Minority', deadline: '2026-09-15', description: 'For students from minority communities' },
  { name: 'Inspire Scholarship', ministry: 'DST', amount: 80000, category: 'Science', deadline: '2026-07-31', description: 'For students pursuing natural/basic sciences at B.Sc level' },
];

const GovernmentSchemes = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [mySchemes, setMySchemes] = useState([]);
  const [filter, setFilter] = useState('All');
  const [applying, setApplying] = useState(null);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = async () => {
    try {
      const res = await studentAPI.getAll({ limit: 1 });
      if (res.data.students?.length > 0) {
        setMySchemes(res.data.students[0].governmentSchemes || []);
      }
    } catch (err) {
      console.error(err);
    }
  }; // eslint-disable-line react-hooks/exhaustive-deps

  const categories = ['All', ...new Set(AVAILABLE_SCHEMES.map(s => s.category))];

  const filteredSchemes = filter === 'All' ? AVAILABLE_SCHEMES : AVAILABLE_SCHEMES.filter(s => s.category === filter);

  const isApplied = (schemeName) => mySchemes.some(s => s.schemeName === schemeName);

  const handleApply = (scheme) => {
    setApplying(scheme.name);
    setTimeout(() => {
      setMySchemes(prev => [...prev, {
        schemeName: scheme.name,
        schemeId: `SCH-2026-${Math.floor(Math.random() * 9000) + 1000}`,
        benefitAmount: scheme.amount,
        status: 'pending',
        startDate: new Date(),
      }]);
      setApplying(null);
      setSuccess(`Successfully applied for ${scheme.name}!`);
      setTimeout(() => setSuccess(''), 3000);
    }, 1200);
  };

  const statusColor = (status) => {
    if (status === 'active') return 'success';
    if (status === 'pending') return 'warning';
    if (status === 'completed') return 'primary';
    return 'secondary';
  };

  const totalBenefit = mySchemes.reduce((acc, s) => acc + (s.benefitAmount || 0), 0);

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>🏛️ Government Schemes Tracker</h4>
          <p className="text-muted small">Track and apply for government scholarships & benefits</p>
        </div>

        {success && (
          <div className="alert alert-success py-2 d-flex align-items-center gap-2" style={{ borderRadius: 8 }}>
            ✅ {success}
          </div>
        )}

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: 12 }}>
              <div style={{ fontSize: '2rem' }}>📋</div>
              <h5 className="fw-bold mb-0" style={{ color: '#1a237e' }}>{AVAILABLE_SCHEMES.length}</h5>
              <p className="text-muted small mb-0">Available Schemes</p>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: 12 }}>
              <div style={{ fontSize: '2rem' }}>✅</div>
              <h5 className="fw-bold mb-0" style={{ color: '#2e7d32' }}>{mySchemes.length}</h5>
              <p className="text-muted small mb-0">Applied / Active</p>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: 12 }}>
              <div style={{ fontSize: '2rem' }}>💰</div>
              <h5 className="fw-bold mb-0" style={{ color: '#e65100' }}>₹{totalBenefit.toLocaleString()}</h5>
              <p className="text-muted small mb-0">Total Benefit</p>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card border-0 shadow-sm text-center p-3" style={{ borderRadius: 12 }}>
              <div style={{ fontSize: '2rem' }}>⏳</div>
              <h5 className="fw-bold mb-0" style={{ color: '#f57f17' }}>
                {mySchemes.filter(s => s.status === 'pending').length}
              </h5>
              <p className="text-muted small mb-0">Pending Approval</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
          <div className="card-header bg-white border-0 pt-3 px-4">
            <ul className="nav nav-tabs border-0">
              <li className="nav-item">
                <button className={`nav-link fw-semibold ${activeTab === 'available' ? 'active' : 'text-muted'}`}
                  onClick={() => setActiveTab('available')} style={{ border: 'none', borderBottom: activeTab === 'available' ? '2px solid #1a237e' : 'none', color: activeTab === 'available' ? '#1a237e' : undefined }}>
                  🏛️ Available Schemes ({AVAILABLE_SCHEMES.length})
                </button>
              </li>
              <li className="nav-item">
                <button className={`nav-link fw-semibold ${activeTab === 'my' ? 'active' : 'text-muted'}`}
                  onClick={() => setActiveTab('my')} style={{ border: 'none', borderBottom: activeTab === 'my' ? '2px solid #1a237e' : 'none', color: activeTab === 'my' ? '#1a237e' : undefined }}>
                  📋 My Applications ({mySchemes.length})
                </button>
              </li>
            </ul>
          </div>
          <div className="card-body p-4">
            {activeTab === 'available' && (
              <>
                {/* Filter */}
                <div className="d-flex gap-2 flex-wrap mb-4">
                  {categories.map(cat => (
                    <button key={cat} className={`btn btn-sm ${filter === cat ? 'btn-primary' : 'btn-outline-secondary'}`}
                      onClick={() => setFilter(cat)} style={{ borderRadius: 20, fontSize: '0.8rem', background: filter === cat ? '#1a237e' : undefined, border: filter === cat ? 'none' : undefined }}>
                      {cat}
                    </button>
                  ))}
                </div>
                <div className="row g-3">
                  {filteredSchemes.map((scheme) => (
                    <div key={scheme.name} className="col-12 col-md-6">
                      <div className="card border-0 h-100" style={{ borderRadius: 10, background: '#f8f9fa', border: '1px solid #e8eaf6' }}>
                        <div className="card-body p-3">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="badge bg-primary bg-opacity-10 text-primary small">{scheme.category}</span>
                            <span className="fw-bold text-success small">₹{scheme.amount.toLocaleString()}/yr</span>
                          </div>
                          <h6 className="fw-bold mb-1" style={{ color: '#1a237e', fontSize: '0.9rem' }}>{scheme.name}</h6>
                          <p className="text-muted mb-1" style={{ fontSize: '0.75rem' }}>{scheme.ministry}</p>
                          <p className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>{scheme.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="text-danger small">⏰ Deadline: {scheme.deadline}</span>
                            {isApplied(scheme.name) ? (
                              <span className="badge bg-success">✓ Applied</span>
                            ) : (
                              <button className="btn btn-sm btn-primary" style={{ background: '#1a237e', border: 'none', borderRadius: 6, fontSize: '0.75rem' }}
                                disabled={applying === scheme.name}
                                onClick={() => handleApply(scheme)}>
                                {applying === scheme.name ? <span className="spinner-border spinner-border-sm" /> : 'Apply Now'}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'my' && (
              <>
                {mySchemes.length === 0 ? (
                  <div className="text-center py-5">
                    <div style={{ fontSize: '3rem' }}>📭</div>
                    <p className="text-muted mt-2">No applications yet. Browse available schemes!</p>
                    <button className="btn btn-primary" onClick={() => setActiveTab('available')}
                      style={{ background: '#1a237e', border: 'none', borderRadius: 8 }}>View Schemes</button>
                  </div>
                ) : (
                  <div className="row g-3">
                    {mySchemes.map((scheme, i) => (
                      <div key={i} className="col-12">
                        <div className="card border-0 p-3" style={{ borderRadius: 10, background: '#f8f9fa' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="fw-bold mb-1" style={{ color: '#1a237e' }}>{scheme.schemeName}</h6>
                              <p className="text-muted small mb-0">ID: <code>{scheme.schemeId}</code></p>
                            </div>
                            <div className="text-end">
                              <span className={`badge bg-${statusColor(scheme.status)} mb-1 d-block`}>
                                {scheme.status?.toUpperCase()}
                              </span>
                              <span className="fw-bold text-success small">₹{scheme.benefitAmount?.toLocaleString()}</span>
                            </div>
                          </div>
                          {/* Progress Bar */}
                          <div className="mt-2">
                            <div className="progress" style={{ height: 6, borderRadius: 8 }}>
                              <div className="progress-bar bg-success" style={{ width: scheme.status === 'active' ? '100%' : scheme.status === 'pending' ? '50%' : '30%', borderRadius: 8 }} />
                            </div>
                            <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.7rem', color: '#9e9e9e' }}>
                              <span>Applied</span><span>Under Review</span><span>Approved</span><span>Disbursed</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GovernmentSchemes;
