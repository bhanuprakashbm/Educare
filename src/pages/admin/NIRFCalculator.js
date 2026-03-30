import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const NIRF_WEIGHTS = {
  teaching: 0.30,
  research: 0.30,
  graduation: 0.20,
  outreach: 0.10,
  perception: 0.10,
};

const NIRFCalculator = () => {
  const [scores, setScores] = useState({
    teaching: 70,
    research: 60,
    graduation: 75,
    outreach: 65,
    perception: 55,
  });
  const [institutionName, setInstitutionName] = useState('Dr. Ambedkar Institute of Technology');

  const handleChange = (key, value) => {
    setScores({ ...scores, [key]: Math.min(100, Math.max(0, Number(value))) });
  };

  const overallScore = Object.entries(NIRF_WEIGHTS).reduce(
    (acc, [key, weight]) => acc + scores[key] * weight, 0
  ).toFixed(2);

  const getRank = (score) => {
    if (score >= 90) return { range: 'Top 10', color: '#1b5e20' };
    if (score >= 80) return { range: 'Top 50', color: '#2e7d32' };
    if (score >= 70) return { range: 'Top 100', color: '#1565c0' };
    if (score >= 60) return { range: 'Top 200', color: '#e65100' };
    if (score >= 50) return { range: 'Top 300', color: '#b71c1c' };
    return { range: '300+', color: '#757575' };
  };

  const rankInfo = getRank(Number(overallScore));

  const radarData = [
    { subject: 'Teaching & Learning', score: scores.teaching, fullMark: 100 },
    { subject: 'Research', score: scores.research, fullMark: 100 },
    { subject: 'Graduation Outcomes', score: scores.graduation, fullMark: 100 },
    { subject: 'Outreach', score: scores.outreach, fullMark: 100 },
    { subject: 'Perception', score: scores.perception, fullMark: 100 },
  ];

  const barData = [
    { name: 'Teaching (30%)', score: scores.teaching, weighted: (scores.teaching * 0.30).toFixed(1) },
    { name: 'Research (30%)', score: scores.research, weighted: (scores.research * 0.30).toFixed(1) },
    { name: 'Graduation (20%)', score: scores.graduation, weighted: (scores.graduation * 0.20).toFixed(1) },
    { name: 'Outreach (10%)', score: scores.outreach, weighted: (scores.outreach * 0.10).toFixed(1) },
    { name: 'Perception (10%)', score: scores.perception, weighted: (scores.perception * 0.10).toFixed(1) },
  ];

  const parameters = [
    { key: 'teaching', label: 'Teaching, Learning & Resources', weight: '30%', icon: '📚', desc: 'Faculty qualification, student-teacher ratio, infrastructure' },
    { key: 'research', label: 'Research & Professional Practice', weight: '30%', icon: '🔬', desc: 'Publications, patents, projects, consultancy' },
    { key: 'graduation', label: 'Graduation Outcomes', weight: '20%', icon: '🎓', desc: 'PhD, placement, higher education, median salary' },
    { key: 'outreach', label: 'Outreach & Inclusivity', weight: '10%', icon: '🌍', desc: 'Regional diversity, women students, economically challenged' },
    { key: 'perception', label: 'Peer Perception', weight: '10%', icon: '👁️', desc: 'Academic reputation among peers and employers' },
  ];

  return (
    <>
      <Navbar />
      <div className="container-fluid py-4 px-4" style={{ background: '#f0f2f5', minHeight: '100vh' }}>
        <div className="mb-4">
          <h4 className="fw-bold mb-0" style={{ color: '#1a237e' }}>🏆 NIRF Score Calculator</h4>
          <p className="text-muted small">National Institutional Ranking Framework — Simulate your institution's NIRF score</p>
        </div>

        <div className="row g-3">
          {/* Left — Input Panel */}
          <div className="col-12 col-lg-5">
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Institution Parameters</h6>
                <div className="mb-3">
                  <label className="form-label small fw-semibold">Institution Name</label>
                  <input className="form-control" value={institutionName}
                    onChange={e => setInstitutionName(e.target.value)} style={{ borderRadius: 8 }} />
                </div>
                {parameters.map(({ key, label, weight, icon, desc }) => (
                  <div key={key} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <label className="form-label small fw-semibold mb-0">
                        {icon} {label}
                        <span className="badge bg-primary ms-2" style={{ fontSize: '0.65rem' }}>{weight}</span>
                      </label>
                      <span className="fw-bold" style={{ color: '#1a237e', minWidth: 32 }}>{scores[key]}</span>
                    </div>
                    <p className="text-muted" style={{ fontSize: '0.72rem', marginBottom: 4 }}>{desc}</p>
                    <input type="range" className="form-range" min={0} max={100} value={scores[key]}
                      onChange={e => handleChange(key, e.target.value)} />
                    <div className="d-flex justify-content-between" style={{ fontSize: '0.7rem', color: '#9e9e9e' }}>
                      <span>0</span><span>50</span><span>100</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Results */}
          <div className="col-12 col-lg-7">
            {/* Score Card */}
            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12, background: 'linear-gradient(135deg, #1a237e, #1565c0)' }}>
              <div className="card-body p-4 text-white">
                <div className="row align-items-center">
                  <div className="col-7">
                    <p className="opacity-75 small mb-1">{institutionName}</p>
                    <h1 className="fw-bold display-4 mb-0">{overallScore}</h1>
                    <p className="opacity-75 mb-2">Overall NIRF Score / 100</p>
                    <span className="badge px-3 py-2" style={{ background: rankInfo.color, fontSize: '0.85rem' }}>
                      🏆 Estimated Rank: {rankInfo.range}
                    </span>
                  </div>
                  <div className="col-5">
                    <div className="text-end">
                      {barData.map(({ name, weighted }) => (
                        <div key={name} className="d-flex justify-content-between mb-1" style={{ fontSize: '0.75rem' }}>
                          <span className="opacity-75">{name.split('(')[0]}</span>
                          <span className="fw-bold">{weighted}</span>
                        </div>
                      ))}
                      <hr className="opacity-25 my-1" />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total</span><span>{overallScore}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="card border-0 shadow-sm mb-3" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>Performance Radar</h6>
                <ResponsiveContainer width="100%" height={260}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                    <Radar name="Score" dataKey="score" stroke="#1a237e" fill="#1a237e" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Improvement Tips */}
            <div className="card border-0 shadow-sm" style={{ borderRadius: 12 }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ color: '#1a237e' }}>💡 Improvement Recommendations</h6>
                {parameters
                  .sort((a, b) => scores[a.key] - scores[b.key])
                  .slice(0, 3)
                  .map(({ key, label, icon }) => (
                    <div key={key} className="d-flex align-items-center gap-3 mb-2 p-2 rounded" style={{ background: '#fff3e0' }}>
                      <span>{icon}</span>
                      <div>
                        <p className="fw-semibold small mb-0">{label}</p>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                          Current: {scores[key]}/100 — Focus here to improve your NIRF rank
                        </p>
                      </div>
                      <span className="ms-auto badge bg-warning text-dark">{scores[key]}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NIRFCalculator;
