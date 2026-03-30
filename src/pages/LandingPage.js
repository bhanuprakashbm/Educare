import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    { title: 'Institution Management', desc: 'Track AISHE codes, NIRF rankings, NAAC grades and compliance status across all institutions in one unified view.' },
    { title: 'Student Lifecycle Tracking', desc: 'Aadhar-based student tracking from admission to post-graduation — academics, attendance, schemes & placement.' },
    { title: 'Faculty Performance', desc: 'Monitor APAR IDs, teaching scores, research publications and appraisal history for every faculty member.' },
    { title: 'NIRF Score Calculator', desc: "Simulate and optimize your institution's NIRF ranking with real-time weighted score calculation and radar analytics." },
    { title: 'Government Schemes', desc: 'Track student eligibility and applications for PM Scholarships, AICTE Pragati, Merit Scholarships and more.' },
    { title: 'Real-Time Analytics', desc: 'Interactive dashboards with charts, KPIs and trend analysis for data-driven institutional governance.' },
  ];

  const stats = [
    { value: '5+', label: 'Institutions' },
    { value: '1000+', label: 'Students' },
    { value: '95%', label: 'Data Accuracy' },
    { value: '3', label: 'User Roles' },
  ];

  const roles = [
    { role: 'Admin', color: '#b71c1c', bg: '#ffebee', borderColor: '#ef9a9a', desc: 'Full control over institutions, students, faculty, analytics and NIRF calculations.', features: ['Manage all modules', 'Platform-wide analytics', 'NIRF calculator', 'Search & filter all data'] },
    { role: 'Faculty', color: '#e65100', bg: '#fff3e0', borderColor: '#ffcc80', desc: 'View and manage assigned students, add academic records and track performance.', features: ['View student roster', 'Add semester records', 'Track attendance', 'Monitor student progress'] },
    { role: 'Student', color: '#1b5e20', bg: '#e8f5e9', borderColor: '#a5d6a7', desc: 'Access personal academic records, attendance, placement status and government schemes.', features: ['View academic records', 'Check attendance', 'Apply for schemes', 'Track placement status'] },
  ];

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", overflowX: 'hidden' }}>

      {/* ── NAVBAR ───────────────────────────────────────────── */}
      <nav style={{ background: 'linear-gradient(135deg, #1a237e, #283593)', position: 'sticky', top: 0, zIndex: 1000, padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 20px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '-0.5px' }}>EduCare</span>
          <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: '0.6rem', padding: '2px 8px', borderRadius: 20, marginLeft: 4, letterSpacing: 1 }}>UNIFIED PLATFORM</span>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', padding: '8px 20px', borderRadius: 8, fontWeight: 500, fontSize: '0.9rem' }}>
            Sign In
          </Link>
          <Link to="/register" style={{ background: 'white', color: '#1a237e', textDecoration: 'none', padding: '8px 20px', borderRadius: 8, fontWeight: 700, fontSize: '0.9rem' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1a237e 0%, #283593 50%, #1565c0 100%)', minHeight: '92vh', display: 'flex', alignItems: 'center', padding: '4rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'absolute', bottom: -150, left: -100, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div style={{ color: 'white' }}>
                <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.5rem', letterSpacing: '-1px' }}>
                  Unified Educational<br />
                  <span style={{ background: 'linear-gradient(90deg, #64b5f6, #e1f5fe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Data Management
                  </span><br />
                  Platform
                </h1>
                <p style={{ fontSize: '1.1rem', opacity: 0.8, lineHeight: 1.7, marginBottom: '2rem', maxWidth: 500 }}>
                  Eliminate data silos across educational institutions. A centralized platform for tracking students, faculty, and institutional performance with real-time analytics.
                </p>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Link to="/register" style={{ background: 'white', color: '#1a237e', textDecoration: 'none', padding: '14px 32px', borderRadius: 10, fontWeight: 700, fontSize: '1rem' }}>
                    Get Started Free
                  </Link>
                  <Link to="/login" style={{ border: '2px solid rgba(255,255,255,0.4)', color: 'white', textDecoration: 'none', padding: '14px 32px', borderRadius: 10, fontWeight: 600, fontSize: '1rem' }}>
                    Sign In
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 d-none d-lg-block">
              {/* Dashboard Preview Card */}
              <div style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', borderRadius: 20, padding: '2rem', border: '1px solid rgba(255,255,255,0.15)' }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: '1.5rem' }}>
                  {['#ff5f57','#ffbd2e','#28c840'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
                </div>
                <div className="row g-2 mb-3">
                  {[
                    { label: 'Institutions', value: '5' },
                    { label: 'Students', value: '5' },
                    { label: 'Faculty', value: '3' },
                    { label: 'Placement %', value: '40%' },
                  ].map(({ label, value }) => (
                    <div key={label} className="col-6">
                      <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                        <div style={{ color: 'white', fontWeight: 800, fontSize: '1.5rem' }}>{value}</div>
                        <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{label}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '1rem' }}>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem', marginBottom: 8 }}>Students by Department</div>
                  {[['MCA', 75], ['CSE', 60], ['ECE', 40], ['MBA', 25]].map(([dept, pct]) => (
                    <div key={dept} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem', width: 35 }}>{dept}</span>
                      <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 4 }}>
                        <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #64b5f6, #42a5f5)', borderRadius: 4 }} />
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.7rem' }}>{pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────── */}
      <section style={{ background: '#1a237e', padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '1rem' }}>
          {stats.map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900 }}>{value}</div>
              <div style={{ opacity: 0.7, fontSize: '0.85rem', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <section style={{ background: '#f8f9fa', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: '#e8eaf6', color: '#1a237e', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>CORE MODULES</span>
            <h2 style={{ fontWeight: 900, color: '#1a237e', marginTop: '1rem', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>Everything in One Platform</h2>
            <p style={{ color: '#666', maxWidth: 600, margin: '0 auto', lineHeight: 1.7 }}>A tripartite model covering institutional health, educator performance, and student lifecycle — all unified under one roof.</p>
          </div>
          <div className="row g-4">
            {features.map(({ title, desc }) => (
              <div key={title} className="col-12 col-md-6 col-lg-4">
                <div style={{ background: 'white', borderRadius: 16, padding: '2rem', height: '100%', boxShadow: '0 4px 20px rgba(26,35,126,0.06)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default', borderTop: '3px solid #1a237e' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(26,35,126,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(26,35,126,0.06)'; }}>
                  <h5 style={{ fontWeight: 700, color: '#1a237e', marginBottom: '0.75rem' }}>{title}</h5>
                  <p style={{ color: '#666', lineHeight: 1.7, fontSize: '0.9rem', margin: 0 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ─────────────────────────────────────── */}
      <section style={{ background: 'white', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: '#e8eaf6', color: '#1a237e', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>TRIPARTITE MODEL</span>
            <h2 style={{ fontWeight: 900, color: '#1a237e', marginTop: '1rem', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>Three Pillars of Excellence</h2>
          </div>
          <div className="row g-4">
            {[
              { title: 'Institutional Health', id: 'AISHE CODE', color: '#1a237e', items: ['AISHE Code tracking', 'NIRF ranking simulation', 'NAAC accreditation status', 'UGC & AICTE compliance', 'Department-wise analytics'] },
              { title: 'Educator Performance', id: 'APAR ID', color: '#1565c0', items: ['APAR ID-based tracking', 'Teaching & research scores', 'Publications & patents', 'Appraisal history', 'Designation-wise reports'] },
              { title: 'Student Lifecycle', id: 'AADHAR', color: '#0288d1', items: ['Aadhar-based identity', 'Admission to placement', 'SGPA/CGPA tracking', 'Attendance monitoring', 'Government scheme benefits'] },
            ].map(({ title, id, color, items }) => (
              <div key={title} className="col-12 col-lg-4">
                <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', height: '100%' }}>
                  <div style={{ background: color, padding: '2rem', color: 'white' }}>
                    <h5 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{title}</h5>
                    <span style={{ background: 'rgba(255,255,255,0.2)', padding: '2px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600 }}>Key ID: {id}</span>
                  </div>
                  <div style={{ background: '#f8f9fa', padding: '1.5rem' }}>
                    {items.map(item => (
                      <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <span style={{ color: color, fontWeight: 700 }}>&#10003;</span>
                        <span style={{ color: '#444', fontSize: '0.9rem' }}>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLE BASED ACCESS ─────────────────────────────────── */}
      <section style={{ background: '#f0f2f5', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ background: '#e8eaf6', color: '#1a237e', padding: '4px 16px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>ROLE-BASED ACCESS</span>
            <h2 style={{ fontWeight: 900, color: '#1a237e', marginTop: '1rem', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)' }}>Tailored for Every Stakeholder</h2>
          </div>
          <div className="row g-4">
            {roles.map(({ role, color, bg, borderColor, desc, features: roleFeatures }) => (
              <div key={role} className="col-12 col-md-4">
                <div style={{ background: 'white', borderRadius: 16, padding: '2rem', height: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', borderTop: `4px solid ${color}` }}>
                  <div style={{ display: 'inline-block', background: bg, border: `1px solid ${borderColor}`, color, borderRadius: 8, padding: '4px 14px', fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem' }}>
                    {role}
                  </div>
                  <p style={{ color: '#666', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>{desc}</p>
                  {roleFeatures.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ color, fontWeight: 700, fontSize: '0.85rem' }}>&#8594;</span>
                      <span style={{ color: '#444', fontSize: '0.85rem' }}>{f}</span>
                    </div>
                  ))}
                  <Link to="/register" style={{ display: 'block', textAlign: 'center', marginTop: '1.5rem', background: color, color: 'white', textDecoration: 'none', padding: '10px', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem' }}>
                    Register as {role}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(135deg, #1a237e, #1565c0)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', color: 'white' }}>
          <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginBottom: '1rem' }}>
            Ready to Unify Your<br />Educational Data?
          </h2>
          <p style={{ opacity: 0.8, lineHeight: 1.7, marginBottom: '2.5rem', fontSize: '1.05rem' }}>
            Join the platform that brings institutional governance, educator performance, and student lifecycle management under one roof.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" style={{ background: 'white', color: '#1a237e', textDecoration: 'none', padding: '16px 40px', borderRadius: 10, fontWeight: 800, fontSize: '1.05rem' }}>
              Get Started Free
            </Link>
            <Link to="/login" style={{ border: '2px solid rgba(255,255,255,0.5)', color: 'white', textDecoration: 'none', padding: '16px 40px', borderRadius: 10, fontWeight: 600, fontSize: '1.05rem' }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ background: '#0d1333', padding: '2.5rem 2rem', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ color: 'white', fontWeight: 700, fontSize: '1.1rem' }}>EduCare</span>
        </div>
        <p style={{ margin: 0, fontSize: '0.85rem' }}>
          Unified Educational Data Management &amp; Institutional Performance Analytics Platform
        </p>
        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem' }}>
          Dr. Ambedkar Institute of Technology, Bengaluru
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
