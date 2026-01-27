'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0'

    const variants = {
      primary: 'bg-zebra-primary text-white hover:bg-zebra-primary-dark hover:-translate-y-0.5 focus:ring-zebra-primary shadow-md shadow-zebra-primary/25 hover:shadow-lg hover:shadow-zebra-primary/30',
      secondary: 'bg-zebra-light text-zebra-dark hover:bg-zebra-border hover:-translate-y-0.5 focus:ring-zebra-gray shadow-sm',
      outline: 'border border-zebra-border text-zebra-dark hover:bg-zebra-light hover:border-zebra-gray focus:ring-zebra-primary',
      danger: 'bg-red-600 text-white hover:bg-red-700 hover:-translate-y-0.5 focus:ring-red-500 shadow-md shadow-red-500/25 hover:shadow-lg hover:shadow-red-500/30',
    }

    const sizes = {
      sm: 'px-3 py-2 text-sm min-h-[40px]',
      md: 'px-5 py-3 text-base min-h-[48px]',
      lg: 'px-6 py-4 text-lg min-h-[56px]',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
