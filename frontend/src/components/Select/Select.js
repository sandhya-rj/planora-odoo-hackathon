/**
 * Select Component
 * Reusable dropdown select field
 */
import React from 'react';
import './Select.css';
import { ChevronDownIcon } from '../../assets/svg/Icons';

const Select = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  label = '',
  error = '',
  required = false,
  disabled = false,
  className = '',
}) => {
  const selectClasses = [
    'planora-select__field',
    error ? 'planora-select__field--error' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={`planora-select ${className}`}>
      {label && (
        <label htmlFor={name} className="planora-select__label">
          {label}
          {required && <span className="planora-select__required">*</span>}
        </label>
      )}
      <div className="planora-select__wrapper">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={selectClasses}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="planora-select__icon">
          <ChevronDownIcon width={20} height={20} />
        </div>
      </div>
      {error && <div className="planora-select__error">{error}</div>}
    </div>
  );
};

export default Select;
