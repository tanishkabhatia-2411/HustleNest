import React, { useState } from 'react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { COUNTRIES } from './Login';

export const RecruiterDashboard = ({
  jobs = [],
  applications = [],
  onAddNewJob,
  onUpdateAppStatus,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedJobForApps, setSelectedJobForApps] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Form State for new job
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: 'Bengaluru, India',
    country: 'India',
    workMode: 'Remote', // Remote, Office, Hybrid
    type: 'Full-time',
    salary: '',
    category: 'Engineering',
    skillsInput: '',
    eligibility: '',
    description: '',
    deadline: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const totalJobs = jobs.length;
  const totalApplicants = applications.length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Offer' || a.status === 'Interview'
  ).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errs = {};
    if (!jobForm.title.trim()) errs.title = 'Title is required';
    if (!jobForm.company.trim()) errs.company = 'Company name is required';
    if (!jobForm.salary.trim()) errs.salary = 'Salary / Stipend is required';
    if (!jobForm.eligibility.trim()) errs.eligibility = 'Eligibility details required';
    if (!jobForm.description.trim()) errs.description = 'Job description required';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleJobSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const skillsArray = jobForm.skillsInput
        ? jobForm.skillsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : ['JavaScript', 'Communication'];

      onAddNewJob({
        title: jobForm.title,
        company: jobForm.company,
        location: jobForm.location,
        country: jobForm.country,
        workMode: jobForm.workMode,
        type: jobForm.type,
        salary: jobForm.salary,
        category: jobForm.category,
        skills: skillsArray,
        eligibility: jobForm.eligibility,
        description: jobForm.description,
        deadline: jobForm.deadline || '2026-10-31',
      });

      setShowAddModal(false);
      setJobForm({
        title: '',
        company: '',
        location: 'Bengaluru, India',
        country: 'India',
        workMode: 'Remote',
        type: 'Full-time',
        salary: '',
        category: 'Engineering',
        skillsInput: '',
        eligibility: '',
        description: '',
        deadline: '',
      });

      setSuccessMsg('🎉 Job drive successfully published to HustleNest! Candidates worldwide can now view and apply.');
      setTimeout(() => setSuccessMsg(''), 5000);
    }
  };

  return (
    <div className="recruiter-page section">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="section-title">HustleNest Recruiter Dashboard</h1>
            <p className="section-subtitle" style={{ marginBottom: 0 }}>
              Publish global hiring drives, manage candidate pipelines, and review candidate CVs.
            </p>
          </div>
          <Button variant="primary" size="lg" onClick={() => setShowAddModal(true)}>
            + Post Global Drive
          </Button>
        </div>

        {successMsg && (
          <div style={{ backgroundColor: 'var(--status-success-bg)', color: 'var(--status-success-text)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', fontWeight: 600, border: '1px solid var(--accent-color)' }}>
            {successMsg}
          </div>
        )}

        {/* Dashboard Summary Cards */}
        <div className="dashboard-stats">
          <div className="stat-card" style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Drives Posted</span>
            <div className="stat-value" style={{ fontSize: '2rem', marginTop: '0.2rem' }}>{totalJobs}</div>
          </div>
          <div className="stat-card" style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Applicants</span>
            <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--primary-color)', marginTop: '0.2rem' }}>
              {totalApplicants}
            </div>
          </div>
          <div className="stat-card" style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Shortlisted / Interviewing</span>
            <div className="stat-value" style={{ fontSize: '2rem', color: 'var(--accent-color)', marginTop: '0.2rem' }}>
              {shortlistedCount}
            </div>
          </div>
        </div>

        {/* Posted Jobs Table */}
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
          Active Drive Listings
        </h2>

        <div className="table-wrapper" style={{ marginBottom: '3rem' }}>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Company</th>
                <th>Work Mode</th>
                <th>Country</th>
                <th>Offer Package</th>
                <th>Applicants</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => {
                const jobApps = applications.filter((a) => a.jobId === job.id);
                return (
                  <tr key={job.id}>
                    <td><strong>{job.title}</strong></td>
                    <td>{job.company}</td>
                    <td><span className="skill-chip">{job.workMode || 'Office'}</span></td>
                    <td>{job.country || 'Global'}</td>
                    <td>{job.salary}</td>
                    <td>
                      <strong style={{ color: 'var(--primary-color)' }}>{jobApps.length}</strong> candidates
                    </td>
                    <td>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJobForApps(selectedJobForApps?.id === job.id ? null : job)}
                      >
                        {selectedJobForApps?.id === job.id ? 'Hide Candidates' : `View Candidates (${jobApps.length})`}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Job Applicants Drawer */}
        {selectedJobForApps && (
          <div style={{ backgroundColor: 'var(--bg-surface)', border: '2px solid var(--primary-color)', borderRadius: 'var(--radius-lg)', padding: '2rem', marginBottom: '3rem', boxShadow: 'var(--shadow-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)' }}>
                  Candidates for "{selectedJobForApps.title}" ({selectedJobForApps.company})
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                  Update applicant selection statuses to notify candidates.
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedJobForApps(null)}>
                Close List ✕
              </Button>
            </div>

            {applications.filter((a) => a.jobId === selectedJobForApps.id).length > 0 ? (
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Candidate Name</th>
                      <th>Email</th>
                      <th>College</th>
                      <th>Resume / CV</th>
                      <th>Applied Date</th>
                      <th>Status</th>
                      <th>Update Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications
                      .filter((a) => a.jobId === selectedJobForApps.id)
                      .map((app) => (
                        <tr key={app.id}>
                          <td><strong>{app.studentName}</strong></td>
                          <td>{app.studentEmail}</td>
                          <td>{app.college}</td>
                          <td>
                            {app.attachedCV ? (
                              <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>📄 HustleNest CV</span>
                            ) : (
                              <a href={app.resumeUrl || '#'} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>
                                Link 🔗
                              </a>
                            )}
                          </td>
                          <td>{app.appliedDate}</td>
                          <td><StatusBadge status={app.status} /></td>
                          <td>
                            <select
                              className="filter-select"
                              style={{ padding: '0.35rem 0.5rem', fontSize: '0.85rem' }}
                              value={app.status}
                              onChange={(e) => onUpdateAppStatus(app.id, e.target.value)}
                            >
                              <option value="Applied">Applied</option>
                              <option value="Shortlisted">Shortlisted</option>
                              <option value="Interview">Interview</option>
                              <option value="Offer">Offer</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No candidate applications submitted for this role yet.
              </div>
            )}
          </div>
        )}

        {/* Modal for Adding New Job */}
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Publish New Global Job Drive</h2>
                <button className="close-btn" onClick={() => setShowAddModal(false)}>
                  ✕
                </button>
              </div>

              <form onSubmit={handleJobSubmit}>
                <div className="form-group">
                  <label className="form-label">Job Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="form-input"
                    value={jobForm.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Frontend Engineer"
                  />
                  {formErrors.title && <span className="form-error">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    className="form-input"
                    value={jobForm.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Stripe or Google"
                  />
                  {formErrors.company && <span className="form-error">{formErrors.company}</span>}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Work Mode</label>
                    <select name="workMode" className="form-select" value={jobForm.workMode} onChange={handleInputChange}>
                      <option value="Remote">Remote / WFH</option>
                      <option value="Office">Office / On-site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Country</label>
                    <select name="country" className="form-select" value={jobForm.country} onChange={handleInputChange}>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Offer Type</label>
                    <select name="type" className="form-select" value={jobForm.type} onChange={handleInputChange}>
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Salary / Stipend *</label>
                    <input
                      type="text"
                      name="salary"
                      className="form-input"
                      value={jobForm.salary}
                      onChange={handleInputChange}
                      placeholder="e.g. $90,000 / yr or ₹15 LPA"
                    />
                    {formErrors.salary && <span className="form-error">{formErrors.salary}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location / City</label>
                    <input
                      type="text"
                      name="location"
                      className="form-input"
                      value={jobForm.location}
                      onChange={handleInputChange}
                      placeholder="e.g. Bengaluru, India"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    name="skillsInput"
                    className="form-input"
                    value={jobForm.skillsInput}
                    onChange={handleInputChange}
                    placeholder="React, JavaScript, Node.js, SQL"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Eligibility Criteria *</label>
                  <input
                    type="text"
                    name="eligibility"
                    className="form-input"
                    value={jobForm.eligibility}
                    onChange={handleInputChange}
                    placeholder="Bachelor's degree in CS/IT (Batch 2025/2026)"
                  />
                  {formErrors.eligibility && <span className="form-error">{formErrors.eligibility}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Job Description *</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="form-textarea"
                    value={jobForm.description}
                    onChange={handleInputChange}
                    placeholder="Provide overview of key responsibilities..."
                  />
                  {formErrors.description && <span className="form-error">{formErrors.description}</span>}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                  <Button variant="outline" size="md" onClick={() => setShowAddModal(false)} type="button">
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" type="submit">
                    Publish Drive
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
