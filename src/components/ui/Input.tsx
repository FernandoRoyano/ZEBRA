'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, helpText, id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-base font-medium text-zebra-dark mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`
            w-full px-4 py-3 text-base
            border-2 rounded-lg
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-zebra-primary focus:border-zebra-primary
            disabled:bg-zebra-light disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-zebra-border'}
            ${className}
          `}
          {...props}
        />
        {helpText && !error && (
          <p className="mt-1 text-sm text-zebra-gray">{helpText}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
