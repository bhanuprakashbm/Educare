import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/StatCard';
import { institutionAPI, facultyAPI } from '../../services/api';

const COLORS = ['#1a237e', '#1565c0', '#0288d1', '#00838f', '#2e7d32', '#f57f17'];

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [facultyStats, setFacultyStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [aRes, fRes] = await Promise.all([
          institutionAPI.getAnalytics(),
          facultyAPI.getStats(),
        ]);
        setAnalytics(aRes.data);
        setFacultyStats(fRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return (
    <>
      <Navbar />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
      </div>
    </>
  );

  const ov = analytics?.overview || {};
  const instByType = analytics?.institutionsByType?.map(d => ({ name: d._id, value: d.count })) || [];
  const deptData = analytics?.studentsByDept?.map(d => ({ name: d._id, students: d.count })) || [];
  const facByDesig = facultyStats?.byDesignation?.map(d => ({ name: d._id, count: d.count })) || [];
  const avgPerf = facultyStats?.averagePerformance || {};

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>Platform Analytics</h4>
          <p className="text-muted small">Real-time institutional performance insights</p>
        </div>

        {/* KPI Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-lg-2">
            <StatCard title="Institutions" value={ov.totalInstitutions ?? 0} icon="🏛️" color="primary" />
          </div>
          <div className="col-6 col-lg-2">
            <StatCard title="Students" value={ov.totalStudents ?? 0} icon="👨‍🎓" color="success" />
          </div>
          <div className="col-6 col-lg-2">
            <StatCard title="Faculty" value={ov.totalFaculty ?? 0} icon="👨‍🏫" color="warning" />
          </div>
          <div className="col-6 col-lg-2">
            <StatCard title="Graduated" value={ov.graduatedStudents ?? 0} icon="🎓" color="info" />
          </div>
          <div className="col-6 col-lg-2">
            <StatCard title="Placed" value={ov.placedStudents ?? 0} icon="💼" color="danger" />
          </div>
          <div className="col-6 col-lg-2">
            <StatCard title="Placement %" value={`${ov.placementRate ?? 0}%`} icon="📈" color="primary" />
          </div>
        </div>

        <div className="row g-3 mb-3">
          {/* Department-wise Students */}
          <div className="col-12 col-lg-8">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Students by Department</h6>
                {deptData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={deptData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="students" fill="#1a237e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-muted text-center py-5">No student data yet</p>}
              </div>
            </div>
          </div>

          {/* Institutions by Type */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Institutions by Type</h6>
                {instByType.length > 0 ? (
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={instByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                        {instByType.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <p className="text-muted text-center py-5">No institution data yet</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {/* Faculty by Designation */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Faculty by Designation</h6>
                {facByDesig.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={facByDesig} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={130} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1565c0" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : <p className="text-muted text-center py-5">No faculty data yet</p>}
              </div>
            </div>
          </div>

          {/* Faculty Performance Averages */}
          <div className="col-12 col-lg-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Average Faculty Performance</h6>
                {avgPerf.avgTeaching ? (
                  <div className="mt-3">
                    {[
                      { label: 'Teaching Score', value: avgPerf.avgTeaching, color: '#1a237e' },
                      { label: 'Research Score', value: avgPerf.avgResearch, color: '#1565c0' },
                      { label: 'Overall APAR', value: avgPerf.avgAPAR, color: '#0288d1' },
                    ].map(({ label, value, color }) => (
                      <div key={label} className="mb-4">
                        <div className="d-flex justify-content-between mb-1">
                          <small className="fw-semibold text-muted">{label}</small>
                          <small className="fw-bold" style={{ color }}>{(value || 0).toFixed(1)}/100</small>
                        </div>
                        <div className="progress" style={{ height: 10, borderRadius: 8 }}>
                          <div className="progress-bar" style={{ width: `${value || 0}%`, background: color, borderRadius: 8 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <p className="text-muted">No faculty performance data yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Analytics;
