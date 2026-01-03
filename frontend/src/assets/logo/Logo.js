/**
 * Logo Component - Full Logo with Text
 * Globe with P inside + PLANORA text
 */
import React from 'react';

const Logo = ({ height = 40, variant = 'default' }) => {
  const fillColor = variant === 'white' ? '#FFFFFF' : '#222222';
  const markColor = '#FFC107';

  return (
    <svg 
      height={height} 
      viewBox="0 0 180 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      {/* Globe with P */}
      <g id="globe-mark">
        {/* Outer circle */}
        <circle cx="24" cy="24" r="20" stroke={markColor} strokeWidth="3" fill="none"/>
        
        {/* Globe meridian lines */}
        <ellipse cx="24" cy="24" rx="8" ry="20" stroke={markColor} strokeWidth="2" fill="none" opacity="0.5"/>
        <ellipse cx="24" cy="24" rx="14" ry="20" stroke={markColor} strokeWidth="1.5" fill="none" opacity="0.3"/>
        
        {/* Globe latitude lines */}
        <line x1="4" y1="24" x2="44" y2="24" stroke={markColor} strokeWidth="2" opacity="0.5"/>
        <line x1="8" y1="14" x2="40" y2="14" stroke={markColor} strokeWidth="1.5" opacity="0.3"/>
        <line x1="8" y1="34" x2="40" y2="34" stroke={markColor} strokeWidth="1.5" opacity="0.3"/>
        
        {/* Letter P in center */}
        <path 
          d="M20 14 L20 34 M20 14 L28 14 C30.5 14 32 16 32 18.5 C32 21 30.5 23 28 23 L20 23" 
          stroke={markColor} 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
        />
      </g>
      
      {/* PLANORA Text */}
      <text 
        x="56" 
        y="30" 
        fontFamily="system-ui, -apple-system, 'Segoe UI', sans-serif" 
        fontSize="26" 
        fontWeight="700" 
        fill={fillColor}
        letterSpacing="1"
      >
        PLANORA
      </text>
    </svg>
  );
};

export default Logo;
