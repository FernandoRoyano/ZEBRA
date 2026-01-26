'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function guardarSociedad(id: number | undefined, formData: FormData) {
  try {
    const data = {
      nombre: formData.get('nombre') as string,
      nombreComercial: formData.get('nombreComercial') as string || null,
      nif: formData.get('nif') as string,
      direccion: formData.get('direccion') as string,
      codigoPostal: formData.get('codigoPostal') as string,
      ciudad: formData.get('ciudad') as string,
      provincia: formData.get('provincia') as string,
      telefono: formData.get('telefono') as string || null,
      email: formData.get('email') as string || null,
      iban: formData.get('iban') as string || null,
      logoUrl: formData.get('logoUrl') as string || null,
      serieActual: formData.get('serieActual') as string || 'A',
      activa: formData.get('activa') === 'on',
    }

    if (id) {
      await prisma.sociedad.update({ where: { id }, data })
    } else {
      await prisma.sociedad.create({ data })
    }

    revalidatePath('/sociedades')
    revalidatePath('/')
  } catch (error) {
    console.error('Error guardando sociedad:', error)
    return { success: false, error: 'Error al guardar la sociedad' }
  }

  redirect('/sociedades')
}

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
