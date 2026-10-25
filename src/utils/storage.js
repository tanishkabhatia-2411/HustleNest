import { INITIAL_JOBS } from '../data/jobs';

const KEYS = {
  JOBS: 'hustlenest_jobs',
  DEMO_JOBS: 'hustlenest_demo_jobs',
  RECRUITER_JOBS: 'hustlenest_recruiter_jobs',
  LIVE_JOBS: 'hustlenest_live_jobs',
  APPLICATIONS: 'hustlenest_applications',
  SAVED_JOBS: 'hustlenest_saved_jobs',
  USER: 'hustlenest_user',
  THEME: 'hustlenest_theme',
  USERS_LIST: 'hustlenest_users_registry',
};

const INITIAL_JOB_IDS = new Set(INITIAL_JOBS.map((job) => job.id));

// Generate a deterministic or unique ID for a candidate user
export const getUserId = (user) => {
  if (!user) return 'guest';
  if (typeof user.id === 'string' && user.id.trim()) return user.id;
  if (typeof user.email === 'string' && user.email.trim()) {
    return 'usr_' + user.email.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  }
  return 'usr_guest';
};

const readArray = (key) => {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error(`Error reading ${key}:`, error);
    return [];
  }
};

const createRecordId = (prefix) => {
  const randomId = globalThis.crypto?.randomUUID?.();
  return `${prefix}-${randomId || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
};

const uniqueJobs = (jobs) => {
  const byId = new Map();
  jobs.forEach((job) => {
    if (job && typeof job.id === 'string' && job.id) {
      byId.set(job.id, job);
    }
  });
  return [...byId.values()];
};

const normalizeApplicationUserId = (application) => {
  if (typeof application?.userId === 'string' && application.userId.trim()) {
    return application.userId;
  }
  const email = application?.userEmail || application?.studentEmail;
  return typeof email === 'string' && email.trim() ? getUserId({ email }) : null;
};

export const filterApplicationsForUser = (applications, userId) => {
  if (!Array.isArray(applications) || !userId) return [];
  return applications.filter((application) => normalizeApplicationUserId(application) === userId);
};

export const filterJobsForRecruiter = (jobs, recruiterId) => {
  if (!Array.isArray(jobs) || !recruiterId) return [];
  return jobs.filter((job) => job?.recruiterId === recruiterId);
};

export const filterApplicationsForRecruiter = (applications, jobs, recruiterId) => {
  if (!Array.isArray(applications)) return [];
  const ownedJobIds = new Set(filterJobsForRecruiter(jobs, recruiterId).map((job) => job.id));
  return applications.filter((application) => ownedJobIds.has(application?.jobId));
};

// Theme Storage
export const getStoredTheme = () => {
  try {
    const saved = localStorage.getItem(KEYS.THEME);
    if (saved === 'dark' || saved === 'light') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  } catch (error) {
    console.warn('Could not read theme preferences:', error);
    return 'light';
  }
};

export const saveStoredTheme = (theme) => {
  try {
    localStorage.setItem(KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
};

// USER-ISOLATED CV STORAGE (hustlenest_cv_<userId>)
export const getUserCV = (userId) => {
  if (!userId) return null;
  try {
    const key = `hustlenest_cv_${userId}`;
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.error(`Error reading CV for user ${userId}:`, error);
    return null;
  }
};

export const saveUserCV = (userId, cvData) => {
  if (!userId) return;
  try {
    const key = `hustlenest_cv_${userId}`;
    const dataToSave = {
      ...cvData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(key, JSON.stringify(dataToSave));
  } catch (error) {
    console.error(`Error saving CV for user ${userId}:`, error);
  }
};

export const deleteUserCV = (userId) => {
  if (!userId) return;
  try {
    const key = `hustlenest_cv_${userId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error deleting CV for user ${userId}:`, error);
  }
};

// Stored Jobs
export const getStoredJobs = () => {
  const legacyJobs = readArray(KEYS.JOBS);
  const demoJobs = readArray(KEYS.DEMO_JOBS);
  const recruiterJobs = readArray(KEYS.RECRUITER_JOBS);
  const liveJobs = readArray(KEYS.LIVE_JOBS);
  const legacyLiveJobs = legacyJobs.filter((job) => job?.isApiJob || String(job?.id || '').startsWith('api-'));
  const legacyDemoJobs = legacyJobs.filter(
    (job) => !job?.isApiJob && !String(job?.id || '').startsWith('api-') && INITIAL_JOB_IDS.has(job?.id)
  );
  const legacyRecruiterJobs = legacyJobs.filter(
    (job) => !job?.isApiJob && !String(job?.id || '').startsWith('api-') && !INITIAL_JOB_IDS.has(job?.id)
  );

  if (legacyJobs.length) {
    try {
      localStorage.setItem(KEYS.DEMO_JOBS, JSON.stringify(uniqueJobs([...legacyDemoJobs, ...demoJobs])));
      localStorage.setItem(KEYS.RECRUITER_JOBS, JSON.stringify(uniqueJobs([...legacyRecruiterJobs, ...recruiterJobs])));
      localStorage.setItem(KEYS.LIVE_JOBS, JSON.stringify(uniqueJobs([...legacyLiveJobs, ...liveJobs])));
      localStorage.setItem(KEYS.JOBS, '[]');
    } catch (error) {
      console.error('Error migrating saved job sources:', error);
    }
  }

  return uniqueJobs([
    ...INITIAL_JOBS,
    ...legacyDemoJobs,
    ...demoJobs,
    ...legacyRecruiterJobs,
    ...recruiterJobs,
    ...legacyLiveJobs,
    ...liveJobs,
  ]);
};

export const saveStoredJobs = (jobs) => {
  try {
    if (!Array.isArray(jobs)) throw new TypeError('Jobs must be an array.');
    localStorage.setItem(
      KEYS.DEMO_JOBS,
      JSON.stringify(
        jobs.filter(
          (job) =>
            !job?.isApiJob &&
            !String(job?.id || '').startsWith('api-') &&
            INITIAL_JOB_IDS.has(job?.id)
        )
      )
    );
    localStorage.setItem(
      KEYS.RECRUITER_JOBS,
      JSON.stringify(
        jobs.filter(
          (job) =>
            !job?.isApiJob &&
            !String(job?.id || '').startsWith('api-') &&
            !INITIAL_JOB_IDS.has(job?.id)
        )
      )
    );
    localStorage.setItem(
      KEYS.LIVE_JOBS,
      JSON.stringify(jobs.filter((job) => job?.isApiJob || String(job?.id || '').startsWith('api-')))
    );
    localStorage.setItem(KEYS.JOBS, '[]');
    return true;
  } catch (error) {
    console.error('Error saving jobs:', error);
    return false;
  }
};

export const saveLiveJobs = (jobs) => {
  try {
    const normalizedJobs = jobs.map((job) => ({ ...job, isApiJob: true }));
    localStorage.setItem(KEYS.LIVE_JOBS, JSON.stringify(uniqueJobs(normalizedJobs)));
  } catch (error) {
    console.error('Error saving live jobs:', error);
  }
};

// Add new job listing
export const addNewJob = (newJobData, recruiterId) => {
  const currentJobs = getStoredJobs();
  const newJob = {
    id: createRecordId('job'),
    postedDate: new Date().toISOString().split('T')[0],
    applicantsCount: 0,
    logo: newJobData.workMode === 'Remote' ? '🌐' : '💼',
    workModeLabel:
      newJobData.workMode === 'Remote'
        ? 'Remote — Worldwide'
        : newJobData.workMode === 'Hybrid'
        ? `Hybrid — ${newJobData.location}`
        : `On-site — ${newJobData.location}`,
    ...newJobData,
    recruiterId,
  };
  const updatedJobs = [newJob, ...currentJobs];
  saveStoredJobs(updatedJobs);
  return updatedJobs;
};

// Stored Applications
export const getStoredApplications = () => {
  return readArray(KEYS.APPLICATIONS)
    .filter((application) => application && typeof application === 'object' && !Array.isArray(application))
    .map((application) => ({
      ...application,
      status: typeof application.status === 'string' ? application.status : 'Applied',
    }));
};

export const saveStoredApplications = (applications) => {
  try {
    if (!Array.isArray(applications)) throw new TypeError('Applications must be an array.');
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(applications));
    return true;
  } catch (error) {
    console.error('Error saving applications:', error);
    return false;
  }
};

// Submit candidate application
export const addApplication = (appData) => {
  const currentApps = getStoredApplications();
  const userId = appData.userId || (appData.studentEmail ? getUserId({ email: appData.studentEmail }) : null);
  const exists = currentApps.some(
    (app) => app.jobId === appData.jobId && normalizeApplicationUserId(app) === userId
  );
  if (exists) {
    return { success: false, message: 'You have already applied for this position!' };
  }

  const newApp = {
    id: createRecordId('app'),
    status: 'Applied',
    appliedDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    ...appData,
    ...(userId ? { userId } : {}),
  };

  const updatedApps = [newApp, ...currentApps];
  const jobs = getStoredJobs();
  const updatedJobs = jobs.map((job) =>
    job.id === appData.jobId
      ? { ...job, applicantsCount: Math.max(0, Number(job.applicantsCount) || 0) + 1 }
      : job
  );
  if (!saveStoredJobs(updatedJobs)) {
    return { success: false, message: 'Could not save the application. Please try again.' };
  }
  if (!saveStoredApplications(updatedApps)) {
    saveStoredJobs(jobs);
    return { success: false, message: 'Could not save the application. Please try again.' };
  }

  return { success: true, application: newApp, jobs: updatedJobs };
};

export const withdrawStoredApplication = (appId, userId) => {
  const currentApps = getStoredApplications();
  const application = currentApps.find((app) => app.id === appId);
  if (!application || normalizeApplicationUserId(application) !== userId) {
    return { applications: currentApps, jobId: null, success: false };
  }

  const updatedApps = currentApps.filter((app) => app.id !== appId);
  const jobs = getStoredJobs();
  const updatedJobs = jobs.map((job) =>
    job.id === application.jobId
      ? { ...job, applicantsCount: Math.max(0, (Number(job.applicantsCount) || 0) - 1) }
      : job
  );
  if (!saveStoredJobs(updatedJobs)) {
    return { applications: currentApps, jobId: null, success: false };
  }
  if (!saveStoredApplications(updatedApps)) {
    saveStoredJobs(jobs);
    return { applications: currentApps, jobId: null, success: false };
  }

  return { applications: updatedApps, jobId: application.jobId, success: true };
};

// Update application status
export const updateApplicationStatus = (appId, newStatus) => {
  const apps = getStoredApplications();
  const updatedApps = apps.map((app) => (app.id === appId ? { ...app, status: newStatus } : app));
  return {
    applications: updatedApps,
    success: saveStoredApplications(updatedApps),
  };
};

// Saved Job IDs
export const getSavedJobIds = () => {
  try {
    const raw = localStorage.getItem(KEYS.SAVED_JOBS);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading saved jobs:', error);
    return [];
  }
};

export const toggleSavedJobId = (jobId) => {
  const saved = getSavedJobIds();
  const updated = saved.includes(jobId) ? saved.filter((id) => id !== jobId) : [...saved, jobId];
  try {
    localStorage.setItem(KEYS.SAVED_JOBS, JSON.stringify(updated));
  } catch (error) {
    console.error('Error updating saved jobs:', error);
  }
  return updated;
};

// User Profile Storage
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) {
      return { isLogged: false, role: 'student', name: '', email: '' };
    }
    const parsed = JSON.parse(raw);
    if (parsed && parsed.isLogged && !parsed.id) {
      parsed.id = getUserId(parsed);
      localStorage.setItem(KEYS.USER, JSON.stringify(parsed));
    }
    return parsed && typeof parsed === 'object'
      ? parsed
      : { isLogged: false, role: 'student', name: '', email: '' };
  } catch (error) {
    console.error('Error reading user:', error);
    return { isLogged: false, role: 'student', name: '', email: '' };
  }
};

export const saveStoredUser = (user) => {
  try {
    if (user && user.isLogged && !user.id) {
      user = { ...user, id: getUserId(user) };
    }
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error saving user:', error);
  }
};
