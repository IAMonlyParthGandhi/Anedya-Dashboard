import React, { useState } from 'react';
import './Dashboard.css';

/* ─── SVG Icons ─── */
const ThermostatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const HumidityIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const PowerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
);
const UptimeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const RouterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="13" width="20" height="7" rx="2" stroke="currentColor" strokeWidth="1.75"/><path d="M12 2v5M2 9l3-3 3 3M16 9l3-3 3 3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><circle cx="7" cy="16.5" r="1" fill="currentColor"/><circle cx="11" cy="16.5" r="1" fill="currentColor"/></svg>
);
const DevicesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.75"/><line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/><line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
);
const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.75"/><polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
const ExportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><polyline points="7,10 12,15 17,10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.75"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.75"/></svg>
);
const PowerOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none"><path d="M18.36 6.64a9 9 0 1 1-12.73 0" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/><line x1="12" y1="2" x2="12" y2="12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round"/></svg>
);

/* ─── Mini sparkline (decorative SVG bar chart) ─── */
const Sparkline = ({ bars = 12, colorVar = 'var(--clr-primary)' }) => {
  const heights = Array.from({ length: bars }, () => Math.random() * 0.6 + 0.2);
  return (
    <svg width="100%" height="40" viewBox={`0 0 ${bars * 8} 40`} preserveAspectRatio="none">
      {heights.map((h, i) => (
        <rect
          key={i}
          x={i * 8 + 1}
          y={40 - h * 36}
          width="6"
          height={h * 36}
          rx="2"
          fill={colorVar}
          opacity={0.15 + h * 0.4}
        />
      ))}
    </svg>
  );
};

/* ─── Devices list data ─── */
const DEVICES = [
  { id: 'AND-9921-X', name: 'Main_Gateway_01', status: 'online', active: true },
  { id: 'AND-4412-B', name: 'Sensor_Node_Alpha', status: 'online', active: false },
  { id: 'AND-1002-Z', name: 'HVAC_Controller', status: 'error', active: false },
  { id: 'AND-7733-C', name: 'Roof_Antenna_A', status: 'online', active: false },
];

