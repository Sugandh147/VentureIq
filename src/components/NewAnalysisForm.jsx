import { useState, useEffect } from 'react';
import { Play, AlertTriangle, Terminal } from 'lucide-react';
import { validateStartupInput } from '../utils/reportGenerator';

export default function NewAnalysisForm({ onAnalysisComplete, currentCredits, onUpgradeClick }) {
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [validationError, setValidationError] = useState("");

  const [reportResult, setReportResult] = useState(null);
  const [apiError, setApiError] = useState("");

  const extractionLogs = [
    `LOG: Querying startup registry index database for "${name}"...`,
    `LOG: Locating corporate filings and database records...`,
    `LOG: Success: Found matching startup records.`,
    `LOG: Extracting operational summaries and founder credentials...`,
    `LOG: Compiling market indicators (TAM, SAM, SOM)...`,
    `LOG: Generating comparative competitor checklists...`,
    `LOG: Assessing operational risk cells (Probability vs Impact)...`,
    `LOG: Formulating 20 tailored screening questions...`,
    `LOG: Drafting professional VC-style investment memo...`,
    `LOG: Packaging report file. Redirecting to Terminal...`
  ];

  // Auto-scroll logs
  useEffect(() => {
    let timer;
    if (analyzing && logIndex < extractionLogs.length) {
      timer = setTimeout(() => {
        setLogIndex(prev => prev + 1);
      }, 600);
    } else if (analyzing && logIndex === extractionLogs.length) {
      if (apiError) {
        setTimeout(() => {
          setValidationError(apiError);
          setAnalyzing(false);
        }, 0);
      } else if (reportResult) {
        setTimeout(() => {
          onAnalysisComplete(reportResult);
          setAnalyzing(false);
        }, 0);
      } else {
        // Wait for the server response if it takes slightly longer
        timer = setTimeout(() => {
          setLogIndex(logIndex); // Trigger effect again
        }, 300);
      }
    }
    return () => clearTimeout(timer);
  }, [analyzing, logIndex, reportResult, apiError, extractionLogs.length, onAnalysisComplete]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError("");
    setApiError("");
    setReportResult(null);
    
    if (!name.trim()) return;
    if (currentCredits <= 0) return;

    // Run Scraper Validation checks
    const check = validateStartupInput(name, websiteUrl);
    if (!check.valid) {
      setValidationError(check.message);
      return;
    }
    
    setLogIndex(0);
    setAnalyzing(true);

    // Call the Backend API
    fetch('http://localhost:5000/api/startups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, websiteUrl })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(data => { throw new Error(data.error || 'Server error') });
        }
        return res.json();
      })
      .then(report => {
        setReportResult(report);
      })
      .catch(err => {
        setApiError(err.message);
      });
  };

  if (analyzing) {
    return (
      <div className="card wizard-container text-center animate-fade-in" style={{ padding: '24px 20px', maxWidth: '600px', margin: '16px auto' }}>
        <div className="analysis-loader-container" style={{ padding: '20px 10px' }}>
          <div className="spinner-ring" style={{ width: '48px', height: '48px', borderWidth: '3px', marginBottom: '16px' }}></div>
          <h2 style={{ fontSize: '18px', marginBottom: '6px' }}>AI Scraper Active</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px' }}>
            VentureIQ is extracting details for <strong>{name}</strong>. This will take a few seconds.
          </p>

          <div className="analysis-status-logs" style={{ height: '180px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #1e2640', paddingBottom: '8px', marginBottom: '8px', color: '#888' }}>
              <Terminal size={14} /> <span>console_scraper_logger</span>
            </div>
            {extractionLogs.slice(0, logIndex).map((log, idx) => (
              <div key={idx} className={`log-line ${idx === logIndex - 1 ? 'active' : ''}`}>
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wizard-container animate-fade-in" style={{ paddingBottom: '16px', maxWidth: '600px', margin: '16px auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '6px' }}>Instant Startup Due Diligence</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          Enter a startup name. VentureIQ will auto-scrape, compile, and index a due diligence report.
        </p>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {validationError && (
          <div className="redflag-item" style={{ marginBottom: '16px', backgroundColor: 'var(--danger-bg)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '10px 14px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} style={{ color: 'var(--danger-color)', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', color: 'var(--text-primary)', textAlign: 'left', fontWeight: '500' }}>
              {validationError}
            </span>
          </div>
        )}

        {currentCredits <= 0 ? (
          <div style={{ textAlign: 'center', padding: '12px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--danger-bg)', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <AlertTriangle size={20} />
            </div>
            <h3 style={{ fontSize: '16px', marginBottom: '6px' }}>Credit Limit Reached</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '16px', lineHeight: '1.4' }}>
              Your standard Free Plan allows **1 startup analysis**. Upgrade to Pro to unlock unlimited runs.
            </p>
            <button className="btn btn-primary" onClick={onUpgradeClick} style={{ width: '100%', justifyContent: 'center' }}>
              Upgrade to Pro (1000Rs)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ textAlign: 'left', marginBottom: '12px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '4px' }}>Startup Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. OpenAI, Zepto, CRED, Snowflake, Solaria Grid" 
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setValidationError("");
                }}
                required
                style={{ padding: '10px 14px', fontSize: '15px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Tip: Works for real startups (e.g. CRED, Zepto, Snowflake) or new/custom names.
              </span>
            </div>

            <div className="form-group" style={{ textAlign: 'left', marginBottom: '12px' }}>
              <label className="form-label" style={{ marginBottom: '4px' }}>Website URL (Optional)</label>
              <input 
                type="url" 
                className="form-input" 
                placeholder="https://example.com" 
                value={websiteUrl}
                onChange={(e) => {
                  setWebsiteUrl(e.target.value);
                  setValidationError("");
                }}
                style={{ padding: '8px 12px' }}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ padding: '10px 20px', fontSize: '14px', justifyContent: 'center', width: '100%', gap: '8px', marginTop: '4px' }}
              disabled={!name.trim()}
            >
              <Play size={14} fill="currentColor" /> Scrape & Run AI Due Diligence
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
