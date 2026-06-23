import { ShieldCheck, Flame, BarChart3, CheckCircle, HelpCircle, Zap } from 'lucide-react';

export default function LandingPage({ setCurrentTab, subscription, setSubscription }) {
  const handleUpgrade = (tier) => {
    setSubscription(tier);
    setCurrentTab('billing');
  };

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '60px' }}>
      {/* Hero Section */}
      <section className="landing-hero" style={{ padding: '60px 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'center', textAlign: 'left' }}>
          <div>
            <div className="hero-tag">VentureIQ platform</div>
            <h1 style={{ fontSize: '46px', lineHeight: '1.15', fontWeight: '800', marginBottom: '20px', textAlign: 'left' }}>Institutional AI Startup Due Diligence</h1>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '32px', textAlign: 'left', lineHeight: '1.6' }}>
              VentureIQ digests pitch decks, financial sheets, and website data to produce comprehensive, professional VC-grade risk summaries, interactive cap table models, and investment scores in seconds.
            </p>
            <div className="hero-actions" style={{ justifyContent: 'flex-start', marginInline: 0, gap: '12px' }}>
              <button className="btn btn-primary" onClick={() => setCurrentTab('dashboard')}>
                Launch Analytics Terminal
              </button>
              <button className="btn btn-outline" onClick={() => setCurrentTab('calculator')}>
                Cap Table Simulator
              </button>
            </div>
          </div>

          {/* Interactive Code-Based SVG & CSS Graphics Animation */}
          <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }} className="no-print">
            <div style={{ position: 'absolute', inset: '-15px', background: 'var(--accent-glow)', filter: 'blur(50px)', borderRadius: '24px', opacity: 0.5, zIndex: 1 }} />
            
            <div style={{
              width: '100%',
              maxWidth: '480px',
              borderRadius: '16px',
              border: 'var(--card-border)',
              boxShadow: 'var(--shadow-lg)',
              background: 'var(--bg-secondary)',
              padding: '16px',
              position: 'relative',
              zIndex: 2,
              transform: 'perspective(1000px) rotateY(-6deg) rotateX(3deg)',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.5s ease',
              cursor: 'pointer',
              overflow: 'hidden'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.03)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15), 0 0 30px var(--accent-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'perspective(1000px) rotateY(-6deg) rotateX(3deg)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            >
              <svg viewBox="0 0 500 400" style={{ width: '100%', height: 'auto', display: 'block' }}>
                <defs>
                  {/* Grid pattern */}
                  <pattern id="radar-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="var(--border-color)" strokeWidth="0.5" opacity="0.4" />
                  </pattern>
                  {/* Glowing gradients */}
                  <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0" />
                  </radialGradient>
                </defs>

                <style>{`
                  @keyframes rotate-sweep {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  @keyframes pulse-ring {
                    0% { r: 10px; opacity: 1; }
                    100% { r: 70px; opacity: 0; }
                  }
                  @keyframes flow-dash {
                    to { stroke-dashoffset: -20; }
                  }
                  @keyframes float-node {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                  }
                  .grid-bg {
                    fill: url(#radar-grid);
                  }
                  .scan-sweep {
                    transform-origin: 250px 200px;
                    animation: rotate-sweep 8s linear infinite;
                  }
                  .pulse-circle {
                    transform-origin: 250px 200px;
                    animation: pulse-ring 4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                  }
                  .pulse-circle-delayed {
                    transform-origin: 250px 200px;
                    animation: pulse-ring 4s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
                    animation-delay: 2s;
                  }
                  .flowing-path {
                    stroke-dasharray: 6,4;
                    animation: flow-dash 1.2s linear infinite;
                  }
                  .node-group {
                    transition: transform 0.3s ease;
                  }
                  .node-group:hover {
                    transform: scale(1.1);
                  }
                  .node-1 { animation: float-node 5s ease-in-out infinite; transform-origin: 150px 110px; }
                  .node-2 { animation: float-node 6s ease-in-out infinite; animation-delay: 1s; transform-origin: 360px 130px; }
                  .node-3 { animation: float-node 5.5s ease-in-out infinite; animation-delay: 0.5s; transform-origin: 130px 290px; }
                  .node-4 { animation: float-node 6.5s ease-in-out infinite; animation-delay: 1.5s; transform-origin: 350px 280px; }
                  .status-text {
                    font-family: monospace;
                    font-size: 10px;
                    fill: var(--text-muted);
                  }
                `}</style>

                {/* Cyber Grid Background */}
                <rect width="500" height="400" className="grid-bg" rx="10" />

                {/* Radar Concentric Rings */}
                <circle cx="250" cy="200" r="130" stroke="var(--border-color)" strokeWidth="1" fill="none" opacity="0.5" />
                <circle cx="250" cy="200" r="95" stroke="var(--border-color)" strokeWidth="1" fill="none" opacity="0.7" />
                <circle cx="250" cy="200" r="60" stroke="var(--accent-color)" strokeWidth="1" fill="none" opacity="0.3" />

                {/* Radial glow background at center */}
                <circle cx="250" cy="200" r="100" fill="url(#center-glow)" pointerEvents="none" />

                {/* Pulsing Concentric waves from scanner core */}
                <circle cx="250" cy="200" r="30" stroke="var(--accent-color)" strokeWidth="1.5" fill="none" className="pulse-circle" />
                <circle cx="250" cy="200" r="30" stroke="var(--accent-color)" strokeWidth="1.5" fill="none" className="pulse-circle-delayed" />

                {/* Flowing connection lines to the 4 nodes */}
                <line x1="250" y1="200" x2="150" y2="110" stroke="var(--success-color)" strokeWidth="1.5" className="flowing-path" />
                <line x1="250" y1="200" x2="360" y2="130" stroke="var(--accent-color)" strokeWidth="1.5" className="flowing-path" />
                <line x1="250" y1="200" x2="130" y2="290" stroke="var(--warning-color)" strokeWidth="1.5" className="flowing-path" />
                <line x1="250" y1="200" x2="350" y2="280" stroke="var(--danger-color)" strokeWidth="1.5" className="flowing-path" />

                {/* Rotating scanner sweep */}
                <line x1="250" y1="200" x2="250" y2="70" stroke="var(--accent-color)" strokeWidth="2.5" strokeLinecap="round" className="scan-sweep" opacity="0.8" />
                <polygon points="250,200 220,74 250,70" fill="var(--accent-glow)" className="scan-sweep" opacity="0.3" />

                {/* Scanner Core Center Dot */}
                <circle cx="250" cy="200" r="6" fill="var(--accent-color)" />
                <circle cx="250" cy="200" r="2" fill="#ffffff" />

                {/* NODE 1: Team & Founder Capability */}
                <g className="node-group node-1">
                  <circle cx="150" cy="110" r="20" fill="var(--bg-secondary)" stroke="var(--success-color)" strokeWidth="2" />
                  <circle cx="150" cy="110" r="6" fill="var(--success-color)" />
                  <rect x="90" y="140" width="120" height="24" rx="4" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="150" y="156" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-primary)">Founder Score: 95%</text>
                  {/* Technical connection dot */}
                  <circle cx="150" cy="110" r="24" stroke="var(--success-color)" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
                </g>

                {/* NODE 2: Market Size (TAM/SAM/SOM) */}
                <g className="node-group node-2">
                  <circle cx="360" cy="130" r="20" fill="var(--bg-secondary)" stroke="var(--accent-color)" strokeWidth="2" />
                  <circle cx="360" cy="130" r="6" fill="var(--accent-color)" />
                  <rect x="300" y="160" width="120" height="24" rx="4" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="360" y="176" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-primary)">TAM Target: Rs 15k Cr</text>
                  <circle cx="360" cy="130" r="24" stroke="var(--accent-color)" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
                </g>

                {/* NODE 3: Financial & Runway Projections */}
                <g className="node-group node-3">
                  <circle cx="130" cy="290" r="20" fill="var(--bg-secondary)" stroke="var(--warning-color)" strokeWidth="2" />
                  <circle cx="130" cy="290" r="6" fill="var(--warning-color)" />
                  <rect x="70" y="320" width="120" height="24" rx="4" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="130" y="336" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-primary)">Cash Runway: 24 Mo</text>
                  <circle cx="130" cy="290" r="24" stroke="var(--warning-color)" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
                </g>

                {/* NODE 4: Red Flag Risk Assessments */}
                <g className="node-group node-4">
                  <circle cx="350" cy="280" r="20" fill="var(--bg-secondary)" stroke="var(--danger-color)" strokeWidth="2" />
                  <circle cx="350" cy="280" r="6" fill="var(--danger-color)" />
                  <rect x="290" y="310" width="120" height="24" rx="4" fill="var(--bg-tertiary)" stroke="var(--border-color)" strokeWidth="1" />
                  <text x="350" y="326" textAnchor="middle" fontSize="10" fontWeight="bold" fill="var(--text-primary)">Risk Flags: Stable</text>
                  <circle cx="350" cy="280" r="24" stroke="var(--danger-color)" strokeWidth="0.5" strokeDasharray="2,2" fill="none" />
                </g>

                {/* HUD Overlay Stats */}
                <text x="20" y="30" className="status-text" fontWeight="bold">SYSTEM STATUS: ACTIVE</text>
                <text x="20" y="45" className="status-text">CO-PILOT MODEL: GEMINI v2.5</text>
                <text x="480" y="30" className="status-text" textAnchor="end">SECURE COGNITIVE FEED</text>
                <text x="480" y="45" className="status-text" textAnchor="end">PORTFOLIO NODES: 4</text>
              </svg>
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
