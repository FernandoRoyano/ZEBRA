import { prisma } from '@/lib/prisma'
import BorradoresList from './BorradoresList'

async function getBorradores() {
  return prisma.factura.findMany({
    where: { estado: 'BORRADOR' },
    orderBy: { updatedAt: 'desc' },
    include: {
      cliente: { select: { nombre: true } },
      sociedad: { select: { nombreComercial: true, nombre: true } },
    },
  })
}

export default async function BorradoresPage() {
  const borradores = await getBorradores()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zebra-dark">Borradores</h1>
        <p className="text-zebra-gray mt-1">Facturas pendientes de emitir</p>
      </div>
      <BorradoresList borradores={borradores} />
    </div>
  )
}
