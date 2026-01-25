'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui'
import { cambiarSociedadFactura } from '../actions'

interface Sociedad {
  id: number
  nombre: string
  nombreComercial: string | null
  nif: string
}

interface Props {
  facturaId: number
  sociedadActualId: number
  sociedades: Sociedad[]
}

export default function ChangeSociedadButton({ facturaId, sociedadActualId, sociedades }: Props) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSociedad, setSelectedSociedad] = useState<number>(sociedadActualId)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleChange() {
    if (selectedSociedad === sociedadActualId) {
      setShowModal(false)
      return
    }

    setLoading(true)
    setError(null)
    const result = await cambiarSociedadFactura(facturaId, selectedSociedad)

    if (result.success) {
      setShowModal(false)
      router.refresh()
    } else {
      setError(result.error || 'Error al cambiar la sociedad')
      setLoading(false)
    }
  }

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 max-w-md mx-4 w-full">
          <h3 className="text-lg font-bold text-zebra-dark mb-4">
            Cambiar sociedad
          </h3>

          <div className="space-y-2 mb-6">
            {sociedades.map((sociedad) => (
              <label
                key={sociedad.id}
                className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                  selectedSociedad === sociedad.id
                    ? 'border-zebra-primary bg-zebra-primary/5'
                    : 'border-zebra-border hover:border-zebra-gray'
                }`}
              >
                <input
                  type="radio"
                  name="sociedad"
                  value={sociedad.id}
                  checked={selectedSociedad === sociedad.id}
                  onChange={() => setSelectedSociedad(sociedad.id)}
                  className="sr-only"
                />
                <div className="flex-1">
                  <p className="font-medium text-zebra-dark">
                    {sociedad.nombreComercial || sociedad.nombre}
                  </p>
                  <p className="text-sm text-zebra-gray">{sociedad.nif}</p>
                </div>
                {selectedSociedad === sociedad.id && (
                  <svg className="w-5 h-5 text-zebra-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </label>
            ))}
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowModal(false)
                setSelectedSociedad(sociedadActualId)
                setError(null)
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleChange}
              disabled={loading || selectedSociedad === sociedadActualId}
            >
              {loading ? 'Cambiando...' : 'Cambiar sociedad'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button variant="secondary" onClick={() => setShowModal(true)}>
      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
      Cambiar sociedad
    </Button>
  )
}
