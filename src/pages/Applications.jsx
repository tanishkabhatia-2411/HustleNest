import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import { useApplications, useAuth, useJobs } from '../hooks/useContextHooks';
import { filterApplicationsForUser } from '../utils/storage';

/**
 * Applications page — consumes ApplicationsContext directly.
 * No longer needs applications passed as a prop from App.jsx.
 * Adds: withdraw application with confirmation, better stats.
 */
export const Applications = () => {
  const { applications: allApplications, withdrawApplication } = useApplications();
  const { userId } = useAuth();
  const { refreshJobs } = useJobs();
  const applications = filterApplicationsForUser(allApplications, userId);
  const [statusFilter, setStatusFilter] = useState('All');
  const [withdrawConfirmId, setWithdrawConfirmId] = useState(null);
  const [withdrawError, setWithdrawError] = useState('');

  const filteredApps = applications.filter((app) => {
    if (statusFilter === 'All') return true;
    return app.status.toLowerCase() === statusFilter.toLowerCase();
  });

  // Counts per status
  const counts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const handleWithdraw = (appId) => {
    const result = withdrawApplication(appId, userId);
    if (result.success) {
      refreshJobs();
      setWithdrawError('');
    } else {
      setWithdrawError('Could not withdraw the application. Please try again.');
    }
    setWithdrawConfirmId(null);
  };

  return (
    <div className="applications-page section">
      <div className="container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <h1 className="section-title">My Job Applications</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Track all your global job submissions and live status updates in real-time.
            </p>
          </div>
          <Link to="/generate-cv">
            <Button variant="outline" size="md">📄 Generate / Edit My CV</Button>
          </Link>
        </div>

        {withdrawError && (
          <p role="alert" className="form-error" style={{ marginBottom: '1rem' }}>
            {withdrawError}
          </p>
        )}

        {/* Application Stats Summary */}
        {applications.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem',
              marginBottom: '2rem',
            }}
          >
            {[
              { status: 'Applied', color: 'var(--primary-color)', icon: '📋' },
              { status: 'Shortlisted', color: '#7C3AED', icon: '⭐' },
              { status: 'Interview', color: '#D97706', icon: '📅' },
              { status: 'Offer', color: '#059669', icon: '🏆' },
              { status: 'Rejected', color: '#DC2626', icon: '❌' },
            ].map(({ status, color, icon }) => (
              <div
                key={status}
                className="stat-card"
                style={{ textAlign: 'center', padding: '1rem', borderTop: `3px solid ${color}` }}
              >
                <div style={{ fontSize: '1.2rem' }}>{icon}</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color }}>{counts[status] || 0}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{status}</div>
              </div>
            ))}
          </div>
        )}

        {/* Status Filter Tabs */}
        {applications.length > 0 && (
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            {['All', 'Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected'].map((status) => (
              <Button
                key={status}
                variant={statusFilter === status ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
              >
                {status}
                {status === 'All'
                  ? ` (${applications.length})`
                  : counts[status]
                  ? ` (${counts[status]})`
                  : ''}
              </Button>
            ))}
          </div>
        )}

        {/* Applications List */}
        {filteredApps.length > 0 ? (
          <div className="applications-list">
            {filteredApps.map((app) => (
              <div key={app.id} className="application-card">
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {app.jobTitle}
                    </h3>
                    <StatusBadge status={app.status} />
                  </div>

                  <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                    🏢 {app.company} • 📍 {app.location} {app.workMode ? `(${app.workMode})` : ''}
                  </p>

                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.8rem', fontSize: '0.85rem', color: 'var(--text-light)', flexWrap: 'wrap' }}>
                    <span>📅 Applied: <strong>{app.appliedDate}</strong></span>
                    {app.college && <span>🎓 <strong>{app.college}</strong></span>}
                    {app.attachedCV && (
                      <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>📄 HustleNest CV Attached</span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {app.resumeUrl && (
                    <a href={app.resumeUrl.startsWith('http') ? app.resumeUrl : '#'} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">📄 Resume</Button>
                    </a>
                  )}
                  <Link to={`/jobs/${app.jobId}`}>
                    <Button variant="outline" size="sm">View Job</Button>
                  </Link>

                  {/* Withdraw application */}
                  {withdrawConfirmId === app.id ? (
                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--status-error-text)' }}>Withdraw?</span>
                      <Button variant="danger" size="sm" onClick={() => handleWithdraw(app.id)}>Yes</Button>
                      <Button variant="ghost" size="sm" onClick={() => setWithdrawConfirmId(null)}>No</Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setWithdrawConfirmId(app.id)}
                      style={{ color: 'var(--status-error-text)' }}
                    >
                      Withdraw
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3 className="empty-title">
              {applications.length === 0
                ? 'No applications submitted yet'
                : `No applications with status '${statusFilter}'`}
            </h3>
            <p className="empty-desc">
              {applications.length === 0
                ? 'Explore national and remote job drives and submit your application to start tracking here.'
                : 'Switch your status filter to see other applications.'}
            </p>
            <Link to="/jobs">
              <Button variant="primary" size="md">Browse Global Opportunities 🚀</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
