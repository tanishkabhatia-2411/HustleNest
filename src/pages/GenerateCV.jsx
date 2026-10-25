import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button';
import CVForm from '../components/CVForm';
import CVPreview from '../components/CVPreview';
import { getUserCV, saveUserCV, deleteUserCV } from '../utils/storage';
import { useAuth } from '../hooks/useContextHooks';

/**
 * PDF generation using jsPDF (already installed: "jspdf": "^4.2.1")
 *
 * jsPDF creates a real binary PDF file in the browser.
 * We call doc.save() which triggers a browser file download.
 * This is NOT window.print() — it's a real .pdf file on the user's device.
 */
const generateAndDownloadPDF = async (cvData) => {
  try {
    // Dynamic import — only loads jsPDF when user clicks Download
    const { jsPDF } = await import('jspdf');

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4', // 210 x 297 mm
    });

    const pageW = doc.internal.pageSize.getWidth();   // 210
    const pageH = doc.internal.pageSize.getHeight();  // 297
    const margin = 18;
    const contentW = pageW - margin * 2;

    // Colors
    const indigo = [67, 56, 202];  // #4338CA
    const dark   = [17, 24, 39];   // #111827
    const muted  = [75, 85, 99];   // #4B5563
    const light  = [100, 116, 139]; // #64748B

    let y = margin; // current vertical cursor

    // Helper: add a new page if we're running out of space
    const checkPageBreak = (neededSpace = 10) => {
      if (y + neededSpace > pageH - margin) {
        doc.addPage();
        y = margin;
      }
    };

    // ── HEADER: Name & Contact ─────────────────────────────────────────────
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(...dark);
    doc.text(cvData.fullName || 'Candidate Name', margin, y);
    y += 6;

    if (cvData.title) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...indigo);
      doc.text(cvData.title, margin, y);
      y += 5;
    }

    // Contact line
    const contacts = [
      cvData.email && `✉ ${cvData.email}`,
      cvData.phone && `✆ ${cvData.phone}`,
      (cvData.city || cvData.country) && `📍 ${[cvData.city, cvData.country].filter(Boolean).join(', ')}`,
    ].filter(Boolean);

    if (contacts.length) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...muted);
      doc.text(contacts.join('   '), margin, y);
      y += 5;
    }

    // Links line
    const links = [
      cvData.linkedin && `LinkedIn: ${cvData.linkedin}`,
      cvData.github && `GitHub: ${cvData.github}`,
      cvData.portfolio && `Portfolio: ${cvData.portfolio}`,
    ].filter(Boolean);

    if (links.length) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(...indigo);
      doc.text(links.join('   |   '), margin, y);
      y += 5;
    }

    // Horizontal rule
    y += 2;
    doc.setDrawColor(...indigo);
    doc.setLineWidth(0.7);
    doc.line(margin, y, pageW - margin, y);
    y += 6;

    // ── SECTION HELPER ──────────────────────────────────────────────────────
    const drawSectionHeading = (title) => {
      checkPageBreak(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...indigo);
      doc.text(title.toUpperCase(), margin, y);
      y += 1.5;
      doc.setDrawColor(...indigo);
      doc.setLineWidth(0.3);
      doc.line(margin, y, pageW - margin, y);
      y += 5;
    };

    const drawBodyText = (text, indent = 0, size = 9) => {
      if (!text) return;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...dark);
      const lines = doc.splitTextToSize(text, contentW - indent);
      lines.forEach((line) => {
        checkPageBreak(5);
        doc.text(line, margin + indent, y);
        y += 4.5;
      });
    };

    const drawMutedText = (text, indent = 0, size = 8.5) => {
      if (!text) return;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...muted);
      const lines = doc.splitTextToSize(text, contentW - indent);
      lines.forEach((line) => {
        checkPageBreak(5);
        doc.text(line, margin + indent, y);
        y += 4.5;
      });
    };

    // ── PROFESSIONAL SUMMARY ────────────────────────────────────────────────
    if (cvData.summary) {
      drawSectionHeading('Professional Summary');
      drawBodyText(cvData.summary);
      y += 3;
    }

    // ── EDUCATION ───────────────────────────────────────────────────────────
    const hasEducation = cvData.education?.some((e) => e.college || e.degree);
    if (hasEducation) {
      drawSectionHeading('Education');
      cvData.education
        .filter((e) => e.college || e.degree)
        .forEach((edu) => {
          checkPageBreak(12);
          // College + year on same line
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(...dark);
          const rightText = edu.gradYear || '';
          const nameWidth = doc.getStringUnitWidth(edu.college || '') * 9.5 / doc.internal.scaleFactor;
          doc.text(edu.college || '', margin, y);
          if (rightText) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...muted);
            doc.text(rightText, pageW - margin - doc.getStringUnitWidth(rightText) * 8.5 / doc.internal.scaleFactor, y);
          }
          y += 4.5;
          // Degree + CGPA
          const degreeText = [edu.degree, edu.cgpa ? `CGPA: ${edu.cgpa}` : ''].filter(Boolean).join('  •  ');
          drawMutedText(degreeText);
          y += 2;
        });
      y += 1;
    }

    // ── TECHNICAL SKILLS ────────────────────────────────────────────────────
    if (cvData.skills?.length > 0) {
      drawSectionHeading('Technical Skills');
      const skillsLine = cvData.skills.join('  •  ');
      drawBodyText(skillsLine);
      y += 3;
    }

    // ── PROJECTS ────────────────────────────────────────────────────────────
    const hasProjects = cvData.projects?.some((p) => p.title || p.description);
    if (hasProjects) {
      drawSectionHeading('Key Projects');
      cvData.projects
        .filter((p) => p.title || p.description)
        .forEach((proj) => {
          checkPageBreak(16);
          // Title + technologies
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(...dark);
          doc.text(proj.title || 'Project', margin, y);
          if (proj.technologies) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...indigo);
            const techW = doc.getStringUnitWidth(proj.technologies) * 8.5 / doc.internal.scaleFactor;
            doc.text(proj.technologies, pageW - margin - techW, y);
          }
          y += 4.5;
          if (proj.description) drawMutedText(proj.description, 0);
          if (proj.link) {
            doc.setFontSize(8);
            doc.setTextColor(...indigo);
            doc.text(`Link: ${proj.link}`, margin, y);
            y += 4;
          }
          y += 2;
        });
      y += 1;
    }

    // ── WORK EXPERIENCE ─────────────────────────────────────────────────────
    const hasExp = cvData.experience?.some((e) => e.title || e.company);
    if (hasExp) {
      drawSectionHeading('Work Experience');
      cvData.experience
        .filter((e) => e.title || e.company)
        .forEach((exp) => {
          checkPageBreak(16);
          const roleText = [exp.title, exp.company ? `at ${exp.company}` : ''].filter(Boolean).join(' ');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(9.5);
          doc.setTextColor(...dark);
          doc.text(roleText, margin, y);
          if (exp.duration) {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8.5);
            doc.setTextColor(...muted);
            const durW = doc.getStringUnitWidth(exp.duration) * 8.5 / doc.internal.scaleFactor;
            doc.text(exp.duration, pageW - margin - durW, y);
          }
          y += 4.5;
          if (exp.responsibilities) drawMutedText(exp.responsibilities);
          y += 2;
        });
      y += 1;
    }

    // ── CERTIFICATIONS ──────────────────────────────────────────────────────
    const hasCerts = cvData.certifications?.some((c) => c.name);
    if (hasCerts) {
      drawSectionHeading('Certifications & Achievements');
      cvData.certifications
        .filter((c) => c.name)
        .forEach((cert) => {
          checkPageBreak(8);
          const certLine = [
            cert.name,
            cert.issuer ? `— ${cert.issuer}` : '',
            cert.date ? `(${cert.date})` : '',
          ].filter(Boolean).join(' ');
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(...dark);
          // Bullet point
          doc.text('•', margin, y);
          doc.text(certLine, margin + 4, y);
          y += 4.5;
        });
    }

    // ── SAVE & DOWNLOAD ─────────────────────────────────────────────────────
    const rawName = cvData.fullName || '';
    const safeName = rawName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
    const filename = safeName ? `${safeName}_CV.pdf` : 'HustleNest_Resume.pdf';

    doc.save(filename);
    return { success: true, filename };
  } catch (err) {
    console.error('PDF generation error:', err);
    return { success: false, error: err.message };
  }
};

