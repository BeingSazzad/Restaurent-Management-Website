import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'green' | 'red' | 'amber' | 'slate';
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'slate',
  className = '',
  size = 'sm',
}) => {
  const variantStyles = {
    gold: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    green: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    red: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    amber: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    slate: 'bg-slate-800/80 text-slate-300 border-slate-700',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
};
