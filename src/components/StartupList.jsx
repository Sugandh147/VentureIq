import { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Eye } from 'lucide-react';

export default function StartupList({ startups, onSelectStartup }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("score"); // 'score' or 'date'
  const [sortOrder, setSortOrder] = useState("desc");

  // Get unique industries for filter dropdown
  const industries = ["all", ...new Set(startups.map(s => s.industry))];
  const stages = ["all", ...new Set(startups.map(s => s.fundingStage))];

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getRecommendationBadge = (rec) => {
    switch (rec) {
      case 'Strong Invest':
        return <span className="badge badge-success">Strong Invest</span>;
      case 'Invest':
        return <span className="badge badge-primary">Invest</span>;
      case 'Investigate Further':
        return <span className="badge badge-warning">Investigate</span>;
      case 'High Risk':
        return <span className="badge badge-danger">High Risk</span>;
      default:
        return <span className="badge badge-critical">Avoid</span>;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 85) return 'var(--success-color)';
    if (score >= 70) return 'var(--accent-color)';
    if (score >= 55) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  // Filter and Sort Logic
  const processedStartups = startups
    .filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            s.industry.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIndustry = industryFilter === "all" || s.industry === industryFilter;
      const matchesStage = stageFilter === "all" || s.fundingStage === stageFilter;
      return matchesSearch && matchesIndustry && matchesStage;
    })
    .sort((a, b) => {
      let valA, valB;
      if (sortBy === 'score') {
        valA = a.scores.overall;
        valB = b.scores.overall;
      } else {
        valA = new Date(a.dateAnalyzed).getTime();
        valB = new Date(b.dateAnalyzed).getTime();
      }
      
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Search and Filters Bar */}
      <div className="filters-bar">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search by name or industry..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filters-controls">
          <SlidersHorizontal size={14} className="filter-icon" />
          
          <select 
            className="form-select filter-select" 
            value={industryFilter} 
            onChange={(e) => setIndustryFilter(e.target.value)}
          >
            <option value="all">All Sectors</option>
            {industries.filter(ind => ind !== 'all').map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          <select 
            className="form-select filter-select" 
            value={stageFilter} 
            onChange={(e) => setStageFilter(e.target.value)}
          >
            <option value="all">All Stages</option>
            {stages.filter(stg => stg !== 'all').map(stg => (
              <option key={stg} value={stg}>{stg}</option>
            ))}
          </select>

          <button className="btn btn-outline sort-btn" onClick={() => handleSort(sortBy === 'score' ? 'date' : 'score')}>
            <ArrowUpDown size={14} /> Sort: {sortBy === 'score' ? 'Score' : 'Date'}
          </button>
        </div>
      </div>

      {/* Startups Table */}
      <div className="table-container">
        {processedStartups.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Startup</th>
                <th>Sector</th>
                <th>Funding Stage</th>
                <th>Overall Score</th>
                <th>Date Analyzed</th>
                <th>Recommendation</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {processedStartups.map(startup => (
                <tr key={startup.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{startup.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{startup.websiteUrl}</div>
                  </td>
                  <td>{startup.industry}</td>
                  <td>{startup.fundingStage}</td>
                  <td>
                    <span style={{ fontSize: '16px', fontWeight: 'bold', color: getScoreColor(startup.scores.overall) }}>
                      {startup.scores.overall}/100
                    </span>
                  </td>
                  <td>{startup.dateAnalyzed}</td>
                  <td>{getRecommendationBadge(startup.recommendation)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => onSelectStartup(startup.id)}
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <Eye size={12} /> Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No analyzed startups match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
}
