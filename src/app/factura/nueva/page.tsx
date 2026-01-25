import { prisma } from '@/lib/prisma'
import FacturaWizard from './FacturaWizard'

async function getDatos() {
  const [sociedades, clientes] = await Promise.all([
    prisma.sociedad.findMany({
      where: { activa: true },
      orderBy: { nombre: 'asc' },
    }),
    prisma.cliente.findMany({
      orderBy: { nombre: 'asc' },
    }),
  ])

  return { sociedades, clientes }
}

export default async function NuevaFacturaPage({
  searchParams,
}: {
  searchParams: Promise<{ sociedad?: string }>
}) {
  const { sociedades, clientes } = await getDatos()
  const params = await searchParams
  const sociedadInicial = params.sociedad ? parseInt(params.sociedad) : undefined

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zebra-dark">Nueva Factura</h1>
        <p className="text-zebra-gray mt-1">Sigue los pasos para crear una factura</p>
      </div>

      <FacturaWizard
        sociedades={sociedades}
        clientes={clientes}
        sociedadInicial={sociedadInicial}
      />
    </div>
  )
}
