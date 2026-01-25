import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button, Card } from '@/components/ui'
import DeleteButton from './DeleteButton'
import ChangeSociedadButton from './ChangeSociedadButton'

interface LineaFactura {
  id: number
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
  subtotal: number
}

async function getFactura(id: number) {
  return prisma.factura.findUnique({
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

async function getSociedades() {
  return prisma.sociedad.findMany({
    where: { activa: true },
    select: {
      id: true,
      nombre: true,
      nombreComercial: true,
      nif: true,
    },
    orderBy: { nombre: 'asc' },
  })
}

export default async function FacturaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [factura, sociedades] = await Promise.all([
    getFactura(parseInt(id)),
    getSociedades(),
  ])

  if (!factura) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabecera */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">
            Factura {factura.numeroCompleto}
          </h1>
          <p className="text-zebra-gray mt-1">
            Emitida el {new Date(factura.fechaEmision).toLocaleDateString('es-ES')}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href={`/api/factura/${factura.id}/pdf`} target="_blank">
            <Button>
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descargar PDF
            </Button>
          </Link>
          {factura.cliente.esAdministracion && (
            <Link href={`/api/factura/${factura.id}/xml`} target="_blank">
              <Button variant="outline">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Descargar XML (FACe)
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Estado */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zebra-gray">Estado</p>
            <p className="font-semibold text-lg">
              {factura.estado === 'EMITIDA' && 'Emitida'}
              {factura.estado === 'ENVIADA' && 'Enviada'}
              {factura.estado === 'PAGADA' && 'Pagada'}
              {factura.estado === 'ANULADA' && 'Anulada'}
              {factura.estado === 'BORRADOR' && 'Borrador'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zebra-gray">Total</p>
            <p className="text-3xl font-bold text-zebra-primary">
              {factura.totalFactura.toLocaleString('es-ES', {
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
          <p className="font-medium">{factura.sociedad.nombreComercial || factura.sociedad.nombre}</p>
          <p className="text-sm text-zebra-gray">{factura.sociedad.nif}</p>
          <p className="text-sm text-zebra-gray mt-2">{factura.sociedad.direccion}</p>
          <p className="text-sm text-zebra-gray">
            {factura.sociedad.codigoPostal} {factura.sociedad.ciudad}
          </p>
          {factura.sociedad.iban && (
            <p className="text-sm text-zebra-gray mt-2 font-mono">
              IBAN: {factura.sociedad.iban}
            </p>
          )}
        </Card>

        <Card>
          <h3 className="font-semibold text-zebra-dark mb-3">Cliente</h3>
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{factura.cliente.nombre}</p>
              <p className="text-sm text-zebra-gray">{factura.cliente.nif}</p>
            </div>
            {factura.cliente.esAdministracion && (
              <span className="px-2 py-1 bg-zebra-primary/10 text-zebra-primary-dark text-xs font-medium rounded-full">
                FACe
              </span>
            )}
          </div>
          <p className="text-sm text-zebra-gray mt-2">{factura.cliente.direccion}</p>
          <p className="text-sm text-zebra-gray">
            {factura.cliente.codigoPostal} {factura.cliente.ciudad}
          </p>
        </Card>
      </div>

      {/* Fechas */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-zebra-gray">Fecha de emisión</p>
            <p className="font-medium">
              {new Date(factura.fechaEmision).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-zebra-gray">Fecha de vencimiento</p>
            <p className="font-medium">
              {factura.fechaVencimiento
                ? new Date(factura.fechaVencimiento).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-zebra-gray">Forma de pago</p>
            <p className="font-medium">Transferencia bancaria</p>
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
              {factura.lineas.map((linea: LineaFactura) => (
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
                  {factura.baseImponible.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-zebra-gray">
                <span>IVA</span>
                <span>
                  {factura.totalIva.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-xl font-bold text-zebra-dark pt-2 border-t border-zebra-border">
                <span>Total</span>
                <span>
                  {factura.totalFactura.toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'EUR',
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Notas */}
      {factura.notas && (
        <Card>
          <h3 className="font-semibold text-zebra-dark mb-2">Notas</h3>
          <p className="text-zebra-gray whitespace-pre-wrap">{factura.notas}</p>
        </Card>
      )}

      {/* Acciones */}
      <div className="flex flex-wrap gap-4">
        <Link href="/facturas">
          <Button variant="outline">Volver al historial</Button>
        </Link>
        <Link href="/factura/nueva">
          <Button variant="secondary">Crear otra factura</Button>
        </Link>
        <ChangeSociedadButton
          facturaId={factura.id}
          sociedadActualId={factura.sociedadId}
          sociedades={sociedades}
        />
        <DeleteButton facturaId={factura.id} numeroFactura={factura.numeroCompleto} />
      </div>
    </div>
  )
}
