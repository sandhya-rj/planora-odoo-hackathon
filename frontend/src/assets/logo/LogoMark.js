/**
 * LogoMark Component - Globe with P Icon Only
 * For use in favicons, small spaces
 */
import React from 'react';

const LogoMark = ({ size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Outer circle */}
      <circle cx="24" cy="24" r="20" stroke="#FFC107" strokeWidth="3" fill="none"/>
      
      {/* Globe meridian lines */}
      <ellipse cx="24" cy="24" rx="8" ry="20" stroke="#FFC107" strokeWidth="2" fill="none" opacity="0.5"/>
      <ellipse cx="24" cy="24" rx="14" ry="20" stroke="#FFC107" strokeWidth="1.5" fill="none" opacity="0.3"/>
      
      {/* Globe latitude lines */}
      <line x1="4" y1="24" x2="44" y2="24" stroke="#FFC107" strokeWidth="2" opacity="0.5"/>
      <line x1="8" y1="14" x2="40" y2="14" stroke="#FFC107" strokeWidth="1.5" opacity="0.3"/>
      <line x1="8" y1="34" x2="40" y2="34" stroke="#FFC107" strokeWidth="1.5" opacity="0.3"/>
      
      {/* Letter P in center */}
      <path 
        d="M20 14 L20 34 M20 14 L28 14 C30.5 14 32 16 32 18.5 C32 21 30.5 23 28 23 L20 23" 
        stroke="#FFC107" 
        strokeWidth="3" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
};

export default LogoMark;
