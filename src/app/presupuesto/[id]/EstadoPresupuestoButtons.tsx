'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { cambiarEstadoPresupuesto } from '../actions'

export default function EstadoPresupuestoButtons({ presupuestoId }: { presupuestoId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleCambiarEstado(estado: string) {
    setLoading(true)
    const result = await cambiarEstadoPresupuesto(presupuestoId, estado)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
    setLoading(false)
  }

  return (
    <>
      <Button
        onClick={() => handleCambiarEstado('ACEPTADO')}
        disabled={loading}
        className="!bg-green-600 hover:!bg-green-700"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Marcar aceptado
      </Button>
      <Button
        variant="outline"
        onClick={() => handleCambiarEstado('RECHAZADO')}
        disabled={loading}
        className="!border-red-300 !text-red-600 hover:!bg-red-50"
      >
        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Marcar rechazado
      </Button>
    </>
  )
}
