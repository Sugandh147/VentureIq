import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import StartupDetail from './components/StartupDetail';
import NewAnalysisForm from './components/NewAnalysisForm';
import Billing from './components/Billing';
import DealCalculator from './components/DealCalculator';
import { mockStartups } from './utils/mockData';
import { Landmark, CreditCard, Plus, Percent } from 'lucide-react';
import './App.css';

export default function App() {
  const [currentTab, setCurrentTab] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [subscription, setSubscription] = useState('free');
  const [analysisCredits, setAnalysisCredits] = useState(1);
  const [startups, setStartups] = useState(mockStartups);
  const [selectedStartupId, setSelectedStartupId] = useState(null);

  // Initialize theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Adjust credit tokens when plan switches
  const handleSubscriptionChange = (newTier) => {
    setSubscription(newTier);
    if (newTier === 'free') {
      setAnalysisCredits(1);
    } else {
      setAnalysisCredits(Infinity);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSelectStartup = (id) => {
    setSelectedStartupId(id);
    setCurrentTab('detail');
  };

  const handleAnalysisComplete = (newReport) => {
    setStartups(prev => [newReport, ...prev]);
    if (analysisCredits !== Infinity) {
      setAnalysisCredits(prev => Math.max(0, prev - 1));
    }
    setSelectedStartupId(newReport.id);
    setCurrentTab('detail');
  };

  const selectedStartup = startups.find(s => s.id === selectedStartupId);

  // Helper to determine page rendering
  const renderTabContent = () => {
    switch (currentTab) {
      case 'landing':
        return (
          <LandingPage 
            setCurrentTab={setCurrentTab} 
            subscription={subscription} 
            setSubscription={handleSubscriptionChange} 
          />
        );
      case 'dashboard':
        return (
          <Dashboard 
            startups={startups} 
            onSelectStartup={handleSelectStartup} 
            onNewAnalysisClick={() => setCurrentTab('new-analysis')}
            subscription={subscription}
            analysisCredits={analysisCredits}
          />
        );
      case 'detail':
        return (
          <StartupDetail 
            startup={selectedStartup} 
            onBack={() => {
              setSelectedStartupId(null);
              setCurrentTab('dashboard');
            }} 
            subscription={subscription}
          />
        );
      case 'new-analysis':
        return (
          <NewAnalysisForm 
            onAnalysisComplete={handleAnalysisComplete} 
            currentCredits={analysisCredits}
            onUpgradeClick={() => setCurrentTab('billing')}
          />
        );
      case 'billing':
        return (
          <Billing 
            subscription={subscription} 
            setSubscription={handleSubscriptionChange}
            analysisCredits={analysisCredits}
            setAnalysisCredits={setAnalysisCredits}
          />
        );
      case 'calculator':
        return (
          <DealCalculator 
            subscription={subscription} 
            onUpgradeClick={() => setCurrentTab('billing')}
          />
        );
      default:
        return <LandingPage setCurrentTab={setCurrentTab} subscription={subscription} setSubscription={handleSubscriptionChange} />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        theme={theme} 
        toggleTheme={toggleTheme}
        subscription={subscription}
      />
      
      {currentTab === 'landing' ? (
        // Full bleed width for landing page
        <main style={{ flex: 1 }}>
          {renderTabContent()}
        </main>
      ) : (
        // Left Sidebar layout for Dashboard application pages
        <div className="app-container">
          <aside className="app-sidebar no-print">
            <div className="sidebar-menu">
              <div 
                className={`sidebar-item ${currentTab === 'dashboard' || currentTab === 'detail' ? 'active' : ''}`}
                onClick={() => setCurrentTab('dashboard')}
              >
                <Landmark size={18} />
                <span>Dashboard (Terminal)</span>
              </div>
              <div 
                className={`sidebar-item ${currentTab === 'calculator' ? 'active' : ''}`}
                onClick={() => setCurrentTab('calculator')}
              >
                <Percent size={18} />
                <span>Cap Table Simulator</span>
              </div>
              <div 
                className={`sidebar-item ${currentTab === 'billing' ? 'active' : ''}`}
                onClick={() => setCurrentTab('billing')}
              >
                <CreditCard size={18} />
                <span>Pricing & Credits</span>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '16px', paddingTop: '16px' }}>
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '8px 12px', fontSize: '13px', justifyContent: 'center' }}
                  onClick={() => setCurrentTab('new-analysis')}
                >
                  <Plus size={14} /> Analyze Startup
                </button>
              </div>
            </div>

            <div style={{ padding: '8px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'left', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <div>Secure Sandbox Env</div>
              <div style={{ fontFamily: 'monospace', marginTop: '4px' }}>v1.4.2 &bull; Active</div>
            </div>
          </aside>

          <main className="app-content">
            {renderTabContent()}
          </main>
        </div>
      )}
    </div>
  );
}
