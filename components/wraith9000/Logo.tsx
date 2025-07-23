import React from 'react';

const Logo: React.FC = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="top" x1="32" y1="8" x2="32" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFF0" stopOpacity="0.35" />
                <stop offset="1" stopColor="#10131A" stopOpacity="0.7" />
            </linearGradient>
            <linearGradient id="left" x1="32" y1="32" x2="12" y2="52" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFF0" stopOpacity="0.12" />
                <stop offset="1" stopColor="#10131A" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="right" x1="32" y1="32" x2="52" y2="52" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00FFF0" stopOpacity="0.18" />
                <stop offset="1" stopColor="#10131A" stopOpacity="0.9" />
            </linearGradient>
        </defs>
        {/* Top face */}
        <polygon points="32,8 56,20 32,32 8,20" fill="url(#top)" stroke="#00FFF0" strokeWidth="2.5" />
        {/* Left face */}
        <polygon points="8,20 32,32 32,56 8,44" fill="url(#left)" stroke="#00FFF0" strokeWidth="2.5" />
        {/* Right face */}
        <polygon points="56,20 32,32 32,56 56,44" fill="url(#right)" stroke="#00FFF0" strokeWidth="2.5" />
        {/* Outline */}
        <polyline points="32,8 56,20 56,44 32,56 8,44 8,20 32,8" stroke="#00FFF0" strokeWidth="2.5" fill="none" />
        {/* Face joins */}
        <polyline points="8,20 32,32 56,20" stroke="#00FFF0" strokeWidth="2" fill="none" />
    </svg>
);

export default Logo; 