import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { getUserId } from '../utils/storage';
import { useAuth } from '../hooks/useContextHooks';

export const ApplicationModal = ({ job, user, onClose, onSubmitApplication }) => {
  const navigate = useNavigate();
  const userId = getUserId(user);
  // Read savedCV from AuthContext — always up to date without prop drilling
  const { savedCV: contextSavedCV } = useAuth();

  const [savedCV, setSavedCV] = useState(null);
  const [useSavedCV, setUseSavedCV] = useState(false);

  const [formData, setFormData] = useState({
    studentName: user?.name || '',
    studentEmail: user?.email || '',
    college: user?.college || '',
    cgpa: user?.cgpa || '8.4',
    resumeUrl: '',
    coverLetter: '',
  });

  const [errors, setErrors] = useState({});

  // Use the savedCV from context (always fresh)
  useEffect(() => {
    if (contextSavedCV && (contextSavedCV.fullName || contextSavedCV.email)) {
      setSavedCV(contextSavedCV);
    } else {
      setSavedCV(null);
    }
  }, [contextSavedCV]);

  if (!job) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleUseCV = () => {
    setUseSavedCV(true);
    setFormData((prev) => ({
      ...prev,
      studentName: savedCV.fullName || prev.studentName,
      studentEmail: savedCV.email || prev.studentEmail,
      college: savedCV.education?.[0]?.college || prev.college,
      resumeUrl: 'Attached: Saved HustleNest Candidate CV',
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.studentName.trim()) newErrors.studentName = 'Full Name is required';
    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.studentEmail)) {
      newErrors.studentEmail = 'Enter a valid email address';
    }
    if (!formData.college.trim()) newErrors.college = 'College/University is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmitApplication({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        type: job.type,
        workMode: job.workMode,
        userId,
        userEmail: user?.email || formData.studentEmail,
        attachedCV: useSavedCV ? savedCV : null,
        ...formData,
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Apply to {job.company}</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Position: <strong>{job.title}</strong> • {job.workMode || 'Office'}
            </p>
          </div>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* CANDIDATE CV ATTACHMENT CHOICE BANNER */}
        <div
          style={{
            backgroundColor: 'var(--bg-surface-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
          }}
        >
          {savedCV ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>📄</span>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  Saved CV Available ({savedCV.fullName || user?.name})
                </strong>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <Button
                  variant={useSavedCV ? 'primary' : 'outline'}
                  size="sm"
                  type="button"
                  onClick={handleUseCV}
                >
                  {useSavedCV ? '✓ Using Saved CV' : 'Use Saved CV'}
                </Button>
                {useSavedCV && (
                  <Button
                    variant="ghost"
                    size="sm"
                    type="button"
                    onClick={() => {
                      setUseSavedCV(false);
                      setFormData((prev) => ({ ...prev, resumeUrl: '' }));
                    }}
                  >
                    Apply Without CV
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/generate-cv');
                  }}
                >
                  Edit CV ✏️
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Would you like to create a CV before applying? (Optional)
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/generate-cv');
                  }}
                >
                  ✨ Generate My CV
                </Button>
                <Button variant="ghost" size="sm" type="button">
                  Continue Without CV
                </Button>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="studentName"
              className="form-input"
              value={formData.studentName}
              onChange={handleChange}
              placeholder="e.g. Alex Johnson"
            />
            {errors.studentName && <span className="form-error">{errors.studentName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="studentEmail"
              className="form-input"
              value={formData.studentEmail}
              onChange={handleChange}
              placeholder="alex.j@university.edu"
            />
            {errors.studentEmail && <span className="form-error">{errors.studentEmail}</span>}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">College / University *</label>
              <input
                type="text"
                name="college"
                className="form-input"
                value={formData.college}
                onChange={handleChange}
                placeholder="e.g. Stanford University"
              />
              {errors.college && <span className="form-error">{errors.college}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">CGPA / %</label>
              <input
                type="text"
                name="cgpa"
                className="form-input"
                value={formData.cgpa}
                onChange={handleChange}
                placeholder="e.g. 8.4"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Resume Link (Optional)</label>
            <input
              type="text"
              name="resumeUrl"
              className="form-input"
              value={formData.resumeUrl}
              onChange={handleChange}
              placeholder="https://drive.google.com/your-resume or LinkedIn link"
              disabled={useSavedCV}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Letter / Note (Optional)</label>
            <textarea
              name="coverLetter"
              rows="3"
              className="form-textarea"
              value={formData.coverLetter}
              onChange={handleChange}
              placeholder="Brief note detailing why you are interested in this position..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Button variant="outline" size="md" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" size="md" type="submit">
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
