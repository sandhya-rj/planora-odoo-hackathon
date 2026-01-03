/**
 * Logo Icon Component
 * SVG placeholder for Planora logo
 */
import React from 'react';

const LogoIcon = ({ width = 48, height = 48, color = '#FFC107' }) => (
  <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="22" fill={color} />
    <path
      d="M24 8L28 18H32L26 24L30 36L24 30L18 36L22 24L16 18H20L24 8Z"
      fill="white"
      stroke="white"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  </svg>
);

export default LogoIcon;
