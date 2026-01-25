'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function actualizarSociedad(id: number, formData: FormData) {
  try {
    await prisma.sociedad.update({
      where: { id },
      data: {
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
        serieActual: formData.get('serieActual') as string,
        activa: formData.get('activa') === 'on',
      },
    })

    revalidatePath('/sociedades')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error actualizando sociedad:', error)
    return { success: false, error: 'Error al guardar los cambios' }
  }
}
