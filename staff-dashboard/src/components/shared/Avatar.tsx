import React from 'react';
import { cn } from '../../lib/utils';

export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
  className?: string;
}

export function Avatar({ name, src, size = 'md', isOnline, className }: AvatarProps) {
  const sizeStyles = {
    sm: 'w-7 h-7 text-[11px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className={cn('relative inline-flex items-center justify-center shrink-0', className)}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={cn('rounded-full object-cover border border-stone-200', sizeStyles[size])}
        />
      ) : (
        <div
          className={cn(
            'rounded-full bg-gradient-to-br from-[#1A130E] to-[#F15A24] text-white font-semibold flex items-center justify-center select-none shadow-2xs',
            sizeStyles[size]
          )}
        >
          {initials}
        </div>
      )}
      {isOnline !== undefined && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            isOnline ? 'bg-emerald-500' : 'bg-stone-300',
            size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'
          )}
        />
      )}
    </div>
  );
}
