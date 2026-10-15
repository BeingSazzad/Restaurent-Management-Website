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
    sm: 'h-8 px-3.5 text-[12px] font-semibold gap-1.5',
    md: 'h-10 px-5 text-[13px] sm:text-[14px] font-semibold gap-2',
    lg: 'h-12 px-6 text-[14px] sm:text-[15px] font-semibold gap-2.5',
    xl: 'h-14 px-8 text-[16px] font-bold gap-3',
  };

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-[#FBA138] to-[#F15A24] text-white hover:opacity-95 shadow-[0_4px_14px_rgba(241,90,36,0.25)] hover:shadow-[0_8px_24px_rgba(241,90,36,0.35)] border border-transparent',
    secondary:
      'bg-white text-[#1A130E] hover:bg-neutral-50 border border-[#E5E5E5] hover:border-[#F15A24] hover:text-[#F15A24] shadow-xs',
    outline:
      'bg-transparent text-[#3D3D3D] hover:bg-white border border-[#E5E5E5] hover:border-[#F15A24] hover:text-[#F15A24] shadow-xs',
    ghost: 'bg-transparent text-[#747474] hover:bg-neutral-100 hover:text-[#1A130E]',
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
