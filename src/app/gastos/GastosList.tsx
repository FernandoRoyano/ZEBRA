'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/ui'
import { eliminarGasto } from './actions'

interface Gasto {
  id: number
  concepto: string
  descripcion: string | null
  importe: number
  fecha: string | Date
  categoria: string | null
  proveedor: string | null
  sociedad: {
    nombre: string
    nombreComercial: string | null
  }
}

const CATEGORIAS_LABEL: Record<string, string> = {
  material: 'Material',
  servicios: 'Servicios',
  personal: 'Personal',
  alquiler: 'Alquiler',
  suministros: 'Suministros',
  transporte: 'Transporte',
  otros: 'Otros',
}

const CATEGORIAS_COLOR: Record<string, string> = {
  material: 'bg-blue-100 text-blue-700',
  servicios: 'bg-purple-100 text-purple-700',
  personal: 'bg-green-100 text-green-700',
  alquiler: 'bg-yellow-100 text-yellow-700',
  suministros: 'bg-orange-100 text-orange-700',
  transporte: 'bg-indigo-100 text-indigo-700',
  otros: 'bg-gray-100 text-gray-600',
}

export default function GastosList({ gastos }: { gastos: Gasto[] }) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)

  const gastosFiltrados = gastos.filter((g) => {
    const q = busqueda.toLowerCase()
    return (
      g.concepto.toLowerCase().includes(q) ||
      (g.proveedor?.toLowerCase().includes(q)) ||
      (g.categoria?.toLowerCase().includes(q))
    )
  })

  const totalGastos = gastosFiltrados.reduce((sum, g) => sum + g.importe, 0)

  async function handleDelete(id: number) {
    setDeleting(true)
    const result = await eliminarGasto(id)
    if (result.success) {
      setConfirmDelete(null)
      router.refresh()
    }
    setDeleting(false)
  }

  return (
    <div className="space-y-6">
      <SearchBar
        placeholder="Buscar por concepto, proveedor o categoría..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {gastosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl border border-zebra-border p-8 text-center">
          <p className="text-zebra-gray text-lg">
            {busqueda ? 'No se encontraron gastos' : 'No hay gastos registrados'}
          </p>
          {!busqueda && (
            <p className="text-zebra-gray/70 mt-1">
              Registra tu primer gasto con el botón &quot;Nuevo Gasto&quot;
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-zebra-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-zebra-border">
              <thead className="bg-zebra-light">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Concepto</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zebra-dark">Importe</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Fecha</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Proveedor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Sociedad</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-zebra-dark">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zebra-border">
                {gastosFiltrados.map((gasto) => (
                  <tr key={gasto.id} className="hover:bg-zebra-primary/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium text-zebra-dark">{gasto.concepto}</span>
                      {gasto.descripcion && (
                        <p className="text-xs text-zebra-gray mt-0.5 truncate max-w-[250px]">{gasto.descripcion}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-red-600 whitespace-nowrap">
                      -{gasto.importe.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                    <td className="px-6 py-4 text-sm text-zebra-gray whitespace-nowrap">
                      {new Date(gasto.fecha).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4">
                      {gasto.categoria ? (
                        <span className={`inline-block px-2.5 py-1 text-xs font-medium rounded-full ${CATEGORIAS_COLOR[gasto.categoria] || 'bg-gray-100 text-gray-600'}`}>
                          {CATEGORIAS_LABEL[gasto.categoria] || gasto.categoria}
                        </span>
                      ) : (
                        <span className="text-zebra-gray/50">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-zebra-gray">
                      {gasto.proveedor || <span className="text-zebra-gray/50">—</span>}
                    </td>
                    <td className="px-6 py-4 text-sm text-zebra-gray">
                      {gasto.sociedad.nombreComercial || gasto.sociedad.nombre}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => router.push(`/gastos/${gasto.id}`)}
                          className="p-1.5 text-zebra-gray hover:text-zebra-primary rounded-lg hover:bg-zebra-primary/10 transition-colors"
                          title="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        {confirmDelete === gasto.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(gasto.id)}
                              disabled={deleting}
                              className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                            >
                              {deleting ? '...' : 'Sí'}
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDelete(gasto.id)}
                            className="p-1.5 text-zebra-gray hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Eliminar"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-3 bg-zebra-light/50 border-t border-zebra-border flex items-center justify-between">
            <p className="text-sm text-zebra-gray">
              {gastosFiltrados.length} gasto{gastosFiltrados.length !== 1 ? 's' : ''}
            </p>
            <p className="text-sm font-semibold text-red-600">
              Total: -{totalGastos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
