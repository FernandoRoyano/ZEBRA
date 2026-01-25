'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const menuItems = [
  { href: '/', label: 'Inicio' },
  { href: '/factura/nueva', label: 'Nueva', highlight: true },
  { href: '/facturas', label: 'Historial' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/sociedades', label: 'Sociedades' },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zebra-border z-50">
      <nav className="flex justify-around items-center py-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          const isHighlight = item.highlight

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium
                transition-colors min-w-[60px]
                ${isActive
                  ? 'text-zebra-primary'
                  : isHighlight
                    ? 'text-zebra-primary font-bold'
                    : 'text-zebra-gray'
                }
              `}
            >
              {item.href === '/' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              )}
              {item.href === '/factura/nueva' && (
                <div className={`p-2 rounded-full ${isHighlight ? 'bg-zebra-primary' : ''}`}>
                  <svg className={`w-6 h-6 ${isHighlight ? 'text-white' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
              {item.href === '/facturas' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
              {item.href === '/clientes' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
              {item.href === '/sociedades' && (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              )}
              <span className="mt-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
