import { prisma } from '@/lib/prisma'
import FacturasList from './FacturasList'

async function getFacturas() {
  return prisma.factura.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      cliente: { select: { nombre: true } },
      sociedad: { select: { nombreComercial: true, nombre: true } },
    },
  })
}

async function getSociedades() {
  return prisma.sociedad.findMany({
    where: { activa: true },
    select: { id: true, nombreComercial: true, nombre: true },
  })
}

export default async function FacturasPage() {
  const [facturas, sociedades] = await Promise.all([getFacturas(), getSociedades()])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-zebra-dark">Historial de Facturas</h1>
        <p className="text-zebra-gray mt-1">Consulta y descarga tus facturas</p>
      </div>

      <FacturasList facturas={facturas} sociedades={sociedades} />
    </div>
  )
}
