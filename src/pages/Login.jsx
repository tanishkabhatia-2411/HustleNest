import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import BrandLogoMark from '../components/BrandLogoMark';
import { useAuth } from '../hooks/useContextHooks';

export const COUNTRIES = [
  'India',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Singapore',
  'United Arab Emirates',
  'Other',
];

export const Login = ({ onLoginUser }) => {
  const navigate = useNavigate();
  // Read current user from AuthContext — no need to pass as prop anymore
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'
  const [role, setRole] = useState('student'); // 'student' or 'recruiter'

  // Login Form State
  const [loginEmail, setLoginEmail] = useState(currentUser?.email || 'alex.j@hustlenest.io');

  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup Form State
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: 'India',
    searchLocation: 'Worldwide', // 'My country', 'Worldwide', 'Specific country'
    specificCountry: 'United States',
    workMode: 'Any', // 'Any', 'Remote / Work from Home', 'Office', 'Hybrid'
    college: '',
  });

  const [signupErrors, setSignupErrors] = useState({});

  // Preset Demo Logins
  const handleQuickLogin = (demoRole) => {
    if (demoRole === 'student') {
      const demoUser = {
        isLogged: true,
        role: 'student',
        name: 'Alex Johnson',
        email: 'alex.j@hustlenest.io',
        country: 'India',
        searchLocation: 'Worldwide',
        workMode: 'Remote / Work from Home',
        college: 'National Institute of Technology',
      };
      onLoginUser(demoUser);
      navigate('/jobs');
    } else {
      const demoUser = {
        isLogged: true,
        role: 'recruiter',
        name: 'Sarah TechRecruiter',
        email: 'recruiter@techcorp.com',
        country: 'United States',
        searchLocation: 'Worldwide',
        workMode: 'Hybrid',
        company: 'CloudScale Global',
      };
      onLoginUser(demoUser);
      navigate('/recruiter');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setLoginError('Please provide both email and password');
      return;
    }

    const loggedUser = {
      isLogged: true,
      role: role,
      name: currentUser?.name || (role === 'student' ? 'Alex Johnson' : 'Recruiter Admin'),
      email: loginEmail.trim(),
      country: currentUser?.country || 'India',
      searchLocation: currentUser?.searchLocation || 'Worldwide',
      workMode: currentUser?.workMode || 'Any',
    };

    onLoginUser(loggedUser);
    navigate(role === 'recruiter' ? '/recruiter' : '/jobs');
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData((prev) => ({ ...prev, [name]: value }));
    if (signupErrors[name]) {
      setSignupErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateSignup = () => {
    const errs = {};
    if (!signupData.name.trim()) errs.name = 'Full Name is required';
    if (!signupData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!signupData.password) errs.password = 'Password is required';
    if (signupData.password !== signupData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!signupData.country) errs.country = 'Country selection is required';

    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (validateSignup()) {
      const newUser = {
        isLogged: true,
        role: role,
        name: signupData.name.trim(),
        email: signupData.email.trim(),
        country: signupData.country,
        searchLocation: signupData.searchLocation,
        specificCountry: signupData.specificCountry,
        workMode: signupData.workMode,
        college: signupData.college.trim() || 'University Graduate',
      };

      onLoginUser(newUser);
      navigate(role === 'recruiter' ? '/recruiter' : '/jobs');
    }
  };

  return (
    <div className="login-page section">
      <div className="container" style={{ maxWidth: '560px' }}>
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow-xl)',
          }}
        >
          {/* Header Branding */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              className="logo-badge"
              style={{ width: '52px', height: '52px', fontSize: '1.6rem', margin: '0 auto 1rem' }}
            >
              <BrandLogoMark />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>
              Welcome to HustleNest
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
              Find your next opportunity. Build your future.
            </p>
          </div>

          {/* Auth Tab Switcher (Login vs Create Account) */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              padding: '0.35rem',
              backgroundColor: 'var(--bg-surface-secondary)',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.75rem',
            }}
          >
            <button
              type="button"
              className={`btn ${activeTab === 'login' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('login')}
            >
              🔑 Sign In
            </button>
            <button
              type="button"
              className={`btn ${activeTab === 'signup' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('signup')}
            >
              ✨ Create Account
            </button>
          </div>

          {/* Persona Selection */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              justify: 'center',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
            }}
          >
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>I am a:</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === 'student'}
                onChange={() => setRole('student')}
              />
              🎓 Student / Candidate
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={role === 'recruiter'}
                onChange={() => setRole('recruiter')}
              />
              👔 Recruiter
            </label>
          </div>

          {/* TAB 1: LOGIN FORM */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit}>
              {loginError && (
                <div
                  style={{
                    backgroundColor: 'var(--status-error-bg)',
                    color: 'var(--status-error-text)',
                    padding: '0.65rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.25rem',
                    fontSize: '0.88rem',
                  }}
                >
                  {loginError}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="candidate@hustlenest.io"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem' }} type="submit">
                Sign In to HustleNest
              </Button>

              <div
                style={{
                  marginTop: '1.75rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid var(--border-color)',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  Quick Demo Access:
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleQuickLogin('student')}
                  >
                    🎓 Demo Student
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => handleQuickLogin('recruiter')}
                  >
                    👔 Demo Recruiter
                  </Button>
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: SIGNUP FORM */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignupSubmit}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="e.g. Alex Johnson"
                />
                {signupErrors.name && <span className="form-error">{signupErrors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  className="form-input"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="alex.j@university.edu"
                />
                {signupErrors.email && <span className="form-error">{signupErrors.email}</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Password *</label>
                  <input
                    type="password"
                    name="password"
                    className="form-input"
                    value={signupData.password}
                    onChange={handleSignupChange}
                    placeholder="••••••••"
                  />
                  {signupErrors.password && <span className="form-error">{signupErrors.password}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-input"
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    placeholder="••••••••"
                  />
                  {signupErrors.confirmPassword && (
                    <span className="form-error">{signupErrors.confirmPassword}</span>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Country of Residence *</label>
                <select
                  name="country"
                  className="form-select"
                  value={signupData.country}
                  onChange={handleSignupChange}
                >
                  {COUNTRIES.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
                {signupErrors.country && <span className="form-error">{signupErrors.country}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Job Search Location</label>
                <select
                  name="searchLocation"
                  className="form-select"
                  value={signupData.searchLocation}
                  onChange={handleSignupChange}
                >
                  <option value="My country">My Country ({signupData.country})</option>
                  <option value="Worldwide">Worldwide / Global</option>
                  <option value="Specific country">Specific Country</option>
                </select>
              </div>

              {signupData.searchLocation === 'Specific country' && (
                <div className="form-group">
                  <label className="form-label">Select Target Country</label>
                  <select
                    name="specificCountry"
                    className="form-select"
                    value={signupData.specificCountry}
                    onChange={handleSignupChange}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Preferred Work Mode</label>
                <select
                  name="workMode"
                  className="form-select"
                  value={signupData.workMode}
                  onChange={handleSignupChange}
                >
                  <option value="Any">Any Work Mode</option>
                  <option value="Remote / Work from Home">Work from Home / Remote</option>
                  <option value="Office">Office / On-site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {role === 'student' && (
                <div className="form-group">
                  <label className="form-label">College / University</label>
                  <input
                    type="text"
                    name="college"
                    className="form-input"
                    value={signupData.college}
                    onChange={handleSignupChange}
                    placeholder="e.g. Stanford University or IIT Bombay"
                  />
                </div>
              )}

              <Button variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem' }} type="submit">
                Create HustleNest Account 🚀
              </Button>
            </form>
          )}

          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1rem',
              textAlign: 'center',
              fontSize: '0.8rem',
              color: 'var(--text-light)',
            }}
          >
            ⚠️ <strong>Frontend Demo Account:</strong> Profile preferences are stored in this browser; passwords are not saved. Demo sign-in and role checks are not secure authentication.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
