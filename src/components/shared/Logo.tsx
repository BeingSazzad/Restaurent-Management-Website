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
        LOGO AUTO-UPDATE TARGET:
        Whenever you place an image at:
        "public/images/logo.png" (or "public/images/logo.svg")
        it will immediately and automatically display here!
      */}
      <div className="relative shrink-0 flex items-center justify-center">
        {!imgFailed ? (
          <img
            src="/images/logo.png"
            alt="Amber Spice Logo"
            onError={(e) => {
              const currentSrc = e.currentTarget.getAttribute('src');
              if (currentSrc === '/images/logo.png') {
                e.currentTarget.src = '/images/logo.svg';
              } else {
                setImgFailed(true);
              }
            }}
            className={`object-contain transition-transform duration-300 group-hover:scale-105 ${
              isFooter ? 'h-9 w-auto max-h-9' : 'h-10 w-auto max-h-10'
            }`}
          />
        ) : (
          /* Default Star Anise Luxury Emblem Fallback */
          <div className="w-9 h-9 flex items-center justify-center text-[#B84A22] group-hover:rotate-45 transition-transform duration-500">
            <svg viewBox="0 0 100 100" className="w-9 h-9 fill-[#B84A22]">
              <path
                d="M50 0 C45 25 25 45 0 50 C25 55 45 75 50 100 C55 75 75 55 100 50 C75 45 55 25 50 0 Z"
                opacity="0.95"
              />
              <path
                d="M50 15 C40 32 32 40 15 50 C32 60 40 68 50 85 C60 68 68 60 85 50 C68 40 60 32 50 15 Z"
                fill="#D49B37"
                opacity="0.9"
              />
              <circle cx="50" cy="50" r="8" fill={isFooter ? '#FFFFFF' : '#1A130E'} />
            </svg>
          </div>
        )}
      </div>

      {/* Brand Text Heading */}
      {showText && (
        <div className="leading-tight">
          <span
            className={`font-bold tracking-[0.1em] block uppercase ${
              isFooter ? 'text-lg text-white' : 'text-xl sm:text-2xl text-[#1A130E]'
            }`}
          >
            AMBER SPICE
          </span>
          {isFooter && (
            <span className="text-[10px] tracking-wider text-[#D49B37] block font-medium">
              Authentic Flavors. Timeless Recipes.
            </span>
          )}
        </div>
      )}
    </Link>
  );
};
