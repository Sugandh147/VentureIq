import { Sun, Moon, Briefcase, Award, Zap } from 'lucide-react';

export default function Header({ currentTab, setCurrentTab, theme, toggleTheme, subscription }) {
  const getSubscriptionBadge = () => {
    switch (subscription) {
      case 'pro':
        return (
          <span className="badge badge-primary flex-center" style={{ gap: '4px' }}>
            <Zap size={13} /> Pro Analyst
          </span>
        );
      default:
        return (
          <span className="badge badge-warning flex-center" style={{ gap: '4px' }}>
            <Award size={13} /> Free Tier
          </span>
        );
    }
  };

  return (
    <header className="glass-header header-nav no-print">
      <div className="container flex-between">
        <div className="logo-container" onClick={() => setCurrentTab('landing')} style={{ cursor: 'pointer' }}>
          <Briefcase size={24} style={{ color: 'var(--accent-color)' }} />
          <span>VentureIQ</span>
        </div>

        <div className="header-links">
          <span 
            className={`nav-link ${currentTab === 'landing' ? 'active' : ''}`}
            onClick={() => setCurrentTab('landing')}
          >
            Overview
          </span>
          <span 
            className={`nav-link ${currentTab === 'dashboard' || currentTab === 'detail' || currentTab === 'new-analysis' ? 'active' : ''}`}
            onClick={() => setCurrentTab('dashboard')}
          >
            Terminal
          </span>
          <span 
            className={`nav-link ${currentTab === 'calculator' ? 'active' : ''}`}
            onClick={() => setCurrentTab('calculator')}
          >
            Cap Table Simulator
          </span>
          <span 
            className={`nav-link ${currentTab === 'billing' ? 'active' : ''}`}
            onClick={() => setCurrentTab('billing')}
          >
            Pricing
          </span>
        </div>

        <div className="flex-center" style={{ gap: '16px' }}>
          {getSubscriptionBadge()}
          <button 
            onClick={toggleTheme} 
            className="btn btn-outline" 
            style={{ padding: '8px', borderRadius: '50%' }}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
