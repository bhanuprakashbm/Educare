import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { studentAPI, facultyAPI, institutionAPI } from '../../services/api';

const Search = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('students');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState({ department: '', status: '', program: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);
    try {
      let res;
      const params = { limit: 50, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
      if (category === 'students') res = await studentAPI.getAll(params);
      else if (category === 'faculty') res = await facultyAPI.getAll(params);
      else res = await institutionAPI.getAll(params);

      const data = res.data.students || res.data.faculty || res.data.institutions || [];
      // Client-side query filter
      const filtered = query.trim()
        ? data.filter(item => {
            const searchStr = JSON.stringify(item).toLowerCase();
            return query.toLowerCase().split(' ').every(word => searchStr.includes(word));
          })
        : data;
      setResults(filtered);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const renderResult = (item) => {
    if (category === 'students') return (
      <div key={item._id} className="card border-0 mb-2" style={{ borderRadius: 10, background: '#f8f9fa' }}>
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="fw-bold mb-1" style={{ color: '#1a237e' }}>{item.user?.name || '—'}</h6>
              <p className="text-muted small mb-1">
                <code>{item.usn || 'No USN'}</code> · {item.department} · {item.program} · Batch {item.batch}
              </p>
              <p className="text-muted small mb-0">Sem {item.currentSemester} · Attendance: {item.attendance?.percentage || 0}%</p>
            </div>
            <div className="text-end">
              <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'} mb-1 d-block`}>{item.status}</span>
              {item.placement?.isPlaced && <span className="badge bg-primary">💼 Placed</span>}
            </div>
          </div>
          {item.academicRecords?.length > 0 && (
            <div className="mt-2 d-flex gap-2 flex-wrap">
              {item.academicRecords.slice(-3).map((rec, i) => (
                <span key={i} className="badge bg-light text-dark border" style={{ fontSize: '0.7rem' }}>
                  Sem{rec.semester}: {rec.sgpa} SGPA
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );

    if (category === 'faculty') return (
      <div key={item._id} className="card border-0 mb-2" style={{ borderRadius: 10, background: '#f8f9fa' }}>
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="fw-bold mb-1" style={{ color: '#1a237e' }}>{item.user?.name || '—'}</h6>
              <p className="text-muted small mb-1">
                <code>{item.aparId}</code> · {item.designation} · {item.department}
              </p>
              <p className="text-muted small mb-0">Experience: {item.experience?.teaching || 0} yrs teaching · Publications: {item.publications?.length || 0}</p>
            </div>
            <div className="text-end">
              <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-secondary'} mb-1 d-block`}>{item.status}</span>
              <span className="badge bg-primary">APAR: {item.performance?.overallAPARScore || 0}</span>
            </div>
          </div>
        </div>
      </div>
    );

    if (category === 'institutions') return (
      <div key={item._id} className="card border-0 mb-2" style={{ borderRadius: 10, background: '#f8f9fa' }}>
        <div className="card-body p-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="fw-bold mb-1" style={{ color: '#1a237e' }}>{item.name}</h6>
              <p className="text-muted small mb-1">
                <code>{item.aisheCode}</code> · {item.type} · {item.address?.city}, {item.address?.state}
              </p>
              <p className="text-muted small mb-0">NAAC: {item.accreditation?.naaacGrade || 'N/A'} · NIRF Rank: {item.nirf?.rank || 'N/A'}</p>
            </div>
            <div className="text-end">
              <span className="badge bg-primary mb-1 d-block">{item.type}</span>
              {item.compliance?.ugcApproved && <span className="badge bg-success me-1" style={{ fontSize: '0.65rem' }}>UGC</span>}
              {item.compliance?.aicteApproved && <span className="badge bg-info" style={{ fontSize: '0.65rem' }}>AICTE</span>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>🔍 Search & Filter</h4>
          <p className="text-muted small">Search across students, faculty, and institutions</p>
        </div>

        {/* Search Form */}
        <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
          <div className="card-body p-4">
            <form onSubmit={handleSearch}>
              <div className="row g-3">
                <div className="col-12 col-lg-5">
                  <label className="form-label fw-semibold small">Search Query</label>
                  <input className="form-control" placeholder="Search by name, USN, APAR ID, department..."
                    value={query} onChange={e => setQuery(e.target.value)} style={{ borderRadius: 8 }} />
                </div>
                <div className="col-6 col-lg-2">
                  <label className="form-label fw-semibold small">Category</label>
                  <select className="form-select" value={category}
                    onChange={e => { setCategory(e.target.value); setResults([]); setSearched(false); }}
                    style={{ borderRadius: 8 }}>
                    <option value="students">👨‍🎓 Students</option>
                    <option value="faculty">👨‍🏫 Faculty</option>
                    <option value="institutions">🏛️ Institutions</option>
                  </select>
                </div>
                {category === 'students' && (
                  <>
                    <div className="col-6 col-lg-2">
                      <label className="form-label fw-semibold small">Department</label>
                      <input className="form-control" placeholder="e.g. MCA" style={{ borderRadius: 8 }}
                        value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })} />
                    </div>
                    <div className="col-6 col-lg-2">
                      <label className="form-label fw-semibold small">Status</label>
                      <select className="form-select" value={filters.status}
                        onChange={e => setFilters({ ...filters, status: e.target.value })} style={{ borderRadius: 8 }}>
                        <option value="">All</option>
                        <option value="active">Active</option>
                        <option value="graduated">Graduated</option>
                        <option value="dropped">Dropped</option>
                      </select>
                    </div>
                  </>
                )}
                {category === 'faculty' && (
                  <div className="col-6 col-lg-2">
                    <label className="form-label fw-semibold small">Department</label>
                    <input className="form-control" placeholder="Department" style={{ borderRadius: 8 }}
                      value={filters.department} onChange={e => setFilters({ ...filters, department: e.target.value })} />
                  </div>
                )}
                <div className="col-12 col-lg-1 d-flex align-items-end">
                  <button type="submit" className="btn btn-primary w-100 py-2"
                    style={{ background: '#1a237e', border: 'none', borderRadius: 8 }} disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm" /> : '🔍'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="fw-bold mb-0" style={{ color: '#1a237e' }}>
                  {loading ? 'Searching...' : `Found ${results.length} result${results.length !== 1 ? 's' : ''}`}
                </h6>
                {results.length > 0 && (
                  <span className="badge bg-primary">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                )}
              </div>
              {loading ? (
                <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
              ) : results.length === 0 ? (
                <div className="text-center py-5">
                  <div style={{ fontSize: '3rem' }}>🔍</div>
                  <p className="text-muted mt-2">No results found. Try different keywords or filters.</p>
                </div>
              ) : (
                results.map(item => renderResult(item))
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Search;
