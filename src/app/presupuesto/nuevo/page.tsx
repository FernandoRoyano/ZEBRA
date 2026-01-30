import { prisma } from '@/lib/prisma'
import PresupuestoWizard from './PresupuestoWizard'

async function getData() {
  const [sociedades, clientes] = await Promise.all([
    prisma.sociedad.findMany({
      where: { activa: true },
      select: {
        id: true,
        nombre: true,
        nombreComercial: true,
        nif: true,
        serieActual: true,
        ultimoNumeroPresupuesto: true,
      },
      orderBy: { nombre: 'asc' },
    }),
    prisma.cliente.findMany({
      select: {
        id: true,
        nombre: true,
        nif: true,
        direccion: true,
        ciudad: true,
        esAdministracion: true,
      },
      orderBy: { nombre: 'asc' },
    }),
  ])

  return { sociedades, clientes }
}

export default async function NuevoPresupuestoPage() {
  const { sociedades, clientes } = await getData()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-zebra-dark">Nuevo Presupuesto</h1>
      <PresupuestoWizard sociedades={sociedades} clientes={clientes} />
    </div>
  )
}
