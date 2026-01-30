'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { convertirAFactura } from '../actions'

export default function ConvertirFacturaButton({ presupuestoId }: { presupuestoId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)

  async function handleConvertir() {
    setLoading(true)
    const result = await convertirAFactura(presupuestoId)
    if (result.success && result.facturaId) {
      router.push(`/factura/${result.facturaId}`)
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
          onClick={handleConvertir}
          disabled={loading}
        >
          {loading ? 'Convirtiendo...' : 'Confirmar conversión a factura'}
        </Button>
        <Button variant="outline" onClick={() => setConfirming(false)} disabled={loading}>
          Cancelar
        </Button>
      </div>
    )
  }

  return (
    <Button onClick={() => setConfirming(true)}>
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      Convertir a factura
    </Button>
  )
}
