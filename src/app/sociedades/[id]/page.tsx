import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SociedadForm from '../SociedadForm'
import DeleteSociedadButton from './DeleteButton'

async function getSociedad(id: number) {
  return prisma.sociedad.findUnique({
    where: { id },
  })
}

export default async function EditarSociedadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const sociedad = await getSociedad(parseInt(id))

  if (!sociedad) {
    notFound()
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">Editar Sociedad</h1>
          <p className="text-zebra-gray mt-1">Modifica los datos fiscales de {sociedad.nombreComercial || sociedad.nombre}</p>
        </div>
        <DeleteSociedadButton
          sociedadId={sociedad.id}
          nombreSociedad={sociedad.nombreComercial || sociedad.nombre}
        />
      </div>

      <SociedadForm sociedad={sociedad} />
    </div>
  )
}
