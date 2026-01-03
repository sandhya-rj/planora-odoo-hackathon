/**
 * Badge Component
 * Display status badges and tags
 */
import React from 'react';
import './Badge.css';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  icon = null,
  className = '',
}) => {
  const badgeClasses = [
    'planora-badge',
    `planora-badge--${variant}`,
    `planora-badge--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={badgeClasses}>
      {icon && <span className="planora-badge__icon">{icon}</span>}
      <span className="planora-badge__text">{children}</span>
    </span>
  );
};

export default Badge;
