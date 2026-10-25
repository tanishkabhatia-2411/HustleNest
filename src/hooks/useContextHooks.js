import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { JobsContext } from '../context/JobsContext';
import { ApplicationsContext } from '../context/ApplicationsContext';

/**
 * useAuth - Access the AuthContext
 * Returns: { user, savedCV, isLogged, isRecruiter, userId, login, logout, refreshCV }
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside an <AuthProvider>');
  }
  return context;
};

/**
 * useTheme - Access the ThemeContext
 * Returns: { theme, toggleTheme, isDark }
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside a <ThemeProvider>');
  }
  return context;
};

/**
 * useJobs - Access the JobsContext
 * Returns: { jobs, savedJobIds, toggleSave, updateJobsList, addJob, refreshJobs }
 */
export const useJobs = () => {
  const context = useContext(JobsContext);
  if (!context) {
    throw new Error('useJobs must be used inside a <JobsProvider>');
  }
  return context;
};

/**
 * useApplications - Access the ApplicationsContext
 * Returns: { applications, totalCount, shortlistedCount, offerCount, appliedJobIds,
 *            applyToJob, withdrawApplication, changeStatus }
 */
export const useApplications = () => {
  const context = useContext(ApplicationsContext);
  if (!context) {
    throw new Error('useApplications must be used inside an <ApplicationsProvider>');
  }
  return context;
};
