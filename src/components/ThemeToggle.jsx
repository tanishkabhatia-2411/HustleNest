import React from 'react';

/**
 * Accessible Theme Toggle Button for HustleNest (Light / Dark Mode)
 */
export const ThemeToggle = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle-btn"
      onClick={onToggleTheme}
      aria-label="Toggle dark mode"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
