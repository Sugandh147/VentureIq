import React, { useState } from 'react';
import { Layers, Lock, Send, MessageSquare, Plus, ArrowRight, UserPlus, CheckCircle } from 'lucide-react';

export default function Workspace({ subscription, setSubscription, startups }) {
  const [comments, setComments] = useState([
    { id: 1, user: "Sarah Jenkins", role: "MD, Venture Fund", text: "QuantumVault looks solid. We should verify if they have any active discussions with defense contractors in Europe. Let's ask them on the upcoming call.", time: "2 hours ago" },
    { id: 2, user: "Marcus Vance", role: "Principal Analyst", text: "Reviewed BioSynthetix's pilot contracts. The royalty fee structure is standard and the 2% clause is locked. Highly recommend pushing to the investment committee.", time: "1 day ago" },
    { id: 3, user: "Elena Rostova", role: "Technical Director", text: "ApexAutonomy's accuracy drift (±5cm) might block standard high-speed logistics grids. We should inspect if their night-vision stack operates consistently under reflective flooring.", time: "3 days ago" }
  ]);
  const [newComment, setNewComment] = useState("");
  const [dealflow, setDealflow] = useState([
    { id: '1', name: 'QuantumVault', stage: 'Deep Due Diligence', score: 92, lead: 'Sarah Jenkins' },
    { id: '2', name: 'BioSynthetix', stage: 'IC Review', score: 83, lead: 'Marcus Vance' },
    { id: '3', name: 'ApexAutonomy', stage: 'Screening', score: 65, lead: 'Sarah Jenkins' },
    { id: '4', name: 'SustainaCart', stage: 'Declined', score: 43, lead: 'Marcus Vance' }
  ]);

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      {
        id: comments.length + 1,
        user: "You (Investment Associate)",
        role: "VentureIQ Admin",
        text: newComment,
        time: "Just now"
      },
      ...comments
    ]);
    setNewComment("");
  };

  const handleStageChange = (dealId, nextStage) => {
    setDealflow(dealflow.map(deal => 
      deal.id === dealId ? { ...deal, stage: nextStage } : deal
    ));
  };

  // Lock State for non-pro tiers
  if (subscription !== 'pro') {
    return (
      <div className="container animate-fade-in" style={{ paddingBottom: '40px', maxWidth: '800px', margin: '0 auto', textAlign: 'center', paddingTop: '60px' }}>
        <div className="card" style={{ padding: '48px 24px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Lock size={28} />
          </div>
          <h2 style={{ fontSize: '26px', marginBottom: '12px' }}>VC Shared Workspaces</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 24px', lineHeight: '1.5' }}>
            Team collaboration, shared deal flow pipelines, discussion boards, and portfolio monitoring are premium features reserved for **Pro Analyst** subscribers.
          </p>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', maxWidth: '400px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left', marginBottom: '24px', fontSize: '14px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> <span>Invite up to 10 colleagues</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> <span>Real-time commenting & consensus votes</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> <span>Custom Kanban deal-flow pipelines</span>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setSubscription('pro')}>
              Upgrade to Pro (1000rs)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', textAlign: 'left', margin: 0 }}>VC Shared Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Collaborative screening and unified investment deal flow tracking.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-outline" style={{ display: 'flex', gap: '6px' }}>
            <UserPlus size={16} /> Invite Colleague
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: '24px' }}>
        {/* Deal-Flow Pipeline Board */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <h3 style={{ fontSize: '18px', marginBottom: '16px', textAlign: 'left' }}>Active Deal Flow Pipeline</h3>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Startup Name</th>
                    <th>Current Pipeline Stage</th>
                    <th>VentureIQ Score</th>
                    <th>Lead Partner</th>
                    <th style={{ textAlign: 'right' }}>Update Stage</th>
                  </tr>
                </thead>
                <tbody>
                  {dealflow.map(deal => (
                    <tr key={deal.id}>
                      <td><strong>{deal.name}</strong></td>
                      <td>
                        <span className={`badge ${
                          deal.stage === 'Declined' ? 'badge-danger' : 
                          deal.stage === 'IC Review' ? 'badge-success' : 
                          deal.stage === 'Deep Due Diligence' ? 'badge-primary' : 'badge-warning'
                        }`}>
                          {deal.stage}
                        </span>
                      </td>
                      <td>
                        <strong style={{ color: deal.score >= 80 ? 'var(--success-color)' : (deal.score >= 60 ? 'var(--warning-color)' : 'var(--danger-color)') }}>
                          {deal.score}/100
                        </strong>
                      </td>
                      <td>{deal.lead}</td>
                      <td style={{ textAlign: 'right' }}>
                        <select 
                          className="form-select" 
                          value={deal.stage} 
                          onChange={(e) => handleStageChange(deal.id, e.target.value)}
                          style={{ padding: '4px 8px', fontSize: '12px', width: '150px' }}
                        >
                          <option value="Screening">Screening</option>
                          <option value="Under Analysis">Under Analysis</option>
                          <option value="Deep Due Diligence">Deep Due Diligence</option>
                          <option value="IC Review">IC Review</option>
                          <option value="Declined">Declined</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Team Collaboration Activity Feed */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', maxHeight: '600px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={18} /> Team Discussions
          </h3>

          <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <input 
              type="text" 
              className="form-input" 
              placeholder="Add consensus thoughts or risk notices..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '10px' }} aria-label="Send comment">
              <Send size={16} />
            </button>
          </form>

          <div className="activity-feed" style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
            {comments.map(comment => (
              <div key={comment.id} className="activity-item">
                <div className="user-avatar">
                  {comment.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="activity-body">
                  <div className="activity-header">
                    <span className="activity-username">{comment.user}</span>
                    <span className="activity-time">{comment.time}</span>
                  </div>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '-2px' }}>{comment.role}</p>
                  <div className="activity-comment">
                    {comment.text}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
