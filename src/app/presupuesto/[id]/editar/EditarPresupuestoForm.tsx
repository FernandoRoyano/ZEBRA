'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, Textarea } from '@/components/ui'
import { actualizarPresupuesto } from '../../actions'

interface LineaPresupuesto {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
}

interface Props {
  presupuesto: {
    id: number
    fechaEmision: string
    fechaValidez: string
    notas: string
    condiciones: string
    sociedadNombre: string
    clienteNombre: string
    lineas: LineaPresupuesto[]
  }
}

export default function EditarPresupuestoForm({ presupuesto }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [fechaEmision, setFechaEmision] = useState(presupuesto.fechaEmision)
  const [fechaValidez, setFechaValidez] = useState(presupuesto.fechaValidez)
  const [notas, setNotas] = useState(presupuesto.notas)
  const [condiciones, setCondiciones] = useState(presupuesto.condiciones)
  const [lineas, setLineas] = useState<LineaPresupuesto[]>(presupuesto.lineas)

  const baseImponible = lineas.reduce(
    (total, linea) => total + linea.cantidad * linea.precioUnitario,
    0
  )
  const totalIva = lineas.reduce(
    (total, linea) =>
      total + (linea.cantidad * linea.precioUnitario * linea.porcentajeIva) / 100,
    0
  )
  const totalPresupuesto = baseImponible + totalIva

  function agregarLinea() {
    setLineas([...lineas, { descripcion: '', cantidad: 1, precioUnitario: 0, porcentajeIva: 21 }])
  }

  function eliminarLinea(index: number) {
    if (lineas.length > 1) {
      setLineas(lineas.filter((_, i) => i !== index))
    }
  }

  function actualizarLinea(index: number, campo: keyof LineaPresupuesto, valor: string | number) {
    const nuevasLineas = [...lineas]
    nuevasLineas[index] = { ...nuevasLineas[index], [campo]: valor }
    setLineas(nuevasLineas)
  }

  async function handleGuardar() {
    const lineasValidas = lineas.filter(
      (l) => l.descripcion.trim() && l.cantidad > 0 && l.precioUnitario > 0
    )

    if (lineasValidas.length === 0) {
      setError('Debes añadir al menos un concepto con descripción y precio')
      return
    }

    setLoading(true)
    setError('')

    try {
      const result = await actualizarPresupuesto(presupuesto.id, {
        fechaEmision: new Date(fechaEmision),
        fechaValidez: new Date(fechaValidez),
        notas: notas || null,
        condiciones: condiciones || null,
        lineas: lineasValidas,
      })

      if (result.success) {
        router.push(`/presupuesto/${presupuesto.id}`)
      } else {
        setError(result.error || 'Error al guardar')
      }
    } catch {
      setError('Error al guardar el presupuesto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zebra-light">
          <p className="text-sm text-zebra-gray">Emisor</p>
          <p className="font-semibold">{presupuesto.sociedadNombre}</p>
        </Card>
        <Card className="bg-zebra-light">
          <p className="text-sm text-zebra-gray">Cliente</p>
          <p className="font-semibold">{presupuesto.clienteNombre}</p>
        </Card>
      </div>

      {/* Fechas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          type="date"
          label="Fecha de emisión"
          value={fechaEmision}
          onChange={(e) => setFechaEmision(e.target.value)}
        />
        <Input
          type="date"
          label="Válido hasta"
          value={fechaValidez}
          onChange={(e) => setFechaValidez(e.target.value)}
        />
      </div>

      {/* Líneas */}
      <div>
        <h3 className="text-lg font-medium text-zebra-dark mb-4">Conceptos</h3>
        <div className="space-y-4">
          {lineas.map((linea, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-5">
                  <Input
                    label={index === 0 ? 'Descripción' : undefined}
                    placeholder="Descripción del servicio/producto"
                    value={linea.descripcion}
                    onChange={(e) => actualizarLinea(index, 'descripcion', e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    label={index === 0 ? 'Cantidad' : undefined}
                    value={linea.cantidad}
                    onChange={(e) => actualizarLinea(index, 'cantidad', parseFloat(e.target.value) || 0)}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    label={index === 0 ? 'Precio' : undefined}
                    value={linea.precioUnitario}
                    onChange={(e) => actualizarLinea(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    label={index === 0 ? 'IVA %' : undefined}
                    value={linea.porcentajeIva}
                    onChange={(e) => actualizarLinea(index, 'porcentajeIva', parseFloat(e.target.value) || 0)}
                    min={0}
                    max={100}
                  />
                </div>
                <div className="md:col-span-1">
                  {lineas.length > 1 && (
                    <Button variant="outline" onClick={() => eliminarLinea(index)} className="w-full">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-2 text-right text-sm text-zebra-gray">
                Subtotal: {(linea.cantidad * linea.precioUnitario).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
              </div>
            </Card>
          ))}
        </div>
        <Button variant="outline" onClick={agregarLinea} className="mt-4">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Añadir línea
        </Button>
      </div>

      <Textarea
        label="Condiciones (opcional)"
        placeholder="Condiciones del presupuesto..."
        value={condiciones}
        onChange={(e) => setCondiciones(e.target.value)}
      />

      <Textarea
        label="Notas (opcional)"
        placeholder="Observaciones adicionales..."
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
      />

      {/* Totales */}
      <Card className="bg-zebra-light">
        <div className="space-y-2">
          <div className="flex justify-between text-zebra-gray">
            <span>Base imponible</span>
            <span>{baseImponible.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
          </div>
          <div className="flex justify-between text-zebra-gray">
            <span>IVA</span>
            <span>{totalIva.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-zebra-dark pt-2 border-t border-zebra-border">
            <span>Total</span>
            <span>{totalPresupuesto.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}</span>
          </div>
        </div>
      </Card>

      {/* Botones */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar} disabled={loading} size="lg">
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </Button>
      </div>
    </div>
  )
}
