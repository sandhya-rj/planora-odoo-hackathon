/**
 * Card Component
 * Reusable card container
 */
import React from 'react';
import './Card.css';

const Card = ({
  children,
  title = '',
  subtitle = '',
  headerAction = null,
  onClick = null,
  hoverable = false,
  className = '',
  noPadding = false,
}) => {
  const cardClasses = [
    'planora-card',
    hoverable ? 'planora-card--hoverable' : '',
    onClick ? 'planora-card--clickable' : '',
    noPadding ? 'planora-card--no-padding' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || headerAction) && (
        <div className="planora-card__header">
          <div className="planora-card__header-text">
            {title && <h3 className="planora-card__title">{title}</h3>}
            {subtitle && <p className="planora-card__subtitle">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="planora-card__header-action">{headerAction}</div>
          )}
        </div>
      )}
      <div className="planora-card__content">{children}</div>
    </div>
  );
};

export default Card;
