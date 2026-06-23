import { Plus, BarChart3, ShieldAlert, CheckCircle, Landmark, Layers } from 'lucide-react';
import StartupList from './StartupList';

export default function Dashboard({ startups, onSelectStartup, onNewAnalysisClick, subscription, analysisCredits }) {
  // Calculations
  const totalStartups = startups.length;
  
  const avgScore = totalStartups > 0 
    ? Math.round(startups.reduce((acc, s) => acc + s.scores.overall, 0) / totalStartups) 
    : 0;

  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--success-color)';
    if (score >= 70) return 'var(--accent-color)';
    if (score >= 55) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  // Count high/critical risks across portfolio
  const criticalRiskCount = startups.reduce((acc, s) => {
    const criticals = s.riskAssessment.filter(r => r.level === 'Critical' || r.level === 'High').length;
    return acc + criticals;
  }, 0);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Upper header action */}
      <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', textAlign: 'left', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={24} style={{ color: 'var(--accent-color)' }} /> Investment Terminal
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>AI-assisted deal sourcing & risk analysis.</p>
        </div>
        <button className="btn btn-primary" onClick={onNewAnalysisClick}>
          <Plus size={16} /> Analyze New Startup
        </button>
      </div>

      {/* Metrics Row */}
      <div className="dashboard-grid">
        {/* Metric 1 */}
        <div className="card metric-card">
          <div className="metric-label">Analyzed Startups</div>
          <div className="metric-value flex-between">
            <span>{totalStartups}</span>
            <Layers size={22} style={{ color: 'var(--accent-color)', opacity: 0.6 }} />
          </div>
          <div className="metric-trend" style={{ color: 'var(--text-muted)' }}>
            Active deal pipeline count
          </div>
        </div>

        {/* Metric 2 */}
        <div className="card metric-card">
          <div className="metric-label">Avg Portfolio Score</div>
          <div className="metric-value flex-between">
            <span style={{ color: getScoreColor(avgScore) }}>{avgScore}/100</span>
            <BarChart3 size={22} style={{ color: getScoreColor(avgScore), opacity: 0.6 }} />
          </div>
          <div className="metric-trend" style={{ color: 'var(--text-muted)' }}>
            Consensus quality indicator
          </div>
        </div>

        {/* Metric 3 */}
        <div className="card metric-card">
          <div className="metric-label">Critical Risks Flagged</div>
          <div className="metric-value flex-between">
            <span style={{ color: criticalRiskCount > 0 ? 'var(--danger-color)' : 'var(--success-color)' }}>
              {criticalRiskCount}
            </span>
            <ShieldAlert size={22} style={{ color: criticalRiskCount > 0 ? 'var(--danger-color)' : 'var(--success-color)', opacity: 0.6 }} />
          </div>
          <div className="metric-trend" style={{ color: 'var(--text-muted)' }}>
            Requires immediate inspection
          </div>
        </div>

        {/* Metric 4 */}
        <div className="card metric-card">
          <div className="metric-label">Remaining Analyses</div>
          <div className="metric-value flex-between">
            <span>{analysisCredits === Infinity ? "Unlimited" : `${analysisCredits}`}</span>
            <CheckCircle size={22} style={{ color: 'var(--success-color)', opacity: 0.6 }} />
          </div>
          <div className="metric-trend" style={{ color: 'var(--text-muted)' }}>
            Plan: {subscription.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Dashboard Charts & List Layout */}
      {totalStartups === 0 ? (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center', gap: '24px' }}>
          {/* Animated SVG Onboarding Graphic */}
          <div style={{ position: 'relative', width: '160px', height: '160px' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'var(--accent-glow)', filter: 'blur(30px)', borderRadius: '50%', opacity: 0.6 }} />
            <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', position: 'relative', zIndex: 2 }}>
              <defs>
                <linearGradient id="orb-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="var(--accent-color)" />
                  <stop offset="100%" stopColor="#2563eb" />
                </linearGradient>
              </defs>
              <style>{`
                @keyframes float-orb {
                  0%, 100% { transform: translateY(0px) scale(1); }
                  50% { transform: translateY(-6px) scale(1.03); }
                }
                @keyframes rotate-ring {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                @keyframes pulse-wave {
                  0% { transform: scale(0.8); opacity: 0.8; }
                  100% { transform: scale(1.3); opacity: 0; }
                }
                .float-orb-group {
                  animation: float-orb 5s ease-in-out infinite;
                  transform-origin: 50px 50px;
                }
                .rotating-radar {
                  transform-origin: 50px 50px;
                  animation: rotate-ring 15s linear infinite;
                  stroke-dasharray: 4 6;
                }
                .radar-pulse {
                  transform-origin: 50px 50px;
                  animation: pulse-wave 3s cubic-bezier(0.16, 1, 0.3, 1) infinite;
                }
              `}</style>
              
              {/* Concentric radar rings */}
              <circle cx="50" cy="50" r="45" stroke="var(--border-color)" strokeWidth="0.5" fill="none" opacity="0.3" />
              <circle cx="50" cy="50" r="32" stroke="var(--border-color)" strokeWidth="0.5" fill="none" opacity="0.5" />
              <circle cx="50" cy="50" r="32" stroke="var(--accent-color)" strokeWidth="1.5" fill="none" className="rotating-radar" opacity="0.5" />
              <circle cx="50" cy="50" r="22" stroke="var(--accent-color)" strokeWidth="1" fill="none" className="radar-pulse" />

              <g className="float-orb-group">
                <circle cx="50" cy="50" r="18" fill="url(#orb-grad)" opacity="0.9" />
                <circle cx="50" cy="50" r="8" fill="#ffffff" opacity="0.25" />
                <circle cx="46" cy="46" r="1.5" fill="#ffffff" />
                <circle cx="54" cy="54" r="1.5" fill="#ffffff" />
              </g>
            </svg>
          </div>

          <div style={{ maxWidth: '460px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '10px' }}>Investment Terminal Ready</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
              Your VC due diligence portfolio is empty. Enter a startup's name in the analyzer to auto-scrape corporate records, construct risk heatmaps, formulate investor screening questions, and compile investment memos.
            </p>
          </div>

          <button className="btn btn-primary" onClick={onNewAnalysisClick} style={{ padding: '12px 28px', fontSize: '14px', gap: '8px' }}>
            + Analyze Your First Startup
          </button>
        </div>
      ) : (
        <div className="dashboard-charts-grid">
          {/* Left Side: Startups list */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '18px', textAlign: 'left' }}>Active Deal Flow Portfolio</h3>
            <StartupList startups={startups} onSelectStartup={onSelectStartup} />
          </div>

          {/* Right Side: Mini Portfolio risk-heat visual */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h3 style={{ fontSize: '18px', textAlign: 'left' }}>Risk Matrix Mapping</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '-12px', textAlign: 'left' }}>
              Portfolio dispersion based on recommendation segments and risk profiles.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {startups.map(startup => (
                <div 
                  key={startup.id} 
                  className="card-interactive" 
                  onClick={() => onSelectStartup(startup.id)}
                  style={{ 
                    padding: '12px', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    border: 'var(--card-border)', 
                    borderRadius: '8px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{startup.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{startup.industry}</div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: getScoreColor(startup.scores.overall) }}>
                      {startup.scores.overall}%
                    </span>
                    <span className={`badge ${
                      startup.recommendation === 'Strong Invest' || startup.recommendation === 'Invest' ? 'badge-success' : 
                      startup.recommendation === 'Investigate Further' ? 'badge-warning' : 'badge-danger'
                    }`} style={{ fontSize: '10px', padding: '3px 8px' }}>
                      {startup.recommendation}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'center' }}>
              <button className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }} onClick={onNewAnalysisClick}>
                + Analyze Next Startup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
