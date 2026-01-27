'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { emitirBorrador } from '@/app/borradores/actions'

interface Props {
  facturaId: number
}

export default function EmitirButton({ facturaId }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleEmitir() {
    if (!confirm('¿Emitir esta factura? Se asignará un número definitivo.')) return
    setLoading(true)
    const result = await emitirBorrador(facturaId)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Error al emitir')
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleEmitir} disabled={loading}>
      {loading ? 'Emitiendo...' : 'Emitir factura'}
    </Button>
  )
}
