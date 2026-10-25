import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { useApplications, useAuth } from '../hooks/useContextHooks';
import { filterApplicationsForUser } from '../utils/storage';

export const JobDetails = ({ jobs = [], savedJobIds = [], onToggleSave, onApplyClick }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { applications: allApplications } = useApplications();
  const { userId } = useAuth();
  const applications = filterApplicationsForUser(allApplications, userId);

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="container section">
        <div className="empty-state">
          <div className="empty-icon">❓</div>
          <h3 className="empty-title">Job Opportunity Not Found</h3>
          <p className="empty-desc">The job drive you are looking for may have closed or been removed.</p>
          <Link to="/jobs">
            <Button variant="primary" size="md">
              Back to All Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = savedJobIds.includes(job.id);
  const existingApp = applications.find((app) => app.jobId === job.id);
  const isApplied = Boolean(existingApp);

  const getWorkModeClass = () => {
    const wm = (job.workMode || '').toLowerCase();
    if (wm.includes('remote')) return 'remote';
    if (wm.includes('hybrid')) return 'hybrid';
    return 'office';
  };

  return (
    <div className="job-details-page section">
      <div className="container">
        {/* Back Link */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            ← Back to Jobs
          </button>
        </div>

        {/* Header Card */}
        <div className="job-details-header">
          <div className="job-details-title-row">
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
              <div className="company-logo" style={{ width: '64px', height: '64px', fontSize: '2rem' }}>
                {job.logo || '⚡'}
              </div>
              <div>
                <span className="company-name" style={{ fontSize: '1.05rem' }}>{job.company}</span>
                <h1>{job.title}</h1>

                <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className={`work-mode-badge ${getWorkModeClass()}`}>
                    {getWorkModeClass() === 'remote' ? '🌐' : getWorkModeClass() === 'hybrid' ? '🏢' : '🏛️'}{' '}
                    {job.workModeLabel || job.workMode || 'Office'}
                  </span>
                  {job.country && (
                    <span className="meta-item" style={{ fontSize: '0.82rem' }}>
                      📍 {job.country}
                    </span>
                  )}
                  <span className="meta-item" style={{ fontSize: '0.82rem' }}>
                    ⏱️ {job.type}
                  </span>
                  <span className="meta-item" style={{ fontSize: '0.82rem' }}>
                    💰 {job.salary}
                  </span>
                </div>
              </div>
            </div>

            <button
              className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
              onClick={() => onToggleSave(job.id)}
              style={{ fontSize: '1.75rem' }}
              title={isSaved ? 'Remove from saved' : 'Save job'}
            >
              {isSaved ? '★' : '☆'}
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              borderTop: '1px solid var(--border-color)',
              paddingTop: '1.25rem',
              marginTop: '1rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Posted date: <strong>{job.postedDate}</strong> | Application Deadline: <strong>{job.deadline || '2026-10-31'}</strong>
            </span>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              {isApplied ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>Application Status:</span>
                  <StatusBadge status={existingApp.status} />
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <Link to="/generate-cv">
                    <Button variant="outline" size="lg">
                      📄 Generate CV
                    </Button>
                  </Link>
                  <Button variant="primary" size="lg" onClick={() => onApplyClick(job)}>
                    Apply Now 🚀
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Breakdown */}
        <div className="job-details-content">
          <div>
            <div className="details-card">
              <h3>Role Overview & Responsibilities</h3>
              <p style={{ lineHeight: 1.7, color: 'var(--text-main)', whiteSpace: 'pre-line' }}>
                {job.description}
              </p>
            </div>

            <div className="details-card">
              <h3>Eligibility & Selection Criteria</h3>
              <p style={{ lineHeight: 1.7, color: 'var(--text-main)' }}>
                {job.eligibility}
              </p>
            </div>

            <div className="details-card">
              <h3>Required Skills & Technologies</h3>
              <div className="job-skills" style={{ gap: '0.6rem' }}>
                {job.skills &&
                  job.skills.map((skill, index) => (
                    <span key={index} className="skill-chip" style={{ fontSize: '0.88rem', padding: '0.35rem 0.85rem' }}>
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div>
            <div className="details-card">
              <h3>Opportunity Summary</h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.9rem' }}>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Job ID:</span>
                  <strong>{job.id}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Work Mode:</span>
                  <strong>{job.workMode || 'Office'}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Offer Type:</span>
                  <strong>{job.type}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Salary / Package:</span>
                  <strong>{job.salary}</strong>
                </li>
                <li style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Applicants:</span>
                  <strong>{job.applicantsCount || 0} candidates</strong>
                </li>
              </ul>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-color)' }}>
                {!isApplied ? (
                  <Button variant="primary" size="md" style={{ width: '100%' }} onClick={() => onApplyClick(job)}>
                    Apply for this Role
                  </Button>
                ) : (
                  <Button variant="outline" size="md" style={{ width: '100%' }} disabled>
                    Applied ({existingApp.status})
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
