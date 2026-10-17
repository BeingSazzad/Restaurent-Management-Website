'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'navbar' | 'footer' | 'auth';
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'navbar',
  className = '',
  showText = true,
}) => {
  const [imgFailed, setImgFailed] = useState(false);
  const [customLogoUrl, setCustomLogoUrl] = useState<string | null>(null);
  const isFooter = variant === 'footer';

  useEffect(() => {
    try {
      const raw = localStorage.getItem('amber_spice_cms_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.storeInfo?.logoUrl && !parsed.storeInfo.logoUrl.includes('logo.svg')) {
          setCustomLogoUrl(parsed.storeInfo.logoUrl);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* 
        BRAND EMBLEM:
        Clean borderless emblem with suitable height and auto aspect-ratio
      */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-105 h-11 sm:h-12 w-auto"
      >
        {!imgFailed ? (
          <img
            src={customLogoUrl || '/images/logo.png?v=3'}
            alt="Amber Spice"
            onError={(e) => {
              const currentSrc = e.currentTarget.getAttribute('src');
              if (currentSrc && currentSrc.startsWith('data:')) {
                e.currentTarget.src = '/images/logo.png?v=3';
              } else if (currentSrc && currentSrc.includes('/images/logo.png')) {
                e.currentTarget.src = '/images/logo.jpg?v=3';
              } else {
                setImgFailed(true);
              }
            }}
            className={`h-10 sm:h-12 w-auto object-contain ${
              isFooter ? 'brightness-0 invert' : ''
            }`}
          />
        ) : (
          /* Default Star Anise Luxury Fallback */
          <div className="w-10 h-10 flex items-center justify-center text-[#B84A22] group-hover:rotate-45 transition-transform duration-500">
            <svg viewBox="0 0 100 100" className={`w-8 h-8 ${isFooter ? 'fill-white' : 'fill-[#B84A22]'}`}>
              <path
                d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z"
                opacity="0.95"
              />
              <path
                d="M50 15 C40 32 32 40 15 50 C32 60 40 68 50 85 C60 68 68 60 85 50 C68 40 60 32 50 15 Z"
                fill={isFooter ? '#FFFFFF' : '#D49B37'}
                opacity="0.9"
              />
              <circle cx="50" cy="50" r="7" fill={isFooter ? '#1A130E' : '#FFFFFF'} />
            </svg>
          </div>
        )}
      </div>

      {/* Brand Text Heading */}
      {showText && (
        <div className="leading-tight select-none">
          <span
            className={`font-extrabold tracking-[0.06em] block uppercase ${
              isFooter ? 'text-lg sm:text-xl text-white' : 'text-xl sm:text-[22px] text-[#1A130E]'
            }`}
          >
            AMBER SPICE
          </span>
        </div>
      )}
    </Link>
  );
};
