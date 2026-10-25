import React from 'react';
import Button from './Button';

export const SearchBar = ({ searchTerm, setSearchTerm, onSearchSubmit, placeholder = 'Search by job title, company, or skills...' }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) onSearchSubmit(searchTerm);
  };

  return (
    <form className="search-bar-wrapper" onSubmit={handleSubmit}>
      <div className="search-input-group">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
        />
        {searchTerm && (
          <button
            type="button"
            className="btn-ghost"
            onClick={() => setSearchTerm('')}
            style={{ fontSize: '0.9rem', padding: '0.2rem 0.5rem' }}
          >
            ✕
          </button>
        )}
      </div>
      <Button type="submit" variant="primary" size="md">
        Search Jobs
      </Button>
    </form>
  );
};

export default SearchBar;
