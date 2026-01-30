'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Card, Input, Textarea } from '@/components/ui'
import { crearPresupuesto } from './actions'

interface Sociedad {
  id: number
  nombre: string
  nombreComercial: string | null
  nif: string
  serieActual: string
  ultimoNumeroPresupuesto: number
}

interface Cliente {
  id: number
  nombre: string
  nif: string
  direccion: string
  ciudad: string
  esAdministracion: boolean
}

interface LineaPresupuesto {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
}

interface Props {
  sociedades: Sociedad[]
  clientes: Cliente[]
}

export default function PresupuestoWizard({ sociedades, clientes }: Props) {
  const router = useRouter()
  const [paso, setPaso] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [sociedadId, setSociedadId] = useState<number | null>(null)
  const [clienteId, setClienteId] = useState<number | null>(null)
  const [fechaEmision, setFechaEmision] = useState(new Date().toISOString().split('T')[0])
  const [diasValidez, setDiasValidez] = useState(30)
  const [notas, setNotas] = useState('')
  const [condiciones, setCondiciones] = useState('')
  const [lineas, setLineas] = useState<LineaPresupuesto[]>([
    { descripcion: '', cantidad: 1, precioUnitario: 0, porcentajeIva: 21 },
  ])

  const sociedadSeleccionada = sociedades.find((s) => s.id === sociedadId)
  const clienteSeleccionado = clientes.find((c) => c.id === clienteId)

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

  async function handleCrearPresupuesto(comoBorrador: boolean = false) {
    if (!sociedadId || !clienteId) return

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
      const fechaValidez = new Date(fechaEmision)
      fechaValidez.setDate(fechaValidez.getDate() + diasValidez)

      const result = await crearPresupuesto({
        sociedadId,
        clienteId,
        fechaEmision: new Date(fechaEmision),
        fechaValidez,
        notas: notas || null,
        condiciones: condiciones || null,
        lineas: lineasValidas,
        comoBorrador,
      })

      if (result.success && result.presupuestoId) {
        router.push(`/presupuesto/${result.presupuestoId}`)
      } else {
        setError(result.error || 'Error al crear el presupuesto')
      }
    } catch {
      setError('Error al crear el presupuesto')
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
            ¿Quién emite el presupuesto?
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
                  Siguiente presupuesto: P-{new Date().getFullYear()}-
                  {String(sociedad.ultimoNumeroPresupuesto + 1).padStart(4, '0')}
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
            ¿A quién va dirigido el presupuesto?
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

      {/* Paso 3: Datos del presupuesto */}
      {paso === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-zebra-dark">Datos del presupuesto</h2>

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
              label="Días de validez"
              value={diasValidez}
              onChange={(e) => setDiasValidez(parseInt(e.target.value) || 30)}
              min={1}
            />
          </div>

          {/* Líneas de presupuesto */}
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

          {/* Condiciones */}
          <Textarea
            label="Condiciones (opcional)"
            placeholder="Condiciones del presupuesto, plazos de entrega, etc."
            value={condiciones}
            onChange={(e) => setCondiciones(e.target.value)}
          />

          {/* Notas */}
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
                  {totalPresupuesto.toLocaleString('es-ES', {
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
                onClick={() => handleCrearPresupuesto(true)}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar borrador'}
              </Button>
              <Button onClick={() => handleCrearPresupuesto(false)} disabled={loading} size="lg">
                {loading ? 'Creando...' : 'Crear Presupuesto'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
