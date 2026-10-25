import React, { useState, useCallback } from 'react';
import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ApplicationModal from './components/ApplicationModal';

// Pages
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Applications from './pages/Applications';
import RecruiterDashboard from './pages/RecruiterDashboard';
import Login from './pages/Login';
import Profile from './pages/Profile';
import GenerateCV from './pages/GenerateCV';
import NotFound from './pages/NotFound';

// Custom hooks that read from Context
import { useAuth } from './hooks/useContextHooks';
import { useTheme } from './hooks/useContextHooks';
import { useJobs } from './hooks/useContextHooks';
import { useApplications } from './hooks/useContextHooks';
import {
  filterApplicationsForRecruiter,
  filterApplicationsForUser,
  filterJobsForRecruiter,
} from './utils/storage';

import './App.css';

const RequireAuth = ({ isLogged }) =>
  isLogged ? <Outlet /> : <Navigate to="/login" replace />;

const RequireRole = ({ user, role }) =>
  user?.role === role ? <Outlet /> : <Navigate to={user?.role === 'recruiter' ? '/recruiter' : '/jobs'} replace />;

/**
 * App.jsx — The main application shell.
 *
 * HOW CONTEXT WORKS HERE:
 * Instead of managing user/jobs/applications/theme state here and passing as props,
 * we now READ from Context using custom hooks. This removes prop drilling.
 * Each page/component can call useAuth(), useJobs(), etc. directly without
 * needing to receive data as props from App.
 *
 * App.jsx still handles:
 * - Route definitions
 * - The Application Modal (needs to be above all routes)
 * - Toast notification display
 */
