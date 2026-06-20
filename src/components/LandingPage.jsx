import React from 'react';
import { ShieldCheck, Flame, BarChart3, CheckCircle, HelpCircle, Zap, Award } from 'lucide-react';

export default function LandingPage({ setCurrentTab, subscription, setSubscription }) {
  const handleUpgrade = (tier) => {
    setSubscription(tier);
    setCurrentTab('billing');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="container">
          <div className="hero-tag">VentureIQ platform</div>
          <h1>Institutional AI Startup Due Diligence</h1>
          <p>
            VentureIQ digests pitch decks, financial sheets, and website data to produce comprehensive, professional VC-grade risk summaries and investment scores in seconds.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setCurrentTab('dashboard')}>
              Launch Analytics Terminal
            </button>
            <button className="btn btn-outline" onClick={() => setCurrentTab('calculator')}>
              Cap Table Simulator
            </button>
          </div>

          {/* Simple Mock Terminal Graphic */}
          <div className="card" style={{ maxWidth: '900px', margin: '0 auto', padding: '16px', background: 'var(--bg-tertiary)' }}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ff5f56' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ffbd2e' }}></span>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#27c93f' }}></span>
            </div>
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '8px', padding: '24px', textAlign: 'left', border: 'var(--card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Snowflake Due Diligence</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>AI / Software &bull; Growth Stage</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-success">Strong Invest</span>
                  <span className="badge badge-primary">Score: 88/100</span>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Executive Summary</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                    Multi-cloud data warehouse and sharing platform separating compute and storage layers. Category-defining data lake architecture with Net Revenue Retention (NRR) of 130%+...
                  </p>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', marginBottom: '8px', color: 'var(--text-secondary)' }}>AI Score Matrix</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>Team Credibility</span>
                      <strong style={{ color: 'var(--success-color)' }}>92%</strong>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                      <div style={{ width: '92%', height: '100%', background: 'var(--success-color)', borderRadius: '3px' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginTop: '4px' }}>
                      <span>Product Moat</span>
                      <strong style={{ color: 'var(--success-color)' }}>92%</strong>
                    </div>
                    <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '3px' }}>
                      <div style={{ width: '92%', height: '100%', background: 'var(--success-color)', borderRadius: '3px' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Premium Upgrade Banner */}
      <section className="container" style={{ margin: '20px auto 40px' }}>
        <div className="card animate-fade-in" style={{ background: 'linear-gradient(135deg, var(--accent-glow) 0%, rgba(37, 99, 235, 0.05) 100%)', borderColor: 'var(--accent-color)', padding: '32px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap style={{ color: 'var(--accent-color)' }} /> Limited Standard Terminal Limits
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', maxWidth: '600px' }}>
              Upgrade to a Pro account today to remove analysis limits and gain access to custom TAM circles, financial curves, red flag warning matrices, cap table dilution simulator, and 20 screening questions.
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => setCurrentTab('calculator')}>
            Try Cap Table Simulator
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <h2 className="section-title">Institutional Capabilities</h2>
          <p className="section-subtitle">
            An AI-powered co-pilot built to standardize risk assessment and structure investment recommendations.
          </p>

          <div className="features-grid">
            <div className="card feature-card">
              <div className="feature-icon-wrapper">
                <BarChart3 size={24} />
              </div>
              <h3>Dynamic Score Breakdown</h3>
              <p>
                Get segmented scores spanning Team, Market, Product, Financials, and Risk, giving a standardized 0-100 score for quick comparisons.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={24} />
              </div>
              <h3>Automated Red Flag Warnings</h3>
              <p>
                Instantly flag dangerous indicators like short cash runways, market size exaggerations, customer concentrations, and outsourced technical anchors.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-wrapper">
                <HelpCircle size={24} />
              </div>
              <h3>20 DD Investor Questions</h3>
              <p>
                Generate 20 tailored, domain-specific screening questions covering product engineering, IP, and financials to grill founders in pitch meetings.
              </p>
            </div>

            <div className="card feature-card">
              <div className="feature-icon-wrapper">
                <Flame size={24} />
              </div>
              <h3>Bull & Bear Analysis</h3>
              <p>
                Get unbiased pros and cons, contrasting the core upside catalysts with underlying downside risks to maintain balanced thesis views.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="pricing-section">
        <div className="container">
          <h2 className="section-title">Investment Pricing Plans</h2>
          <p className="section-subtitle">
            Flexible plans designed for active angel investors, accelerators, and VC teams.
          </p>

          <div className="pricing-grid" style={{ maxWidth: '750px', margin: '0 auto' }}>
            {/* Free Tier */}
            <div className={`card pricing-card ${subscription === 'free' ? 'popular' : ''}`}>
              <div className="pricing-header">
                <h3>Free Tier</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Explore VentureIQ basic features</p>
                <div className="pricing-price" style={{ margin: '20px 0' }}>
                  0Rs <span>/ month</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> 1 Startup Analysis per Month</li>
                <li><CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> 0-100 Score Summary</li>
                <li><CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> 5 Basic Screening Questions</li>
                <li style={{ color: 'var(--text-muted)' }}><CheckCircle size={16} /> Advanced charts (Locked)</li>
                <li style={{ color: 'var(--text-muted)' }}><CheckCircle size={16} /> Cap Table Simulator (Locked)</li>
              </ul>
              <button 
                className={`btn ${subscription === 'free' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleUpgrade('free')}
                disabled={subscription === 'free'}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {subscription === 'free' ? 'Active Plan' : 'Activate Free'}
              </button>
            </div>

            {/* Pro Tier */}
            <div className={`card pricing-card ${subscription === 'pro' ? 'popular' : ''}`}>
              {subscription === 'pro' && <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--accent-color)', color: '#fff', fontSize: '10px', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold' }}>ACTIVE TERMINAL</div>}
              <div className="pricing-header">
                <h3>Pro Analyst</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>For active investors & accelerators</p>
                <div className="pricing-price" style={{ margin: '20px 0' }}>
                  1000Rs <span>/ month</span>
                </div>
              </div>
              <ul className="pricing-features">
                <li><CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> Unlimited Startup Analyses</li>
                <li><CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> Full VC Investment Memos</li>
                <li><CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> 20 Tailored DD Screening Questions</li>
                <li><CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> Advanced SVG charts & visual metrics</li>
                <li><CheckCircle size={16} style={{ color: 'var(--success-color)' }} /> Cap Table & Dilution exit waterfall simulator</li>
              </ul>
              <button 
                className={`btn ${subscription === 'pro' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleUpgrade('pro')}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {subscription === 'pro' ? 'Active Plan' : 'Upgrade to Pro'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
