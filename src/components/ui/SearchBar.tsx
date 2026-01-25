'use client'

import { InputHTMLAttributes, forwardRef } from 'react'

interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onSearch?: (value: string) => void
}

const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className = '', placeholder = 'Buscar...', onSearch, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onSearch?.(e.target.value)
    }

    return (
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-zebra-gray"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={ref}
          type="search"
          className={`
            w-full pl-12 pr-4 py-3 text-base
            border-2 border-zebra-border rounded-lg
            bg-white
            transition-colors
            focus:outline-none focus:ring-2 focus:ring-zebra-primary focus:border-zebra-primary
            placeholder:text-zebra-gray
            ${className}
          `}
          placeholder={placeholder}
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  }
)

SearchBar.displayName = 'SearchBar'

export default SearchBar
