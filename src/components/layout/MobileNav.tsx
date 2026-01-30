'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// Items principales en la barra inferior (max 5)
const mainItems = [
  { href: '/', label: 'Inicio', icon: 'home' },
  { href: '/clientes', label: 'Clientes', icon: 'clientes' },
  { href: '/factura/nueva', label: 'Nueva', icon: 'nueva', highlight: true },
  { href: '/facturas', label: 'Facturas', icon: 'facturas' },
  { href: '_more', label: 'Más', icon: 'more' },
]

// Items del menú "Más"
const moreItems = [
  { href: '/presupuestos', label: 'Presupuestos', icon: 'presupuestos' },
  { href: '/gastos', label: 'Gastos', icon: 'gastos' },
  { href: '/borradores', label: 'Borradores', icon: 'borradores' },
  { href: '/sociedades', label: 'Sociedades', icon: 'sociedades' },
  { href: '/guia', label: 'Guía de uso', icon: 'guia' },
]

function Icon({ name, className = 'w-6 h-6' }: { name: string; className?: string }) {
  switch (name) {
    case 'home':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    case 'clientes':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    case 'nueva':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
    case 'facturas':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    case 'more':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
    case 'presupuestos':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
    case 'gastos':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
    case 'borradores':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    case 'sociedades':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    case 'guia':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    case 'logout':
      return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
    default:
      return null
  }
}

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [showMore, setShowMore] = useState(false)

  // Cerrar panel al cambiar de ruta
  useEffect(() => {
    setShowMore(false)
  }, [pathname])

  const handleLogout = async () => {
    await fetch('/api/auth', { method: 'DELETE' })
    router.push('/login')
    router.refresh()
  }

  // Comprobar si alguno de los items del menú "Más" está activo
  const isMoreActive = moreItems.some((item) => pathname === item.href)

  return (
    <>
      {/* Overlay */}
      {showMore && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* Panel "Más" */}
      <div
        className={`lg:hidden fixed bottom-[68px] left-0 right-0 z-50 transition-all duration-300 ease-out ${
          showMore
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="mx-3 mb-2 bg-white rounded-2xl shadow-xl border border-zebra-border overflow-hidden">
          <div className="px-4 py-3 border-b border-zebra-border bg-zebra-light/50">
            <p className="text-xs font-semibold text-zebra-gray uppercase tracking-wide">Más opciones</p>
          </div>
          <div className="py-1">
            {moreItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${
                    isActive
                      ? 'bg-zebra-primary/10 text-zebra-primary'
                      : 'text-zebra-dark hover:bg-zebra-light active:bg-zebra-light'
                  }`}
                >
                  <Icon name={item.icon} className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-zebra-primary" />
                  )}
                </Link>
              )
            })}
          </div>
          <div className="border-t border-zebra-border">
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 px-5 py-3.5 w-full text-red-500 hover:bg-red-50 active:bg-red-50 transition-colors"
            >
              <Icon name="logout" className="w-5 h-5" />
              <span className="text-sm font-medium">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra inferior principal */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zebra-border z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
        <nav className="flex justify-around items-center h-[68px] px-1">
          {mainItems.map((item) => {
            const isMore = item.href === '_more'
            const isActive = isMore ? isMoreActive || showMore : pathname === item.href
            const isHighlight = item.highlight

            if (isMore) {
              return (
                <button
                  key="_more"
                  onClick={() => setShowMore(!showMore)}
                  className={`flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-medium transition-all duration-200 w-16 ${
                    isActive ? 'text-zebra-primary font-semibold' : 'text-zebra-gray'
                  }`}
                >
                  <Icon name="more" className="w-6 h-6" />
                  <span className="mt-1">{item.label}</span>
                </button>
              )
            }

            if (isHighlight) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center justify-center py-1 w-16"
                >
                  <div className="bg-zebra-primary rounded-full p-2.5 -mt-4 shadow-lg shadow-zebra-primary/30">
                    <Icon name={item.icon} className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[11px] font-bold text-zebra-primary mt-0.5">{item.label}</span>
                </Link>
              )
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1 rounded-lg text-[11px] font-medium transition-all duration-200 w-16 ${
                  isActive ? 'text-zebra-primary font-semibold' : 'text-zebra-gray'
                }`}
              >
                <Icon name={item.icon} className="w-6 h-6" />
                <span className="mt-1">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
