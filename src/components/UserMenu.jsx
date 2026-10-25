import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const UserMenu = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user || !user.isLogged) {
    return (
      <Link to="/login">
        <button className="btn btn-primary btn-sm">Login</button>
      </Link>
    );
  }

  const displayName = user.name || user.email || 'User';
  const initial = displayName.charAt(0).toUpperCase();

  const handleLogoutClick = () => {
    setIsOpen(false);
    onLogout();
    navigate('/');
  };

  return (
    <div className="user-menu-wrapper" ref={dropdownRef}>
      <button
        type="button"
        className="user-menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="user-avatar">{initial}</span>
        <span>{displayName}</span>
        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>▼</span>
      </button>

      {isOpen && (
        <div className="user-dropdown">
          <div style={{ padding: '0.5rem 0.85rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.25rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)' }}>{displayName}</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user.email}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', fontWeight: 600, marginTop: '0.2rem', textTransform: 'capitalize' }}>
              {user.role === 'recruiter' ? '👔 Recruiter Profile' : '🎓 Student Candidate'}
            </div>
          </div>

          <Link to="/profile" className="dropdown-item" onClick={() => setIsOpen(false)}>
            👤 My Profile
          </Link>
          <Link to="/generate-cv" className="dropdown-item" onClick={() => setIsOpen(false)}>
            📄 Generate My CV
          </Link>
          <Link to="/applications" className="dropdown-item" onClick={() => setIsOpen(false)}>
            📁 My Applications
          </Link>
          {user.role === 'recruiter' && (
            <Link to="/recruiter" className="dropdown-item" onClick={() => setIsOpen(false)}>
              👔 Recruiter Hub
            </Link>
          )}

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '0.35rem', paddingTop: '0.35rem' }}>
            <button
              type="button"
              className="dropdown-item danger"
              style={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}
              onClick={handleLogoutClick}
            >
              🚪 Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