export default function Dashboard() {
  const [relayOn, setRelayOn] = useState(true);
  const [activeDevice, setActiveDevice] = useState('AND-9921-X');

  const now = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="dashboard">

      {/* Page Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="dashboard-title-row">
            <h1 className="dashboard-title">Dashboard</h1>
            <span className="online-pill">
              <span className="online-dot" />
              Online
            </span>
          </div>
          <div className="dashboard-device-id">
            Device ID: <code>AN-IOT-SENTINEL-09X</code>
          </div>
        </div>
        <div className="dashboard-header-actions">
          <button className="btn-secondary">
            <ExportIcon />
            Export Logs
          </button>
          <button className="btn-primary-sm">
            <SettingsIcon />
            Device Settings
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="dashboard-grid">
        <div className="dashboard-grid-left">

          {/* Metric Cards */}
          <div className="metrics-grid">
            {/* Temperature */}
            <div className="metric-card">
              <div className="metric-card-bg-icon"><ThermostatIcon /></div>
              <div className="metric-card-header">
                <div className="metric-icon temp"><ThermostatIcon /></div>
                <span className="metric-label">Temperature</span>
              </div>
              <div className="metric-value-row">
                <span className="metric-value">32</span>
                <span className="metric-unit">°C</span>
              </div>
              <div className="metric-status crit">⚠ Critical — Above threshold</div>
              <div className="metric-bar-wrap"><div className="metric-bar temp" style={{ width: '85%' }} /></div>
              <div className="metric-timestamp"><ClockIcon />Updated: {now}</div>
            </div>

            {/* Humidity */}
            <div className="metric-card">
              <div className="metric-card-bg-icon"><HumidityIcon /></div>
              <div className="metric-card-header">
                <div className="metric-icon humid"><HumidityIcon /></div>
                <span className="metric-label">Humidity</span>
              </div>
              <div className="metric-value-row">
                <span className="metric-value">45</span>
                <span className="metric-unit">%</span>
              </div>
              <div className="metric-status ok">✓ Optimal conditions</div>
              <div className="metric-bar-wrap"><div className="metric-bar humid" style={{ width: '45%' }} /></div>
              <div className="metric-timestamp"><ClockIcon />Updated: {now}</div>
            </div>

            {/* Uptime */}
            <div className="metric-card">
              <div className="metric-card-bg-icon"><UptimeIcon /></div>
              <div className="metric-card-header">
                <div className="metric-icon uptime"><UptimeIcon /></div>
                <span className="metric-label">Network Uptime</span>
              </div>
              <div className="metric-value-row">
                <span className="metric-value">99</span>
                <span className="metric-unit">.9%</span>
              </div>
              <div className="metric-status ok">✓ All systems nominal</div>
              <div className="metric-bar-wrap"><div className="metric-bar uptime" style={{ width: '99%' }} /></div>
              <div className="metric-timestamp"><ClockIcon />Updated: {now}</div>
            </div>
          </div>

          {/* Relay Control */}
          <div className="relay-card">
            <div className="relay-info">
              <div className="relay-power-btn">
                <PowerIcon />
              </div>
              <div className="relay-text">
                <div className="relay-name">Relay Unit A1</div>
                <div className="relay-sub">Main distribution circuit — Since 08:30 AM</div>
                <span className="relay-state-chip">
                  <span className="online-dot" style={{ width: 5, height: 5 }} />
                  State: {relayOn ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>
            <div className="relay-controls">
              <button
                className="btn-relay-off"
                onClick={() => setRelayOn(r => !r)}
              >
                <PowerOffIcon />
                Turn {relayOn ? 'OFF' : 'ON'}
              </button>
            </div>
          </div>

          {/* Stats Strip */}
          <div className="stats-strip">
            <div className="strip-stat">
              <div className="strip-stat-label">Network Uptime</div>
              <div className="strip-stat-value primary">99.98%</div>
              <div className="strip-stat-sub">Last 30 days</div>
            </div>
            <div className="strip-stat">
              <div className="strip-stat-label">Data Processed</div>
              <div className="strip-stat-value">1.2 GB</div>
              <div className="strip-stat-sub" style={{ color: 'var(--clr-success)' }}>+12% from yesterday</div>
            </div>
            <div className="strip-stat">
              <div className="strip-stat-label">Active Alerts</div>
              <div className="strip-stat-value error">2</div>
              <div className="strip-stat-sub">Requires attention</div>
            </div>
            <div className="strip-stat">
              <div className="strip-stat-label">Last Cloud Sync</div>
              <div className="strip-stat-value">14:20</div>
              <div className="strip-stat-sub" style={{ color: 'var(--clr-success)' }}>Successful</div>
            </div>
          </div>
        </div>

        {/* Device Sidebar */}
        <div className="dashboard-grid-right">
          <div className="devices-card">
            <div className="devices-card-header">
              <div className="devices-card-title">
                <DevicesIcon />
                Active Devices
                <span className="devices-count">({DEVICES.filter(d => d.status === 'online').length} online)</span>
              </div>
              <button className="btn-add-device">+ Add</button>
            </div>
            <div className="device-list">
              {DEVICES.map(device => (
                <div
                  key={device.id}
                  className={`device-item ${activeDevice === device.id ? 'device-active' : ''}`}
                  onClick={() => setActiveDevice(device.id)}
                >
                  <div className="device-item-left">
                    <div className="device-icon"><RouterIcon /></div>
                    <div>
                      <div className="device-name">{device.name}</div>
                      <div className="device-id-text">{device.id}</div>
                    </div>
                  </div>
                  <span className={`device-status-dot ${device.status}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
