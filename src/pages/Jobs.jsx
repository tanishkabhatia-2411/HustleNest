import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import JobCard from '../components/JobCard';
import Button from '../components/Button';
import { fetchJobsFromApi } from '../services/jobService';
import { useAuth } from '../hooks/useContextHooks';

export const Jobs = ({
  jobs = [],
  savedJobIds = [],
  appliedJobIds = [],
  onToggleSave,
  onApplyClick,
  onUpdateJobsList,
}) => {
  const location = useLocation();
  // Read user from AuthContext for preference-based filter defaults
  const { user } = useAuth();

  const querySearch = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  }, [location.search]);

  const [searchTerm, setSearchTerm] = useState(querySearch);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [dataSource, setDataSource] = useState('Local Demo Dataset');

  // Filters State
  const [filters, setFilters] = useState({
    workMode: user?.workMode?.includes('Remote') ? 'Remote' : 'All',
    type: 'All',
    country: user?.searchLocation === 'My country' ? (user?.country || 'India') : 'All',
    category: 'All',
  });

  useEffect(() => {
    if (querySearch) {
      setSearchTerm(querySearch);
    }
  }, [querySearch]);

  // Load API Jobs via Fetch API
  const loadApiJobs = async () => {
    setLoading(true);
    setApiError(null);
    try {
      const result = await fetchJobsFromApi();
      setDataSource(result.source || 'Local Demo Dataset');

      if (result.success && result.jobs) {
        onUpdateJobsList(result.jobs);
      } else if (result.error) {
        setApiError(result.error);
      }
    } catch (error) {
      setApiError(error instanceof Error ? error.message : String(error));
    } finally {
      setLoading(false);
    }
  };

  // Filter Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search text matching
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !searchLower ||
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.category?.toLowerCase().includes(searchLower) ||
        (job.skills && job.skills.some((s) => s.toLowerCase().includes(searchLower)));

      // Work Mode matching
      let matchesWorkMode = true;
      if (filters.workMode !== 'All') {
        const jobWm = (job.workMode || '').toLowerCase();
        const targetWm = filters.workMode.toLowerCase();
        matchesWorkMode = jobWm.includes(targetWm);
      }

      // Job Type matching
      const matchesType = filters.type === 'All' || job.type === filters.type;

      // Country matching
      let matchesCountry = true;
      if (filters.country !== 'All') {
        const jobCountry = (job.country || job.location || '').toLowerCase();
        const targetCountry = filters.country.toLowerCase();
        matchesCountry = jobCountry.includes(targetCountry) || (targetCountry === 'worldwide' && jobCountry.includes('remote'));
      }

      // Category matching
      const matchesCategory = filters.category === 'All' || job.category === filters.category;

      return matchesSearch && matchesWorkMode && matchesType && matchesCountry && matchesCategory;
    });
  }, [jobs, searchTerm, filters]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters({ workMode: 'All', type: 'All', country: 'All', category: 'All' });
  };

  return (
    <div className="jobs-page section">
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 className="section-title">Global Job Discovery</h1>
              <p className="section-subtitle" style={{ marginBottom: 0 }}>
                Find your next opportunity. Explore national, remote, and international career drives.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--bg-surface-secondary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-muted)',
                }}
              >
                Source: <strong>{dataSource}</strong>
              </span>

              <Button variant="outline" size="sm" onClick={loadApiJobs} disabled={loading}>
                {loading ? 'Fetching Jobs...' : '⚡ Fetch Live API Jobs'}
              </Button>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search by role, company, or skills (e.g. React, Java, Data)..."
            />
          </div>
        </div>

        {apiError && (
          <div
            style={{
              backgroundColor: 'var(--status-warning-bg)',
              color: 'var(--status-warning-text)',
              padding: '0.75rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              fontSize: '0.88rem',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              Live listings could not be refreshed. Existing demo, recruiter, and previously loaded live jobs are still available.
            </span>
            <Button variant="ghost" size="sm" onClick={loadApiJobs}>
              Retry API ↺
            </Button>
          </div>
        )}

        <FilterPanel
          filters={{ ...filters, search: searchTerm }}
          setFilters={setFilters}
          onResetFilters={handleResetFilters}
          totalResults={filteredJobs.length}
        />

        {/* LOADING SKELETON */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Fetching Live Global Jobs...</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Querying public jobs API service...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
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
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">No matching jobs found</h3>
            <p className="empty-desc">
              We couldn't find any job openings matching your current search filters. Try clearing your work mode or location filters.
            </p>
            <Button variant="primary" size="md" onClick={handleResetFilters}>
              Reset All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
