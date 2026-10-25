/**
 * Reusable Form Components for HustleNest
 * 
 * These are controlled components — they receive value and onChange from their parent.
 * This follows the "controlled input" pattern taught in React fundamentals.
 * 
 * Concept: In React, a controlled component is one where the form data is handled
 * by the component's state rather than the DOM itself.
 */

import React from 'react';

// ─── FormError ────────────────────────────────────────────────────────────────
// Shows a validation error message below a field
export const FormError = ({ message }) => {
  if (!message) return null;
  return <span className="form-error" role="alert">{message}</span>;
};

// ─── FormSection ─────────────────────────────────────────────────────────────
// Groups related form fields with an optional heading and divider
export const FormSection = ({ title, children, style }) => (
  <div
    style={{
      marginBottom: '1.5rem',
      paddingBottom: '1.5rem',
      borderBottom: '1px solid var(--border-color)',
      ...style,
    }}
  >
    {title && (
      <h3
        style={{
          fontSize: '1rem',
          fontWeight: 700,
          color: 'var(--primary-color)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        {title}
      </h3>
    )}
    {children}
  </div>
);

// ─── TextInput ────────────────────────────────────────────────────────────────
// Controlled text input with label and optional error display
export const TextInput = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  error,
  required = false,
  type = 'text',
  disabled = false,
  hint,
}) => (
  <div className="form-group">
    {label && (
      <label className="form-label" htmlFor={id || name}>
        {label} {required && <span style={{ color: 'var(--status-error-text)' }}>*</span>}
      </label>
    )}
    {hint && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{hint}</p>}
    <input
      id={id || name}
      type={type}
      name={name}
      className={`form-input${error ? ' form-input-error' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      aria-describedby={error ? `${name}-error` : undefined}
      aria-invalid={!!error}
      required={required}
    />
    <FormError message={error} />
  </div>
);

// ─── EmailInput ───────────────────────────────────────────────────────────────
// Email-specific controlled input
export const EmailInput = ({ label, id, name, value, onChange, error, required = false, disabled = false }) => (
  <TextInput
    type="email"
    label={label || 'Email Address'}
    id={id}
    name={name}
    value={value}
    onChange={onChange}
    placeholder="candidate@example.com"
    error={error}
    required={required}
    disabled={disabled}
  />
);

// ─── SelectInput ──────────────────────────────────────────────────────────────
// Controlled <select> dropdown with label and error
export const SelectInput = ({
  label,
  id,
  name,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder,
}) => (
  <div className="form-group">
    {label && (
      <label className="form-label" htmlFor={id || name}>
        {label} {required && <span style={{ color: 'var(--status-error-text)' }}>*</span>}
      </label>
    )}
    <select
      id={id || name}
      name={name}
      className={`form-select${error ? ' form-input-error' : ''}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-invalid={!!error}
      required={required}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) =>
        typeof opt === 'string' ? (
          <option key={opt} value={opt}>{opt}</option>
        ) : (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        )
      )}
    </select>
    <FormError message={error} />
  </div>
);

// ─── TextArea ─────────────────────────────────────────────────────────────────
// Controlled textarea with label and error
export const TextArea = ({
  label,
  id,
  name,
  value,
  onChange,
  placeholder = '',
  rows = 4,
  error,
  required = false,
  disabled = false,
  hint,
}) => (
  <div className="form-group">
    {label && (
      <label className="form-label" htmlFor={id || name}>
        {label} {required && <span style={{ color: 'var(--status-error-text)' }}>*</span>}
      </label>
    )}
    {hint && <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{hint}</p>}
    <textarea
      id={id || name}
      name={name}
      className={`form-textarea${error ? ' form-input-error' : ''}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      aria-invalid={!!error}
      required={required}
    />
    <FormError message={error} />
  </div>
);

// ─── Checkbox ─────────────────────────────────────────────────────────────────
// Controlled checkbox
export const Checkbox = ({ label, id, name, checked, onChange, disabled = false }) => (
  <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}>
    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
      <input
        type="checkbox"
        id={id || name}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        style={{ width: '16px', height: '16px', accentColor: 'var(--primary-color)' }}
      />
      {label}
    </label>
  </div>
);

// ─── SubmitButton ─────────────────────────────────────────────────────────────
// Submit button that shows loading state and disables during async operations
export const SubmitButton = ({
  label = 'Submit',
  loadingLabel = 'Please wait...',
  isLoading = false,
  disabled = false,
  variant = 'primary',
  size = 'lg',
  fullWidth = true,
  style,
}) => (
  <button
    type="submit"
    className={`btn btn-${variant} btn-${size}`}
    disabled={isLoading || disabled}
    aria-busy={isLoading}
    style={{ width: fullWidth ? '100%' : undefined, marginTop: '1rem', ...style }}
  >
    {isLoading ? (
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
        <span
          style={{
            display: 'inline-block',
            width: '14px',
            height: '14px',
            border: '2px solid rgba(255,255,255,0.4)',
            borderTopColor: 'white',
            borderRadius: '50%',
            animation: 'spin 0.7s linear infinite',
          }}
        />
        {loadingLabel}
      </span>
    ) : (
      label
    )}
  </button>
);
