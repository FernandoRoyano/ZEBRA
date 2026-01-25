'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { eliminarFactura } from '../actions'

interface Props {
  facturaId: number
  numeroFactura: string
}

export default function DeleteButton({ facturaId, numeroFactura }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    const result = await eliminarFactura(facturaId)

    if (result.success) {
      router.push('/facturas')
    } else {
      alert(result.error || 'Error al eliminar')
      setLoading(false)
      setShowConfirm(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md mx-4">
          <h3 className="text-lg font-bold text-zebra-dark mb-2">
            ¿Eliminar factura?
          </h3>
          <p className="text-zebra-gray mb-6">
            ¿Estás seguro de que quieres eliminar la factura <strong>{numeroFactura}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Sí, eliminar'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button variant="danger" onClick={() => setShowConfirm(true)}>
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Eliminar factura
    </Button>
  )
}
