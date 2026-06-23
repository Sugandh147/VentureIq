import { useState, useEffect } from 'react';
import { CreditCard, Shield, Award, Zap, AlertTriangle, KeyRound, CheckCircle } from 'lucide-react';

export default function Billing({ subscription, setSubscription, analysisCredits, setAnalysisCredits }) {
  const [showModal, setShowModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState('checkout'); // 'checkout' -> 'bank' -> 'processing' -> 'success'
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(120);
  const [errorMessage, setErrorMessage] = useState('');

  // OTP Countdown timer
  useEffect(() => {
    let interval;
    if (paymentStep === 'bank' && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setTimeout(() => {
        setErrorMessage("OTP verification expired. Please request a new code.");
      }, 0);
    }
    return () => clearInterval(interval);
  }, [paymentStep, timer]);

  const handleOpenUpgrade = () => {
    setPaymentStep('checkout');
    setOtp('');
    setTimer(120);
    setErrorMessage('');
    setShowModal(true);
  };

  const handleTriggerBank = () => {
    setPaymentStep('bank');
  };

  const handleSubmitOtp = (e) => {
    e.preventDefault();
    if (otp.length < 4) {
      setErrorMessage("Please enter a valid verification code.");
      return;
    }
    
    setPaymentStep('processing');
    
    // Simulate transaction clearing
    setTimeout(() => {
      setSubscription('pro');
      setAnalysisCredits(Infinity);
      setPaymentStep('success');
    }, 2000);
  };

  const handleCloseSuccess = () => {
    setShowModal(false);
  };

  const formatTimer = () => {
    const mins = Math.floor(timer / 60);
    const secs = timer % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      <div className="flex-between" style={{ marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', textAlign: 'left', margin: 0 }}>Subscription & Billing</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Upgrade accounts, inspect metrics limits, and unlock terminal features.</p>
        </div>
      </div>

      <div className="billing-grid">
        {/* Left Side: Summary Card */}
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Current Plan</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-tertiary)', color: subscription === 'pro' ? 'var(--accent-color)' : 'var(--warning-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {subscription === 'pro' ? <Zap size={22} /> : <Award size={22} />}
            </div>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{subscription === 'pro' ? 'Pro Analyst' : 'Free Tier'}</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{subscription === 'pro' ? '1000Rs' : '0Rs'} / month</p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Analysis Credits:</span>
              <strong style={{ color: 'var(--text-primary)' }}>
                {analysisCredits === Infinity ? 'Unlimited' : `${analysisCredits} remaining`}
              </strong>
            </div>
            {subscription === 'free' && (
              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', color: 'var(--warning-color)', fontSize: '12px', marginTop: '8px', backgroundColor: 'var(--warning-bg)', padding: '10px', borderRadius: '6px' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>You are on a Free plan. Upgrade to Pro for unlimited analyses and the Cap Table Dilution Simulator.</span>
              </div>
            )}
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', justifyContent: 'center' }}
            onClick={handleOpenUpgrade}
            disabled={subscription === 'pro'}
          >
            {subscription === 'pro' ? 'Pro Activated' : 'Upgrade to Pro'}
          </button>
        </div>

        {/* Right Side: Available Tiers */}
        <div className="card">
          <h3 style={{ fontSize: '18px', marginBottom: '20px', textAlign: 'left' }}>Available Plans</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Free */}
            <div className="flex-between billing-plan-item" style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: subscription === 'free' ? '1px solid var(--warning-color)' : '1px solid transparent' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>Free Tier</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>1 startup analysis per month, 5 basic due diligence questions.</p>
              </div>
              <div className="flex-center" style={{ gap: '16px' }}>
                <strong style={{ fontSize: '16px' }}>0Rs/mo</strong>
                <button 
                  className="btn btn-outline" 
                  onClick={() => {
                    setSubscription('free');
                    setAnalysisCredits(1);
                  }}
                  disabled={subscription === 'free'}
                  style={{ minWidth: '110px', justifyContent: 'center' }}
                >
                  {subscription === 'free' ? 'Active' : 'Downgrade'}
                </button>
              </div>
            </div>

            {/* Pro */}
            <div className="flex-between billing-plan-item" style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px', border: subscription === 'pro' ? '1px solid var(--accent-color)' : '1px solid transparent' }}>
              <div style={{ textAlign: 'left' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 'bold' }}>Pro Analyst</h4>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Unlimited startup searches, full 20 questions, VC memos, and Cap Table dilution modeling.</p>
              </div>
              <div className="flex-center" style={{ gap: '16px' }}>
                <strong style={{ fontSize: '16px' }}>1000Rs/mo</strong>
                <button 
                  className="btn btn-primary" 
                  onClick={handleOpenUpgrade}
                  disabled={subscription === 'pro'}
                  style={{ minWidth: '110px', justifyContent: 'center' }}
                >
                  {subscription === 'pro' ? 'Active' : 'Upgrade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Secure Gateway Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          
          {/* STEP 1: Basic Checkout Info */}
          {paymentStep === 'checkout' && (
            <div className="card animate-fade-in" style={{ width: '400px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                <h3 style={{ fontSize: '18px' }}>Billing Summary</h3>
                <button onClick={() => setShowModal(false)} style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: 'bold' }}>&times;</button>
              </div>
              
              <div style={{ textAlign: 'left', fontSize: '14px' }}>
                <p style={{ marginBottom: '8px' }}>Confirm account upgrade to:</p>
                <div style={{ padding: '12px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '6px', marginBottom: '16px' }}>
                  <strong>Pro Analyst Terminal</strong> &bull; 1000Rs / month
                </div>
                
                <div className="form-group">
                  <label className="form-label">Cardholder Name</label>
                  <input type="text" className="form-input" placeholder="Sarah Jenkins" defaultValue="Sarah Jenkins" readOnly />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Billing Card</label>
                  <div style={{ display: 'flex', border: '1px solid var(--border-color)', padding: '10px', borderRadius: '8px', backgroundColor: 'var(--bg-secondary)', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} style={{ color: 'var(--text-muted)' }} />
                    <span style={{ fontSize: '13px' }}>&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }} onClick={handleTriggerBank}>
                  Pay 1000Rs
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: FAKE 3D SECURE BANK WINDOW */}
          {paymentStep === 'bank' && (
            <div className="card animate-fade-in" style={{ width: '420px', padding: 0, overflow: 'hidden', backgroundColor: '#ffffff', border: '1px solid #c8d2df', color: '#1a1a1a', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
              {/* Bank Header banner */}
              <div style={{ backgroundColor: '#0d233a', color: '#ffffff', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #ffcc00' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Shield size={18} style={{ color: '#ffcc00' }} />
                  <span style={{ fontFamily: 'Georgia, serif', fontWeight: 'bold', fontSize: '16px', letterSpacing: '0.5px' }}>Apex Secure Bank</span>
                </div>
                <span style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 'bold', border: '1px solid #475569', padding: '2px 6px', borderRadius: '3px' }}>3D SECURE</span>
              </div>

              {/* Bank Checkout details */}
              <div style={{ padding: '20px', fontSize: '12px', textAlign: 'left', lineHeight: '1.4' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#f4f6f9', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>MERCHANT</span>
                    <strong style={{ color: '#0f172a' }}>VentureIQ Platforms</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>AMOUNT</span>
                    <strong style={{ color: '#0f172a', fontSize: '13px' }}>INR 1,000.00</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>CARD NUMBER</span>
                    <strong style={{ color: '#0f172a' }}>XXXX-XXXX-XXXX-4242</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b', display: 'block', fontSize: '10px' }}>TRANSACTION ID</span>
                    <strong style={{ color: '#0f172a' }}>TXN-8549302</strong>
                  </div>
                </div>

                <p style={{ color: '#334155', marginBottom: '16px' }}>
                  A one-time verification passcode (OTP) has been sent to your registered mobile number ending in **89.
                </p>

                <form onSubmit={handleSubmitOtp} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Enter verification code (OTP)</span>
                      <span style={{ color: '#e11d48', fontWeight: 'bold' }}>{formatTimer()}</span>
                    </label>
                    <div style={{ position: 'relative' }}>
                      <KeyRound size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                      <input 
                        type="password" 
                        maxLength="6"
                        placeholder="Enter 123456 (or any code)"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g,''))}
                        style={{ width: '100%', padding: '10px 10px 10px 36px', borderRadius: '4px', border: '1px solid #94a3b8', fontSize: '14px', boxSizing: 'border-box', color: '#0f172a', backgroundColor: '#fff' }}
                        autoFocus
                      />
                    </div>
                  </div>

                  {errorMessage && <div style={{ color: '#e11d48', fontSize: '11px', fontWeight: 'bold' }}>{errorMessage}</div>}

                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <button 
                      type="button" 
                      onClick={() => setShowModal(false)}
                      style={{ flex: 1, backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', color: '#475569', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: '500' }}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      style={{ flex: 2, backgroundColor: '#0ea5e9', border: 'none', color: '#ffffff', padding: '10px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      Verify & Pay
                    </button>
                  </div>
                </form>
              </div>

              {/* Secure footer */}
              <div style={{ backgroundColor: '#f8fafc', padding: '12px 20px', borderTop: '1px solid #e2e8f0', fontSize: '10px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Shield size={12} style={{ color: '#0ea5e9' }} /> Secure 256-bit Bank Network Session
              </div>
            </div>
          )}

          {/* STEP 3: TRANSACTION PROCESSING */}
          {paymentStep === 'processing' && (
            <div className="card text-center animate-fade-in" style={{ width: '350px', padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div className="spinner-ring" style={{ width: '48px', height: '48px', borderWidth: '3px' }}></div>
              <h3 style={{ fontSize: '18px' }}>Settling Ledger Accounts</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                Contacting banking network and activating Pro Analyst parameters. Please hold.
              </p>
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {paymentStep === 'success' && (
            <div className="card text-center animate-fade-in" style={{ width: '380px', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: 'var(--success-bg)', color: 'var(--success-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle size={28} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Upgrade Successful</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.4' }}>
                Transaction approved. Your **Pro Analyst** terminal limits have cleared. You have **Unlimited startup analyses** and the **Cap Table Dilution Simulator** active.
              </p>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }} onClick={handleCloseSuccess}>
                Access Premium Terminal
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
