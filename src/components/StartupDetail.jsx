import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Download, Check, X, ShieldAlert, Award, FileText, CheckCircle2, ChevronDown, ChevronUp, Copy, HelpCircle, MessageSquare, Send, Calendar, Trash2, Radio } from 'lucide-react';
import { TAMChart, FinancialChart, RiskHeatmap } from './Charts';

export default function StartupDetail({ startup, onBack, subscription, refreshStartups }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [openQuestion, setOpenQuestion] = useState(null);
  const [copiedMemo, setCopiedMemo] = useState(false);
  const [isSimplifyMode, setIsSimplifyMode] = useState(false);

  // Advanced Interactive States
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  
  const [votes, setVotes] = useState({ invest: 0, watch: 0, pass: 0, userVote: null });
  const [signals, setSignals] = useState([]);

  // Auto-scroll chat window
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatLoading]);

  // Load backend details when startup ID changes
  useEffect(() => {
    if (!startup) return;

    fetch(`http://localhost:5000/api/startups/${startup.id}/comments`)
      .then(res => res.json())
      .then(data => setComments(data))
      .catch(err => console.error("Error loading comments:", err));

    fetch(`http://localhost:5000/api/startups/${startup.id}/votes`)
      .then(res => res.json())
      .then(data => setVotes(data))
      .catch(err => console.error("Error loading votes:", err));

    fetch(`http://localhost:5000/api/startups/${startup.id}/signals`)
      .then(res => res.json())
      .then(data => setSignals(data))
      .catch(err => console.error("Error loading signals:", err));

    // Reset Chat history with initial greeting (deferred to prevent render cascades)
    setTimeout(() => {
      setChatHistory([
        { 
          sender: 'ai', 
          text: `Hello! I am your AI Due Diligence Co-pilot. Ask me anything about **${startup.name}**'s market size, financials, risk matrix, or potential stress tests.` 
        }
      ]);
    }, 0);
  }, [startup]);

  const handleVote = (voteType) => {
    const finalVote = votes.userVote === voteType ? null : voteType;
    fetch(`http://localhost:5000/api/startups/${startup.id}/vote`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ voteType: finalVote })
    })
      .then(res => res.json())
      .then(data => {
        setVotes(data);
        if (refreshStartups) refreshStartups();
      })
      .catch(err => console.error("Error casting vote:", err));
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    fetch(`http://localhost:5000/api/startups/${startup.id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newCommentText, author: 'VC Analyst' })
    })
      .then(res => res.json())
      .then(data => {
        setComments(prev => [...prev, data]);
        setNewCommentText("");
      })
      .catch(err => console.error("Error adding comment:", err));
  };

  const handleDeleteComment = (commentId) => {
    fetch(`http://localhost:5000/api/startups/${startup.id}/comments/${commentId}`, {
      method: 'DELETE'
    })
      .then(() => {
        setComments(prev => prev.filter(c => c.id !== commentId));
      })
      .catch(err => console.error("Error deleting comment:", err));
  };

  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim() || chatLoading) return;

    const userMsg = { sender: 'user', text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage("");
    setChatLoading(true);

    fetch(`http://localhost:5000/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startupId: startup.id,
        message: userMsg.text,
        history: chatHistory.concat(userMsg)
      })
    })
      .then(res => res.json())
      .then(data => {
        setChatHistory(prev => [...prev, { sender: 'ai', text: data.reply }]);
      })
      .catch(err => {
        console.error("Error chatting:", err);
        setChatHistory(prev => [...prev, { sender: 'ai', text: "Sorry, I had trouble reaching the AI co-pilot. Please check backend connection." }]);
      })
      .finally(() => {
        setChatLoading(false);
      });
  };

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
            
            {/* Analyst Voting Widget */}
            <div className="flex-center no-print" style={{ gap: '6px', marginTop: '4px', backgroundColor: 'var(--bg-primary)', padding: '4px', borderRadius: '8px', border: 'var(--card-border)' }}>
              <button 
                onClick={() => handleVote('invest')} 
                className="btn"
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '11px', 
                  gap: '4px', 
                  borderRadius: '6px', 
                  backgroundColor: votes.userVote === 'invest' ? 'var(--success-bg)' : 'transparent',
                  color: votes.userVote === 'invest' ? 'var(--success-color)' : 'var(--text-secondary)',
                  border: votes.userVote === 'invest' ? '1px solid var(--success-color)' : '1px solid transparent'
                }}
                title="Vote to Invest"
              >
                👍 Invest ({votes.invest || 0})
              </button>
              <button 
                onClick={() => handleVote('watch')} 
                className="btn"
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '11px', 
                  gap: '4px', 
                  borderRadius: '6px', 
                  backgroundColor: votes.userVote === 'watch' ? 'var(--accent-glow)' : 'transparent',
                  color: votes.userVote === 'watch' ? 'var(--accent-color)' : 'var(--text-secondary)',
                  border: votes.userVote === 'watch' ? '1px solid var(--accent-color)' : '1px solid transparent'
                }}
                title="Vote to Watch"
              >
                👀 Watch ({votes.watch || 0})
              </button>
              <button 
                onClick={() => handleVote('pass')} 
                className="btn"
                style={{ 
                  padding: '4px 8px', 
                  fontSize: '11px', 
                  gap: '4px', 
                  borderRadius: '6px', 
                  backgroundColor: votes.userVote === 'pass' ? 'var(--danger-bg)' : 'transparent',
                  color: votes.userVote === 'pass' ? 'var(--danger-color)' : 'var(--text-secondary)',
                  border: votes.userVote === 'pass' ? '1px solid var(--danger-color)' : '1px solid transparent'
                }}
                title="Vote to Pass"
              >
                👎 Pass ({votes.pass || 0})
              </button>
            </div>
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
      <div className="detail-tabs no-print" style={{ overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', gap: '4px' }}>
        <button className={`detail-tab-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>Summary & Memo</button>
        <button className={`detail-tab-btn ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>Team & Product</button>
        <button className={`detail-tab-btn ${activeTab === 'market' ? 'active' : ''}`} onClick={() => setActiveTab('market')}>Market & Business</button>
        <button className={`detail-tab-btn ${activeTab === 'competitors' ? 'active' : ''}`} onClick={() => setActiveTab('competitors')}>Competition Map</button>
        <button className={`detail-tab-btn ${activeTab === 'financials' ? 'active' : ''}`} onClick={() => setActiveTab('financials')}>Financial Model</button>
        <button className={`detail-tab-btn ${activeTab === 'risks' ? 'active' : ''}`} onClick={() => setActiveTab('risks')}>Risks & Flags</button>
        <button className={`detail-tab-btn ${activeTab === 'questions' ? 'active' : ''}`} onClick={() => setActiveTab('questions')}>
          Due Diligence ({visibleQuestions.length})
        </button>
        <button className={`detail-tab-btn ${activeTab === 'copilot' ? 'active' : ''}`} onClick={() => setActiveTab('copilot')}>AI Co-pilot</button>
        <button className={`detail-tab-btn ${activeTab === 'signals' ? 'active' : ''}`} onClick={() => setActiveTab('signals')}>Web Signals ({signals.length})</button>
        <button className={`detail-tab-btn ${activeTab === 'collab' ? 'active' : ''}`} onClick={() => setActiveTab('collab')}>Collaboration ({comments.length})</button>
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

      {/* 8. AI Co-pilot Chatbot */}
      {activeTab === 'copilot' && (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '24px', textAlign: 'left' }}>
          {/* Chat Window */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '520px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '12px' }}>
              <MessageSquare size={20} style={{ color: 'var(--accent-color)' }} />
              <div>
                <h3 style={{ fontSize: '16px', margin: 0 }}>AI Due Diligence Co-pilot</h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Conversational Analyst Assistant</span>
              </div>
            </div>

            {/* Message Log */}
            <div className="chat-messages-log" style={{ flex: 1, overflowY: 'auto', paddingRight: '6px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '12px' }}>
              {chatHistory.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}
                >
                  {/* Parse markdown-like content in AI messages */}
                  {msg.sender === 'user' ? (
                    <p style={{ fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{msg.text}</p>
                  ) : (
                    <div style={{ fontSize: '13px' }}>
                      {msg.text.split('\n').map((line, lIdx) => {
                        if (line.startsWith('### ')) {
                          return <h4 key={lIdx} style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '10px', marginBottom: '4px', color: 'var(--accent-color)' }}>{line.replace('### ', '')}</h4>;
                        }
                        if (line.startsWith('- ')) {
                          return <div key={lIdx} style={{ paddingLeft: '8px', marginBottom: '2px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>&bull; <span>{line.replace('- ', '')}</span></div>;
                        }
                        return <p key={lIdx} style={{ margin: '0 0 6px 0', lineHeight: '1.4' }}>{line}</p>;
                      })}
                    </div>
                  )}
                </div>
              ))}
              {chatLoading && (
                <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-tertiary)', border: 'var(--card-border)', padding: '12px 16px', borderRadius: '12px 12px 12px 2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <div className="spinner-ring" style={{ width: '12px', height: '12px', borderWidth: '2px', margin: 0 }} />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Co-pilot is writing report analysis...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Form */}
            <form onSubmit={handleSendChatMessage} style={{ display: 'flex', gap: '8px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder={`Ask about ${startup.name}'s runway, risks, or market...`}
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                disabled={chatLoading}
                style={{ fontSize: '13px', padding: '10px' }}
              />
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={!chatMessage.trim() || chatLoading}
                style={{ padding: '10px 14px', borderRadius: '8px' }}
              >
                <Send size={14} />
              </button>
            </form>
          </div>

          {/* Chat Sidebar/Diligence Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <h4 style={{ fontSize: '14px', marginBottom: '8px' }}>Stress Test Prompt Tips</h4>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '8px' }}>
                Challenge the business model:
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <button 
                  onClick={() => setChatMessage("What if their monthly cash burn doubles next month?")}
                  className="btn btn-secondary" 
                  style={{ fontSize: '11px', padding: '6px 8px', width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                >
                  💸 "What if burn doubles?"
                </button>
                <button 
                  onClick={() => setChatMessage("Detail the legal and copyright risks of their product.")}
                  className="btn btn-secondary" 
                  style={{ fontSize: '11px', padding: '6px 8px', width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                >
                  ⚖️ "Show regulatory threats"
                </button>
                <button 
                  onClick={() => setChatMessage("How defensible is their competitive moat?")}
                  className="btn btn-secondary" 
                  style={{ fontSize: '11px', padding: '6px 8px', width: '100%', justifyContent: 'flex-start', textAlign: 'left' }}
                >
                  🛡️ "Check product moat"
                </button>
              </div>
            </div>

            <div className="card" style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)' }}>
              <h4 style={{ fontSize: '13px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldAlert size={14} style={{ color: 'var(--warning-color)' }} /> Sandbox Secure
              </h4>
              <p style={{ fontSize: '10px', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                Queries are processed locally inside VentureIQ. Model updates do not train third-party LLMs.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 9. Live Web Signals Feed */}
      {activeTab === 'signals' && (
        <div className="animate-fade-in" style={{ textAlign: 'left' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '16px' }}>
              <Radio size={20} className="pulse-glow" style={{ color: 'var(--success-color)' }} />
              <div>
                <h3 style={{ fontSize: '18px', margin: 0 }}>Live Scraper Web Signals</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Automated external data scans</span>
              </div>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '20px' }}>
              VentureIQ continuously monitors signals on web registries, social platforms, and filing servers to alert investors of corporate changes.
            </p>

            <div className="signals-timeline">
              {signals.map((sig) => (
                <div key={sig.id} className="signal-node">
                  <div className={`signal-marker ${sig.status === 'positive' ? 'positive' : 'neutral'}`} />
                  <div>
                    <div className="flex-between">
                      <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{sig.type} &bull; {sig.title}</strong>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> {new Date(sig.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.4' }}>
                      {sig.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 10. Collaboration Board */}
      {activeTab === 'collab' && (
        <div className="animate-fade-in" style={{ textAlign: 'left' }}>
          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Investment Analyst Collaboration Board</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '20px' }}>
              Add internal review notes, research observations, and checklist logs for due diligence alignment.
            </p>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Create Analyst Note</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Enter observation (e.g. Verified customer traction, found conflict in capitalization ratios...)" 
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  style={{ fontSize: '13px', minHeight: '80px' }}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={!newCommentText.trim()}
                style={{ alignSelf: 'flex-end', padding: '8px 16px', fontSize: '13px' }}
              >
                Publish Note
              </button>
            </form>

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c.id} className="analyst-comment-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="analyst-avatar-circle">
                          {c.author.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div style={{ textAlign: 'left' }}>
                          <span style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{c.author}</span>
                          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '1px' }}>
                            {new Date(c.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDeleteComment(c.id)}
                        style={{ color: 'var(--danger-color)', opacity: 0.6, cursor: 'pointer' }}
                        title="Delete note"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.4', paddingLeft: '40px' }}>
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                  No analyst notes published yet. Write the first note above!
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
