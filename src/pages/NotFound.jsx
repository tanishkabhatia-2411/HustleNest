import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

export const NotFound = () => {
  return (
    <div className="not-found-page section">
      <div className="container" style={{ textAlign: 'center', padding: '4rem 1rem' }}>
        <div style={{ fontSize: '5.5rem', fontWeight: 800, color: 'var(--primary-color)', lineHeight: 1 }}>
          404
        </div>
        <h1 className="section-title" style={{ marginTop: '1rem' }}>
          Page Not Found
        </h1>
        <p className="section-subtitle" style={{ maxWidth: '520px', margin: '0 auto 2.5rem' }}>
          Oops! The page, job drive, or resource you are searching for on HustleNest does not exist or may have been moved.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/">
            <Button variant="primary" size="md">
              Return Home 🏠
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="md">
              Browse Active Jobs 💼
            </Button>
          </Link>
          <Link to="/generate-cv">
            <Button variant="accent" size="md">
              Generate CV 📄
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
