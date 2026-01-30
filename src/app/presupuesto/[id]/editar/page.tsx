import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditarPresupuestoForm from './EditarPresupuestoForm'

async function getPresupuesto(id: number) {
  return prisma.presupuesto.findUnique({
    where: { id },
    include: {
      sociedad: { select: { nombreComercial: true, nombre: true } },
      cliente: { select: { nombre: true } },
      lineas: {
        orderBy: { orden: 'asc' },
      },
    },
  })
}

export default async function EditarPresupuestoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const presupuesto = await getPresupuesto(parseInt(id))

  if (!presupuesto) {
    notFound()
  }

  if (presupuesto.estado !== 'BORRADOR') {
    redirect(`/presupuesto/${presupuesto.id}`)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-zebra-dark">Editar borrador de presupuesto</h1>
      <EditarPresupuestoForm
        presupuesto={{
          id: presupuesto.id,
          fechaEmision: presupuesto.fechaEmision.toISOString().split('T')[0],
          fechaValidez: presupuesto.fechaValidez?.toISOString().split('T')[0] ?? '',
          notas: presupuesto.notas ?? '',
          condiciones: presupuesto.condiciones ?? '',
          sociedadNombre: presupuesto.sociedad.nombreComercial || presupuesto.sociedad.nombre,
          clienteNombre: presupuesto.cliente.nombre,
          lineas: presupuesto.lineas.map(l => ({
            descripcion: l.descripcion,
            cantidad: l.cantidad,
            precioUnitario: l.precioUnitario,
            porcentajeIva: l.porcentajeIva,
          })),
        }}
      />
    </div>
  )
}
