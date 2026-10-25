import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';
import UserMenu from './UserMenu';
import BrandLogoMark from './BrandLogoMark';

export const Navbar = ({
  theme,
  onToggleTheme,
  user,
  onLogout,
  savedCount = 0,
  applicationCount = 0,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const drawerRef = useRef(null);

  // Close mobile drawer on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [mobileOpen]);

  const closeMenu = () => {
    setMobileOpen(false);
  };

  const handleMobileLogout = () => {
    closeMenu();
    onLogout();
    navigate('/');
  };

  const isLogged = user && user.isLogged;
  const userName = user?.name || user?.email || 'Candidate';

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={closeMenu}>
          <span className="logo-badge"><BrandLogoMark /></span>
          <span>HustleNest</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav">
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Jobs
                {savedCount > 0 && <span className="nav-badge">{savedCount}</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/generate-cv" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Generate CV
              </NavLink>
            </li>
            <li>
              <NavLink to="/applications" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                My Applications
                {applicationCount > 0 && <span className="nav-badge">{applicationCount}</span>}
              </NavLink>
            </li>
            <li>
              <NavLink to="/recruiter" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
                Recruiter Hub
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Desktop Actions */}
        <div className="nav-actions desktop-actions">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          <UserMenu user={user} onLogout={onLogout} />
        </div>

        {/* Mobile Header Right Actions (Theme Toggle + Hamburger) */}
        <div className="mobile-header-actions">
          <ThemeToggle theme={theme} onToggleTheme={onToggleTheme} />
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation drawer"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* MOBILE OVERLAY DRAWER */}
      {mobileOpen && (
        <div className="mobile-drawer-backdrop" onClick={closeMenu}>
          <div
            className="mobile-drawer-content"
            ref={drawerRef}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-drawer-header">
              <Link to="/" className="brand-logo" onClick={closeMenu}>
                <span className="logo-badge"><BrandLogoMark /></span>
                <span>HustleNest</span>
              </Link>
              <button type="button" className="close-btn" onClick={closeMenu}>
                ✕
              </button>
            </div>

            {/* User Profile Card inside Drawer */}
            <div className="mobile-drawer-user">
              {isLogged ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                      {userName}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {user.email || 'Candidate User'}
                    </div>
                    {user.country && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', marginTop: '0.1rem' }}>
                        📍 {user.country} • {user.role === 'recruiter' ? '👔 Recruiter' : '🎓 Student'}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Guest Candidate</span>
                  <Link to="/login" onClick={closeMenu}>
                    <button className="btn btn-primary btn-sm">Sign In / Register</button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Drawer Menu Links */}
            <ul className="mobile-drawer-links">
              <li>
                <NavLink to="/" className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')} onClick={closeMenu}>
                  🏠 Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')} onClick={closeMenu}>
                  💼 Browse Jobs {savedCount > 0 ? `(${savedCount} saved)` : ''}
                </NavLink>
              </li>
              <li>
                <NavLink to="/generate-cv" className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')} onClick={closeMenu}>
                  📄 Generate My CV
                </NavLink>
              </li>
              <li>
                <NavLink to="/applications" className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')} onClick={closeMenu}>
                  📁 My Applications {applicationCount > 0 ? `(${applicationCount})` : ''}
                </NavLink>
              </li>
              <li>
                <NavLink to="/recruiter" className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')} onClick={closeMenu}>
                  👔 Recruiter Hub
                </NavLink>
              </li>

              {isLogged && (
                <>
                  <li style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.5rem', paddingTop: '0.5rem' }}>
                    <NavLink to="/profile" className={({ isActive }) => (isActive ? 'mobile-link active' : 'mobile-link')} onClick={closeMenu}>
                      👤 My Profile & Preferences
                    </NavLink>
                  </li>
                  <li>
                    <button
                      type="button"
                      className="mobile-link danger"
                      style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
                      onClick={handleMobileLogout}
                    >
                      🚪 Sign Out ({userName})
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
