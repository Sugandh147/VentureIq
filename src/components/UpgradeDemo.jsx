import React from 'react';
import { ShieldCheck, Zap, Award, CheckCircle2, ArrowRight, Landmark } from 'lucide-react';

export default function UpgradeDemo({ subscription, setSubscription, setCurrentTab }) {
  const handleUpgrade = (tier) => {
    setSubscription(tier);
    setCurrentTab('billing'); // Redirect to billing checkout
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '60px', paddingTop: '20px' }}>
      {/* Hero Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="hero-tag" style={{ marginBottom: '16px' }}>conversion hub</div>
        <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '16px' }}>Unlock Institutional Due Diligence</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '650px', margin: '0 auto', lineHeight: '1.5' }}>
          Transition from basic limits to professional VC-style memos, custom market sizing charts, and collaborative workspace pipelines.
        </p>
      </div>

      {/* Before / After Comparison Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '48px', maxWidth: '900px', marginInline: 'auto' }}>
        {/* Free Plan Limits */}
        <div className="card" style={{ borderLeft: '4px solid var(--warning-color)', padding: '32px', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'var(--warning-bg)', color: 'var(--warning-color)', padding: '10px', borderRadius: '50%' }}>
              <Award size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Standard Free Account</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Best for introductory exploration</p>
            </div>
          </div>
          
          <ul className="pricing-features" style={{ gap: '16px' }}>
            <li style={{ opacity: 0.8 }}><CheckCircle2 size={16} style={{ color: 'var(--warning-color)' }} /> 1 Startup analysis credit</li>
            <li style={{ opacity: 0.6 }}><CheckCircle2 size={16} style={{ color: 'var(--text-muted)' }} /> 5 Basic due diligence questions</li>
            <li style={{ opacity: 0.4 }}><span style={{ textDecoration: 'line-through' }}>Advanced concentric market sizing charts</span></li>
            <li style={{ opacity: 0.4 }}><span style={{ textDecoration: 'line-through' }}>Copyable VC-style investment memos</span></li>
            <li style={{ opacity: 0.4 }}><span style={{ textDecoration: 'line-through' }}>Shared collaborative team workspaces</span></li>
          </ul>
        </div>

        {/* Premium Plan Capabilities */}
        <div className="card" style={{ borderLeft: '4px solid var(--accent-color)', padding: '32px', textAlign: 'left', background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ backgroundColor: 'var(--accent-glow)', color: 'var(--accent-color)', padding: '10px', borderRadius: '50%' }}>
              <Zap size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Pro Analyst Terminal</h3>
              <p style={{ fontSize: '12px', color: 'var(--accent-color)' }}>For active angels, syndicates, and VC groups</p>
            </div>
          </div>
          
          <ul className="pricing-features" style={{ gap: '16px' }}>
            <li><CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} /> <strong>Unlimited</strong> real startup analyses</li>
            <li><CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} /> Full <strong>20 screening questions</strong> customized by sector</li>
            <li><CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} /> Interactive **TAM/SAM/SOM rings** and financial curves</li>
            <li><CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} /> Automated **Red Flag detectors** & copypaste VC memos</li>
            <li><CheckCircle2 size={16} style={{ color: 'var(--success-color)' }} /> Shared workspaces & deal flow status tracking</li>
          </ul>
        </div>
      </div>

      {/* Quick Upgrade Cards */}
      <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '32px' }}>Account Upgrade</h2>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        
        {/* Pro Plan */}
        <div className="card pricing-card popular" style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Pro Analyst</h3>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Full access suite</p>
              </div>
              <span className="badge badge-primary">Recommended</span>
            </div>
            
            <div className="pricing-price" style={{ margin: '12px 0' }}>
              1000rs <span>/ month</span>
            </div>
            
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
              Unlock unlimited startup queries, copy custom investment memos, view localized financial line charts, and access collaborative workspaces.
            </p>
          </div>

          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => handleUpgrade('pro')}>
            Upgrade to Pro (1000rs) <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* trust badges */}
      <div className="flex-center" style={{ marginTop: '56px', gap: '32px', flexWrap: 'wrap', opacity: 0.6, fontSize: '13px', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Landmark size={16} /> <span>Security Audited Platform</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldCheck size={16} /> <span>Secure bank connections enabled</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckCircle2 size={16} /> <span>Trusted by 400+ Institutional Funds</span>
        </div>
      </div>
    </div>
  );
}
