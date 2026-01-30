'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { eliminarPresupuesto } from '../actions'

export default function DeletePresupuestoButton({
  presupuestoId,
  label,
}: {
  presupuestoId: number
  label: string
}) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    const result = await eliminarPresupuesto(presupuestoId)
    if (result.success) {
      router.push('/presupuestos')
    } else {
      alert(result.error)
      setLoading(false)
      setConfirming(false)
    }
  }

  if (confirming) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleDelete}
          disabled={loading}
          className="!border-red-500 !text-red-600 hover:!bg-red-50"
        >
          {loading ? 'Eliminando...' : `Confirmar eliminar ${label}`}
        </Button>
        <Button variant="outline" onClick={() => setConfirming(false)} disabled={loading}>
          Cancelar
        </Button>
      </div>
    )
  }

  return (
    <Button
      variant="outline"
      onClick={() => setConfirming(true)}
      className="!border-red-300 !text-red-600 hover:!bg-red-50"
    >
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      Eliminar
    </Button>
  )
}
