'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'
import { guardarGasto } from './actions'

interface Sociedad {
  id: number
  nombre: string
  nombreComercial: string | null
}

interface Gasto {
  id: number
  concepto: string
  descripcion: string | null
  importe: number
  fecha: Date | string
  categoria: string | null
  proveedor: string | null
  sociedadId: number
}

const CATEGORIAS = [
  { value: '', label: 'Sin categoría' },
  { value: 'material', label: 'Material' },
  { value: 'servicios', label: 'Servicios' },
  { value: 'personal', label: 'Personal' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'suministros', label: 'Suministros' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'otros', label: 'Otros' },
]

export default function GastoForm({
  gasto,
  sociedades,
}: {
  gasto?: Gasto
  sociedades: Sociedad[]
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fechaDefault = gasto
    ? new Date(gasto.fecha).toISOString().split('T')[0]
    : new Date().toISOString().split('T')[0]

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    try {
      const result = await guardarGasto(gasto?.id, formData)
      if (result.success) {
        router.push('/gastos')
        router.refresh()
      } else {
        setError(result.error || 'Error al guardar')
      }
    } catch {
      setError('Error al guardar el gasto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit}>
      <Card className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <Input
          name="concepto"
          label="Concepto"
          defaultValue={gasto?.concepto || ''}
          required
          placeholder="Descripción breve del gasto"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="importe"
            label="Importe (EUR)"
            type="number"
            step="0.01"
            min="0.01"
            defaultValue={gasto?.importe?.toString() || ''}
            required
          />
          <Input
            name="fecha"
            label="Fecha"
            type="date"
            defaultValue={fechaDefault}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="categoria" className="block text-sm font-medium text-zebra-dark mb-1.5">
              Categoría
            </label>
            <select
              name="categoria"
              id="categoria"
              defaultValue={gasto?.categoria || ''}
              className="w-full px-4 py-2.5 rounded-lg border border-zebra-border bg-white text-zebra-dark focus:outline-none focus:ring-2 focus:ring-zebra-primary/30 focus:border-zebra-primary transition-colors"
            >
              {CATEGORIAS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sociedadId" className="block text-sm font-medium text-zebra-dark mb-1.5">
              Sociedad
            </label>
            <select
              name="sociedadId"
              id="sociedadId"
              defaultValue={gasto?.sociedadId?.toString() || ''}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-zebra-border bg-white text-zebra-dark focus:outline-none focus:ring-2 focus:ring-zebra-primary/30 focus:border-zebra-primary transition-colors"
            >
              <option value="">Seleccionar sociedad...</option>
              {sociedades.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombreComercial || s.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Input
          name="proveedor"
          label="Proveedor"
          defaultValue={gasto?.proveedor || ''}
          placeholder="Nombre del proveedor"
        />

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-zebra-dark mb-1.5">
            Descripción
          </label>
          <textarea
            name="descripcion"
            id="descripcion"
            rows={3}
            defaultValue={gasto?.descripcion || ''}
            placeholder="Notas adicionales..."
            className="w-full px-4 py-2.5 rounded-lg border border-zebra-border bg-white text-zebra-dark focus:outline-none focus:ring-2 focus:ring-zebra-primary/30 focus:border-zebra-primary transition-colors resize-none"
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : gasto ? 'Guardar cambios' : 'Crear gasto'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </Card>
    </form>
  )
}
