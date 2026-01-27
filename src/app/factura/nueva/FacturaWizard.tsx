'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, Textarea } from '@/components/ui'
import { crearFactura } from './actions'

interface Sociedad {
  id: number
  nombre: string
  nombreComercial: string | null
  nif: string
  serieActual: string
  ultimoNumero: number
}

interface Cliente {
  id: number
  nombre: string
  nif: string
  direccion: string
  ciudad: string
  esAdministracion: boolean
}

interface LineaFactura {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
}

interface Props {
  sociedades: Sociedad[]
  clientes: Cliente[]
  sociedadInicial?: number
}

export default function FacturaWizard({ sociedades, clientes, sociedadInicial }: Props) {
  const router = useRouter()
  const [paso, setPaso] = useState(sociedadInicial ? 2 : 1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Datos del wizard
  const [sociedadId, setSociedadId] = useState<number | null>(sociedadInicial || null)
  const [clienteId, setClienteId] = useState<number | null>(null)
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0])
  const [diasPago, setDiasPago] = useState(30)
  const [notas, setNotas] = useState('')
  const [lineas, setLineas] = useState<LineaFactura[]>([
    { descripcion: '', cantidad: 1, precioUnitario: 0, porcentajeIva: 21 },
  ])

  const sociedadSeleccionada = sociedades.find((s) => s.id === sociedadId)
  const clienteSeleccionado = clientes.find((c) => c.id === clienteId)

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

  function actualizarLinea(index: number, campo: keyof LineaFactura, valor: string | number) {
    const nuevasLineas = [...lineas]
    nuevasLineas[index] = { ...nuevasLineas[index], [campo]: valor }
    setLineas(nuevasLineas)
  }

  async function handleCrearFactura(comoBorrador: boolean = false) {
    if (!sociedadId || !clienteId) return

    // Validar que haya al menos una línea con datos
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
      const result = await crearFactura({
        sociedadId,
        clienteId,
        fechaEmision: new Date(fechaEmision),
        diasPago,
        notas: notas || null,
        lineas: lineasValidas,
        comoBorrador,
      })

      if (result.success && result.facturaId) {
        router.push(`/factura/${result.facturaId}`)
      } else {
        setError(result.error || 'Error al crear la factura')
      }
    } catch {
      setError('Error al crear la factura')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Indicador de pasos */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((num) => (
          <div key={num} className="flex items-center">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center text-lg font-semibold
                ${paso >= num ? 'bg-zebra-primary text-white' : 'bg-zebra-light text-zebra-gray'}
              `}
            >
              {num}
            </div>
            {num < 3 && (
              <div
                className={`w-20 h-1 mx-2 ${paso > num ? 'bg-zebra-primary' : 'bg-zebra-light'}`}
              />
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Paso 1: Seleccionar Sociedad */}
      {paso === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zebra-dark">
            ¿Quién emite la factura?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sociedades.map((sociedad) => (
              <Card
                key={sociedad.id}
                clickable
                selected={sociedadId === sociedad.id}
                onClick={() => setSociedadId(sociedad.id)}
                className="cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-zebra-dark">
                  {sociedad.nombreComercial || sociedad.nombre}
                </h3>
                <p className="text-sm text-zebra-gray mt-1">NIF: {sociedad.nif}</p>
                <p className="text-sm text-zebra-gray/70 mt-2">
                  Siguiente factura: {sociedad.serieActual}-{new Date().getFullYear()}-
                  {String(sociedad.ultimoNumero + 1).padStart(4, '0')}
                </p>
              </Card>
            ))}
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setPaso(2)} disabled={!sociedadId} size="lg">
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Paso 2: Seleccionar Cliente */}
      {paso === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zebra-dark">
            ¿A quién va dirigida la factura?
          </h2>

          {clientes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {clientes.map((cliente) => (
                <Card
                  key={cliente.id}
                  clickable
                  selected={clienteId === cliente.id}
                  onClick={() => setClienteId(cliente.id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-zebra-dark">{cliente.nombre}</h3>
                      <p className="text-sm text-zebra-gray">NIF: {cliente.nif}</p>
                    </div>
                    {cliente.esAdministracion && (
                      <span className="px-2 py-1 bg-zebra-primary/10 text-zebra-primary-dark text-xs font-medium rounded-full">
                        FACe
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-zebra-gray/70 mt-2">
                    {cliente.direccion}, {cliente.ciudad}
                  </p>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <p className="text-center text-zebra-gray py-4">
                No hay clientes guardados. Ve a la sección de Clientes para añadir uno.
              </p>
            </Card>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setPaso(1)}>
              Anterior
            </Button>
            <Button onClick={() => setPaso(3)} disabled={!clienteId} size="lg">
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Paso 3: Datos de la factura */}
      {paso === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zebra-dark">Datos de la factura</h2>

          {/* Resumen de selección */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-zebra-light">
              <p className="text-sm text-zebra-gray">Emisor</p>
              <p className="font-semibold">
                {sociedadSeleccionada?.nombreComercial || sociedadSeleccionada?.nombre}
              </p>
            </Card>
            <Card className="bg-zebra-light">
              <p className="text-sm text-zebra-gray">Cliente</p>
              <p className="font-semibold">{clienteSeleccionado?.nombre}</p>
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
                        onChange={(e) =>
                          actualizarLinea(index, 'descripcion', e.target.value)
                        }
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
                          actualizarLinea(
                            index,
                            'precioUnitario',
                            parseFloat(e.target.value) || 0
                          )
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
                          actualizarLinea(
                            index,
                            'porcentajeIva',
                            parseFloat(e.target.value) || 0
                          )
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
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
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
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
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
                  {baseImponible.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-zebra-gray">
                <span>IVA</span>
                <span>
                  {totalIva.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-zebra-dark pt-2 border-t border-zebra-border">
                <span>Total</span>
                <span>
                  {totalFactura.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
            </div>
          </Card>

          {/* Botones */}
          <div className="flex justify-between pt-4">
            <Button variant="outline" onClick={() => setPaso(2)}>
              Anterior
            </Button>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => handleCrearFactura(true)}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar borrador'}
              </Button>
              <Button onClick={() => handleCrearFactura(false)} disabled={loading} size="lg">
                {loading ? 'Creando...' : 'Crear Factura'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
