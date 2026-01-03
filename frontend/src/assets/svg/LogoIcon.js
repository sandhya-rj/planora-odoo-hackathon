/**
 * Logo Icon Component
 * Mountain with sun and birds for travel planning
 */
import React from 'react';

const LogoIcon = ({ width = 48, height = 48, color = '#FFC107', withBackground = false }) => (
  <svg 
    width={width} 
    height={height} 
    viewBox="0 0 48 48" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Background circle for visibility */}
    {withBackground && (
      <circle 
        cx="24" 
        cy="24" 
        r="22" 
        fill="white" 
        opacity="0.95"
      />
    )}
    
    {/* Sun */}
    <circle cx="24" cy="16" r="6" fill={color} opacity="0.9" />
    
    {/* Sun rays */}
    <circle cx="24" cy="16" r="8" stroke={color} strokeWidth="1" opacity="0.4" />
    
    {/* Back mountain */}
    <path 
      d="M8 36 L18 20 L28 36 Z"
      fill={color}
      opacity="0.4"
    />
    
    {/* Front mountain */}
    <path 
      d="M16 36 L24 16 L32 36 Z"
      fill={color}
      opacity="0.7"
    />
    
    {/* Main mountain peak */}
    <path 
      d="M20 36 L28 20 L36 36 Z"
      fill={color}
    />
    
    {/* Snow cap on main peak */}
    <path 
      d="M26 24 L28 20 L30 24 Z"
      fill="white"
      opacity="0.8"
    />
    
    {/* Birds - left bird */}
    <path 
      d="M10 14 Q12 12 14 14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* Birds - right bird */}
    <path 
      d="M34 12 Q36 10 38 12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    
    {/* Birds - center bird */}
    <path 
      d="M18 10 Q20 8 22 10"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

export default LogoIcon;
