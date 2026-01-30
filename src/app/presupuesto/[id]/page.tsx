import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button, Card } from '@/components/ui'
import DeletePresupuestoButton from './DeletePresupuestoButton'
import EstadoPresupuestoButtons from './EstadoPresupuestoButtons'
import ConvertirFacturaButton from './ConvertirFacturaButton'
import EmitirPresupuestoButton from './EmitirPresupuestoButton'

interface LineaPresupuesto {
  id: number
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
  subtotal: number
}

const ESTADO_LABELS: Record<string, { label: string; bg: string; text: string }> = {
  BORRADOR: { label: 'Borrador', bg: 'bg-gray-100', text: 'text-gray-700' },
  ENVIADO: { label: 'Enviado', bg: 'bg-blue-100', text: 'text-blue-700' },
  ACEPTADO: { label: 'Aceptado', bg: 'bg-green-100', text: 'text-green-700' },
  RECHAZADO: { label: 'Rechazado', bg: 'bg-red-100', text: 'text-red-700' },
  EXPIRADO: { label: 'Expirado', bg: 'bg-orange-100', text: 'text-orange-700' },
}

async function getPresupuesto(id: number) {
  return prisma.presupuesto.findUnique({
    where: { id },
    include: {
      sociedad: true,
      cliente: true,
      lineas: {
        orderBy: { orden: 'asc' },
      },
    },
  })
}

export default async function PresupuestoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const presupuesto = await getPresupuesto(parseInt(id))

  if (!presupuesto) {
    notFound()
  }

  const estado = ESTADO_LABELS[presupuesto.estado] || ESTADO_LABELS.BORRADOR

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">
            {presupuesto.estado === 'BORRADOR'
              ? 'Borrador de presupuesto'
              : `Presupuesto ${presupuesto.numeroCompleto}`}
          </h1>
          <p className="text-zebra-gray mt-1">
            {presupuesto.estado === 'BORRADOR'
              ? `Creado el ${new Date(presupuesto.createdAt).toLocaleDateString('es-ES')}`
              : `Emitido el ${new Date(presupuesto.fechaEmision).toLocaleDateString('es-ES')}`}
          </p>
        </div>
        <div className="flex gap-3">
          {presupuesto.estado === 'BORRADOR' ? (
            <>
              <Link href={`/presupuesto/${presupuesto.id}/editar`}>
                <Button variant="secondary">Editar borrador</Button>
              </Link>
              <EmitirPresupuestoButton presupuestoId={presupuesto.id} />
            </>
          ) : (
            <>
              <Link href={`/api/presupuesto/${presupuesto.id}/pdf`} target="_blank">
                <Button>
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar PDF
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Estado + Total */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zebra-gray">Estado</p>
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full mt-1 ${estado.bg} ${estado.text}`}>
              {estado.label}
            </span>
            {presupuesto.facturaId && (
              <Link
                href={`/factura/${presupuesto.facturaId}`}
                className="ml-3 text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Ver factura generada →
              </Link>
            )}
          </div>
          <div className="text-right">
            <p className="text-sm text-zebra-gray">Total</p>
            <p className="text-3xl font-bold text-zebra-primary">
              {presupuesto.totalPresupuesto.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
          </div>
        </div>
      </Card>

      {/* Datos de emisor y cliente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-zebra-dark mb-3">Emisor</h3>
          <p className="font-medium">{presupuesto.sociedad.nombreComercial || presupuesto.sociedad.nombre}</p>
          <p className="text-sm text-zebra-gray">{presupuesto.sociedad.nif}</p>
          <p className="text-sm text-zebra-gray mt-2">{presupuesto.sociedad.direccion}</p>
          <p className="text-sm text-zebra-gray">
            {presupuesto.sociedad.codigoPostal} {presupuesto.sociedad.ciudad}
          </p>
        </Card>

        <Card>
          <h3 className="font-semibold text-zebra-dark mb-3">Cliente</h3>
          <p className="font-medium">{presupuesto.cliente.nombre}</p>
          <p className="text-sm text-zebra-gray">{presupuesto.cliente.nif}</p>
          <p className="text-sm text-zebra-gray mt-2">{presupuesto.cliente.direccion}</p>
          <p className="text-sm text-zebra-gray">
            {presupuesto.cliente.codigoPostal} {presupuesto.cliente.ciudad}
          </p>
        </Card>
      </div>

      {/* Fechas */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-zebra-gray">Fecha de emisión</p>
            <p className="font-medium">
              {new Date(presupuesto.fechaEmision).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-zebra-gray">Válido hasta</p>
            <p className="font-medium">
              {presupuesto.fechaValidez
                ? new Date(presupuesto.fechaValidez).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
        </div>
      </Card>

      {/* Conceptos */}
      <Card>
        <h3 className="font-semibold text-zebra-dark mb-4">Conceptos</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-zebra-border">
                <th className="text-left py-3 text-sm font-medium text-zebra-gray">Descripción</th>
                <th className="text-right py-3 text-sm font-medium text-zebra-gray">Cantidad</th>
                <th className="text-right py-3 text-sm font-medium text-zebra-gray">Precio</th>
                <th className="text-right py-3 text-sm font-medium text-zebra-gray">IVA</th>
                <th className="text-right py-3 text-sm font-medium text-zebra-gray">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {presupuesto.lineas.map((linea: LineaPresupuesto) => (
                <tr key={linea.id} className="border-b border-zebra-light">
                  <td className="py-3">{linea.descripcion}</td>
                  <td className="py-3 text-right">{linea.cantidad}</td>
                  <td className="py-3 text-right">
                    {linea.precioUnitario.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </td>
                  <td className="py-3 text-right">{linea.porcentajeIva}%</td>
                  <td className="py-3 text-right font-medium">
                    {linea.subtotal.toLocaleString('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totales */}
        <div className="mt-6 pt-4 border-t border-zebra-border">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-zebra-gray">
                <span>Base imponible</span>
                <span>
                  {presupuesto.baseImponible.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-zebra-gray">
                <span>IVA</span>
                <span>
                  {presupuesto.totalIva.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-zebra-dark pt-2 border-t border-zebra-border">
                <span>Total</span>
                <span>
                  {presupuesto.totalPresupuesto.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Condiciones */}
      {presupuesto.condiciones && (
        <Card>
          <h3 className="font-semibold text-zebra-dark mb-2">Condiciones</h3>
          <p className="text-zebra-gray whitespace-pre-wrap">{presupuesto.condiciones}</p>
        </Card>
      )}

      {/* Notas */}
      {presupuesto.notas && (
        <Card>
          <h3 className="font-semibold text-zebra-dark mb-2">Notas</h3>
          <p className="text-zebra-gray whitespace-pre-wrap">{presupuesto.notas}</p>
        </Card>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-4">
        <Link href="/presupuestos">
          <Button variant="outline">Volver a presupuestos</Button>
        </Link>

        {presupuesto.estado === 'ENVIADO' && (
          <EstadoPresupuestoButtons presupuestoId={presupuesto.id} />
        )}

        {presupuesto.estado === 'ACEPTADO' && !presupuesto.facturaId && (
          <ConvertirFacturaButton presupuestoId={presupuesto.id} />
        )}

        <Link href="/presupuesto/nuevo">
          <Button variant="secondary">Crear otro presupuesto</Button>
        </Link>

        <DeletePresupuestoButton
          presupuestoId={presupuesto.id}
          label={presupuesto.estado === 'BORRADOR' ? 'este borrador' : presupuesto.numeroCompleto}
        />
      </div>
    </div>
  )
}
