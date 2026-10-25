import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import { COUNTRIES } from './Login';
import { useAuth } from '../hooks/useContextHooks';
import { useJobs } from '../hooks/useContextHooks';

export const Profile = ({ onUpdateUser, applicationsCount = 0 }) => {
  // Read account profile and saved CV from contexts; application count is scoped by App.
  const { user, savedCV } = useAuth();
  const { savedJobIds } = useJobs();
  const savedJobsCount = savedJobIds.length;
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    country: user?.country || 'India',
    searchLocation: user?.searchLocation || 'Worldwide',
    specificCountry: user?.specificCountry || 'United States',
    workMode: user?.workMode || 'Any',
    college: user?.college || '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      ...formData,
    });
    setMessage('✅ Profile preferences updated successfully!');
    setTimeout(() => setMessage(''), 4000);
  };

  return (
    <div className="profile-page section">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 className="section-title">My Profile & Preferences</h1>
          <p className="section-subtitle">
            Manage your personal credentials, country settings, and global job search preferences.
          </p>
        </div>

        {message && (
          <div
            style={{
              backgroundColor: 'var(--status-success-bg)',
              color: 'var(--status-success-text)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              fontWeight: 600,
              border: '1px solid var(--accent-color)',
            }}
          >
            {message}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '2rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Summary Card */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              boxShadow: 'var(--shadow-sm)',
              textAlign: 'center',
            }}
          >
            <div
              className="user-avatar"
              style={{
                width: '72px',
                height: '72px',
                fontSize: '2rem',
                margin: '0 auto 1rem',
              }}
            >
              {(user?.name || user?.email || 'U').charAt(0).toUpperCase()}
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {user?.name || 'Candidate User'}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {user?.email}
            </p>

            <div
              style={{
                borderTop: '1px solid var(--border-color)',
                paddingTop: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                fontSize: '0.88rem',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Role:</span>
                <strong style={{ textTransform: 'capitalize', color: 'var(--primary-color)' }}>
                  {user?.role || 'student'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Country:</span>
                <strong>{user?.country || 'India'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Saved Jobs:</span>
                <strong>{savedJobsCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Applications:</span>
                <strong>{applicationsCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-muted)' }}>Saved CV:</span>
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: savedCV ? 'var(--status-success-bg)' : 'var(--bg-surface-secondary)',
                    color: savedCV ? 'var(--status-success-text)' : 'var(--text-muted)',
                  }}
                >
                  {savedCV ? '✓ Ready' : 'Not Generated'}
                </span>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <Link to="/generate-cv">
                <Button variant={savedCV ? 'outline' : 'primary'} size="sm" style={{ width: '100%' }}>
                  {savedCV ? '✏️ Edit Saved CV' : '📄 Generate CV Now'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Preferences Form */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--text-main)',
                marginBottom: '1.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-color)',
              }}
            >
              Account Preferences
            </h3>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Country of Residence</label>
                <select
                  name="country"
                  className="form-select"
                  value={formData.country}
                  onChange={handleChange}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Job Search Location</label>
                <select
                  name="searchLocation"
                  className="form-select"
                  value={formData.searchLocation}
                  onChange={handleChange}
                >
                  <option value="My country">My Country ({formData.country})</option>
                  <option value="Worldwide">Worldwide / Global</option>
                  <option value="Specific country">Specific Country</option>
                </select>
              </div>

              {formData.searchLocation === 'Specific country' && (
                <div className="form-group">
                  <label className="form-label">Target Country</label>
                  <select
                    name="specificCountry"
                    className="form-select"
                    value={formData.specificCountry}
                    onChange={handleChange}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Preferred Work Mode</label>
                <select
                  name="workMode"
                  className="form-select"
                  value={formData.workMode}
                  onChange={handleChange}
                >
                  <option value="Any">Any Work Mode</option>
                  <option value="Remote / Work from Home">Work from Home / Remote</option>
                  <option value="Office">Office / On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">College / University</label>
                <input
                  type="text"
                  name="college"
                  className="form-input"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="e.g. Stanford University"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <Button variant="primary" size="md" type="submit">
                  Save Preferences 💾
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
