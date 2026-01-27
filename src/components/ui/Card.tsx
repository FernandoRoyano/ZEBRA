'use client'

import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  selected?: boolean
  clickable?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', selected = false, clickable = false, children, ...props }, ref) => {
    const baseStyles = 'bg-white rounded-xl border p-6 shadow-sm transition-all duration-200'

    const interactiveStyles = clickable
      ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-zebra-primary-light'
      : ''

    const selectedStyles = selected
      ? 'border-zebra-primary ring-2 ring-zebra-primary/20 shadow-md'
      : 'border-zebra-border'

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${interactiveStyles} ${selectedStyles} ${className}`}
        role={clickable ? 'button' : undefined}
        tabIndex={clickable ? 0 : undefined}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export default Card
