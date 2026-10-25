import React from 'react';

export const CVPreview = ({ cvData }) => {
  if (!cvData) return null;

  const {
    fullName = 'Candidate Name',
    email = '',
    phone = '',
    country = '',
    city = '',
    title = '',
    linkedin = '',
    github = '',
    portfolio = '',
    summary = '',
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    experience = [],
  } = cvData;

  const hasEducation = education && education.some((e) => e.college || e.degree);
  const hasSkills = skills && skills.length > 0;
  const hasProjects = projects && projects.some((p) => p.title || p.description);
  const hasCertifications = certifications && certifications.some((c) => c.name);
  const hasExperience = experience && experience.some((ex) => ex.title || ex.company);

  return (
    <div className="cv-preview-container">
      <div
        className="cv-printable-area"
        style={{
          backgroundColor: 'white',
          color: '#111827',
          borderRadius: 'var(--radius-md)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid #cbd5e1',
          fontSize: '0.88rem',
          lineHeight: 1.5,
        }}
      >
        {/* RESUME HEADER */}
        <div style={{ borderBottom: '2px solid #4338ca', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
            {fullName || 'Candidate Name'}
          </h1>

          {title && (
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#4338ca', marginTop: '0.2rem' }}>
              {title}
            </div>
          )}

          <div style={{ color: '#4b5563', fontSize: '0.85rem', marginTop: '0.35rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {email && <span>📧 {email}</span>}
            {phone && <span>📱 {phone}</span>}
            {(city || country) && <span>📍 {[city, country].filter(Boolean).join(', ')}</span>}
          </div>

          {(linkedin || github || portfolio) && (
            <div style={{ color: '#2563eb', fontSize: '0.8rem', marginTop: '0.35rem', display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
              {linkedin && <a href={linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
              {github && <a href={github} target="_blank" rel="noreferrer">GitHub</a>}
              {portfolio && <a href={portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
            </div>
          )}
        </div>

        {/* SECTION H: SUMMARY */}
        {summary && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
              Professional Summary
            </h4>
            <p style={{ color: '#374151', fontSize: '0.86rem', lineHeight: 1.55 }}>{summary}</p>
          </div>
        )}

        {/* SECTION C: EDUCATION */}
        {hasEducation && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Education
            </h4>
            {education
              .filter((e) => e.college || e.degree)
              .map((edu, idx) => (
                <div key={idx} style={{ marginBottom: '0.65rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111827' }}>
                    <span>{edu.college}</span>
                    {edu.gradYear && <span style={{ color: '#4b5563', fontWeight: 600 }}>{edu.gradYear}</span>}
                  </div>
                  <div style={{ color: '#4b5563', fontSize: '0.84rem' }}>
                    {edu.degree} {edu.cgpa ? `• CGPA / Grade: ${edu.cgpa}` : ''}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* SECTION D: TECHNICAL SKILLS */}
        {hasSkills && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
              Technical Skills
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skills.map((skill, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    border: '1px solid #bfdbfe',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* SECTION E: PROJECTS */}
        {hasProjects && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Key Projects
            </h4>
            {projects
              .filter((p) => p.title || p.description)
              .map((proj, idx) => (
                <div key={idx} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111827' }}>
                    <span>{proj.title}</span>
                    {proj.technologies && (
                      <span style={{ fontSize: '0.8rem', color: '#4338ca', fontWeight: 600 }}>
                        {proj.technologies}
                      </span>
                    )}
                  </div>
                  {proj.description && (
                    <p style={{ color: '#374151', fontSize: '0.84rem', marginTop: '0.2rem', whiteSpace: 'pre-line' }}>
                      {proj.description}
                    </p>
                  )}
                  {proj.link && (
                    <div style={{ fontSize: '0.78rem', color: '#2563eb', marginTop: '0.15rem' }}>
                      Link: {proj.link}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* SECTION G: WORK EXPERIENCE */}
        {hasExperience && (
          <div style={{ marginBottom: '1.25rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
              Work Experience
            </h4>
            {experience
              .filter((ex) => ex.title || ex.company)
              .map((exp, idx) => (
                <div key={idx} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#111827' }}>
                    <span>{exp.title} {exp.company ? `at ${exp.company}` : ''}</span>
                    {exp.duration && <span style={{ color: '#4b5563', fontSize: '0.82rem' }}>{exp.duration}</span>}
                  </div>
                  {exp.responsibilities && (
                    <p style={{ color: '#374151', fontSize: '0.84rem', marginTop: '0.2rem', whiteSpace: 'pre-line' }}>
                      {exp.responsibilities}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}

        {/* SECTION F: CERTIFICATIONS */}
        {hasCertifications && (
          <div style={{ marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4338ca', textTransform: 'uppercase', marginBottom: '0.35rem', letterSpacing: '0.05em' }}>
              Certifications & Achievements
            </h4>
            <ul style={{ paddingLeft: '1.25rem', color: '#374151', fontSize: '0.84rem' }}>
              {certifications
                .filter((c) => c.name)
                .map((cert, idx) => (
                  <li key={idx}>
                    <strong>{cert.name}</strong> {cert.issuer ? `— ${cert.issuer}` : ''} {cert.date ? `(${cert.date})` : ''}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CVPreview;
