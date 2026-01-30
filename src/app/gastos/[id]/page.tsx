import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import GastoForm from '../GastoForm'

async function getGasto(id: number) {
  return prisma.gasto.findUnique({
    where: { id },
  })
}

async function getSociedades() {
  return prisma.sociedad.findMany({
    where: { activa: true },
    select: { id: true, nombre: true, nombreComercial: true },
    orderBy: { nombre: 'asc' },
  })
}

export default async function EditarGastoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [gasto, sociedades] = await Promise.all([
    getGasto(parseInt(id)),
    getSociedades(),
  ])

  if (!gasto) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zebra-dark">Editar Gasto</h1>
        <p className="text-zebra-gray mt-1">Modifica los datos del gasto</p>
      </div>

      <GastoForm gasto={gasto} sociedades={sociedades} />
    </div>
  )
}
