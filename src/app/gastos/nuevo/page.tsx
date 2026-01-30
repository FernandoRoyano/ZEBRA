import { prisma } from '@/lib/prisma'
import GastoForm from '../GastoForm'

async function getSociedades() {
  return prisma.sociedad.findMany({
    where: { activa: true },
    select: { id: true, nombre: true, nombreComercial: true },
    orderBy: { nombre: 'asc' },
  })
}

export default async function NuevoGastoPage() {
  const sociedades = await getSociedades()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zebra-dark">Nuevo Gasto</h1>
        <p className="text-zebra-gray mt-1">Registra un nuevo gasto</p>
      </div>

      <GastoForm sociedades={sociedades} />
    </div>
  )
}
