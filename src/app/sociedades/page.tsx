import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Button, Card } from '@/components/ui'

async function getSociedades() {
  return prisma.sociedad.findMany({
    orderBy: { nombre: 'asc' },
  })
}

export default async function SociedadesPage() {
  const sociedades = await getSociedades()

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zebra-dark">Sociedades</h1>
          <p className="text-zebra-gray mt-1">Gestiona los datos fiscales de tus empresas</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sociedades.map((sociedad) => (
          <Link key={sociedad.id} href={`/sociedades/${sociedad.id}`}>
            <Card clickable className="h-full">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-zebra-dark">
                    {sociedad.nombreComercial || sociedad.nombre}
                  </h3>
                  <p className="text-sm text-zebra-gray mt-1">{sociedad.nombre}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  sociedad.activa
                    ? 'bg-zebra-primary/10 text-zebra-primary-dark'
                    : 'bg-zebra-light text-zebra-gray'
                }`}>
                  {sociedad.activa ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-zebra-gray">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zebra-dark">NIF:</span>
                  <span>{sociedad.nif}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zebra-dark">Dirección:</span>
                  <span>{sociedad.direccion}, {sociedad.codigoPostal} {sociedad.ciudad}</span>
                </div>
                {sociedad.iban && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-zebra-dark">Cuenta:</span>
                    <span className="font-mono text-xs">{sociedad.iban}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-zebra-light">
                <p className="text-sm text-zebra-gray">
                  Serie actual: <span className="font-semibold">{sociedad.serieActual}</span>
                  {' • '}
                  Última factura: <span className="font-semibold">#{sociedad.ultimoNumero}</span>
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {sociedades.length === 0 && (
        <Card>
          <div className="text-center py-8">
            <p className="text-zebra-gray text-lg">No hay sociedades configuradas</p>
          </div>
        </Card>
      )}
    </div>
  )
}
