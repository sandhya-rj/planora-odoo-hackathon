/**
 * Input Component
 * Reusable input field with validation
 */
import React, { useState } from 'react';
import './Input.css';
import { AlertIcon } from '../../assets/svg/Icons';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder = '',
  label = '',
  error = '',
  required = false,
  disabled = false,
  icon = null,
  className = '',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const inputClasses = [
    'planora-input__field',
    error ? 'planora-input__field--error' : '',
    icon ? 'planora-input__field--with-icon' : '',
    isFocused ? 'planora-input__field--focused' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`planora-input ${className}`}>
      {label && (
        <label htmlFor={name} className="planora-input__label">
          {label}
          {required && <span className="planora-input__required">*</span>}
        </label>
      )}
      <div className="planora-input__wrapper">
        {icon && <span className="planora-input__icon">{icon}</span>}
        <input
          id={name}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          {...props}
        />
      </div>
      {error && (
        <div className="planora-input__error">
          <AlertIcon width={14} height={14} color="#F44336" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Input;
