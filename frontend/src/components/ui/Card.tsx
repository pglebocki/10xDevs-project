import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  selectable?: boolean;
  selected?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  selectable = false,
  selected = false,
}) => {
  const baseClasses = 'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200';
  const hoverClasses = hoverable ? 'hover:shadow-md hover:border-gray-300 cursor-pointer' : '';
  const selectedClasses = selected ? 'border-blue-500 ring-2 ring-blue-200' : '';
  const interactiveClasses = selectable ? 'cursor-pointer' : '';
  
  return (
    <div
      className={`${baseClasses} ${hoverClasses} ${selectedClasses} ${interactiveClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`p-4 border-b border-gray-200 ${className}`}>{children}</div>;
};

export const CardTitle: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>{children}</h3>;
};

export const CardDescription: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <p className={`text-sm text-gray-500 mt-1 ${className}`}>{children}</p>;
};

export const CardContent: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{ className?: string; children: React.ReactNode }> = ({ 
  className = '', 
  children 
}) => {
  return <div className={`p-4 border-t border-gray-200 ${className}`}>{children}</div>;
};

export default Card;