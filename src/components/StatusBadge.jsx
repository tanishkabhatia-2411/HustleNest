import React from 'react';

/**
 * Visual badge for tracking application status
 * Statuses: 'Applied', 'Shortlisted', 'Interview', 'Offer', 'Rejected'
 */
export const StatusBadge = ({ status = 'Applied' }) => {
  const normalizedStatus = status.toLowerCase();

  return (
    <span className={`status-badge ${normalizedStatus}`}>
      <span className="dot"></span>
      {status}
    </span>
  );
};

export default StatusBadge;
