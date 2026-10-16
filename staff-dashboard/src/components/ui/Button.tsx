import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary: 'bg-[#F15A24] hover:bg-[#D94E1C] text-white shadow-2xs border border-transparent',
      secondary: 'bg-[#1A130E] hover:bg-black text-white shadow-2xs border border-transparent',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-2xs border border-transparent',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs border border-transparent',
      outline: 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-200',
      ghost: 'bg-transparent hover:bg-stone-100 text-stone-700 border border-transparent',
    };

    const sizeStyles = {
      sm: 'h-8 px-2.5 text-xs rounded-lg gap-1.5',
      md: 'h-9 px-3.5 text-xs sm:text-sm rounded-lg gap-2',
      lg: 'h-10 px-4 text-sm rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-colors cursor-pointer select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