export function App() {
  const navigate = useNavigate();

  // Read shared state from Context — no more local state needed for these
  const { user, isLogged, isRecruiter, login, logout, savedCV, refreshCV, userId } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { jobs, savedJobIds, toggleSave, updateJobsList, addJob, refreshJobs } = useJobs();
  const { applications, applyToJob, changeStatus } = useApplications();
  const userApplications = filterApplicationsForUser(applications, userId);
  const recruiterJobs = filterJobsForRecruiter(jobs, isRecruiter ? userId : null);
  const recruiterApplications = filterApplicationsForRecruiter(
    applications,
    jobs,
    isRecruiter ? userId : null
  );
  const appliedJobIds = userApplications.map((application) => application.jobId);

  // Application Modal state (kept local — only needed in App for the overlay)
  const [activeJobForModal, setActiveJobForModal] = useState(null);

  // Toast Notification (kept local — transient UI state)
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Toggle Save Job
  const handleToggleSave = useCallback(
    (jobId) => {
      const isSaved = toggleSave(jobId);
      showToast(isSaved ? 'Job saved to your bookmarks!' : 'Job removed from saved.');
    },
    [toggleSave, showToast]
  );

  // Open apply modal
  const handleApplyClick = useCallback(
    (job) => {
      if (!isLogged) {
        navigate('/login');
        return;
      }
      const alreadyApplied = userApplications.some((app) => app.jobId === job.id);
      if (alreadyApplied) {
        showToast('You have already applied for this position!', 'info');
        return;
      }
      setActiveJobForModal(job);
    },
    [isLogged, userApplications, navigate, showToast]
  );

  // Submit application
  const handleSubmitApplication = useCallback(
    (appData) => {
      const result = applyToJob({ ...appData, userId });
      if (result.success) {
        refreshJobs(); // refresh applicant counts
        setActiveJobForModal(null);
        showToast('🎉 Application submitted! Track updates in My Applications.');
        navigate('/applications');
      } else {
        showToast(result.message, 'error');
      }
    },
    [applyToJob, userId, refreshJobs, showToast, navigate]
  );

  // Recruiter: add a new job
  const handleAddNewJob = useCallback(
    (newJobData) => {
      addJob(newJobData, userId);
      showToast('🚀 New job drive published to HustleNest!');
    },
    [addJob, userId, showToast]
  );

  // Recruiter: update applicant status
  const handleUpdateAppStatus = useCallback(
    (appId, newStatus) => {
      if (!recruiterApplications.some((application) => application.id === appId)) return;
      if (changeStatus(appId, newStatus)) {
        showToast(`Application status updated to "${newStatus}"!`);
      } else {
        showToast('Could not save the status update. Please try again.', 'error');
      }
    },
    [changeStatus, recruiterApplications, showToast]
  );

  // User login
  const handleLoginUser = useCallback(
    (userData) => {
      login(userData);
      showToast(`Welcome, ${userData.name || userData.email}!`);
    },
    [login, showToast]
  );

  // User logout
  const handleLogout = useCallback(() => {
    logout();
    setActiveJobForModal(null);
    navigate('/login');
    showToast('Signed out successfully.');
  }, [logout, navigate, showToast]);

  // CV saved callback (from GenerateCV page)
  const handleSaveCV = useCallback(
    (cvData) => {
      refreshCV(userId);
      showToast('📄 Resume saved to your HustleNest profile!');
    },
    [refreshCV, userId, showToast]
  );

  return (
    <div className="app-container">
      {/* Toast Banner */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 2000,
            backgroundColor:
              toast.type === 'error'
                ? 'var(--status-error-text)'
                : toast.type === 'info'
                ? 'var(--primary-color)'
                : 'var(--primary-color)',
            color: 'white',
            padding: '0.85rem 1.35rem',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-xl)',
            fontWeight: 600,
            fontSize: '0.92rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            maxWidth: '380px',
          }}
        >
          {toast.message}
        </div>
      )}

      {/* Navbar reads user from AuthContext internally */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
        savedCount={savedJobIds.length}
        applicationCount={isRecruiter ? recruiterApplications.length : userApplications.length}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                jobs={jobs}
                applications={userApplications}
                savedJobIds={savedJobIds}
                appliedJobIds={appliedJobIds}
                onToggleSave={handleToggleSave}
                onApplyClick={handleApplyClick}
              />
            }
          />

          <Route
            path="/jobs"
            element={
              <Jobs
                jobs={jobs}
                savedJobIds={savedJobIds}
                appliedJobIds={appliedJobIds}
                onToggleSave={handleToggleSave}
                onApplyClick={handleApplyClick}
                onUpdateJobsList={updateJobsList}
              />
            }
          />

          <Route
            path="/jobs/:id"
            element={
              <JobDetails
                jobs={jobs}
                savedJobIds={savedJobIds}
                onToggleSave={handleToggleSave}
                onApplyClick={handleApplyClick}
              />
            }
          />

          <Route element={<RequireAuth isLogged={isLogged} />}>
            <Route element={<RequireRole user={user} role="student" />}>
              <Route path="/applications" element={<Applications />} />
              <Route
                path="/generate-cv"
                element={<GenerateCV onSaveCV={handleSaveCV} />}
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    onUpdateUser={handleLoginUser}
                    savedJobsCount={savedJobIds.length}
                    applicationsCount={userApplications.length}
                  />
                }
              />
            </Route>
            <Route element={<RequireRole user={user} role="recruiter" />}>
              <Route
                path="/recruiter"
                element={
                  <RecruiterDashboard
                    jobs={recruiterJobs}
                    applications={recruiterApplications}
                    onAddNewJob={handleAddNewJob}
                    onUpdateAppStatus={handleUpdateAppStatus}
                  />
                }
              />
            </Route>
          </Route>

          <Route
            path="/login"
            element={<Login onLoginUser={handleLoginUser} />}
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      {/* Application Modal */}
      {activeJobForModal && (
        <ApplicationModal
          job={activeJobForModal}
          user={user}
          userId={userId}
          savedCV={savedCV}
          onClose={() => setActiveJobForModal(null)}
          onSubmitApplication={handleSubmitApplication}
        />
      )}
    </div>
  );
}

export default App;
