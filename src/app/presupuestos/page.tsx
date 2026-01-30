import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui'
import PresupuestosList from './PresupuestosList'

async function getPresupuestos() {
  return prisma.presupuesto.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      cliente: { select: { nombre: true } },
      sociedad: { select: { nombreComercial: true, nombre: true } },
    },
  })
}

export default async function PresupuestosPage() {
  const presupuestos = await getPresupuestos()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">Presupuestos</h1>
          <p className="text-zebra-gray mt-1">Gestiona tus presupuestos y cotizaciones</p>
        </div>
        <Link href="/presupuesto/nuevo">
          <Button size="lg">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Presupuesto
          </Button>
        </Link>
      </div>

      <PresupuestosList presupuestos={presupuestos.map(p => ({
        id: p.id,
        numeroCompleto: p.numeroCompleto,
        fechaEmision: p.fechaEmision.toISOString(),
        fechaValidez: p.fechaValidez?.toISOString() ?? null,
        estado: p.estado,
        totalPresupuesto: p.totalPresupuesto,
        clienteNombre: p.cliente.nombre,
        sociedadNombre: p.sociedad.nombreComercial || p.sociedad.nombre,
        facturaId: p.facturaId,
      }))} />
    </div>
  )
}
