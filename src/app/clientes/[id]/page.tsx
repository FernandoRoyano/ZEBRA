import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ClienteForm from '../ClienteForm'
import DeleteClienteButton from './DeleteClienteButton'

async function getCliente(id: number) {
  return prisma.cliente.findUnique({
    where: { id },
  })
}

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const cliente = await getCliente(parseInt(id))

  if (!cliente) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">Editar Cliente</h1>
          <p className="text-zebra-gray mt-1">Modifica los datos de {cliente.nombre}</p>
        </div>
        <DeleteClienteButton clienteId={cliente.id} />
      </div>

      <ClienteForm cliente={cliente} />
    </div>
  )
}
