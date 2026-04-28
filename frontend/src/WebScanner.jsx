import { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, Globe, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';

export default function WebScanner() {
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
      const webRes = await axios.post('http://127.0.0.1:8000/api/web-scan', { query });
      setResults(webRes.data);
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
        <h1 className="page-title">Dedicated Web Scanner</h1>
      </div>

      <div className="search-container">
        <Search className="text-muted" style={{ opacity: 0.5, marginTop: '12px' }} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Enter match name or keywords to scan external websites..." 
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
        <div className="dashboard-grid">
          <div className="card full-width-card">
            <h3 className="card-title">AI Generated Search Patterns</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              StreamShield Gemini AI automatically generated these variations to expand the web search scope:
            </p>
            <div className="keyword-chips">
              {results.generated_keywords?.map((kw, i) => (
                <span key={i} className="chip">{kw}</span>
              ))}
            </div>
          </div>

          <div className="card full-width-card">
            <h3 className="card-title"><Globe size={20} /> External Web Piracy Results</h3>
            {results.piracy_results?.length > 0 ? (
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
                    {results.piracy_results.map((item, index) => (
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
        </div>
      )}
      
      {!results && !isScanning && !error && (
        <div className="hero-section">
          <div className="hero-badge" style={{ background: 'rgba(34, 197, 94, 0.15)', color: 'var(--success)', borderColor: 'rgba(34, 197, 94, 0.3)' }}>External Domain Engine</div>
          <h2 className="hero-title">Dedicated Open Web Scanner</h2>
          <p className="hero-subtitle">
            Scan DuckDuckGo and the open web for unauthorized mirrors and clones. Generates dynamic variations of your keywords to catch elusive pirate domains.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--success)', background: 'rgba(34, 197, 94, 0.1)' }}><Globe size={24} /></div>
              <h3>DuckDuckGo Intelligence</h3>
              <p>Scrapes multiple pages of search results to uncover hidden clone sites distributing your match.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--success)', background: 'rgba(34, 197, 94, 0.1)' }}><CheckCircle size={24} /></div>
              <h3>Dynamic Padding</h3>
              <p>Automatically surfaces confirmed, known high-risk pirate databases even when normal search engines try to hide them.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--success)', background: 'rgba(34, 197, 94, 0.1)' }}><AlertTriangle size={24} /></div>
              <h3>Host Takedowns</h3>
              <p>Identify the root hosting providers of external domains and initiate swift domain-level takedowns.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
