import React, { useState } from 'react';
import { ArrowLeft, Download, Check, X, ShieldAlert, Award, FileText, CheckCircle2, ChevronDown, ChevronUp, Copy, HelpCircle } from 'lucide-react';
import { TAMChart, FinancialChart, RiskHeatmap } from './Charts';

export default function StartupDetail({ startup, onBack, subscription }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isSimplifyMode, setIsSimplifyMode] = useState(false);

  if (!startup) return null;

  // Determine standard vs simple modes dynamically
  const execSummary = isSimplifyMode ? startup.executiveSummarySimple : startup.executiveSummary;
  const founderAnalysis = isSimplifyMode ? startup.founderAnalysisSimple : startup.founderAnalysis;
  const productAnalysis = isSimplifyMode ? startup.productAnalysisSimple : startup.productAnalysis;
  const marketAnalysis = isSimplifyMode ? startup.marketAnalysisSimple : startup.marketAnalysis;
  const businessModelAnalysis = isSimplifyMode ? startup.businessModelAnalysisSimple : startup.businessModelAnalysis;
  const competitorAnalysis = isSimplifyMode ? startup.competitorAnalysisSimple : startup.competitorAnalysis;
  const financialAnalysis = isSimplifyMode ? startup.financialAnalysisSimple : startup.financialAnalysis;
  const riskAssessment = isSimplifyMode ? (startup.riskAssessmentSimple || startup.riskAssessment) : startup.riskAssessment;
  const redFlags = isSimplifyMode ? (startup.redFlagsSimple || startup.redFlags) : startup.redFlags;
  const bullBear = isSimplifyMode ? (startup.bullBearSimple || startup.bullBear) : startup.bullBear;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMemo = () => {
    navigator.clipboard.writeText(startup.investmentMemo);
    setCopiedMemo(true);
    setTimeout(() => setCopiedMemo(false), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--success-color)';
    if (score >= 70) return 'var(--accent-color)';
    if (score >= 55) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  const getRecommendationBadge = (rec) => {
    switch (rec) {
      case 'Strong Invest':
        return <span className="badge badge-success" style={{ padding: '6px 12px', fontSize: '13px' }}>Strong Invest</span>;
      case 'Invest':
        return <span className="badge badge-primary" style={{ padding: '6px 12px', fontSize: '13px' }}>Invest</span>;
      case 'Investigate Further':
        return <span className="badge badge-warning" style={{ padding: '6px 12px', fontSize: '13px' }}>Investigate</span>;
      case 'High Risk':
        return <span className="badge badge-danger" style={{ padding: '6px 12px', fontSize: '13px' }}>High Risk</span>;
      default:
        return <span className="badge badge-critical" style={{ padding: '6px 12px', fontSize: '13px' }}>Avoid</span>;
    }
  };

  // Determine questions count based on plan
  const visibleQuestions = subscription === 'free' 
    ? startup.questions.slice(0, 5) 
    : startup.questions;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      
      {/* Back button and Download bar */}
      <div className="flex-between no-print" style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <button className="btn btn-outline" onClick={onBack}>
          <ArrowLeft size={16} /> Back to Terminal
        </button>

        {/* Rookie Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'var(--bg-tertiary)', padding: '6px 12px', borderRadius: '20px', border: 'var(--card-border)' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: !isSimplifyMode ? 'var(--accent-color)' : 'var(--text-secondary)' }}>Standard Analyst</span>
          <div 
            onClick={() => setIsSimplifyMode(!isSimplifyMode)} 
            style={{ 
              width: '44px', 
              height: '22px', 
              backgroundColor: isSimplifyMode ? 'var(--success-color)' : 'var(--text-muted)', 
              borderRadius: '11px', 
              position: 'relative', 
              cursor: 'pointer',
              transition: 'background-color 0.2s' 
            }}
          >
            <div 
              style={{ 
                width: '18px', 
                height: '18px', 
                backgroundColor: '#ffffff', 
                borderRadius: '50%', 
                position: 'absolute', 
                top: '2px', 
                left: isSimplifyMode ? '24px' : '2px', 
                transition: 'left 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)' 
              }} 
            />
          </div>
          <span style={{ fontSize: '13px', fontWeight: '600', color: isSimplifyMode ? 'var(--success-color)' : 'var(--text-secondary)' }}>Rookie Mode (ELI5)</span>
        </div>

        <button className="btn btn-primary" onClick={handlePrint}>
          <Download size={16} /> Save PDF Report
        </button>
      </div>

      {/* Profile Header */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="detail-header">
          <div style={{ textAlign: 'left' }}>
            <span className="badge badge-primary" style={{ marginBottom: '8px' }}>{startup.industry}</span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', margin: '4px 0 8px' }}>{startup.name}</h2>
            <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Stage: <strong>{startup.fundingStage}</strong></span>
              <span>&bull;</span>
              <span>Website: <a href={startup.websiteUrl} target="_blank" rel="noreferrer">{startup.websiteUrl}</a></span>
              <span>&bull;</span>
              <span>Analyzed: <strong>{startup.dateAnalyzed}</strong></span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            {getRecommendationBadge(startup.recommendation)}
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Consensus Recommendation</span>
          </div>
        </div>

        {/* Scores Panel */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '32px', alignItems: 'center' }}>
          
          {/* Main Overall Circle Score */}
          <div className="flex-center" style={{ flexDirection: 'column', gap: '8px' }}>
            <div className="score-circle-wrapper">
              <svg className="score-circle-svg">
                <circle className="score-circle-bg" cx="70" cy="70" r="60" />
                <circle 
                  className="score-circle-fill" 
                  cx="70" 
                  cy="70" 
                  r="60" 
                  style={{ 
                    stroke: getScoreColor(startup.scores.overall),
                    strokeDashoffset: 377 - (377 * startup.scores.overall) / 100 
                  }}
                />
              </svg>
              <div className="score-circle-text">
                <span className="score-circle-num">{startup.scores.overall}</span>
                <span className="score-circle-label">Overall</span>
              </div>
            </div>
          </div>

          {/* Subscores breakdowns */}
          <div className="scores-grid-small">
            <div className="score-card-mini">
              <div className="score-card-mini-num" style={{ color: getScoreColor(startup.scores.team) }}>{startup.scores.team}%</div>
              <div className="score-card-mini-label">Team</div>
            </div>
            <div className="score-card-mini">
              <div className="score-card-mini-num" style={{ color: getScoreColor(startup.scores.market) }}>{startup.scores.market}%</div>
              <div className="score-card-mini-label">Market</div>
            </div>
            <div className="score-card-mini">
              <div className="score-card-mini-num" style={{ color: getScoreColor(startup.scores.product) }}>{startup.scores.product}%</div>
              <div className="score-card-mini-label">Product</div>
            </div>
            <div className="score-card-mini">
              <div className="score-card-mini-num" style={{ color: getScoreColor(startup.scores.competition) }}>{startup.scores.competition}%</div>
              <div className="score-card-mini-label">Competition</div>
            </div>
            <div className="score-card-mini">
              <div className="score-card-mini-num" style={{ color: getScoreColor(startup.scores.financial) }}>{startup.scores.financial}%</div>
              <div className="score-card-mini-label">Financial</div>
            </div>
            <div className="score-card-mini">
              <div className="score-card-mini-num" style={{ color: getScoreColor(startup.scores.risk) }}>{startup.scores.risk}%</div>
              <div className="score-card-mini-label">Risk Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="detail-tabs no-print">
        <button className={`detail-tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary & Memo</button>
        <button className={`detail-tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>Team & Product</button>
        <button className={`detail-tab-btn ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}>Market & Business</button>
        <button className={`detail-tab-btn ${activeTab === 'competitors' ? 'active' : ''}`} onClick={() => setActiveTab('competitors')}>Competition Map</button>
        <button className={`detail-tab-btn ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>Financial Model</button>
        <button className={`detail-tab-btn ${activeTab === 'risks' ? 'active' : ''}`} onClick={() => setActiveTab('risks')}>Risks & Flags</button>
        <button className={`detail-tab-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>
          Due Diligence ({visibleQuestions.length})
        </button>
      </div>

      {/* Tab Contents */}
      
      {/* 1. Summary & Memo */}
      {activeTab === 'summary' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Executive Due Diligence Summary {isSimplifyMode && <span className="badge badge-success" style={{ marginLeft: '8px' }}>Rookie ELI5</span>}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Problem Statement</strong>
                <p style={{ marginTop: '6px', fontSize: '14px', lineHeight: '1.5' }}>{execSummary.problem}</p>
              </div>
              <div>
                <strong style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Solution Summary</strong>
                <p style={{ marginTop: '6px', fontSize: '14px', lineHeight: '1.5' }}>{execSummary.solution}</p>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '20px', paddingTop: '16px' }}>
              <strong style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Investment Thesis</strong>
              <p style={{ marginTop: '6px', fontSize: '14px', lineHeight: '1.5', fontStyle: 'italic', borderLeft: '3px solid var(--accent-color)', paddingLeft: '12px' }}>
                {execSummary.investmentThesis}
              </p>
            </div>
          </div>

          {/* Investment Memo Markdown Exporter */}
          {subscription === 'free' ? (
            <div className="card text-center" style={{ padding: '32px' }}>
              <FileText size={28} style={{ color: 'var(--text-muted)', marginBottom: '12px', marginInline: 'auto' }} />
              <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>Investment Memo Exporter Locked</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '400px', margin: '0 auto 16px', lineHeight: '1.4' }}>
                Upgrading to a **Pro Analyst** or **Enterprise** plan unlocks the institutional VC-style investment memo generator.
              </p>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'left' }}>
              <div className="flex-between" style={{ marginBottom: '16px' }}>
                <h3 style={{ fontSize: '18px' }}>VC Investment Memo Draft</h3>
                <button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={handleCopyMemo}>
                  <Copy size={13} /> {copiedMemo ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>
              <pre className="memo-content">{startup.investmentMemo}</pre>
            </div>
          )}
        </div>
      )}

      {/* 2. Team & Product */}
      {activeTab === 'team' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Team Analysis */}
          <div className="card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Founder & Management Evaluation</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Background Summary</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{founderAnalysis.background}</p>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Experience Rating</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{founderAnalysis.experience}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '16px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--success-color)' }}>Key Strengths</strong>
                <ul style={{ paddingLeft: '16px', marginTop: '6px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {founderAnalysis.strengths.map((str, idx) => <li key={idx}>{str}</li>)}
                </ul>
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--danger-color)' }}>Weaknesses</strong>
                <ul style={{ paddingLeft: '16px', marginTop: '6px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {founderAnalysis.weaknesses.map((wk, idx) => <li key={idx}>{wk}</li>)}
                </ul>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '13px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Missing Critical Hires: </span>
              <strong>{founderAnalysis.missingHires}</strong>
            </div>
          </div>

          {/* Product Moat */}
          <div className="card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Product Differentiation & Moat</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Differentiation Factor</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{productAnalysis.differentiation}</p>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Defensibility Moat</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{productAnalysis.moat}</p>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Legal Defensibility (Patents)</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{productAnalysis.defensibility}</p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
              <span>Innovation Score Rating:</span>
              <strong style={{ color: 'var(--accent-color)' }}>{productAnalysis.innovation} / 100</strong>
            </div>
          </div>
        </div>
      )}

      {/* 3. Market & Business Model */}
      {activeTab === 'market' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* Market Analysis Ring */}
          <div className="card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Market Sizing (TAM/SAM/SOM)</h3>
            <TAMChart 
              tam={marketAnalysis.tam} 
              sam={marketAnalysis.sam} 
              som={marketAnalysis.som} 
            />
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', fontSize: '13px' }}>
              <strong>Sector Trends: </strong>
              <span style={{ color: 'var(--text-secondary)' }}>{marketAnalysis.trends}</span>
            </div>
          </div>

          {/* Business Model Details */}
          <div className="card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Business Model & Unit Economics</h3>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Revenue Streams</strong>
              <ul style={{ paddingLeft: '16px', marginTop: '4px', fontSize: '14px' }}>
                {businessModelAnalysis.streams.map((str, idx) => <li key={idx}>{str}</li>)}
              </ul>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pricing Model Details</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{businessModelAnalysis.pricing}</p>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Customer Segments</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{businessModelAnalysis.segments.join(', ')}</p>
            </div>
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Scalability Assessment</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{businessModelAnalysis.scalability}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. Competitor Map */}
      {activeTab === 'competitors' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Feature Comparison Matrix</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Feature Checklist</th>
                    <th>{startup.name}</th>
                    <th>{competitorAnalysis.direct[0] || 'Competitor A'}</th>
                    <th>{competitorAnalysis.direct[1] || 'Competitor B'}</th>
                  </tr>
                </thead>
                <tbody>
                  {competitorAnalysis.features.map((feat, idx) => (
                    <tr key={idx}>
                      <td><strong>{feat.featureName}</strong></td>
                      <td>
                        {feat.startupValue 
                          ? <div className="feature-check"><Check size={16} /></div> 
                          : <div className="feature-cross"><X size={16} /></div>}
                      </td>
                      <td>
                        {feat.competitor1 
                          ? <div className="feature-check"><Check size={16} /></div> 
                          : <div className="feature-cross"><X size={16} /></div>}
                      </td>
                      <td>
                        {feat.competitor2 
                          ? <div className="feature-check"><Check size={16} /></div> 
                          : <div className="feature-cross"><X size={16} /></div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--success-color)' }}>Direct Competitive Advantages</strong>
                <ul style={{ paddingLeft: '16px', marginTop: '6px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {competitorAnalysis.advantages.map((adv, idx) => <li key={idx}>{adv}</li>)}
                </ul>
              </div>
              <div>
                <strong style={{ fontSize: '13px', color: 'var(--danger-color)' }}>Weaknesses relative to peers</strong>
                <ul style={{ paddingLeft: '16px', marginTop: '6px', fontSize: '13px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {competitorAnalysis.weaknesses.map((wk, idx) => <li key={idx}>{wk}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Projections & Financials */}
      {activeTab === 'financials' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          {/* SVG Projections Chart */}
          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px', textAlign: 'left' }}>4-Year Projections Model</h3>
            <FinancialChart data={financialAnalysis.projections} />
          </div>

          {/* Core financial metrics */}
          <div className="card" style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Runway & Burn Statistics</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', border: 'var(--card-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Monthly Burn</span>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--danger-color)', marginTop: '4px' }}>
                  {financialAnalysis.burnRate}
                </div>
              </div>
              <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '16px', borderRadius: '8px', border: 'var(--card-border)' }}>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Calculated Runway</span>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--success-color)', marginTop: '4px' }}>
                  {financialAnalysis.runway}
                </div>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Revenue Growth Velocity</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{financialAnalysis.revenueGrowth}</p>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <strong style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Gross Margins</strong>
              <p style={{ marginTop: '4px', fontSize: '14px' }}>{financialAnalysis.marginAnalysis}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. Risks & Red Flags */}
      {activeTab === 'risks' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Risk Heatmap Chart section */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="card">
              <h3 style={{ fontSize: '18px', marginBottom: '16px', textAlign: 'left' }}>Risk Matrix Heatmap</h3>
              <RiskHeatmap risks={riskAssessment} />
            </div>

            {/* Red Flags warnings column */}
            <div className="card" style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Critical Red Flag Detections</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '-12px', marginBottom: '16px' }}>
                VentureIQ automatically scans inputs for atypical structural weaknesses.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {redFlags.map((flag, idx) => (
                  <div key={idx} className="redflag-item">
                    <ShieldAlert size={20} style={{ color: 'var(--danger-color)', flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{flag.flagName}</strong>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>{flag.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bull vs Bear section */}
          <div className="bull-bear-container">
            <div className="card bull-card" style={{ textAlign: 'left' }}>
              <h4 className="bull-title"><Award size={18} /> Thesis Upside (Bull Case)</h4>
              <ul className="bullet-list">
                {bullBear.bull.map((bl, idx) => (
                  <li key={idx}><CheckCircle2 size={16} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '2px' }} /> <span>{bl}</span></li>
                ))}
              </ul>
            </div>

            <div className="card bear-card" style={{ textAlign: 'left' }}>
              <h4 className="bear-title"><ShieldAlert size={18} /> Risk Downside (Bear Case)</h4>
              <ul className="bullet-list">
                {bullBear.bear.map((br, idx) => (
                  <li key={idx}><X size={16} style={{ color: 'var(--danger-color)', flexShrink: 0, marginTop: '2px' }} /> <span>{br}</span></li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

      {/* 7. Due Diligence Questions */}
      {activeTab === 'questions' && (
        <div className="animate-fade-in" style={{ textAlign: 'left' }}>
          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>High-Quality Due Diligence Questions</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '24px' }}>
              Grill the founders with these domain questions during screening calls. Click on any question to view the analysis rationale.
            </p>

            {/* Questions count check warning */}
            {subscription === 'free' && (
              <div style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning-color)', padding: '12px', borderRadius: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <HelpCircle size={16} />
                <span>Showing 5 of 20 questions. Upgrade to Pro/Enterprise to unlock all due diligence questions.</span>
              </div>
            )}

            <div>
              {visibleQuestions.map((q) => {
                const isOpen = openQuestion === q.id;
                return (
                  <div key={q.id} className="question-accordion">
                    <div className="question-header" onClick={() => setOpenQuestion(isOpen ? null : q.id)}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span className="badge badge-primary" style={{ padding: '2px 8px', fontSize: '10px' }}>{q.category}</span>
                        <span className="question-title">{q.id}. {q.question}</span>
                      </div>
                      {isOpen ? <ChevronUp size={16} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={16} style={{ color: 'var(--text-muted)' }} />}
                    </div>
                    {isOpen && (
                      <div className="question-content animate-fade-in">
                        <strong>Analyst Screening Objective:</strong>
                        <p style={{ marginTop: '4px', lineHeight: '1.4' }}>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
