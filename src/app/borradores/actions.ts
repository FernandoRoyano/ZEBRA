'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function eliminarBorrador(facturaId: number) {
  try {
    const factura = await prisma.factura.findUnique({
      where: { id: facturaId },
    })

    if (!factura) {
      return { success: false, error: 'Borrador no encontrado' }
    }

    if (factura.estado !== 'BORRADOR') {
      return { success: false, error: 'Solo se pueden eliminar borradores' }
    }

    await prisma.factura.delete({
      where: { id: facturaId },
    })

    revalidatePath('/')
    revalidatePath('/borradores')
    revalidatePath('/facturas')

    return { success: true }
  } catch (error) {
    console.error('Error eliminando borrador:', error)
    return { success: false, error: 'Error al eliminar el borrador' }
  }
}

export async function emitirBorrador(facturaId: number) {
  try {
    const factura = await prisma.factura.findUnique({
      where: { id: facturaId },
      include: { sociedad: true },
    })

    if (!factura) {
      return { success: false, error: 'Borrador no encontrado' }
    }

    if (factura.estado !== 'BORRADOR') {
      return { success: false, error: 'Solo se pueden emitir borradores' }
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const sociedad = await tx.sociedad.findUnique({
        where: { id: factura.sociedadId },
      })

      if (!sociedad) throw new Error('Sociedad no encontrada')

      const nuevoNumero = sociedad.ultimoNumero + 1
      const año = factura.fechaEmision.getFullYear()
      const numeroCompleto = `${sociedad.serieActual}-${año}-${String(nuevoNumero).padStart(4, '0')}`

      await tx.factura.update({
        where: { id: facturaId },
        data: {
          estado: 'EMITIDA',
          numero: String(nuevoNumero),
          serie: sociedad.serieActual,
          numeroCompleto,
        },
      })

      await tx.sociedad.update({
        where: { id: factura.sociedadId },
        data: { ultimoNumero: nuevoNumero },
      })
    })

    revalidatePath('/')
    revalidatePath('/borradores')
    revalidatePath('/facturas')
    revalidatePath(`/factura/${facturaId}`)

    return { success: true, facturaId }
  } catch (error) {
    console.error('Error emitiendo borrador:', error)
    return { success: false, error: 'Error al emitir la factura' }
  }
}
