'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/ui'

interface Cliente {
  id: number
  nombre: string
  nif: string
  direccion: string
  ciudad: string
  email: string | null
  telefono: string | null
  movil: string | null
  tags: string | null
  tipoContacto: string
  tipoEntidad: string
  _count: {
    facturas: number
  }
}

interface ColumnDef {
  key: string
  label: string
  defaultVisible: boolean
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: 'nombre', label: 'Nombre', defaultVisible: true },
  { key: 'nif', label: 'ID', defaultVisible: true },
  { key: 'email', label: 'Email', defaultVisible: true },
  { key: 'telefono', label: 'Teléfono', defaultVisible: true },
  { key: 'movil', label: 'Móvil', defaultVisible: false },
  { key: 'direccion', label: 'Dirección', defaultVisible: false },
  { key: 'ciudad', label: 'Población', defaultVisible: true },
  { key: 'tags', label: 'Tags', defaultVisible: true },
  { key: 'tipoContacto', label: 'Tipo', defaultVisible: true },
]

const STORAGE_KEY = 'zebra_clientes_columns'

function getTipoLabel(tipo: string): string {
  const map: Record<string, string> = {
    cliente: 'Cliente',
    proveedor: 'Proveedor',
    lead: 'Lead',
    deudor: 'Deudor',
    acreedor: 'Acreedor',
    sin_especificar: 'Sin especificar',
  }
  return map[tipo] || tipo
}

function getTipoColor(tipo: string): string {
  const map: Record<string, string> = {
    cliente: 'bg-green-100 text-green-700',
    proveedor: 'bg-blue-100 text-blue-700',
    lead: 'bg-yellow-100 text-yellow-700',
    deudor: 'bg-red-100 text-red-700',
    acreedor: 'bg-purple-100 text-purple-700',
    sin_especificar: 'bg-gray-100 text-gray-600',
  }
  return map[tipo] || 'bg-gray-100 text-gray-600'
}

