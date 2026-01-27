'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Card } from '@/components/ui'
import { eliminarBorrador, emitirBorrador } from './actions'

interface Borrador {
  id: number
  totalFactura: number
  updatedAt: Date
  cliente: { nombre: string }
  sociedad: { nombreComercial: string | null; nombre: string }
}

interface Props {
  borradores: Borrador[]
}

export default function BorradoresList({ borradores }: Props) {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const [loadingAction, setLoadingAction] = useState<'eliminar' | 'emitir' | null>(null)

  async function handleEliminar(id: number) {
    if (!confirm('¿Eliminar este borrador?')) return
    setLoadingId(id)
    setLoadingAction('eliminar')
    const result = await eliminarBorrador(id)
    if (!result.success) {
      alert(result.error || 'Error al eliminar')
    }
    setLoadingId(null)
    setLoadingAction(null)
    router.refresh()
  }

  async function handleEmitir(id: number) {
    if (!confirm('¿Emitir esta factura? Se asignará un número definitivo.')) return
    setLoadingId(id)
    setLoadingAction('emitir')
    const result = await emitirBorrador(id)
    if (result.success && result.facturaId) {
      router.push(`/factura/${result.facturaId}`)
    } else {
      alert(result.error || 'Error al emitir')
      setLoadingId(null)
      setLoadingAction(null)
    }
  }

  if (borradores.length === 0) {
    return (
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
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <p className="text-zebra-gray text-lg">No hay borradores</p>
          <p className="text-zebra-gray/70 mt-1">
            Los borradores aparecerán aquí cuando guardes una factura sin emitir
          </p>
          <Link href="/factura/nueva" className="mt-4 inline-block">
            <Button>Nueva Factura</Button>
          </Link>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-zebra-gray">
        {borradores.length} borrador{borradores.length !== 1 ? 'es' : ''}
      </p>
      {borradores.map((borrador) => {
        const isLoading = loadingId === borrador.id
        return (
          <Card key={borrador.id}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                    Borrador
                  </span>
                  <span className="text-sm text-zebra-gray">
                    Editado {new Date(borrador.updatedAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <p className="font-semibold text-zebra-dark mt-2">
                  {borrador.cliente.nombre}
                </p>
                <p className="text-sm text-zebra-gray">
                  {borrador.sociedad.nombreComercial || borrador.sociedad.nombre}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-bold text-zebra-dark">
                  {borrador.totalFactura.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link href={`/factura/${borrador.id}/editar`}>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </Link>
                <Button
                  size="sm"
                  onClick={() => handleEmitir(borrador.id)}
                  disabled={isLoading}
                >
                  {isLoading && loadingAction === 'emitir' ? 'Emitiendo...' : 'Emitir'}
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleEliminar(borrador.id)}
                  disabled={isLoading}
                >
                  {isLoading && loadingAction === 'eliminar' ? 'Eliminando...' : 'Eliminar'}
                </Button>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
