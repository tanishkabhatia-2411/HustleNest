import React from 'react';

/**
 * Reusable Button component for CampusHire
 * Props:
 * - variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost'
 * - size: 'sm' | 'md' | 'lg'
 * - onClick: function
 * - children: node
 * - type: 'button' | 'submit' | 'reset'
 * - disabled: boolean
 * - className: string
 */
export const Button = ({
  variant = 'primary',
  size = 'md',
  onClick,
  children,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
