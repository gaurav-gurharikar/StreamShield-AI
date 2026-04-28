import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, Search, AlertTriangle, MonitorPlay, Globe } from 'lucide-react';
import Dashboard from './Dashboard';
import YoutubeScanner from './YoutubeScanner';
import WebScanner from './WebScanner';

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
            <Route path="/youtube" element={<YoutubeScanner />} />
            <Route path="/web" element={<WebScanner />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
