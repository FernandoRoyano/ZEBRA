'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { eliminarSociedad } from '../actions'

interface Props {
  sociedadId: number
  nombreSociedad: string
}

export default function DeleteSociedadButton({ sociedadId, nombreSociedad }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    setError(null)
    const result = await eliminarSociedad(sociedadId)

    if (result.success) {
      router.push('/sociedades')
    } else {
      setError(result.error || 'Error al eliminar')
      setLoading(false)
    }
  }

  if (showConfirm) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md mx-4">
          <h3 className="text-lg font-bold text-zebra-dark mb-2">
            ¿Eliminar sociedad?
          </h3>
          <p className="text-zebra-gray mb-4">
            ¿Estás seguro de que quieres eliminar <strong>{nombreSociedad}</strong>?
            Esta acción no se puede deshacer.
          </p>
          {error && (
            <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirm(false)
                setError(null)
              }}
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
      Eliminar sociedad
    </Button>
  )
}
