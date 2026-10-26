import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-bold rounded-xl transition-all focus:outline-hidden focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer';

    const variants = {
      primary: 'bg-brand-700 hover:bg-brand-800 text-white shadow-xs focus:ring-brand-700 active:scale-[0.99]',
      secondary: 'bg-surface-900 hover:bg-surface-800 text-white shadow-xs focus:ring-surface-900 active:scale-[0.99]',
      outline: 'bg-white hover:bg-surface-50 text-surface-800 border border-surface-300 focus:ring-surface-400',
      ghost: 'bg-transparent hover:bg-surface-100 text-surface-700 focus:ring-surface-300',
      danger: 'bg-red-600 hover:bg-red-700 text-white shadow-xs focus:ring-red-600',
    };

    const sizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-xs sm:text-sm px-4 py-2.5',
      lg: 'text-sm sm:text-base px-6 py-3.5 rounded-2xl',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
