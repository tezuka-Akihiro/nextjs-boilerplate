import React from 'react'
import { cn } from '@lib/utils'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  glow?: boolean
  loading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    glow = false,
    loading = false,
    disabled,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-background-primary',
      'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
      'active:scale-95 transform hover:scale-105'
    ]

    const variants = {
      primary: [
        'bg-gradient-to-r from-cyber-blue-deep to-cyber-blue text-background-primary',
        'hover:from-cyber-blue hover:to-cyber-blue-deep',
        'border border-cyber-blue',
        glow && 'cyber-glow'
      ],
      secondary: [
        'bg-background-secondary text-text-primary border border-border',
        'hover:bg-background-accent hover:border-cyber-blue',
        glow && 'hover:cyber-glow'
      ],
      success: [
        'bg-gradient-to-r from-success to-success text-background-primary',
        'hover:from-success hover:to-success border border-success',
        glow && 'success-glow'
      ],
      danger: [
        'bg-gradient-to-r from-error to-error text-text-primary',
        'hover:from-error hover:to-error border border-error'
      ],
      ghost: [
        'text-text-primary hover:text-cyber-blue hover:bg-background-accent',
        'border border-transparent hover:border-cyber-blue'
      ]
    }

    const sizes = {
      sm: 'h-8 px-3 text-sm rounded-md',
      md: 'h-10 px-4 text-base rounded-lg',
      lg: 'h-12 px-6 text-lg rounded-xl'
    }

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <div className="cyber-loading w-4 h-4 mr-2" />
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export { Button }