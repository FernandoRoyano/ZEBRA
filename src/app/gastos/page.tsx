import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui'
import GastosList from './GastosList'

async function getGastos() {
  return prisma.gasto.findMany({
    orderBy: { fecha: 'desc' },
    include: {
      sociedad: {
        select: { nombre: true, nombreComercial: true },
      },
    },
  })
}

export default async function GastosPage() {
  const gastos = await getGastos()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">Gastos</h1>
          <p className="text-zebra-gray mt-1">Gestiona los gastos de tu negocio</p>
        </div>
        <Link href="/gastos/nuevo">
          <Button>
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Gasto
          </Button>
        </Link>
      </div>

      <GastosList gastos={gastos} />
    </div>
  )
}