// ── PRINT CV (window.print fallback) ──────────────────────────────────────────
const printCV = (fullName) => {
  const origTitle = document.title;
  const nameSlug = fullName
    ? fullName.trim().replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '')
    : 'HustleNest_Resume';
  document.title = `${nameSlug}_CV`;
  window.print();
  setTimeout(() => { document.title = origTitle; }, 1500);
};

// ── MAIN COMPONENT ─────────────────────────────────────────────────────────────
export const GenerateCV = ({ onSaveCV }) => {
  // Read user from AuthContext instead of receiving as prop
  const { user, userId, savedCV: contextCV, refreshCV } = useAuth();

  const [userCV, setUserCV] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [pdfLoading, setPdfLoading] = useState(false);

  // Load user's own CV from localStorage on mount or when user changes
  useEffect(() => {
    const existing = getUserCV(userId);
    setUserCV(existing || null);
    setIsEditing(false);
  }, [userId]);

  const showLocalToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 5000);
  };

  const handleStartCreating = () => setIsEditing(true);

  const handleSaveForm = (formData) => {
    saveUserCV(userId, formData);
    setUserCV(formData);
    setIsEditing(false);
    refreshCV(userId);
    if (onSaveCV) onSaveCV(formData);
    showLocalToast('✅ Resume saved successfully to your candidate account!');
  };

  const handleDeleteCV = () => {
    deleteUserCV(userId);
    setUserCV(null);
    setIsEditing(false);
    setShowConfirmDelete(false);
    refreshCV(userId);
    if (onSaveCV) onSaveCV(null);
    showLocalToast('🗑️ Resume reset successfully.');
  };

  // ── REAL PDF DOWNLOAD using jsPDF ─────────────────────────────────────────
  const handleDownloadPDF = useCallback(async () => {
    if (!userCV) return;
    setPdfLoading(true);
    showLocalToast('⏳ Generating your PDF…', 'info');

    const result = await generateAndDownloadPDF(userCV);

    setPdfLoading(false);
    if (result.success) {
      showLocalToast(`✅ PDF downloaded: ${result.filename}`);
    } else {
      showLocalToast(
        `❌ PDF generation failed. Try the Print button as a fallback. (${result.error})`,
        'error'
      );
    }
  }, [userCV]);

  const handlePrintCV = () => printCV(userCV?.fullName);

  const hasCV = Boolean(userCV && (userCV.fullName || userCV.email));

  return (
    <div className="generate-cv-page section">
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">HustleNest CV / Resume Builder</h1>
          <p className="section-subtitle" style={{ marginBottom: 0 }}>
            Build, preview, and{' '}
            <strong>download a real PDF</strong> of your placement-ready resume — saved privately for{' '}
            {user?.email || 'your account'}.
          </p>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div
            role="status"
            style={{
              backgroundColor:
                toastType === 'error'
                  ? 'var(--status-error-bg)'
                  : toastType === 'info'
                  ? 'var(--primary-light)'
                  : 'var(--status-success-bg)',
              color:
                toastType === 'error'
                  ? 'var(--status-error-text)'
                  : toastType === 'info'
                  ? 'var(--primary-color)'
                  : 'var(--status-success-text)',
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              fontWeight: 600,
              border: `1px solid ${toastType === 'error' ? 'var(--status-error-text)' : 'var(--accent-color)'}`,
            }}
          >
            {toastMessage}
          </div>
        )}

        {/* ─── STATE 1: EMPTY STATE — No CV, not editing ─── */}
        {!hasCV && !isEditing ? (
          <div className="empty-state" style={{ maxWidth: '600px', margin: '2rem auto' }}>
            <div className="empty-icon">📄</div>
            <h2 className="empty-title">Create Your Professional CV</h2>
            <p className="empty-desc">
              Build a placement-ready resume using <strong>your own</strong> education, skills,
              projects, and experience. Download as a real PDF file. Every HustleNest user has
              their own separate resume stored privately.
            </p>
            <Button variant="primary" size="lg" onClick={handleStartCreating}>
              🚀 Start Creating My CV
            </Button>
          </div>
        ) : isEditing ? (
          /* ─── STATE 2: EDITING MODE — Form + Live Preview ─── */
          <div>
            <div
              className="no-print"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                {hasCV ? 'Editing Your Resume' : 'Building Your Resume'} — {user?.name || 'Candidate'}
              </h2>
              {hasCV && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Cancel Editing
                </Button>
              )}
            </div>

            <div className="cv-edit-layout">
              <div>
                <CVForm
                  initialData={userCV}
                  onSave={handleSaveForm}
                  onCancel={hasCV ? () => setIsEditing(false) : null}
                />
              </div>
              <div className="cv-preview-sticky no-print">
                <div
                  style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-muted)' }}
                >
                  📄 Live Resume Preview
                </div>
                <CVPreview cvData={userCV} />
              </div>
            </div>
          </div>
        ) : (
          /* ─── STATE 3: VIEW MODE — Actions + Full Preview ─── */
          <div>
            {/* Action bar */}
            <div
              className="no-print cv-actions-bar"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem 1.75rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                  {userCV.fullName ? `${userCV.fullName}'s Resume` : 'Your Saved Resume'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                  Ready to download as a real PDF and attach to job applications.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                {/* PRIMARY: Real PDF download via jsPDF */}
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                >
                  {pdfLoading ? '⏳ Generating…' : '📥 Download CV as PDF'}
                </Button>

                {/* SECONDARY: Print / Save as PDF via browser print */}
                <Button variant="outline" size="md" onClick={handlePrintCV}>
                  🖨️ Print CV
                </Button>

                <Button variant="secondary" size="md" onClick={() => setIsEditing(true)}>
                  ✏️ Edit CV
                </Button>

                <Button variant="danger" size="md" onClick={() => setShowConfirmDelete(true)}>
                  🗑️ Reset CV
                </Button>
              </div>
            </div>

            {/* PDF download note */}
            <div
              className="no-print"
              style={{
                backgroundColor: 'var(--primary-light)',
                border: '1px solid var(--primary-color)',
                borderRadius: 'var(--radius-md)',
                padding: '0.75rem 1.25rem',
                marginBottom: '1.5rem',
                fontSize: '0.85rem',
                color: 'var(--primary-color)',
                fontWeight: 500,
              }}
            >
              💡 <strong>Download CV as PDF</strong> generates a real A4 PDF file using jsPDF and saves it directly to
              your device. Your browser will download it to your configured Downloads folder.
              Use <strong>Print CV</strong> as an alternative (browser print → Save as PDF).
            </div>

            {/* CV Preview */}
            <div style={{ maxWidth: '820px', margin: '0 auto' }}>
              <CVPreview cvData={userCV} />
            </div>
          </div>
        )}

        {/* CONFIRM DELETE MODAL */}
        {showConfirmDelete && (
          <div className="modal-overlay" onClick={() => setShowConfirmDelete(false)}>
            <div
              className="modal-content"
              style={{ maxWidth: '420px', textAlign: 'center' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>
                Reset Saved Resume?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                This will permanently delete your CV data. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Button variant="outline" size="md" onClick={() => setShowConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button variant="danger" size="md" onClick={handleDeleteCV}>
                  Yes, Reset CV
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateCV;
