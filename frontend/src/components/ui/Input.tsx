import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export default function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}: InputProps) {
  const baseClasses = 'w-full px-3 py-2 bg-[#40444B] border border-[#4F545C] rounded-md text-white placeholder-[#72767D] focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:border-transparent transition-all duration-200';
  
  const errorClasses = error ? 'border-[#ED4245] focus:ring-[#ED4245]' : '';
  const iconClasses = leftIcon ? 'pl-10' : rightIcon ? 'pr-10' : '';
  
  const classes = `${baseClasses} ${errorClasses} ${iconClasses} ${className}`;
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#B9BBBE] mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#72767D]">
            {leftIcon}
          </div>
        )}
        
        <input
          className={classes}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#72767D]">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-[#ED4245]">{error}</p>
      )}
    </div>
  );
}
