'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function cambiarSociedadFactura(facturaId: number, nuevaSociedadId: number) {
  try {
    // Verificar que la factura existe
    const factura = await prisma.factura.findUnique({
      where: { id: facturaId },
    })

    if (!factura) {
      return { success: false, error: 'Factura no encontrada' }
    }

    // Verificar que la nueva sociedad existe
    const sociedad = await prisma.sociedad.findUnique({
      where: { id: nuevaSociedadId },
    })

    if (!sociedad) {
      return { success: false, error: 'Sociedad no encontrada' }
    }

    // Actualizar la factura con la nueva sociedad
    await prisma.factura.update({
      where: { id: facturaId },
      data: { sociedadId: nuevaSociedadId },
    })

    revalidatePath(`/factura/${facturaId}`)
    revalidatePath('/')
    revalidatePath('/facturas')

    return { success: true }
  } catch (error) {
    console.error('Error cambiando sociedad:', error)
    return { success: false, error: 'Error al cambiar la sociedad' }
  }
}

export async function eliminarFactura(facturaId: number) {
  try {
    // Verificar que la factura existe
    const factura = await prisma.factura.findUnique({
      where: { id: facturaId },
    })

    if (!factura) {
      return { success: false, error: 'Factura no encontrada' }
    }

    // Eliminar factura (las líneas y archivos se eliminan por cascade)
    await prisma.factura.delete({
      where: { id: facturaId },
    })

    revalidatePath('/')
    revalidatePath('/facturas')

    return { success: true }
  } catch (error) {
    console.error('Error eliminando factura:', error)
    return { success: false, error: 'Error al eliminar la factura' }
  }
}
