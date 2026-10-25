import React, { createContext, useState, useCallback } from 'react';
import {
  getStoredApplications,
  addApplication,
  updateApplicationStatus,
  withdrawStoredApplication,
} from '../utils/storage';

// ApplicationsContext manages all job applications globally
export const ApplicationsContext = createContext(null);

export const ApplicationsProvider = ({ children }) => {
  const [applications, setApplications] = useState(() => getStoredApplications());

  // Submit a new application
  const applyToJob = useCallback((appData) => {
    const result = addApplication(appData);
    if (result.success) {
      setApplications(getStoredApplications());
    }
    return result;
  }, []);

  // Withdraw / remove an application (with confirmation done by caller)
  const withdrawApplication = useCallback((appId, userId) => {
    const result = withdrawStoredApplication(appId, userId);
    setApplications(result.applications);
    return result;
  }, []);

  // Update status (recruiter action)
  const changeStatus = useCallback((appId, newStatus) => {
    const result = updateApplicationStatus(appId, newStatus);
    if (result.success) setApplications(result.applications);
    return result.success;
  }, []);

  // Refresh from localStorage
  const refreshApplications = useCallback(() => {
    setApplications(getStoredApplications());
  }, []);

  // Computed counts (used by dashboard)
  const totalCount = applications.length;
  const shortlistedCount = applications.filter(
    (a) => a.status === 'Shortlisted' || a.status === 'Interview'
  ).length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;
  const appliedJobIds = applications.map((a) => a.jobId);

  const value = {
    applications,
    totalCount,
    shortlistedCount,
    offerCount,
    appliedJobIds,
    applyToJob,
    withdrawApplication,
    changeStatus,
    refreshApplications,
  };

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
};
