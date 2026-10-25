import React from 'react';
import { Link } from 'react-router-dom';
import Button from './Button';

export const JobCard = ({
  job,
  isSaved = false,
  isApplied = false,
  onToggleSave,
  onApplyClick,
}) => {
  const {
    id,
    title,
    company,
    logo,
    location,
    country,
    type,
    workMode = 'Office',
    workModeLabel,
    salary,
    skills,
    postedDate,
  } = job;

  const getWorkModeClass = () => {
    if (workMode.toLowerCase().includes('remote')) return 'remote';
    if (workMode.toLowerCase().includes('hybrid')) return 'hybrid';
    return 'office';
  };

  const formattedWorkModeLabel = workModeLabel || (workMode === 'Remote' ? 'Remote — Worldwide' : workMode === 'Hybrid' ? 'Hybrid' : 'On-site');

  return (
    <div className="job-card">
      <div className="job-card-header">
        <div className="company-badge">
          <div className="company-logo">{logo || '⚡'}</div>
          <div className="company-info">
            <span className="company-name">{company}</span>
            <h3 className="job-title">{title}</h3>
          </div>
        </div>
        <button
          type="button"
          className={`bookmark-btn ${isSaved ? 'saved' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onToggleSave(id);
          }}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? '★' : '☆'}
        </button>
      </div>

      <div className="job-card-body">
        <div style={{ marginBottom: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span className={`work-mode-badge ${getWorkModeClass()}`}>
            {getWorkModeClass() === 'remote' ? '🌐' : getWorkModeClass() === 'hybrid' ? '🏢' : '🏛️'}{' '}
            {formattedWorkModeLabel}
          </span>
          {country && (
            <span className="meta-item" style={{ fontSize: '0.75rem' }}>
              📍 {country}
            </span>
          )}
        </div>

        <div className="job-meta-list">
          <span className="meta-item">⏱️ {type}</span>
          <span className="meta-item">💰 {salary}</span>
        </div>

        {skills && skills.length > 0 && (
          <div className="job-skills">
            {skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="skill-chip">
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="skill-chip">+{skills.length - 4} more</span>
            )}
          </div>
        )}
      </div>

      <div className="job-card-footer">
        <span className="posted-date">Posted {postedDate}</span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link to={`/jobs/${id}`}>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </Link>
          {isApplied ? (
            <Button variant="ghost" size="sm" disabled style={{ color: 'var(--status-success-text)', fontWeight: 600 }}>
              ✓ Applied
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={() => onApplyClick(job)}>
              Apply
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
