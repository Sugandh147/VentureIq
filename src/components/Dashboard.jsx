import React from 'react';
import { Plus, BarChart3, ShieldAlert, CheckCircle, RefreshCcw, Landmark, Layers } from 'lucide-react';
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
    </div>
  );
}
