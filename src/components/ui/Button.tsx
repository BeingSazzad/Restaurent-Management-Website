import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap active:scale-98';

  const sizeStyles = {
    sm: 'h-8 px-3.5 text-xs gap-1.5',
    md: 'h-10 px-5 text-xs sm:text-sm gap-2',
    lg: 'h-12 px-6 text-sm sm:text-base gap-2.5',
    xl: 'h-14 px-8 text-base gap-3',
  };

  const variantStyles = {
    primary:
      'bg-[#B84A22] text-white hover:bg-[#9E3E1B] shadow-[0_4px_14px_rgba(184,74,34,0.2)] hover:shadow-[0_8px_24px_rgba(184,74,34,0.32)] border border-transparent',
    secondary:
      'bg-[#FAF6EF] text-[#1A130E] hover:bg-[#F3ECE2] border border-[#EBE2D7] hover:border-[#B84A22]/50 hover:text-[#B84A22]',
    outline:
      'bg-transparent text-[#3D3D3D] hover:bg-white border border-[#C4B5A5] hover:border-[#B84A22] hover:text-[#B84A22] shadow-xs',
    ghost: 'bg-transparent text-[#747474] hover:bg-[#FAF6EF] hover:text-[#1A130E]',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
