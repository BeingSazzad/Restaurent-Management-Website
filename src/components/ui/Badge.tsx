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
    terracotta: 'bg-orange-50 text-[#B84A22] border border-orange-200/60',
    gold: 'bg-[#FFF9ED] text-[#D49B37] border border-[#F6E3B8]',
    green: 'bg-[#F0FAF4] text-[#0FA958] border border-[#BDE8CF]',
    neutral: 'bg-white text-[#555555] border border-[#E5E5E5]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 leading-4 font-semibold',
    md: 'text-[12px] px-3 py-1 leading-5 font-semibold',
  };

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
