import React from 'react';
import Button from './Button';
import { COUNTRIES } from '../pages/Login';

export const FilterPanel = ({
  filters,
  setFilters,
  onResetFilters,
  totalResults = 0,
}) => {
  const handleWorkModeTab = (mode) => {
    setFilters((prev) => ({ ...prev, workMode: mode }));
  };

  const handleTypeChange = (e) => {
    setFilters((prev) => ({ ...prev, type: e.target.value }));
  };

  const handleCountryChange = (e) => {
    setFilters((prev) => ({ ...prev, country: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setFilters((prev) => ({ ...prev, category: e.target.value }));
  };

  const isFiltered =
    filters.workMode !== 'All' ||
    filters.type !== 'All' ||
    filters.country !== 'All' ||
    filters.category !== 'All' ||
    filters.search !== '';

  return (
    <div className="filter-panel">
      {/* Quick Category Work Mode Tabs */}
      <div className="work-mode-tabs">
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-main)', alignSelf: 'center', marginRight: '0.5rem' }}>
          Work Mode:
        </span>
        {['All', 'Remote', 'Office', 'Hybrid'].map((mode) => (
          <Button
            key={mode}
            variant={filters.workMode === mode ? 'primary' : 'outline'}
            size="sm"
            type="button"
            onClick={() => handleWorkModeTab(mode)}
          >
            {mode === 'Remote' ? '🌐 Remote Jobs' : mode === 'Office' ? '🏛️ Office Jobs' : mode === 'Hybrid' ? '🏢 Hybrid Jobs' : 'All Jobs'}
          </Button>
        ))}
      </div>

      <div className="filter-grid">
        <div className="filter-group">
          <label className="filter-label">Country Location</label>
          <select className="filter-select" value={filters.country} onChange={handleCountryChange}>
            <option value="All">All Countries</option>
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Job Type</label>
          <select className="filter-select" value={filters.type} onChange={handleTypeChange}>
            <option value="All">All Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Internship">Internship</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Category</label>
          <select className="filter-select" value={filters.category} onChange={handleCategoryChange}>
            <option value="All">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Design">Design</option>
            <option value="Data & Analytics">Data & Analytics</option>
            <option value="Product">Product</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>
            Showing {totalResults} {totalResults === 1 ? 'Job' : 'Jobs'}
          </span>
          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={onResetFilters}>
              Reset Filters ↺
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
