import { useState } from 'react';

// Concentric TAM/SAM/SOM Circles Chart
export function TAMChart({ tam, sam, som }) {
  const [hovered, setHovered] = useState(null);

  const formatValue = (val) => {
    return val >= 1000 ? `${(val / 1000).toFixed(1)}B Rs` : `${val}M Rs`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <div className="tamsamsom-container">
        <svg viewBox="0 0 300 300" style={{ width: '100%', maxHeight: '250px' }}>
          {/* TAM (Outer Circle) */}
          <circle
            cx="150"
            cy="150"
            r="120"
            fill="var(--accent-glow)"
            stroke="var(--accent-color)"
            strokeWidth="1.5"
            strokeDasharray="4,4"
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={() => setHovered('tam')}
            onMouseLeave={() => setHovered(null)}
          />
          {/* SAM (Middle Circle) */}
          <circle
            cx="150"
            cy="150"
            r="80"
            fill="rgba(56, 189, 248, 0.15)"
            stroke="var(--accent-color)"
            strokeWidth="2"
            style={{ cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={() => setHovered('sam')}
            onMouseLeave={() => setHovered(null)}
          />
          {/* SOM (Inner Circle) */}
          <circle
            cx="150"
            cy="150"
            r="45"
            fill="var(--accent-gradient)"
            style={{ cursor: 'pointer', transition: 'all 0.2s', opacity: hovered === 'som' ? 0.95 : 0.85 }}
            onMouseEnter={() => setHovered('som')}
            onMouseLeave={() => setHovered(null)}
          />

          {/* Labels & Annotation Lines */}
          {/* SOM Center Label */}
          <text x="150" y="153" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" pointerEvents="none">
            SOM
          </text>

          {/* Annotations */}
          <line x1="150" y1="70" x2="250" y2="70" stroke="var(--text-muted)" strokeWidth="1" />
          <circle cx="150" cy="70" r="3" fill="var(--accent-color)" />
          <text x="255" y="74" fill="var(--text-primary)" fontSize="11" fontWeight="600" textAnchor="start">
            SAM: {formatValue(sam)}
          </text>

          <line x1="150" y1="30" x2="250" y2="30" stroke="var(--text-muted)" strokeWidth="1" />
          <circle cx="150" cy="30" r="3" fill="var(--accent-color)" />
          <text x="255" y="34" fill="var(--text-primary)" fontSize="11" fontWeight="600" textAnchor="start">
            TAM: {formatValue(tam)}
          </text>

          <line x1="150" y1="135" x2="60" y2="135" stroke="var(--text-muted)" strokeWidth="1" />
          <circle cx="150" cy="135" r="3" fill="#ffffff" />
          <text x="55" y="139" fill="var(--text-primary)" fontSize="11" fontWeight="600" textAnchor="end">
            SOM: {formatValue(som)}
          </text>
        </svg>
      </div>

      {/* Interactive description overlay */}
      <div style={{ height: '40px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        {hovered === 'tam' && `Total Addressable Market: ${formatValue(tam)} (Global sector size)`}
        {hovered === 'sam' && `Serviceable Addressable Market: ${formatValue(sam)} (Geographic or product segment addressable)`}
        {hovered === 'som' && `Serviceable Obtainable Market: ${formatValue(som)} (Target market share captured in 3-5 years)`}
        {!hovered && "Hover over rings to inspect market details"}
      </div>
    </div>
  );
}

// Financial Projections Bar Chart (Revenue vs Burn)
export function FinancialChart({ data }) {
  const [activeBar, setActiveBar] = useState(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.flatMap(d => [d.revenue, d.burn]));
  const scaleY = (val) => (val / maxVal) * 140; // max chart height 140px

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div style={{ position: 'relative', height: '200px', width: '100%', borderBottom: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }}>
        
        {/* Y Axis grid ticks */}
        <div style={{ position: 'absolute', left: '-30px', top: '10px', fontSize: '10px', color: 'var(--text-muted)' }}>{Math.round(maxVal)}k</div>
        <div style={{ position: 'absolute', left: '-30px', top: '75px', fontSize: '10px', color: 'var(--text-muted)' }}>{Math.round(maxVal / 2)}k</div>
        <div style={{ position: 'absolute', left: '-30px', bottom: '5px', fontSize: '10px', color: 'var(--text-muted)' }}>0</div>

        {/* Grid lines */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: '15px', borderBottom: '1px dashed var(--border-color)', opacity: 0.3 }}></div>
        <div style={{ position: 'absolute', left: 0, right: 0, top: '80px', borderBottom: '1px dashed var(--border-color)', opacity: 0.3 }}></div>

        {/* Bars Container */}
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%', padding: '0 10px' }}>
          {data.map((item, idx) => {
            const revHeight = scaleY(item.revenue);
            const burnHeight = scaleY(item.burn);

            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1 }}>
                
                {/* Dynamic values on hover */}
                <div style={{ height: '20px', display: 'flex', gap: '8px', opacity: activeBar === idx ? 1 : 0, transition: 'opacity 0.2s', fontSize: '11px', fontWeight: 'bold' }}>
                  <span style={{ color: 'var(--success-color)' }}>R: {item.revenue}k Rs</span>
                  <span style={{ color: 'var(--danger-color)' }}>B: {item.burn}k Rs</span>
                </div>

                <div 
                  style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', cursor: 'pointer' }}
                  onMouseEnter={() => setActiveBar(idx)}
                  onMouseLeave={() => setActiveBar(null)}
                >
                  {/* Revenue Bar */}
                  <div 
                    style={{ 
                      width: '24px', 
                      height: `${revHeight}px`, 
                      background: 'linear-gradient(180deg, var(--success-color) 0%, rgba(16, 185, 129, 0.4) 100%)', 
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.2s'
                    }}
                  />
                  {/* Burn Rate Bar */}
                  <div 
                    style={{ 
                      width: '24px', 
                      height: `${burnHeight}px`, 
                      background: 'linear-gradient(180deg, var(--danger-color) 0%, rgba(239, 68, 68, 0.4) 100%)', 
                      borderRadius: '4px 4px 0 0',
                      transition: 'all 0.2s'
                    }}
                  />
                </div>

                {/* X Axis Label */}
                <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                  {item.year}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex-center" style={{ gap: '20px', fontSize: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--success-color)' }} />
          <span>Annual Revenue (k Rs)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'var(--danger-color)' }} />
          <span>Annual Burn (k Rs)</span>
        </div>
      </div>
    </div>
  );
}

// 4x4 Risk Heatmap matrix
export function RiskHeatmap({ risks }) {
  const [hoveredRisk, setHoveredRisk] = useState(null);

  // Map low, medium, high, critical to coordinate indices (0-3)
  const mapLevel = (level) => {
    switch (level) {
      case 'Critical': return 3;
      case 'High': return 2;
      case 'Medium': return 1;
      default: return 0;
    }
  };

  const labels = ['Low', 'Med', 'High', 'Crit'];

  // Initialize a 4x4 matrix mapping risks
  const matrix = Array(4).fill(null).map(() => Array(4).fill(null).map(() => []));
  
  risks.forEach(risk => {
    // Determine cell coords
    // Let category or index determine probability to disperse them cleanly
    let prob = 1; // medium
    if (risk.name.includes("Dependency") || risk.name.includes("Runway") || risk.name.includes("Lack")) prob = 3; // critical probability
    else if (risk.name.includes("Moat") || risk.name.includes("adoption")) prob = 2; // high probability
    else if (risk.name.includes("Vulnerability") || risk.name.includes("Drift")) prob = 0; // low probability
    
    const imp = mapLevel(risk.level);
    matrix[prob][imp].push(risk);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* 4x4 Grid layout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(4, 1fr)', gap: '4px' }}>
          {/* Column labels: Impact */}
          <div />
          {labels.map((lbl, idx) => (
            <div key={idx} style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', textAlign: 'center', textTransform: 'uppercase' }}>
              {lbl}
            </div>
          ))}
        </div>

        {/* Matrix Rows (Y = Probability, top down 3 to 0) */}
        {[3, 2, 1, 0].map(y => (
          <div key={y} style={{ display: 'grid', gridTemplateColumns: '50px repeat(4, 1fr)', gap: '4px', alignItems: 'center' }}>
            {/* Row label */}
            <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', textAlign: 'right', paddingRight: '8px', textTransform: 'uppercase' }}>
              {labels[y]}
            </div>

            {/* Matrix Cells */}
            {[0, 1, 2, 3].map(x => {
              const cellRisks = matrix[y][x];
              
              // Colors based on coordinate risk product
              let cellClass = 'low';
              const riskVal = x + y;
              if (riskVal >= 5) cellClass = 'critical';
              else if (riskVal >= 4) cellClass = 'high';
              else if (riskVal >= 2) cellClass = 'medium';

              return (
                <div 
                  key={x} 
                  className={`heatmap-cell ${cellClass}`} 
                  style={{ minHeight: '46px', opacity: hoveredRisk && !cellRisks.some(cr => cr.name === hoveredRisk.name) ? 0.4 : 1 }}
                >
                  {cellRisks.map((risk, rIdx) => (
                    <span 
                      key={rIdx} 
                      className="heatmap-cell-title"
                      style={{ fontSize: '8px', padding: '1px 3px', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '3px', marginBottom: '2px', width: '100%', display: 'block', textAlign: 'center', border: '1px solid rgba(0,0,0,0.2)' }}
                      onMouseEnter={() => setHoveredRisk(risk)}
                      onMouseLeave={() => setHoveredRisk(null)}
                    >
                      {risk.category}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
        ))}
        
        {/* X Axis Label */}
        <div style={{ textAlign: 'center', fontSize: '10px', fontWeight: 'bold', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px', paddingLeft: '50px' }}>
          Impact &rarr;
        </div>
      </div>

      {/* Tooltip detail card */}
      <div className="card" style={{ minHeight: '60px', padding: '10px', backgroundColor: 'var(--bg-tertiary)', border: 'var(--card-border)', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {hoveredRisk ? (
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <strong style={{ fontSize: '13px' }}>{hoveredRisk.category} &bull; {hoveredRisk.name}</strong>
              <span className={`badge ${
                hoveredRisk.level === 'Critical' ? 'badge-critical' : 
                hoveredRisk.level === 'High' ? 'badge-danger' : 
                hoveredRisk.level === 'Medium' ? 'badge-warning' : 'badge-success'
              }`} style={{ fontSize: '9px', padding: '2px 6px' }}>
                {hoveredRisk.level} Risk
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{hoveredRisk.description}</p>
          </div>
        ) : (
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center' }}>
            Hover over elements in the heat matrix to read specific due diligence risk notes.
          </p>
        )}
      </div>

    </div>
  );
}
