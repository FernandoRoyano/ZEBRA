'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function eliminarSociedad(sociedadId: number) {
  try {
    // Verificar que la sociedad existe
    const sociedad = await prisma.sociedad.findUnique({
      where: { id: sociedadId },
      include: {
        _count: {
          select: { facturas: true },
        },
      },
    })

    if (!sociedad) {
      return { success: false, error: 'Sociedad no encontrada' }
    }

    // Verificar que no tiene facturas asociadas
    if (sociedad._count.facturas > 0) {
      return {
        success: false,
        error: `No se puede eliminar: tiene ${sociedad._count.facturas} factura(s) asociada(s)`,
      }
    }

    // Eliminar sociedad
    await prisma.sociedad.delete({
      where: { id: sociedadId },
    })

    revalidatePath('/')
    revalidatePath('/sociedades')

    return { success: true }
  } catch (error) {
    console.error('Error eliminando sociedad:', error)
    return { success: false, error: 'Error al eliminar la sociedad' }
  }
}
