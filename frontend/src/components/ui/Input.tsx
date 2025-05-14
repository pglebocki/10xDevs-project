import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-md border ${error ? 'border-red-300' : 'border-gray-300'} 
              shadow-sm focus:border-blue-500 focus:ring-blue-500 
              ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2 text-sm
              ${error ? 'text-red-900 placeholder-red-300' : 'text-gray-900 placeholder-gray-400'} 
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;