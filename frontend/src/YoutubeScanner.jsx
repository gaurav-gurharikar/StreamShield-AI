import { useState } from 'react';
import axios from 'axios';
import { Search, AlertTriangle, MonitorPlay, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';

export default function YoutubeScanner() {
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
      const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const youtubeRes = await axios.post(`${API_URL}/api/youtube-search`, { query });
      setResults(youtubeRes.data);
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
        <h1 className="page-title">Dedicated YouTube Scanner</h1>
      </div>

      <div className="search-container">
        <Search className="text-muted" style={{ opacity: 0.5, marginTop: '12px' }} />
        <input 
          type="text" 
          className="search-input" 
          placeholder="Enter match name or stream title to scan YouTube..." 
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
            <h3 className="card-title"><MonitorPlay size={20} /> YouTube Live Stream Results</h3>
            {results.live_streams?.length > 0 ? (
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
                    {results.live_streams.map((item, index) => {
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
          
          <div className="card full-width-card">
            <h3 className="card-title"><MonitorPlay size={20} /> Recent Video Uploads</h3>
            {results.recent_videos?.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>Video Title</th>
                      <th>Channel</th>
                      <th>Risk Level</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.recent_videos.map((item, index) => {
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
                <p>No unauthorized videos detected.</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {!results && !isScanning && !error && (
        <div className="hero-section">
          <div className="hero-badge" style={{ background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>YouTube Enforcement</div>
          <h2 className="hero-title">Dedicated YouTube Live Scanner</h2>
          <p className="hero-subtitle">
            Search exclusively across YouTube Live and recent uploads for potential piracy. Our algorithm locally filters out irrelevant content to guarantee high-risk matches.
          </p>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}><Search size={24} /></div>
              <h3>Deep API Search</h3>
              <p>Fetches up to 25 highly recent uploads and active live streams matching your protected keywords.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}><CheckCircle size={24} /></div>
              <h3>Strict Filtering</h3>
              <p>Irrelevant videos injected by YouTube's algorithm are automatically discarded and scored by exact string matches.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon" style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)' }}><AlertTriangle size={24} /></div>
              <h3>One-Click Reporting</h3>
              <p>Instantly flag High-Risk streams and automatically draft DMCA takedown notices for YouTube Legal.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
