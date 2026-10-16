import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-stone-700">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-stone-400 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full h-10 rounded-xl border bg-white px-3.5 text-[13.5px] text-stone-900 outline-none transition-all placeholder:text-stone-400',
              leftIcon ? 'pl-11' : 'pl-3.5',
              rightIcon ? 'pr-11' : 'pr-3.5',
              error
                ? 'border-rose-400 focus:border-rose-600 focus:ring-2 focus:ring-rose-200'
                : 'border-stone-200 focus:border-[#F15A24] focus:ring-2 focus:ring-[#F15A24]/15',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 text-stone-400 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-[11px] text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-stone-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
