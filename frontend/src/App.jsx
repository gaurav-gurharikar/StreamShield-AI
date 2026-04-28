import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Search, AlertTriangle, Settings, MonitorPlay, Globe } from 'lucide-react';
import Dashboard from './Dashboard';

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Shield className="logo-icon" size={28} />
        <span>StreamShield AI</span>
      </div>
      
      <div className="nav-links">
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <Activity size={20} />
          <span>Monitoring Dashboard</span>
        </Link>
        <Link to="/youtube" className={`nav-item ${location.pathname === '/youtube' ? 'active' : ''}`}>
          <MonitorPlay size={20} />
          <span>YouTube Scanner</span>
        </Link>
        <Link to="/web" className={`nav-item ${location.pathname === '/web' ? 'active' : ''}`}>
          <Globe size={20} />
          <span>Web Scanner</span>
        </Link>
        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/youtube" element={<div className="empty-state"><h2>YouTube Scanner</h2><p>Select the monitoring dashboard to start scanning.</p></div>} />
            <Route path="/web" element={<div className="empty-state"><h2>Web Scanner</h2><p>Select the monitoring dashboard to start scanning.</p></div>} />
            <Route path="/settings" element={<div className="empty-state"><h2>Settings</h2><p>Configuration options</p></div>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