function renderTags(tags: string | null) {
  if (!tags) return <span className="text-zebra-gray/50">—</span>
  return (
    <div className="flex flex-wrap gap-1">
      {tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
        <span
          key={i}
          className="inline-block px-2 py-0.5 bg-zebra-primary/10 text-zebra-primary-dark text-xs rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

function getCellValue(cliente: Cliente, key: string) {
  switch (key) {
    case 'nombre':
      return <span className="font-medium text-zebra-dark">{cliente.nombre}</span>
    case 'nif':
      return cliente.nif
    case 'email':
      return cliente.email || <span className="text-zebra-gray/50">—</span>
    case 'telefono':
      return cliente.telefono || <span className="text-zebra-gray/50">—</span>
    case 'movil':
      return cliente.movil || <span className="text-zebra-gray/50">—</span>
    case 'direccion':
      return cliente.direccion
    case 'ciudad':
      return cliente.ciudad
    case 'tags':
      return renderTags(cliente.tags)
    case 'tipoContacto':
      return (
        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${getTipoColor(cliente.tipoContacto)}`}>
          {getTipoLabel(cliente.tipoContacto)}
        </span>
      )
    default:
      return null
  }
}

export default function ClientesList({ clientes }: { clientes: Cliente[] }) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(ALL_COLUMNS.filter(c => c.defaultVisible).map(c => c.key))
  )
  const [showColumnPicker, setShowColumnPicker] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)

  // Cargar estado de columnas desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setVisibleColumns(new Set(parsed))
        }
      }
    } catch {
      // Ignorar errores de localStorage
    }
  }, [])

  // Guardar estado de columnas en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...visibleColumns]))
    } catch {
      // Ignorar errores de localStorage
    }
  }, [visibleColumns])

  // Cerrar picker al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowColumnPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const toggleColumn = (key: string) => {
    setVisibleColumns(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        // No permitir ocultar todas las columnas
        if (next.size > 1) next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const clientesFiltrados = clientes.filter(
    (cliente) => {
      const q = busqueda.toLowerCase()
      return (
        cliente.nombre.toLowerCase().includes(q) ||
        cliente.nif.toLowerCase().includes(q) ||
        (cliente.email?.toLowerCase().includes(q)) ||
        (cliente.tags?.toLowerCase().includes(q))
      )
    }
  )

  const activeColumns = ALL_COLUMNS.filter(c => visibleColumns.has(c.key))

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex gap-2 sm:gap-4 items-center">
        <div className="flex-1">
          <SearchBar
            placeholder="Buscar por nombre, NIF, email o tags..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        {/* Selector de columnas - solo visible en desktop */}
        <div className="relative hidden sm:block" ref={pickerRef}>
          <button
            type="button"
            onClick={() => setShowColumnPicker(!showColumnPicker)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zebra-border bg-white text-sm font-medium text-zebra-dark hover:bg-zebra-light transition-colors"
          >
            <svg className="w-5 h-5 text-zebra-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Columnas
          </button>
          {showColumnPicker && (
            <div className="absolute right-0 mt-2 bg-white border border-zebra-border rounded-xl shadow-lg p-4 z-20 min-w-[200px]">
              <p className="text-xs font-semibold text-zebra-gray uppercase mb-3">Mostrar columnas</p>
              {ALL_COLUMNS.map(col => (
                <label key={col.key} className="flex items-center gap-3 py-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visibleColumns.has(col.key)}
                    onChange={() => toggleColumn(col.key)}
                    className="w-4 h-4 rounded border-zebra-border text-zebra-primary focus:ring-zebra-primary"
                  />
                  <span className="text-sm text-zebra-dark">{col.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {clientesFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-zebra-border p-6 sm:p-8 text-center">
          <p className="text-zebra-gray text-base sm:text-lg">
            {busqueda ? 'No se encontraron clientes' : 'No hay clientes guardados'}
          </p>
          {!busqueda && (
            <p className="text-zebra-gray/70 mt-1 text-sm">
              Crea tu primer cliente con el botón &quot;Nuevo Cliente&quot;
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Vista móvil: tarjetas */}
          <div className="sm:hidden space-y-3">
            {clientesFiltrados.map((cliente) => (
              <div
                key={cliente.id}
                onClick={() => router.push(`/clientes/${cliente.id}`)}
                className="bg-white rounded-xl border border-zebra-border p-4 active:bg-zebra-primary/5 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="font-semibold text-zebra-dark truncate">{cliente.nombre}</p>
                    <p className="text-xs text-zebra-gray mt-0.5">{cliente.nif}</p>
                  </div>
                  <span className={`shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getTipoColor(cliente.tipoContacto)}`}>
                    {getTipoLabel(cliente.tipoContacto)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zebra-gray mt-2">
                  {cliente.email && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                      {cliente.email}
                    </span>
                  )}
                  {cliente.telefono && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      {cliente.telefono}
                    </span>
                  )}
                  {cliente.ciudad && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {cliente.ciudad}
                    </span>
                  )}
                </div>
                {cliente.tags && (
                  <div className="mt-2">{renderTags(cliente.tags)}</div>
                )}
              </div>
            ))}
            <div className="text-center py-2">
              <p className="text-xs text-zebra-gray">
                {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>

          {/* Vista desktop: tabla */}
          <div className="hidden sm:block bg-white rounded-xl border border-zebra-border overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-zebra-border">
                <thead className="bg-zebra-light">
                  <tr>
                    {activeColumns.map(col => (
                      <th
                        key={col.key}
                        className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark whitespace-nowrap"
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zebra-border">
                  {clientesFiltrados.map((cliente) => (
                    <tr
                      key={cliente.id}
                      onClick={() => router.push(`/clientes/${cliente.id}`)}
                      className="hover:bg-zebra-primary/5 cursor-pointer transition-colors"
                    >
                      {activeColumns.map(col => (
                        <td key={col.key} className="px-6 py-4 text-sm text-zebra-gray whitespace-nowrap">
                          {getCellValue(cliente, col.key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 bg-zebra-light/50 border-t border-zebra-border">
              <p className="text-sm text-zebra-gray">
                {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
