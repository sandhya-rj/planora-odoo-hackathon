/**
 * Alert Component
 * Display alerts for success, warning, error, and info messages
 */
import React from 'react';
import './Alert.css';
import { AlertIcon, CheckIcon, CloseIcon } from '../../assets/svg/Icons';

const Alert = ({
  type = 'info',
  message,
  onClose = null,
  className = '',
}) => {
  const icons = {
    success: <CheckIcon width={20} height={20} />,
    warning: <AlertIcon width={20} height={20} />,
    error: <AlertIcon width={20} height={20} />,
    info: <AlertIcon width={20} height={20} />,
  };

  const alertClasses = [
    'planora-alert',
    `planora-alert--${type}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={alertClasses}>
      <div className="planora-alert__icon">{icons[type]}</div>
      <div className="planora-alert__message">{message}</div>
      {onClose && (
        <button
          className="planora-alert__close"
          onClick={onClose}
          aria-label="Close alert"
        >
          <CloseIcon width={16} height={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
