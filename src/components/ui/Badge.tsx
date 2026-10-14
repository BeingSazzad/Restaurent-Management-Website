import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'terracotta' | 'gold' | 'green' | 'neutral';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'terracotta',
  className = '',
  size = 'sm',
}) => {
  const baseStyles = 'inline-flex items-center gap-1.5 font-semibold rounded-full';

  const variantStyles = {
    terracotta: 'bg-[#FAF6EF] text-[#B84A22] border border-[#EBE2D7]',
    gold: 'bg-[#FFF9ED] text-[#D49B37] border border-[#F6E3B8]',
    green: 'bg-[#F0FAF4] text-[#0FA958] border border-[#BDE8CF]',
    neutral: 'bg-[#FAF6EF] text-[#747474] border border-[#EBE2D7]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 leading-4',
    md: 'text-xs px-3 py-1 leading-5',
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
