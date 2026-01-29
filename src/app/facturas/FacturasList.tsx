'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Card, SearchBar, Select, Button } from '@/components/ui'
import { eliminarFactura } from '../factura/actions'

interface Factura {
  id: number
  numeroCompleto: string
  fechaEmision: Date
  totalFactura: number
  estado: string
  cliente: { nombre: string }
  sociedad: { nombreComercial: string | null; nombre: string }
}

interface Sociedad {
  id: number
  nombreComercial: string | null
  nombre: string
}

interface Props {
  facturas: Factura[]
  sociedades: Sociedad[]
}

export default function FacturasList({ facturas, sociedades }: Props) {
  const router = useRouter()
  const [busqueda, setBusqueda] = useState('')
  const [sociedadFiltro, setSociedadFiltro] = useState('')
  const [mesAnio, setMesAnio] = useState('')
  const [facturaAEliminar, setFacturaAEliminar] = useState<{ id: number; numero: string } | null>(null)
  const [eliminando, setEliminando] = useState(false)

  // Obtener meses únicos para el filtro
  const mesesUnicos = [...new Set(
    facturas.map((f) => {
      const date = new Date(f.fechaEmision)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    })
  )].sort().reverse()

  const facturasFiltradas = facturas.filter((factura) => {
    // Filtro por búsqueda
    const matchBusqueda =
      factura.numeroCompleto.toLowerCase().includes(busqueda.toLowerCase()) ||
      factura.cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())

    // Filtro por sociedad
    const matchSociedad = !sociedadFiltro || factura.sociedad.nombre === sociedadFiltro

    // Filtro por mes
    const fechaFactura = new Date(factura.fechaEmision)
    const mesFactura = `${fechaFactura.getFullYear()}-${String(fechaFactura.getMonth() + 1).padStart(2, '0')}`
    const matchMes = !mesAnio || mesFactura === mesAnio

    return matchBusqueda && matchSociedad && matchMes
  })

  async function handleEliminar() {
    if (!facturaAEliminar) return
    setEliminando(true)
    const result = await eliminarFactura(facturaAEliminar.id)
    if (result.success) {
      setFacturaAEliminar(null)
      setEliminando(false)
      router.refresh()
    } else {
      alert(result.error || 'Error al eliminar la factura')
      setEliminando(false)
      setFacturaAEliminar(null)
    }
  }

  const estadoStyles: Record<string, string> = {
    BORRADOR: 'bg-zebra-light text-zebra-gray border border-zebra-border',
    EMITIDA: 'bg-blue-50 text-blue-700 border border-blue-200',
    ENVIADA: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    PAGADA: 'bg-zebra-primary/10 text-zebra-primary-dark border border-zebra-primary/20',
    ANULADA: 'bg-red-50 text-red-700 border border-red-200',
  }

  const estadoLabels: Record<string, string> = {
    BORRADOR: 'Borrador',
    EMITIDA: 'Emitida',
    ENVIADA: 'Enviada',
    PAGADA: 'Pagada',
    ANULADA: 'Anulada',
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <SearchBar
            placeholder="Buscar por número o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <Select
          options={[
            { value: '', label: 'Todas las sociedades' },
            ...sociedades.map((s) => ({
              value: s.nombre,
              label: s.nombreComercial || s.nombre,
            })),
          ]}
          value={sociedadFiltro}
          onChange={(e) => setSociedadFiltro(e.target.value)}
        />
        <Select
          options={[
            { value: '', label: 'Todos los meses' },
            ...mesesUnicos.map((mes) => {
              const [year, month] = mes.split('-')
              const monthName = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString(
                'es-ES',
                { month: 'long', year: 'numeric' }
              )
              return { value: mes, label: monthName.charAt(0).toUpperCase() + monthName.slice(1) }
            }),
          ]}
          value={mesAnio}
          onChange={(e) => setMesAnio(e.target.value)}
        />
      </div>

      {/* Lista de facturas */}
      {facturasFiltradas.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 text-zebra-gray/40 mx-auto mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-zebra-gray text-lg">
              {busqueda || sociedadFiltro || mesAnio
                ? 'No se encontraron facturas con esos filtros'
                : 'No hay facturas todavía'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="bg-white rounded-xl border border-zebra-border overflow-hidden shadow-sm">
          <table className="min-w-full divide-y divide-zebra-border">
            <thead className="bg-zebra-light">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">
                  Número
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">
                  Sociedad
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">
                  Estado
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zebra-dark">
                  Total
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-zebra-dark">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zebra-border">
              {facturasFiltradas.map((factura) => (
                <tr key={factura.id} className="hover:bg-zebra-primary/5 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/factura/${factura.id}`}
                      className="font-medium text-zebra-primary hover:text-zebra-primary-dark"
                    >
                      {factura.numeroCompleto}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-zebra-gray">{factura.cliente.nombre}</td>
                  <td className="px-6 py-4 text-zebra-gray">
                    {factura.sociedad.nombreComercial || factura.sociedad.nombre}
                  </td>
                  <td className="px-6 py-4 text-zebra-gray">
                    {new Date(factura.fechaEmision).toLocaleDateString('es-ES')}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        estadoStyles[factura.estado] || estadoStyles.EMITIDA
                      }`}
                    >
                      {estadoLabels[factura.estado] || factura.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-zebra-dark">
                    {factura.totalFactura.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/api/factura/${factura.id}/pdf`}
                        target="_blank"
                        className="p-2 text-zebra-gray hover:text-zebra-primary hover:bg-zebra-primary/10 rounded-lg transition-colors"
                        title="Descargar PDF"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </Link>
                      <Link
                        href={`/api/factura/${factura.id}/xml`}
                        target="_blank"
                        className="p-2 text-zebra-gray hover:text-zebra-primary-dark hover:bg-zebra-primary/10 rounded-lg transition-colors"
                        title="Descargar XML"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                          />
                        </svg>
                      </Link>
                      <button
                        onClick={() => setFacturaAEliminar({ id: factura.id, numero: factura.numeroCompleto })}
                        className="p-2 text-zebra-gray hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar factura"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Resumen */}
      {facturasFiltradas.length > 0 && (
        <div className="flex justify-between items-center text-sm text-zebra-gray">
          <span>
            Mostrando {facturasFiltradas.length} de {facturas.length} facturas
          </span>
          <span>
            Total:{' '}
            <span className="font-semibold text-zebra-dark">
              {facturasFiltradas
                .reduce((sum, f) => sum + f.totalFactura, 0)
                .toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </span>
        </div>
      )}
      {/* Modal de confirmación de eliminación */}
      {facturaAEliminar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4">
            <h3 className="text-lg font-bold text-zebra-dark mb-2">
              ¿Eliminar factura?
            </h3>
            <p className="text-zebra-gray mb-6">
              ¿Estás seguro de que quieres eliminar la factura <strong>{facturaAEliminar.numero}</strong>?
              Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setFacturaAEliminar(null)}
                disabled={eliminando}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={handleEliminar}
                disabled={eliminando}
              >
                {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
