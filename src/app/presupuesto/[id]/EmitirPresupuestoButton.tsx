'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { emitirPresupuestoBorrador } from '../actions'

export default function EmitirPresupuestoButton({ presupuestoId }: { presupuestoId: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleEmitir() {
    setLoading(true)
    const result = await emitirPresupuestoBorrador(presupuestoId)
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error)
    }
    setLoading(false)
  }

  return (
    <Button onClick={handleEmitir} disabled={loading} size="lg">
      {loading ? 'Emitiendo...' : 'Emitir presupuesto'}
    </Button>
  )
}
