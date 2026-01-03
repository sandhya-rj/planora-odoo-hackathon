/**
 * Button Component
 * Reusable button with variants and states
 */
import React from 'react';
import './Button.css';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  fullWidth = false,
  icon = null,
  loading = false,
  className = '',
}) => {
  const classes = [
    'planora-button',
    `planora-button--${variant}`,
    `planora-button--${size}`,
    fullWidth ? 'planora-button--full-width' : '',
    disabled || loading ? 'planora-button--disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <span className="planora-button__spinner" />}
      {!loading && icon && <span className="planora-button__icon">{icon}</span>}
      <span className="planora-button__text">{children}</span>
    </button>
  );
};

export default Button;
