import React from 'react';
import { Link } from 'react-router-dom';
import BrandLogoMark from './BrandLogoMark';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '1.35rem', fontWeight: 800 }}>
              <span className="logo-badge" style={{ width: '34px', height: '34px', fontSize: '1.1rem' }}>
                <BrandLogoMark />
              </span>
              <span>HustleNest</span>
            </div>
            <p>
              Find your next opportunity. Build your future. HustleNest connects students and freshers with national and remote job placement drives worldwide.
            </p>
          </div>

          <div className="footer-column">
            <h4>For Candidates</h4>
            <ul>
              <li><Link to="/jobs">Global Job Discovery</Link></li>
              <li><Link to="/generate-cv">Generate My CV</Link></li>
              <li><Link to="/applications">Track Applications</Link></li>
              <li><Link to="/profile">My Preferences</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>For Recruiters</h4>
            <ul>
              <li><Link to="/recruiter">Post Global Drives</Link></li>
              <li><Link to="/recruiter">Applicant Management</Link></li>
              <li><Link to="/recruiter">Placement Reports</Link></li>
              <li><Link to="/login">Recruiter Portal</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Support & Community</h4>
            <ul>
              <li><a href="#placement-guidelines">Placement Guidelines</a></li>
              <li><a href="#work-from-home">Remote Work FAQs</a></li>
              <li><a href="#country-search">Global Hiring Criteria</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 HustleNest. All rights reserved. Empowering global student placement drives.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
