import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui'
import ClientesList from './ClientesList'

async function getClientes() {
  return prisma.cliente.findMany({
    orderBy: { nombre: 'asc' },
    include: {
      _count: {
        select: { facturas: true },
      },
    },
  })
}

export default async function ClientesPage() {
  const clientes = await getClientes()

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zebra-dark">Clientes</h1>
          <p className="text-zebra-gray mt-1 text-sm sm:text-base">Gestiona tus clientes guardados</p>
        </div>
        <Link href="/clientes/nuevo">
          <Button className="w-full sm:w-auto">
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Cliente
          </Button>
        </Link>
      </div>

      <ClientesList clientes={clientes} />
    </div>
  )
}
