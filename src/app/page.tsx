import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button, Card } from '@/components/ui'

async function getStats() {
  const [totalFacturas, facturasEsteMes, totalClientes, sociedades, facturacionTotal] = await Promise.all([
    prisma.factura.count(),
    prisma.factura.count({
      where: {
        fechaEmision: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    }),
    prisma.cliente.count(),
    prisma.sociedad.findMany({
      where: { activa: true },
      select: { id: true, nombre: true, nombreComercial: true },
    }),
    prisma.factura.aggregate({
      _sum: { totalFactura: true },
    }),
  ])

  return {
    totalFacturas,
    facturasEsteMes,
    totalClientes,
    sociedades,
    facturacionTotal: facturacionTotal._sum.totalFactura || 0,
  }
}

async function getFacturacionPorSociedad() {
  const sociedades = await prisma.sociedad.findMany({
    where: { activa: true },
    select: {
      id: true,
      nombre: true,
      nombreComercial: true,
      nif: true,
      facturas: {
        select: {
          totalFactura: true,
        },
      },
    },
    orderBy: { nombre: 'asc' },
  })

  return sociedades.map(s => ({
    id: s.id,
    nombre: s.nombreComercial || s.nombre,
    nif: s.nif,
    // Determinar si es asociación (NIF empieza con G) o sociedad (empieza con B)
    tipo: s.nif.startsWith('G') ? 'Asociación' : 'Sociedad',
    totalFacturado: s.facturas.reduce((sum, f) => sum + f.totalFactura, 0),
    numFacturas: s.facturas.length,
  }))
}

async function getUltimasFacturas() {
  return prisma.factura.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: {
      cliente: { select: { nombre: true } },
      sociedad: { select: { nombreComercial: true } },
    },
  })
}

export default async function HomePage() {
  const [stats, ultimasFacturas, facturacionPorSociedad] = await Promise.all([
    getStats(),
    getUltimasFacturas(),
    getFacturacionPorSociedad(),
  ])

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">Bienvenida</h1>
          <p className="text-zebra-gray mt-1">Panel de facturación</p>
        </div>
        <Link href="/factura/nueva" className="shrink-0">
          <Button size="lg">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Factura
          </Button>
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-zebra-primary">{stats.totalFacturas}</p>
            <p className="text-zebra-gray mt-1">Facturas totales</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-zebra-primary-light">{stats.facturasEsteMes}</p>
            <p className="text-zebra-gray mt-1">Este mes</p>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <p className="text-4xl font-bold text-zebra-primary-dark">{stats.totalClientes}</p>
            <p className="text-zebra-gray mt-1">Clientes</p>
          </div>
        </Card>
        <Card className="bg-zebra-primary text-white">
          <div className="text-center">
            <p className="text-3xl font-bold">
              {stats.facturacionTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
            <p className="text-white/80 mt-1">Facturación total</p>
          </div>
        </Card>
      </div>

      {/* Facturación por Sociedad/Asociación */}
      <div>
        <h2 className="text-xl font-semibold text-zebra-dark mb-4">Facturación por entidad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {facturacionPorSociedad.map((entidad) => (
            <Card key={entidad.id}>
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${
                    entidad.tipo === 'Asociación'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {entidad.tipo}
                  </span>
                  <p className="font-semibold text-zebra-dark">{entidad.nombre}</p>
                  <p className="text-sm text-zebra-gray">{entidad.nif}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-zebra-primary">
                    {entidad.totalFacturado.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                  </p>
                  <p className="text-sm text-zebra-gray">{entidad.numFacturas} factura{entidad.numFacturas !== 1 ? 's' : ''}</p>
                </div>
              </div>
            </Card>
          ))}
          {facturacionPorSociedad.length === 0 && (
            <Card className="col-span-2">
              <p className="text-center text-zebra-gray py-4">No hay sociedades registradas</p>
            </Card>
          )}
        </div>
      </div>

      {/* Sociedades activas */}
      <div>
        <h2 className="text-xl font-semibold text-zebra-dark mb-4">Tus sociedades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.sociedades.map((sociedad) => (
            <Link key={sociedad.id} href={`/factura/nueva?sociedad=${sociedad.id}`}>
              <Card clickable className="text-center">
                <p className="font-semibold text-zebra-dark">
                  {sociedad.nombreComercial || sociedad.nombre}
                </p>
                <p className="text-sm text-zebra-primary mt-2">Crear factura</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Últimas facturas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-zebra-dark">Últimas facturas</h2>
          <Link href="/facturas" className="text-zebra-primary hover:text-zebra-primary-dark font-medium">
            Ver todas
          </Link>
        </div>

        {ultimasFacturas.length === 0 ? (
          <Card>
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-zebra-border mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-zebra-gray text-lg">No hay facturas todavía</p>
              <p className="text-zebra-gray/70 mt-1">Crea tu primera factura para empezar</p>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-zebra-border overflow-hidden">
            <table className="min-w-full divide-y divide-zebra-border">
              <thead className="bg-zebra-light">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Número</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Sociedad</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Fecha</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zebra-dark">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zebra-border">
                {ultimasFacturas.map((factura) => (
                  <tr key={factura.id} className="hover:bg-zebra-light/50">
                    <td className="px-6 py-4 font-medium text-zebra-dark">{factura.numeroCompleto}</td>
                    <td className="px-6 py-4 text-zebra-gray">{factura.cliente.nombre}</td>
                    <td className="px-6 py-4 text-zebra-gray">{factura.sociedad.nombreComercial}</td>
                    <td className="px-6 py-4 text-zebra-gray">
                      {new Date(factura.fechaEmision).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-zebra-dark">
                      {factura.totalFactura.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
