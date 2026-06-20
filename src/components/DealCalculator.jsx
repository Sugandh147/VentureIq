import React, { useState } from 'react';
import { Landmark, AlertTriangle, ShieldCheck, HelpCircle, Lock } from 'lucide-react';

export default function DealCalculator({ subscription, onUpgradeClick }) {
  // Simulator Parameters
  const [preMoney, setPreMoney] = useState(20); // Rs 20cr
  const [roundSize, setRoundSize] = useState(4); // Rs 4cr
  const [optionPool, setOptionPool] = useState(10); // 10% option pool
  const [liqPrefMultiplier, setLiqPrefMultiplier] = useState(1); // 1x
  const [isParticipating, setIsParticipating] = useState(false); // Non-participating

  // Cap Table Math
  const postMoney = preMoney + roundSize;
  const investorOwnership = Math.round((roundSize / postMoney) * 100 * 10) / 10;
  const optionPoolOwnership = optionPool;
  const founderOwnership = Math.round((100 - investorOwnership - optionPoolOwnership) * 10) / 10;

  // Waterfall Scenarios (Exit Valuations in Rs cr)
  const exitScenarios = [
    Math.round(roundSize * 0.5),
    Math.round(roundSize * 1.2),
    Math.round(postMoney * 0.5),
    Math.round(postMoney),
    Math.round(postMoney * 2),
    Math.round(postMoney * 5)
  ];

  const calculatePayout = (exitValue) => {
    const prefPayout = Math.min(exitValue, roundSize * liqPrefMultiplier);
    
    let investorPayout = 0;
    let founderPayout = 0;

    if (isParticipating) {
      // Participating: gets preference payout first, then splits remainder by actual ownership %
      const remainder = Math.max(0, exitValue - prefPayout);
      // Rescale ownership excluding option pool for exit division
      const totalActiveOwnership = investorOwnership + founderOwnership;
      const investorShareOfRemainder = remainder * (investorOwnership / totalActiveOwnership);
      
      investorPayout = prefPayout + investorShareOfRemainder;
      founderPayout = remainder * (founderOwnership / totalActiveOwnership);
    } else {
      // Non-participating: gets the higher of preference or share of exit value
      const sharePayout = exitValue * (investorOwnership / (investorOwnership + founderOwnership));
      
      if (prefPayout >= sharePayout) {
        investorPayout = prefPayout;
        founderPayout = Math.max(0, exitValue - prefPayout);
      } else {
        investorPayout = sharePayout;
        founderPayout = Math.max(0, exitValue - sharePayout);
      }
    }

    return {
      investor: Math.round(investorPayout * 10) / 10,
      founder: Math.round(founderPayout * 10) / 10
    };
  };

  return (
    <div className="container animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Title */}
      <div className="flex-between" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', textAlign: 'left', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Landmark size={24} style={{ color: 'var(--accent-color)' }} /> VC Deal Cap Table & Dilution Modeler
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '2px' }}>Simulate round dilutions, founder payouts, and liquidation waterfalls.</p>
        </div>
      </div>

      {/* Free Plan Lock Overlay */}
      {subscription !== 'pro' ? (
        <div className="card text-center" style={{ padding: '64px 24px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(5px)', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '32px', borderRadius: '12px', border: 'var(--card-border)', maxWidth: '480px', boxShadow: 'var(--shadow-lg)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-glow)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Lock size={22} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Pro Deal Modeling Locked</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px', lineHeight: '1.4' }}>
                Dilution modeling, cap table bars, and liquidation waterfall simulation require an active **Pro Analyst** subscription.
              </p>
              <button className="btn btn-primary" onClick={onUpgradeClick} style={{ width: '100%', justifyContent: 'center' }}>
                Upgrade to Pro (1000Rs)
              </button>
            </div>
          </div>

          {/* Blurred Background Preview */}
          <div style={{ opacity: 0.15, filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="card" style={{ height: '300px' }} />
              <div className="card" style={{ height: '300px' }} />
            </div>
          </div>
        </div>
      ) : (
        /* Unlocked Mode */
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '24px', alignItems: 'start' }}>
          
          {/* Left panel: round controls */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
            <h3 style={{ fontSize: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Round Parameters</h3>

            {/* Pre-money valuation */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500' }}>
                <label>Pre-money Valuation</label>
                <strong style={{ color: 'var(--accent-color)' }}>Rs {preMoney} cr</strong>
              </div>
              <input 
                type="range" 
                min="5" 
                max="250" 
                step="1"
                value={preMoney}
                onChange={(e) => setPreMoney(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-color)' }}
              />
            </div>

            {/* Round size */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500' }}>
                <label>Round Size (Investment)</label>
                <strong style={{ color: 'var(--success-color)' }}>Rs {roundSize} cr</strong>
              </div>
              <input 
                type="range" 
                min="1" 
                max="100" 
                step="0.5"
                value={roundSize}
                onChange={(e) => setRoundSize(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--success-color)' }}
              />
            </div>

            {/* Option Pool */}
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '500' }}>
                <label>Post-round Option Pool</label>
                <strong style={{ color: 'var(--warning-color)' }}>{optionPool}%</strong>
              </div>
              <input 
                type="range" 
                min="0" 
                max="30" 
                step="1"
                value={optionPool}
                onChange={(e) => setOptionPool(parseInt(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--warning-color)' }}
              />
            </div>

            {/* Liquidation Preference */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>Liquidation Preference</h4>
              
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '12px' }}>Multiplier</label>
                <select 
                  className="form-select" 
                  value={liqPrefMultiplier} 
                  onChange={(e) => setLiqPrefMultiplier(parseInt(e.target.value))}
                  style={{ padding: '6px' }}
                >
                  <option value="1">1x preference payout</option>
                  <option value="2">2x preference payout</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                <input 
                  type="checkbox" 
                  id="participating"
                  checked={isParticipating}
                  onChange={(e) => setIsParticipating(e.target.checked)}
                  style={{ width: '16px', height: '16px' }}
                />
                <label htmlFor="participating" style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Participating Preference (Double Dip)
                </label>
              </div>
            </div>
          </div>

          {/* Right panel: outputs & exit waterfall */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Ownership share card */}
            <div className="card" style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>Post-Round Ownership</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px' }}>
                Calculated pre-money option pool dilution math. Post-money Valuation: <strong>Rs {postMoney} cr</strong>.
              </p>

              {/* Cap Table Bar */}
              <div style={{ height: '32px', borderRadius: '6px', overflow: 'hidden', display: 'flex', marginBottom: '20px', border: '1px solid rgba(0,0,0,0.1)' }}>
                <div style={{ width: `${founderOwnership}%`, backgroundColor: '#3b82f6', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }} title="Founders">
                  {founderOwnership}%
                </div>
                <div style={{ width: `${investorOwnership}%`, backgroundColor: '#10b981', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }} title="Investors">
                  {investorOwnership}%
                </div>
                {optionPoolOwnership > 0 && (
                  <div style={{ width: `${optionPoolOwnership}%`, backgroundColor: '#f59e0b', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold' }} title="Option Pool">
                    {optionPoolOwnership}%
                  </div>
                )}
              </div>

              {/* Table legends */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', fontSize: '13px' }}>
                <div style={{ borderLeft: '3px solid #3b82f6', paddingLeft: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Founders Share</span>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{founderOwnership}%</div>
                </div>
                <div style={{ borderLeft: '3px solid #10b981', paddingLeft: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Round Investors</span>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{investorOwnership}%</div>
                </div>
                <div style={{ borderLeft: '3px solid #f59e0b', paddingLeft: '8px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Option Pool</span>
                  <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{optionPoolOwnership}%</div>
                </div>
              </div>
            </div>

            {/* Liquidation Exit Waterfall Table */}
            <div className="card" style={{ textAlign: 'left' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Exit Liquidation Waterfall</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginBottom: '16px' }}>
                Distribution of exit capital at different corporate sales values under active terms.
              </p>

              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Acquisition Price</th>
                      <th>Investor Payout</th>
                      <th>Investor Multiple</th>
                      <th>Founder Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exitScenarios.map((exit, idx) => {
                      const payout = calculatePayout(exit);
                      const multiple = Math.round((payout.investor / roundSize) * 10) / 10;
                      return (
                        <tr key={idx}>
                          <td><strong>Rs {exit} cr</strong></td>
                          <td style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>Rs {payout.investor} cr</td>
                          <td><span className="badge badge-primary">{multiple}x</span></td>
                          <td>Rs {payout.founder} cr</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start', backgroundColor: 'var(--bg-tertiary)', padding: '12px', borderRadius: '8px', marginTop: '16px', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <ShieldCheck size={16} style={{ color: 'var(--success-color)', flexShrink: 0, marginTop: '2px' }} />
                <span>
                  <strong>Waterfall Logic:</strong> Investors get paid back their Rs {roundSize}cr round first. {isParticipating ? 'As participating preference is enabled, they also split the remaining exit amount.' : 'As non-participating preference is active, they only split the exit if their ownership percentage exceeds the base preference value.'}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
