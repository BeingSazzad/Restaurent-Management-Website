'use client';

import React, { useState } from 'react';
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
  const isFooter = variant === 'footer';

  return (
    <Link href="/" className={`flex items-center gap-3 group ${className}`}>
      {/* 
        BRAND EMBLEM:
        Automatically loads from /images/logo.svg (vector) or /images/logo.png / logo.jpg
        Perfect height (42px-44px), beautifully contained, never broken.
      */}
      <div
        className={`relative shrink-0 flex items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 ${
          isFooter
            ? 'w-11 h-11 bg-white/10 border border-white/15 p-1.5'
            : 'w-11 h-11 bg-white border border-[#E5E5E5] p-1.5 shadow-2xs'
        }`}
      >
        {!imgFailed ? (
          <img
            src="/images/logo.svg"
            alt="Amber Spice Dublin"
            onError={(e) => {
              const currentSrc = e.currentTarget.getAttribute('src');
              if (currentSrc === '/images/logo.svg') {
                e.currentTarget.src = '/images/logo.png';
              } else if (currentSrc === '/images/logo.png') {
                e.currentTarget.src = '/images/logo.jpg';
              } else {
                setImgFailed(true);
              }
            }}
            className="w-full h-full object-contain"
          />
        ) : (
          /* Default Star Anise Luxury Fallback */
          <div className="w-full h-full flex items-center justify-center text-[#B84A22] group-hover:rotate-45 transition-transform duration-500">
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-[#B84A22]">
              <path
                d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z"
                opacity="0.95"
              />
              <path
                d="M50 15 C40 32 32 40 15 50 C32 60 40 68 50 85 C60 68 68 60 85 50 C68 40 60 32 50 15 Z"
                fill="#D49B37"
                opacity="0.9"
              />
              <circle cx="50" cy="50" r="7" fill={isFooter ? '#FFFFFF' : '#1A130E'} />
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
          <span
            className={`text-[10px] tracking-[0.16em] uppercase block font-semibold mt-0.5 ${
              isFooter ? 'text-[#D49B37]' : 'text-[#B84A22]'
            }`}
          >
            {isFooter ? 'Authentic Flavors · Timeless Recipes' : 'Dublin · Est. 2018'}
          </span>
        </div>
      )}
    </Link>
  );
};
