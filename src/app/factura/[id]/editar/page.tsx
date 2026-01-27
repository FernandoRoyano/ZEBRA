import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import EditarBorradorForm from './EditarBorradorForm'

async function getBorrador(id: number) {
  return prisma.factura.findUnique({
    where: { id },
    include: {
      sociedad: true,
      cliente: true,
      lineas: { orderBy: { orden: 'asc' } },
    },
  })
}

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

export default async function EditarBorradorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const factura = await getBorrador(parseInt(id))

  if (!factura) notFound()
  if (factura.estado !== 'BORRADOR') redirect(`/factura/${id}`)

  const { sociedades, clientes } = await getDatos()

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zebra-dark">Editar Borrador</h1>
        <p className="text-zebra-gray mt-1">Modifica los datos antes de emitir</p>
      </div>
      <EditarBorradorForm
        factura={factura}
        sociedades={sociedades}
        clientes={clientes}
      />
    </div>
  )
}
