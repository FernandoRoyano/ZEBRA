'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, Textarea, Select } from '@/components/ui'
import { actualizarBorrador } from './actions'

interface Sociedad {
  id: number
  nombre: string
  nombreComercial: string | null
  nif: string
}

interface Cliente {
  id: number
  nombre: string
  nif: string
  esAdministracion: boolean
}

interface LineaFactura {
  id: number
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
}

interface Factura {
  id: number
  sociedadId: number
  clienteId: number
  fechaEmision: Date
  diasPago: number
  notas: string | null
  lineas: LineaFactura[]
}

interface LineaForm {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
}

interface Props {
  factura: Factura
  sociedades: Sociedad[]
  clientes: Cliente[]
}

export default function EditarBorradorForm({ factura, sociedades, clientes }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [sociedadId, setSociedadId] = useState(factura.sociedadId)
  const [clienteId, setClienteId] = useState(factura.clienteId)
  const [fechaEmision, setFechaEmision] = useState(
    new Date(factura.fechaEmision).toISOString().split('T')[0]
  )
  const [diasPago, setDiasPago] = useState(factura.diasPago)
  const [notas, setNotas] = useState(factura.notas || '')
  const [lineas, setLineas] = useState<LineaForm[]>(
    factura.lineas.map((l) => ({
      descripcion: l.descripcion,
      cantidad: l.cantidad,
      precioUnitario: l.precioUnitario,
      porcentajeIva: l.porcentajeIva,
    }))
  )

  // Cálculos
  const baseImponible = lineas.reduce(
    (total, linea) => total + linea.cantidad * linea.precioUnitario,
    0
  )
  const totalIva = lineas.reduce(
    (total, linea) =>
      total + (linea.cantidad * linea.precioUnitario * linea.porcentajeIva) / 100,
    0
  )
  const totalFactura = baseImponible + totalIva

  function agregarLinea() {
    setLineas([...lineas, { descripcion: '', cantidad: 1, precioUnitario: 0, porcentajeIva: 21 }])
  }

  function eliminarLinea(index: number) {
    if (lineas.length > 1) {
      setLineas(lineas.filter((_, i) => i !== index))
    }
  }

  function actualizarLinea(index: number, campo: keyof LineaForm, valor: string | number) {
    const nuevasLineas = [...lineas]
    nuevasLineas[index] = { ...nuevasLineas[index], [campo]: valor }
    setLineas(nuevasLineas)
  }

  async function handleGuardar(emitir: boolean = false) {
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
      const result = await actualizarBorrador({
        facturaId: factura.id,
        sociedadId,
        clienteId,
        fechaEmision: new Date(fechaEmision),
        diasPago,
        notas: notas || null,
        lineas: lineasValidas,
        emitir,
      })

      if (result.success && result.facturaId) {
        router.push(`/factura/${result.facturaId}`)
      } else {
        setError(result.error || 'Error al guardar')
      }
    } catch {
      setError('Error al guardar el borrador')
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

      {/* Sociedad y Cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Emisor (Sociedad)"
          value={String(sociedadId)}
          onChange={(e) => setSociedadId(parseInt(e.target.value))}
          options={sociedades.map((s) => ({
            value: String(s.id),
            label: s.nombreComercial || s.nombre,
          }))}
        />
        <Select
          label="Cliente"
          value={String(clienteId)}
          onChange={(e) => setClienteId(parseInt(e.target.value))}
          options={clientes.map((c) => ({
            value: String(c.id),
            label: `${c.nombre}${c.esAdministracion ? ' (FACe)' : ''}`,
          }))}
        />
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
          type="number"
          label="Días para el pago"
          value={diasPago}
          onChange={(e) => setDiasPago(parseInt(e.target.value) || 30)}
          min={0}
        />
      </div>

      {/* Líneas de factura */}
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
                    onChange={(e) =>
                      actualizarLinea(index, 'cantidad', parseFloat(e.target.value) || 0)
                    }
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    label={index === 0 ? 'Precio' : undefined}
                    value={linea.precioUnitario}
                    onChange={(e) =>
                      actualizarLinea(index, 'precioUnitario', parseFloat(e.target.value) || 0)
                    }
                    min={0}
                    step={0.01}
                  />
                </div>
                <div className="md:col-span-2">
                  <Input
                    type="number"
                    label={index === 0 ? 'IVA %' : undefined}
                    value={linea.porcentajeIva}
                    onChange={(e) =>
                      actualizarLinea(index, 'porcentajeIva', parseFloat(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                  />
                </div>
                <div className="md:col-span-1">
                  {lineas.length > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => eliminarLinea(index)}
                      className="w-full"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  )}
                </div>
              </div>
              <div className="mt-2 text-right text-sm text-zebra-gray">
                Subtotal:{' '}
                {(linea.cantidad * linea.precioUnitario).toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                })}
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

      {/* Notas */}
      <Textarea
        label="Notas (opcional)"
        placeholder="Observaciones que aparecerán en la factura..."
        value={notas}
        onChange={(e) => setNotas(e.target.value)}
      />

      {/* Totales */}
      <Card className="bg-zebra-light">
        <div className="space-y-2">
          <div className="flex justify-between text-zebra-gray">
            <span>Base imponible</span>
            <span>
              {baseImponible.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          <div className="flex justify-between text-zebra-gray">
            <span>IVA</span>
            <span>
              {totalIva.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold text-zebra-dark pt-2 border-t border-zebra-border">
            <span>Total</span>
            <span>
              {totalFactura.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </span>
          </div>
        </div>
      </Card>

      {/* Botones */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={() => router.push(`/factura/${factura.id}`)}>
          Cancelar
        </Button>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => handleGuardar(false)}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar borrador'}
          </Button>
          <Button onClick={() => handleGuardar(true)} disabled={loading} size="lg">
            {loading ? 'Emitiendo...' : 'Guardar y emitir'}
          </Button>
        </div>
      </div>
    </div>
  )
}
