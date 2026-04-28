import { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, Play, Globe, MonitorPlay, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';

export default function Dashboard() {
  const [query, setQuery] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = async () => {
    if (!query) return;
    
    setIsScanning(true);
    setError(null);
    setResults(null);
    
    try {
      // Simulate API call for now if backend isn't ready or run real requests
      const youtubeRes = await axios.post('http://127.0.0.1:8000/api/youtube-search', { query });
      const webRes = await axios.post('http://127.0.0.1:8000/api/web-scan', { query });
      
      setResults({
        youtube: youtubeRes.data,
        web: webRes.data
      });
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data from the monitoring engine. Ensure the backend is running.');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div>
      <div className="header">
        <h1 className="page-title">Piracy Monitoring Dashboard</h1>
      </div>

      <div className="search-container">
        <Search className="text-muted" style={{ opacity: 0.5, marginTop: '12px' }} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Enter match name, stream title, or keywords to scan..." 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleScan()}
        />
        <button 
          className="btn" 
          onClick={handleScan}
          disabled={isScanning || !query}
        >
          {isScanning ? (
            <><div className="loader" /> Scanning...</>
          ) : (
            <><ShieldAlert size={18} /> Start Scan</>
          )}
        </button>
      </div>

      {error && (
        <div className="card risk-high" style={{ marginBottom: '2rem' }}>
          <div className="card-title"><AlertTriangle size={20} /> Error</div>
          <p>{error}</p>
        </div>
      )}

      {results && (
        <>
          <div className="dashboard-grid">
            <div className="card">
              <h3 className="card-title"><AlertTriangle size={20} /> High Risk Sources</h3>
              <p className="stats-value">
                {results.web.piracy_results.filter(r => r.risk_score >= 80).length + 
                 results.youtube.live_streams.length}
              </p>
            </div>
            <div className="card">
              <h3 className="card-title"><MonitorPlay size={20} /> Suspicious YouTube Streams</h3>
              <p className="stats-value">{results.youtube.live_streams.length}</p>
            </div>
            <div className="card">
              <h3 className="card-title"><Globe size={20} /> External Web Matches</h3>
              <p className="stats-value">{results.web.piracy_results.length}</p>
            </div>
          </div>

          <div className="dashboard-grid">
            <div className="card full-width-card">
              <h3 className="card-title">AI Generated Search Patterns</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                StreamShield Gemini AI automatically generated these variations to expand the search scope:
              </p>
              <div className="keyword-chips">
                {results.web.generated_keywords.map((kw, i) => (
                  <span key={i} className="chip">{kw}</span>
                ))}
              </div>
            </div>

            <div className="card full-width-card">
              <h3 className="card-title"><Globe size={20} /> External Web Piracy Results</h3>
              {results.web.piracy_results.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Snippet</th>
                        <th>Risk Level</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.web.piracy_results.map((item, index) => (
                        <tr key={index}>
                          <td style={{ maxWidth: '250px' }}>
                            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{item.title}</div>
                            <a href={item.link} target="_blank" rel="noreferrer" className="source-link" style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                              {new URL(item.link).hostname} <ExternalLink size={12} />
                            </a>
                          </td>
                          <td style={{ maxWidth: '300px', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            {item.snippet}
                          </td>
                          <td>
                            <span className={`risk-badge ${item.risk_score >= 80 ? 'risk-high' : item.risk_score >= 50 ? 'risk-medium' : 'risk-low'}`}>
                              {item.risk_score}% Risk
                            </span>
                          </td>
                          <td>
                            <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
                              Take Down
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <CheckCircle size={48} className="empty-icon text-success" />
                  <p>No external piracy sources detected.</p>
                </div>
              )}
            </div>

            <div className="card full-width-card">
              <h3 className="card-title"><MonitorPlay size={20} /> YouTube Live Stream Results</h3>
              {results.youtube.live_streams.length > 0 ? (
                <div style={{ overflowX: 'auto' }}>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Stream Title</th>
                        <th>Channel</th>
                        <th>Risk Level</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.youtube.live_streams.map((item, index) => {
                        const titleLower = item.snippet.title.toLowerCase();
                        const queryLower = query.toLowerCase();
                        const isHighRisk = titleLower.includes(queryLower);
                        const riskClass = isHighRisk ? 'risk-high' : 'risk-low';
                        const riskText = isHighRisk ? 'High Risk' : 'Low Risk';

                        return (
                        <tr key={index}>
                          <td style={{ maxWidth: '250px' }}>
                            <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>{item.snippet.title}</div>
                            <a href={`https://youtube.com/watch?v=${item.id?.videoId}`} target="_blank" rel="noreferrer" className="source-link" style={{ fontSize: '0.875rem', opacity: 0.7 }}>
                              Watch <ExternalLink size={12} />
                            </a>
                          </td>
                          <td>{item.snippet.channelTitle}</td>
                          <td>
                            <span className={`risk-badge ${riskClass}`}>
                              {riskText}
                            </span>
                          </td>
                          <td>
                            <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} disabled={!isHighRisk}>
                              Report Match
                            </button>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <CheckCircle size={48} className="empty-icon text-success" />
                  <p>No unauthorized live streams detected on YouTube.</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      
      {!results && !isScanning && !error && (
        <div className="hero-section">
          <div className="hero-badge">System Ready</div>
          <h2 className="hero-title">Protect Your Digital Assets in Real-Time</h2>
          <p className="hero-subtitle">
            Enter your proprietary live event or match below. Our AI engine will automatically generate search variants, crawl the web for clone sites, and scan YouTube for unauthorized broadcasts.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><Search size={24} /></div>
              <h3>1. Enter Event Details</h3>
              <p>Type the exact match or event name (e.g. "Champions League Final") into the search bar above.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><Globe size={24} /></div>
              <h3>2. AI Discovery</h3>
              <p>Gemini AI generates keyword permutations to outsmart pirates trying to evade standard searches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><ShieldAlert size={24} /></div>
              <h3>3. Take Down Pirates</h3>
              <p>Review the color-coded risk dashboard and instantly report highly suspicious mirrors and streams.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
