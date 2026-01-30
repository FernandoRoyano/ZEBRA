'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, SearchBar } from '@/components/ui'

interface Presupuesto {
  id: number
  numeroCompleto: string
  fechaEmision: string
  fechaValidez: string | null
  estado: string
  totalPresupuesto: number
  clienteNombre: string
  sociedadNombre: string
  facturaId: number | null
}

const ESTADO_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  BORRADOR: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Borrador' },
  ENVIADO: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Enviado' },
  ACEPTADO: { bg: 'bg-green-100', text: 'text-green-700', label: 'Aceptado' },
  RECHAZADO: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rechazado' },
  EXPIRADO: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Expirado' },
}

export default function PresupuestosList({ presupuestos }: { presupuestos: Presupuesto[] }) {
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState<string>('TODOS')

  const filtered = presupuestos.filter(p => {
    const matchSearch = !search ||
      p.numeroCompleto.toLowerCase().includes(search.toLowerCase()) ||
      p.clienteNombre.toLowerCase().includes(search.toLowerCase()) ||
      p.sociedadNombre.toLowerCase().includes(search.toLowerCase())
    const matchEstado = filtroEstado === 'TODOS' || p.estado === filtroEstado
    return matchSearch && matchEstado
  })

  const total = filtered.reduce((sum, p) => sum + p.totalPresupuesto, 0)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <SearchBar
            value={search}
            onSearch={setSearch}
            placeholder="Buscar por número, cliente o sociedad..."
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-4 py-3 border border-zebra-border rounded-lg bg-white text-zebra-dark focus:ring-2 focus:ring-zebra-primary/30 focus:border-zebra-primary outline-none"
        >
          <option value="TODOS">Todos los estados</option>
          <option value="BORRADOR">Borrador</option>
          <option value="ENVIADO">Enviado</option>
          <option value="ACEPTADO">Aceptado</option>
          <option value="RECHAZADO">Rechazado</option>
          <option value="EXPIRADO">Expirado</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-zebra-gray/40 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <p className="text-zebra-gray text-lg">No hay presupuestos</p>
            <p className="text-zebra-gray/70 mt-1">Crea tu primer presupuesto para empezar</p>
          </div>
        </Card>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-zebra-border overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-zebra-border">
              <thead className="bg-zebra-light">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Número</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Sociedad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Validez</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zebra-dark">Total</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-zebra-dark">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zebra-border">
                {filtered.map((p) => {
                  const estado = ESTADO_STYLES[p.estado] || ESTADO_STYLES.BORRADOR
                  return (
                    <tr key={p.id} className="hover:bg-zebra-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/presupuesto/${p.id}`} className="font-medium text-zebra-primary hover:text-zebra-primary-dark">
                          {p.numeroCompleto}
                        </Link>
                        {p.facturaId && (
                          <span className="ml-2 text-xs text-green-600" title="Convertido a factura">
                            → Factura
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-zebra-gray">{p.clienteNombre}</td>
                      <td className="px-6 py-4 text-zebra-gray">{p.sociedadNombre}</td>
                      <td className="px-6 py-4 text-zebra-gray">
                        {new Date(p.fechaEmision).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-zebra-gray">
                        {p.fechaValidez
                          ? new Date(p.fechaValidez).toLocaleDateString('es-ES')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-zebra-dark">
                        {p.totalPresupuesto.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${estado.bg} ${estado.text}`}>
                          {estado.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <Card className="inline-block">
              <p className="text-sm text-zebra-gray">
                Total ({filtered.length} presupuesto{filtered.length !== 1 ? 's' : ''}):
                <span className="ml-2 text-lg font-bold text-zebra-dark">
                  {total.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                </span>
              </p>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}
