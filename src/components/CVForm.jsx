import React, { useState } from 'react';
import Button from './Button';
import { COUNTRIES } from '../pages/Login';

export const CVForm = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState(
    initialData || {
      fullName: '',
      email: '',
      phone: '',
      country: 'India',
      city: '',
      title: '',
      linkedin: '',
      github: '',
      portfolio: '',
      targetRole: 'Software Developer',
      workMode: 'Any',
      searchLocation: 'Worldwide',
      employmentType: 'Full-time',
      summary: '',
      education: [
        {
          id: 'edu-1',
          college: '',
          degree: '',
          gradYear: '',
          cgpa: '',
        },
      ],
      skills: [],
      newSkillInput: '',
      projects: [
        {
          id: 'proj-1',
          title: '',
          description: '',
          technologies: '',
          link: '',
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: '',
          issuer: '',
          date: '',
        },
      ],
      experience: [
        {
          id: 'exp-1',
          title: '',
          company: '',
          duration: '',
          responsibilities: '',
        },
      ],
    }
  );

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Education Handlers
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        { id: `edu-${Date.now()}`, college: '', degree: '', gradYear: '', cgpa: '' },
      ],
    }));
  };

  const handleRemoveEducation = (id) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((item) => item.id !== id),
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  // Skill Chip Handlers
  const handleAddSkill = () => {
    if (!formData.newSkillInput.trim()) return;
    const skillName = formData.newSkillInput.trim();
    if (!formData.skills.includes(skillName)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillName],
        newSkillInput: '',
      }));
    } else {
      setFormData((prev) => ({ ...prev, newSkillInput: '' }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Project Handlers
  const handleAddProject = () => {
    setFormData((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        { id: `proj-${Date.now()}`, title: '', description: '', technologies: '', link: '' },
      ],
    }));
  };

  const handleRemoveProject = (id) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.filter((item) => item.id !== id),
    }));
  };

  const handleProjectChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      projects: prev.projects.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  // Certification Handlers
  const handleAddCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [
        ...prev.certifications,
        { id: `cert-${Date.now()}`, name: '', issuer: '', date: '' },
      ],
    }));
  };

  const handleRemoveCertification = (id) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((item) => item.id !== id),
    }));
  };

  const handleCertificationChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  // Work Experience Handlers
  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        { id: `exp-${Date.now()}`, title: '', company: '', duration: '', responsibilities: '' },
      ],
    }));
  };

  const handleRemoveExperience = (id) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.filter((item) => item.id !== id),
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      experience: prev.experience.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    }));
  };

  // Frontend Summary Generator (no AI — uses entered data only)
  const handleGenerateSummary = () => {
    const role = formData.targetRole || 'Software Development';
    const skillsList = formData.skills.length > 0 ? formData.skills.slice(0, 5).join(', ') : '';
    const edu = formData.education[0]?.degree || '';
    const name = formData.fullName ? formData.fullName.split(' ')[0] : 'I';

    let generated = '';
    if (edu && skillsList) {
      generated = `${edu} candidate with hands-on experience in ${skillsList}. Passionate about ${role} and eager to contribute to impactful projects in a collaborative environment.`;
    } else if (skillsList) {
      generated = `Motivated candidate with skills in ${skillsList}, seeking opportunities in ${role}. Committed to delivering quality work and continuous learning.`;
    } else if (edu) {
      generated = `${edu} graduate with a strong academic foundation, aspiring to build a career in ${role}. Quick learner with a passion for technology and problem solving.`;
    } else {
      generated = `Ambitious ${role} candidate eager to apply academic knowledge to real-world challenges. Passionate about building impactful software and contributing to global technology teams.`;
    }

    setFormData((prev) => ({ ...prev, summary: generated }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="cv-form-wrapper">
      {/* SECTION A — PERSONAL INFORMATION */}
      <div className="details-card">
        <h3>Section A — Personal Information</h3>

        <div className="cv-grid-2">
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              className="form-input"
              value={formData.fullName}
              onChange={handleTextChange}
              placeholder="e.g. Alex Johnson"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleTextChange}
              placeholder="alex.j@university.edu"
              required
            />
          </div>
        </div>

        <div className="cv-grid-3">
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phone"
              className="form-input"
              value={formData.phone}
              onChange={handleTextChange}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Country</label>
            <select name="country" className="form-select" value={formData.country} onChange={handleTextChange}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">City / Location</label>
            <input
              type="text"
              name="city"
              className="form-input"
              value={formData.city}
              onChange={handleTextChange}
              placeholder="e.g. Bengaluru"
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Professional Title / Role Headline</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleTextChange}
            placeholder="e.g. Frontend Developer or Computer Science Graduate"
          />
        </div>

        <div className="cv-grid-3">
          <div className="form-group">
            <label className="form-label">LinkedIn URL (Optional)</label>
            <input
              type="url"
              name="linkedin"
              className="form-input"
              value={formData.linkedin}
              onChange={handleTextChange}
              placeholder="https://linkedin.com/in/alex"
            />
          </div>
          <div className="form-group">
            <label className="form-label">GitHub URL (Optional)</label>
            <input
              type="url"
              name="github"
              className="form-input"
              value={formData.github}
              onChange={handleTextChange}
              placeholder="https://github.com/alex"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Portfolio URL (Optional)</label>
            <input
              type="url"
              name="portfolio"
              className="form-input"
              value={formData.portfolio}
              onChange={handleTextChange}
              placeholder="https://alexportfolio.dev"
            />
          </div>
        </div>
      </div>

      {/* SECTION B — CAREER PREFERENCES */}
      <div className="details-card">
        <h3>Section B — Career Preferences</h3>
        <div className="cv-grid-2">
          <div className="form-group">
            <label className="form-label">Target Job Category / Role</label>
            <select name="targetRole" className="form-select" value={formData.targetRole} onChange={handleTextChange}>
              <option value="Software Developer">Software Developer</option>
              <option value="Frontend Developer">Frontend Developer</option>
              <option value="Backend Developer">Backend Developer</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
              <option value="Data Analyst">Data Analyst</option>
              <option value="Data Scientist">Data Scientist</option>
              <option value="UI/UX Designer">UI/UX Designer</option>
              <option value="Product Manager">Product Manager</option>
              <option value="DevOps Engineer">DevOps Engineer</option>
              <option value="Mobile Developer">Mobile Developer</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Work Mode</label>
            <select name="workMode" className="form-select" value={formData.workMode} onChange={handleTextChange}>
              <option value="Any">Any Work Mode</option>
              <option value="Remote / Work from Home">Remote / Work from Home</option>
              <option value="Office">Office / On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>

        <div className="cv-grid-2">
          <div className="form-group">
            <label className="form-label">Preferred Job Location</label>
            <select name="searchLocation" className="form-select" value={formData.searchLocation} onChange={handleTextChange}>
              <option value="Worldwide">Worldwide / Global</option>
              <option value="My country">My Country ({formData.country})</option>
              <option value="Specific country">Specific Country</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Employment Type</label>
            <select name="employmentType" className="form-select" value={formData.employmentType} onChange={handleTextChange}>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>
          </div>
        </div>
      </div>

      {/* SECTION C — EDUCATION */}
      <div className="details-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Section C — Education</h3>
          <Button variant="outline" size="sm" type="button" onClick={handleAddEducation}>
            + Add Education
          </Button>
        </div>

        {formData.education.map((edu, idx) => (
          <div
            key={edu.id}
            style={{
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              backgroundColor: 'var(--bg-surface-secondary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                Education Entry #{idx + 1}
              </span>
              {formData.education.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveEducation(edu.id)}
                  style={{ color: 'var(--status-error-text)', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Remove ✕
                </button>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">College / University *</label>
              <input
                type="text"
                className="form-input"
                value={edu.college}
                onChange={(e) => handleEducationChange(edu.id, 'college', e.target.value)}
                placeholder="e.g. Stanford University or NIT Warangal"
              />
            </div>

            <div className="cv-grid-2-1-1">
              <div className="form-group">
                <label className="form-label">Degree & Major</label>
                <input
                  type="text"
                  className="form-input"
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                  placeholder="e.g. B.Tech in Computer Science"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Graduation Year</label>
                <input
                  type="text"
                  className="form-input"
                  value={edu.gradYear}
                  onChange={(e) => handleEducationChange(edu.id, 'gradYear', e.target.value)}
                  placeholder="e.g. 2026"
                />
              </div>

              <div className="form-group">
                <label className="form-label">CGPA / %</label>
                <input
                  type="text"
                  className="form-input"
                  value={edu.cgpa}
                  onChange={(e) => handleEducationChange(edu.id, 'cgpa', e.target.value)}
                  placeholder="e.g. 8.4"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION D — SKILLS */}
      <div className="details-card">
        <h3>Section D — Technical & Soft Skills</h3>
        <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Add your own languages, frameworks, tools, or soft skills. Press Enter or click Add Skill.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, minWidth: '160px' }}
            value={formData.newSkillInput}
            onChange={(e) => setFormData((prev) => ({ ...prev, newSkillInput: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddSkill();
              }
            }}
            placeholder="Type a skill (e.g. React, Python, SQL) and press Add or Enter"
          />
          <Button variant="primary" size="md" type="button" onClick={handleAddSkill}>
            Add Skill
          </Button>
        </div>

        {formData.skills.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-light)', fontStyle: 'italic' }}>
            No skills added yet. Type a skill above and click Add.
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {formData.skills.map((skill, i) => (
            <span
              key={i}
              className="skill-chip"
              style={{
                fontSize: '0.88rem',
                padding: '0.35rem 0.75rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              {skill}
              <button
                type="button"
                onClick={() => handleRemoveSkill(skill)}
                style={{ color: 'var(--status-error-text)', cursor: 'pointer', fontWeight: 700, background: 'none', border: 'none', lineHeight: 1 }}
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* SECTION E — PROJECTS */}
      <div className="details-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Section E — Projects</h3>
          <Button variant="outline" size="sm" type="button" onClick={handleAddProject}>
            + Add Project
          </Button>
        </div>

        {formData.projects.map((proj, idx) => (
          <div
            key={proj.id}
            style={{
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              backgroundColor: 'var(--bg-surface-secondary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                Project #{idx + 1}
              </span>
              {formData.projects.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveProject(proj.id)}
                  style={{ color: 'var(--status-error-text)', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Remove ✕
                </button>
              )}
            </div>

            <div className="cv-grid-2-1">
              <div className="form-group">
                <label className="form-label">Project Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={proj.title}
                  onChange={(e) => handleProjectChange(proj.id, 'title', e.target.value)}
                  placeholder="e.g. HustleNest Global Job Portal"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Technologies Used</label>
                <input
                  type="text"
                  className="form-input"
                  value={proj.technologies}
                  onChange={(e) => handleProjectChange(proj.id, 'technologies', e.target.value)}
                  placeholder="React, CSS3, Vite"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Project Description</label>
              <textarea
                rows="2"
                className="form-textarea"
                value={proj.description}
                onChange={(e) => handleProjectChange(proj.id, 'description', e.target.value)}
                placeholder="Describe what you built, your role, and key achievements..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Project / Demo Link (Optional)</label>
              <input
                type="url"
                className="form-input"
                value={proj.link}
                onChange={(e) => handleProjectChange(proj.id, 'link', e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>
          </div>
        ))}
      </div>

      {/* SECTION F — CERTIFICATIONS */}
      <div className="details-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Section F — Certifications</h3>
          <Button variant="outline" size="sm" type="button" onClick={handleAddCertification}>
            + Add Certification
          </Button>
        </div>

        {formData.certifications.map((cert, idx) => (
          <div
            key={cert.id}
            style={{
              padding: '1rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '0.75rem',
              backgroundColor: 'var(--bg-surface-secondary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Certification #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveCertification(cert.id)}
                style={{ color: 'var(--status-error-text)', fontSize: '0.8rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Remove ✕
              </button>
            </div>

            <div className="cv-grid-cert">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Certification Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={cert.name}
                  onChange={(e) => handleCertificationChange(cert.id, 'name', e.target.value)}
                  placeholder="e.g. AWS Cloud Practitioner"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Issuing Organization</label>
                <input
                  type="text"
                  className="form-input"
                  value={cert.issuer}
                  onChange={(e) => handleCertificationChange(cert.id, 'issuer', e.target.value)}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Year (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  value={cert.date}
                  onChange={(e) => handleCertificationChange(cert.id, 'date', e.target.value)}
                  placeholder="e.g. 2024"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION G — WORK EXPERIENCE (OPTIONAL FOR FRESHERS) */}
      <div className="details-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Section G — Work Experience</h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
              Optional — freshers and students can leave this section blank.
            </span>
          </div>
          <Button variant="outline" size="sm" type="button" onClick={handleAddExperience}>
            + Add Experience
          </Button>
        </div>

        {formData.experience.map((exp, idx) => (
          <div
            key={exp.id}
            style={{
              padding: '1.25rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1rem',
              backgroundColor: 'var(--bg-surface-secondary)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--primary-color)' }}>
                Experience #{idx + 1}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveExperience(exp.id)}
                style={{ color: 'var(--status-error-text)', fontSize: '0.85rem', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Remove ✕
              </button>
            </div>

            <div className="cv-grid-exp">
              <div className="form-group">
                <label className="form-label">Job / Role Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={exp.title}
                  onChange={(e) => handleExperienceChange(exp.id, 'title', e.target.value)}
                  placeholder="e.g. Software Intern"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={exp.company}
                  onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                  placeholder="e.g. TechCorp"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <input
                  type="text"
                  className="form-input"
                  value={exp.duration}
                  onChange={(e) => handleExperienceChange(exp.id, 'duration', e.target.value)}
                  placeholder="e.g. 3 Months (Summer 2025)"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Responsibilities & Key Contributions</label>
              <textarea
                rows="2"
                className="form-textarea"
                value={exp.responsibilities}
                onChange={(e) => handleExperienceChange(exp.id, 'responsibilities', e.target.value)}
                placeholder="Describe your responsibilities, achievements, and impact..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* SECTION H — PROFESSIONAL SUMMARY */}
      <div className="details-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Section H — Professional Summary</h3>
          <Button variant="outline" size="sm" type="button" onClick={handleGenerateSummary}>
            ✨ Auto-Generate Summary
          </Button>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
          Write your own summary, or click Auto-Generate to create one based on your entered skills and education.
        </p>

        <div className="form-group">
          <textarea
            name="summary"
            rows="4"
            className="form-textarea"
            value={formData.summary}
            onChange={handleTextChange}
            placeholder="Write a brief professional summary highlighting your background, skills, and career goals..."
          />
        </div>
      </div>

      {/* SUBMIT BUTTONS */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        {onCancel && (
          <Button variant="outline" size="lg" type="button" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button variant="primary" size="lg" type="submit">
          Save My Candidate CV 💾
        </Button>
      </div>
    </form>
  );
};

export default CVForm;
