import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import JobCard from '../components/JobCard';
import Button from '../components/Button';
import { useAuth } from '../hooks/useContextHooks';

// ─── Candidate Dashboard Card ───────────────────────────────────────────────
const DashboardCard = ({ icon, label, value, color, link }) => (
  <Link to={link || '#'} style={{ textDecoration: 'none' }}>
    <div
      className="stat-card"
      style={{
        textAlign: 'left',
        padding: '1.25rem 1.5rem',
        cursor: 'pointer',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        borderLeft: `4px solid ${color || 'var(--primary-color)'}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{icon}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: color || 'var(--text-main)', lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontWeight: 600 }}>
        {label}
      </div>
    </div>
  </Link>
);

// ─── Quick Link Button ────────────────────────────────────────────────────────
const QuickLink = ({ icon, label, to }) => (
  <Link to={to}>
    <button
      className="btn btn-outline btn-md"
      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
    >
      {icon} {label}
    </button>
  </Link>
);

// ─── Candidate Dashboard ──────────────────────────────────────────────────────
const CandidateDashboard = ({ savedCount, user, savedCV, applications }) => {
  const totalCount = applications.length;
  const shortlistedCount = applications.filter((a) => a.status === 'Shortlisted').length;
  const offerCount = applications.filter((a) => a.status === 'Offer').length;

  const inProgressCount = applications.filter(
    (a) => a.status === 'Applied' || a.status === 'Shortlisted' || a.status === 'Interview'
  ).length;

  const firstName = user?.name ? user.name.split(' ')[0] : 'Candidate';

  return (
    <section
      className="section"
      style={{
        background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-hover) 100%)',
        color: 'white',
        padding: '2.5rem 0',
      }}
    >
      <div className="container">
        {/* Welcome Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 800,
                color: 'white',
                flexShrink: 0,
              }}
            >
              {firstName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'white', margin: 0 }}>
                Welcome back, {firstName}! 👋
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', margin: 0 }}>
                {user?.role === 'recruiter'
                  ? `Recruiter at ${user.company || 'your company'}`
                  : `${user?.college || 'Candidate'} • ${user?.country || 'Global'}`}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
            marginBottom: '1.75rem',
          }}
        >
          <DashboardCard
            icon="💼"
            label="Total Applications"
            value={totalCount}
            color="#10B981"
            link="/applications"
          />
          <DashboardCard
            icon="⏳"
            label="In Progress"
            value={inProgressCount}
            color="#F59E0B"
            link="/applications"
          />
          <DashboardCard
            icon="⭐"
            label="Shortlisted"
            value={shortlistedCount}
            color="#818CF8"
            link="/applications"
          />
          <DashboardCard
            icon="🏆"
            label="Offers Received"
            value={offerCount}
            color="#34D399"
            link="/applications"
          />
          <DashboardCard
            icon="🔖"
            label="Saved Jobs"
            value={savedCount}
            color="#F472B6"
            link="/jobs"
          />
          <DashboardCard
            icon={savedCV ? '✅' : '📄'}
            label={savedCV ? 'CV Ready' : 'No CV Yet'}
            value={savedCV ? '1' : '0'}
            color={savedCV ? '#34D399' : '#94A3B8'}
            link="/generate-cv"
          />
        </div>

        {/* Quick Links */}
        <div>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginBottom: '0.75rem', fontWeight: 600 }}>
            QUICK ACTIONS
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <QuickLink icon="🔍" label="Explore Jobs" to="/jobs" />
            <QuickLink icon="📁" label="My Applications" to="/applications" />
            <QuickLink icon={savedCV ? '✏️' : '📄'} label={savedCV ? 'Edit My CV' : 'Generate CV'} to="/generate-cv" />
            <QuickLink icon="👤" label="Edit Profile" to="/profile" />
            {user?.role === 'recruiter' && (
              <QuickLink icon="👔" label="Recruiter Hub" to="/recruiter" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── MAIN HOME PAGE ───────────────────────────────────────────────────────────
export const Home = ({
  jobs = [],
  applications = [],
  savedJobIds = [],
  appliedJobIds = [],
  onToggleSave,
  onApplyClick,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user, isLogged, savedCV } = useAuth();

  const handleSearchSubmit = (term) => {
    if (term.trim()) {
      navigate(`/jobs?search=${encodeURIComponent(term.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const featuredJobs = jobs.slice(0, 4);

  return (
    <div className="home-page">
      {/* ─── PERSONALISED CANDIDATE DASHBOARD (logged in only) ─── */}
      {isLogged && (
        <CandidateDashboard
          savedCount={savedJobIds.length}
          user={user}
          savedCV={savedCV}
          applications={applications}
        />
      )}

      {/* ─── HERO SECTION ─── */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-pill">
            <span>🌐 Global Job Discovery &amp; Placement Platform 2026</span>
          </div>

          <h1 className="hero-headline">
            {isLogged
              ? 'Find your next opportunity today.'
              : 'Your next opportunity is closer than you think.'}
          </h1>
          <p className="hero-subtext">
            Find your next opportunity. Build your future. Connect with national, international, and
            remote job placement drives designed for ambitious students and freshers.
          </p>

          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            placeholder="Search by role (e.g. Frontend, Data Analyst), skill (React, Python), or location..."
          />

          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/jobs">
              <Button variant="primary" size="lg">
                Explore All Opportunities ({jobs.length})
              </Button>
            </Link>
            <Link to="/generate-cv">
              <Button variant="accent" size="lg">
                📄 {savedCV ? 'View / Edit My CV' : 'Generate My CV'}
              </Button>
            </Link>
            <Link to="/applications">
              <Button variant="outline" size="lg">
                Track Applications
              </Button>
            </Link>
          </div>

          {/* Key Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">96.4%</div>
              <div className="stat-label">Placement Success Rate</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">350+</div>
              <div className="stat-label">Global Partner Employers</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">$85k / ₹12 LPA</div>
              <div className="stat-label">Average Offer Package</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">2,850+</div>
              <div className="stat-label">Offers Issued Worldwide</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED JOBS SECTION ─── */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 className="section-title">Featured Career Drives</h2>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Top hiring drives actively seeking candidates this week across national and remote markets
              </p>
            </div>
            <Link to="/jobs">
              <Button variant="outline" size="md">View All Opportunities →</Button>
            </Link>
          </div>

          <div className="jobs-grid">
            {featuredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isSaved={savedJobIds.includes(job.id)}
                isApplied={appliedJobIds.includes(job.id)}
                onToggleSave={onToggleSave}
                onApplyClick={onApplyClick}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY HUSTLENEST ─── */}
      <section className="section" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 3.5rem' }}>
            <h2 className="section-title">Why Candidates &amp; Recruiters Choose HustleNest</h2>
            <p className="section-subtitle">
              Engineered to connect early-career talent with modern SaaS companies, remote teams, and global enterprises.
            </p>
          </div>

          <div className="stats-grid" style={{ marginTop: 0 }}>
            {[
              { icon: '🌐', title: 'Global & Remote Jobs', desc: 'Discover remote work-from-home positions alongside top national and international office opportunities.' },
              { icon: '📄', title: 'Integrated CV Builder', desc: 'Build, preview, and download a real PDF resume. Saved privately per user account.' },
              { icon: '⚡', title: 'Real-Time Status Tracker', desc: 'Track whether your submission is Shortlisted, Interview-scheduled, or Offered with visual badges.' },
              { icon: '👔', title: 'Recruiter Control Center', desc: 'Publish new job drives, review candidate profiles, and manage selection pipeline statuses.' },
            ].map((feat) => (
              <div key={feat.title} className="stat-card" style={{ textAlign: 'left', padding: '2rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{feat.icon}</div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{feat.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--primary-color), var(--primary-hover))', color: 'white' }}>
        <div className="container" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>
            Ready to discover your next career milestone?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '640px', margin: '0 auto 2rem' }}>
            Filter opportunities by your preferred country and work mode (Remote, Hybrid, or Office) and submit your application today.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/jobs"><Button variant="accent" size="lg">Explore Active Jobs Now</Button></Link>
            <Link to="/generate-cv"><Button variant="secondary" size="lg">Generate My Resume</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
