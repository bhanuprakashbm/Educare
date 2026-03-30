const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => {
  const colorMap = {
    primary: { bg: '#1a237e', light: '#e8eaf6' },
    success: { bg: '#1b5e20', light: '#e8f5e9' },
    warning: { bg: '#e65100', light: '#fff3e0' },
    danger:  { bg: '#b71c1c', light: '#ffebee' },
    info:    { bg: '#006064', light: '#e0f7fa' },
  };
  const colors = colorMap[color] || colorMap.primary;

  return (
    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <p className="text-muted mb-1 small text-uppercase fw-semibold" style={{ letterSpacing: '0.05em' }}>
              {title}
            </p>
            <h2 className="fw-bold mb-0" style={{ color: colors.bg, fontSize: '2rem' }}>
              {value}
            </h2>
            {subtitle && <p className="text-muted small mb-0 mt-1">{subtitle}</p>}
          </div>
          <div
            className="d-flex align-items-center justify-content-center rounded-circle"
            style={{ width: 60, height: 60, background: colors.light, fontSize: '1.8rem' }}
          >
            {icon}
          </div>
        </div>
      </div>
      <div style={{ height: 4, background: colors.bg }} />
    </div>
  );
};

export default StatCard;
