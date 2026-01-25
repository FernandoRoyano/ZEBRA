import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed de la base de datos...')

  // Asociaciones y Sociedades reales
  const sociedades = [
    // Asociaciones
    {
      nombre: 'ASOCIACIÓN CULTURAL AIRES DEL PAS',
      nombreComercial: 'Aires del Pas',
      nif: 'G39867940',
      direccion: 'San Fernando 4A-10I',
      codigoPostal: '39010',
      ciudad: 'Santander',
      provincia: 'Cantabria',
      serieActual: 'A',
    },
    {
      nombre: 'ASOCIACIÓN DE COMERCIANTES DE CANTABRIA NORDESTE',
      nombreComercial: 'Comerciantes Cantabria NE',
      nif: 'G44749281',
      direccion: 'San Fernando 4A-10ºI',
      codigoPostal: '39010',
      ciudad: 'Santander',
      provincia: 'Cantabria',
      serieActual: 'B',
    },
    // Sociedades
    {
      nombre: 'ZEBRA PUBLICIDAD SL',
      nombreComercial: 'Zebra Publicidad',
      nif: 'B39302369',
      direccion: 'San Fernando 4A-10ºIZQ',
      codigoPostal: '39010',
      ciudad: 'Santander',
      provincia: 'Cantabria',
      serieActual: 'C',
    },
    {
      nombre: 'CARPE 18 SL',
      nombreComercial: 'Carpe 18',
      nif: 'B39868732',
      direccion: 'C/ La Habana Nº 9-3ºC',
      codigoPostal: '39008',
      ciudad: 'Santander',
      provincia: 'Cantabria',
      serieActual: 'D',
    },
  ]

  for (const sociedad of sociedades) {
    const existente = await prisma.sociedad.findUnique({
      where: { nif: sociedad.nif },
    })

    if (!existente) {
      await prisma.sociedad.create({
        data: sociedad,
      })
      console.log(`Creada sociedad: ${sociedad.nombre}`)
    } else {
      console.log(`Sociedad ya existe: ${sociedad.nombre}`)
    }
  }

  // Crear un cliente de ejemplo (administración pública)
  const clienteAdmin = await prisma.cliente.findFirst({
    where: { nif: 'P2807900E' },
  })

  if (!clienteAdmin) {
    await prisma.cliente.create({
      data: {
        nombre: 'Ayuntamiento de Madrid',
        nif: 'P2807900E',
        direccion: 'Plaza de la Villa, 4',
        codigoPostal: '28005',
        ciudad: 'Madrid',
        provincia: 'Madrid',
        esAdministracion: true,
        codigoDir3: 'L01280796',
        organoGestor: 'L01280796',
        unidadTramitadora: 'L01280796',
        oficinaContable: 'L01280796',
      },
    })
    console.log('Creado cliente: Ayuntamiento de Madrid')
  }

  // Crear un cliente de ejemplo (empresa privada)
  const clienteEmpresa = await prisma.cliente.findFirst({
    where: { nif: 'B98765432' },
  })

  if (!clienteEmpresa) {
    await prisma.cliente.create({
      data: {
        nombre: 'Empresa Ejemplo S.L.',
        nif: 'B98765432',
        direccion: 'Calle del Comercio 50',
        codigoPostal: '28006',
        ciudad: 'Madrid',
        provincia: 'Madrid',
        esAdministracion: false,
      },
    })
    console.log('Creado cliente: Empresa Ejemplo S.L.')
  }

  console.log('Seed completado!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
