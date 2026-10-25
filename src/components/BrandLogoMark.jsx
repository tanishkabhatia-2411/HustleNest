import React from 'react';

const BrandLogoMark = ({ className = '', title = 'HustleNest brand mark' }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    role="img"
    aria-label={title}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path className="growth-nest-main" d="M14 39.5c2.8-9.8 8.8-15.5 18-15.5s15.2 5.7 18 15.5" />
    <path className="growth-nest-main" d="M18 43.5c2.5-5.8 7.2-8.7 14-8.7s11.5 2.9 14 8.7" />
    <path className="growth-nest-main" d="M15 47.4c0-1.8 1.4-3.2 3.2-3.2h27.6c1.8 0 3.2 1.4 3.2 3.2v1.2c0 1.8-1.4 3.2-3.2 3.2H18.2c-1.8 0-3.2-1.4-3.2-3.2v-1.2Z" />
    <path className="growth-nest-accent" d="M25.5 35.5 32 29l6.5 6.5" />
    <path className="growth-nest-accent" d="M32 29v16" />
  </svg>
);

export default BrandLogoMark;
