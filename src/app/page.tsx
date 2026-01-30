import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button, Card } from '@/components/ui'
import FinancePanel from './FinancePanel'
import MetricsChart from './MetricsChart'

const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

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

async function getFinanceData() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const [ingresosLast30, ingresosMonth, gastosLast30, gastosMonth] = await Promise.all([
    prisma.factura.aggregate({
      _sum: { totalFactura: true },
      where: {
        fechaEmision: { gte: thirtyDaysAgo },
        estado: { not: 'ANULADA' },
      },
    }),
    prisma.factura.aggregate({
      _sum: { totalFactura: true },
      where: {
        fechaEmision: { gte: monthStart },
        estado: { not: 'ANULADA' },
      },
    }),
    prisma.gasto.aggregate({
      _sum: { importe: true },
      where: { fecha: { gte: thirtyDaysAgo } },
    }),
    prisma.gasto.aggregate({
      _sum: { importe: true },
      where: { fecha: { gte: monthStart } },
    }),
  ])

  return {
    last30: {
      ingresos: ingresosLast30._sum.totalFactura || 0,
      gastos: gastosLast30._sum.importe || 0,
    },
    mesActual: {
      ingresos: ingresosMonth._sum.totalFactura || 0,
      gastos: gastosMonth._sum.importe || 0,
    },
  }
}

async function getLast12MonthsData() {
  const now = new Date()
  const twelveMonthsAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1)

  const [facturas, gastos] = await Promise.all([
    prisma.factura.findMany({
      where: {
        fechaEmision: { gte: twelveMonthsAgo },
        estado: { not: 'ANULADA' },
      },
      select: { fechaEmision: true, totalFactura: true },
    }),
    prisma.gasto.findMany({
      where: { fecha: { gte: twelveMonthsAgo } },
      select: { fecha: true, importe: true },
    }),
  ])

  // Generar los últimos 12 meses
  const months: { month: string; ingresos: number; gastos: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const label = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`

    const ingresosMonth = facturas
      .filter(f => {
        const fd = new Date(f.fechaEmision)
        return `${fd.getFullYear()}-${fd.getMonth()}` === key
      })
      .reduce((sum, f) => sum + f.totalFactura, 0)

    const gastosMonth = gastos
      .filter(g => {
        const gd = new Date(g.fecha)
        return `${gd.getFullYear()}-${gd.getMonth()}` === key
      })
      .reduce((sum, g) => sum + g.importe, 0)

    months.push({ month: label, ingresos: ingresosMonth, gastos: gastosMonth })
  }

  return months
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

async function getPresupuestoStats() {
  const [pendientes, ultimosPresupuestos] = await Promise.all([
    prisma.presupuesto.count({
      where: { estado: 'ENVIADO' },
    }),
    prisma.presupuesto.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        cliente: { select: { nombre: true } },
        sociedad: { select: { nombreComercial: true } },
      },
    }),
  ])

  return { pendientes, ultimosPresupuestos }
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
}

export default async function HomePage() {
  const [stats, financeData, monthlyData, ultimasFacturas, facturacionPorSociedad, presupuestoStats] = await Promise.all([
    getStats(),
    getFinanceData(),
    getLast12MonthsData(),
    getUltimasFacturas(),
    getFacturacionPorSociedad(),
    getPresupuestoStats(),
  ])

  const greeting = getGreeting()

  return (
    <div className="space-y-8">
      {/* Cabecera con saludo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">{greeting}, Azu</h1>
          <p className="text-zebra-gray mt-1">Panel de control</p>
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

      {/* Panel de Finanzas */}
      <FinancePanel data={financeData} />

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-zebra-primary">
          <div className="text-center">
            <p className="text-4xl font-bold text-zebra-primary">{stats.totalFacturas}</p>
            <p className="text-zebra-gray mt-1">Facturas totales</p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-zebra-primary-light">
          <div className="text-center">
            <p className="text-4xl font-bold text-zebra-primary-light">{stats.facturasEsteMes}</p>
            <p className="text-zebra-gray mt-1">Este mes</p>
          </div>
        </Card>
        <Card className="border-l-4 border-l-zebra-primary-dark">
          <div className="text-center">
            <p className="text-4xl font-bold text-zebra-primary-dark">{stats.totalClientes}</p>
            <p className="text-zebra-gray mt-1">Clientes</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-zebra-primary to-zebra-primary-dark text-white border-none">
          <div className="text-center">
            <p className="text-3xl font-bold">
              {stats.facturacionTotal.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
            </p>
            <p className="text-white/80 mt-1">Facturación total</p>
          </div>
        </Card>
      </div>

      {/* Gráfico de métricas 12 meses */}
      <MetricsChart data={monthlyData} />

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

      {/* Presupuestos pendientes */}
      {presupuestoStats.pendientes > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-zebra-dark">
                  {presupuestoStats.pendientes} presupuesto{presupuestoStats.pendientes !== 1 ? 's' : ''} pendiente{presupuestoStats.pendientes !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-zebra-gray">Esperando respuesta del cliente</p>
              </div>
            </div>
            <Link href="/presupuestos" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Ver todos →
            </Link>
          </div>
        </Card>
      )}

      {/* Últimos presupuestos */}
      {presupuestoStats.ultimosPresupuestos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-zebra-dark">Últimos presupuestos</h2>
            <Link href="/presupuestos" className="text-zebra-primary hover:text-zebra-primary-dark font-medium">
              Ver todos
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-zebra-border overflow-hidden shadow-sm">
            <table className="min-w-full divide-y divide-zebra-border">
              <thead className="bg-zebra-light">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Número</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Cliente</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-zebra-dark">Fecha</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-zebra-dark">Total</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-zebra-dark">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zebra-border">
                {presupuestoStats.ultimosPresupuestos.map((p) => {
                  const estadoStyles: Record<string, string> = {
                    BORRADOR: 'bg-gray-100 text-gray-700',
                    ENVIADO: 'bg-blue-100 text-blue-700',
                    ACEPTADO: 'bg-green-100 text-green-700',
                    RECHAZADO: 'bg-red-100 text-red-700',
                    EXPIRADO: 'bg-orange-100 text-orange-700',
                  }
                  const estadoLabels: Record<string, string> = {
                    BORRADOR: 'Borrador',
                    ENVIADO: 'Enviado',
                    ACEPTADO: 'Aceptado',
                    RECHAZADO: 'Rechazado',
                    EXPIRADO: 'Expirado',
                  }
                  return (
                    <tr key={p.id} className="hover:bg-zebra-primary/5 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/presupuesto/${p.id}`} className="font-medium text-zebra-primary hover:text-zebra-primary-dark">
                          {p.numeroCompleto}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-zebra-gray">{p.cliente.nombre}</td>
                      <td className="px-6 py-4 text-zebra-gray">
                        {new Date(p.fechaEmision).toLocaleDateString('es-ES')}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-zebra-dark">
                        {p.totalPresupuesto.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${estadoStyles[p.estado] || ''}`}>
                          {estadoLabels[p.estado] || p.estado}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              <svg className="w-16 h-16 text-zebra-gray/40 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-zebra-gray text-lg">No hay facturas todavía</p>
              <p className="text-zebra-gray/70 mt-1">Crea tu primera factura para empezar</p>
            </div>
          </Card>
        ) : (
          <div className="bg-white rounded-xl border border-zebra-border overflow-hidden shadow-sm">
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
                  <tr key={factura.id} className="hover:bg-zebra-primary/5 transition-colors">
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
