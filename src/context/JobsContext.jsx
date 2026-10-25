import React, { createContext, useState, useCallback } from 'react';
import {
  getStoredJobs,
  saveLiveJobs,
  getSavedJobIds,
  toggleSavedJobId,
  addNewJob,
} from '../utils/storage';

// JobsContext manages job listings and saved jobs for the whole app
export const JobsContext = createContext(null);

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState(() => getStoredJobs());
  const [savedJobIds, setSavedJobIds] = useState(() => getSavedJobIds());

  // Toggle a job as saved/unsaved
  const toggleSave = useCallback((jobId) => {
    const updated = toggleSavedJobId(jobId);
    setSavedJobIds(updated);
    return updated.includes(jobId); // return whether it is now saved
  }, []);

  // Replace only the live API source while preserving demo and recruiter jobs.
  const updateJobsList = useCallback((newJobs) => {
    saveLiveJobs(newJobs);
    setJobs(getStoredJobs());
  }, []);

  // Add a recruiter-posted job
  const addJob = useCallback((newJobData, recruiterId) => {
    const updatedJobs = addNewJob(newJobData, recruiterId);
    setJobs(updatedJobs);
    return updatedJobs;
  }, []);

  // Refresh jobs from localStorage (e.g. after application updates applicantCount)
  const refreshJobs = useCallback(() => {
    setJobs(getStoredJobs());
  }, []);

  const value = {
    jobs,
    savedJobIds,
    toggleSave,
    updateJobsList,
    addJob,
    refreshJobs,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};
