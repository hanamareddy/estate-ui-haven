  
import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'accent' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  activeColor?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  badge?: string | number;
}

const ActionButton = ({
  className,
  variant = 'default',
  size = 'md',
  active = false,
  activeColor = 'bg-accent text-white',
  icon,
  children,
  badge,
  ...props
}: ActionButtonProps) => {
  const baseStyles = "rounded-full inline-flex items-center justify-center transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-accent/40";
  
  const variants = {
    default: "bg-white shadow-sm border border-border hover:bg-secondary/80",
    outline: "bg-transparent border border-border hover:bg-secondary/50 text-foreground",
    ghost: "bg-transparent hover:bg-secondary/50 text-foreground",
    accent: "bg-accent text-white hover:bg-accent/90",
    subtle: "bg-secondary/50 text-foreground hover:bg-secondary/80"
  };
  
  const sizes = {
    sm: icon && !children ? "w-8 h-8" : "text-xs px-3 py-1.5",
    md: icon && !children ? "w-10 h-10" : "text-sm px-4 py-2",
    lg: icon && !children ? "w-12 h-12" : "text-base px-5 py-2.5"
  };
  
  const activeStyles = active ? activeColor : variants[variant];
  
  return (
    <button
      className={cn(
        baseStyles,
        sizes[size],
        activeStyles,
        className
      )}
      {...props}
    >
      {icon}
      {children}
      {badge && (
        <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-xs bg-accent text-white font-medium">
          {badge}
        </span>
      )}
    </button>
  );
};

export default ActionButton;
