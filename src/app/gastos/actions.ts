'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function guardarGasto(id: number | undefined, formData: FormData) {
  try {
    const data = {
      concepto: formData.get('concepto') as string,
      descripcion: formData.get('descripcion') as string || null,
      importe: parseFloat(formData.get('importe') as string),
      fecha: new Date(formData.get('fecha') as string),
      categoria: formData.get('categoria') as string || null,
      proveedor: formData.get('proveedor') as string || null,
      sociedadId: parseInt(formData.get('sociedadId') as string),
    }

    if (isNaN(data.importe) || data.importe <= 0) {
      return { success: false, error: 'El importe debe ser un número positivo' }
    }

    if (isNaN(data.sociedadId)) {
      return { success: false, error: 'Debes seleccionar una sociedad' }
    }

    if (id) {
      await prisma.gasto.update({
        where: { id },
        data,
      })
    } else {
      await prisma.gasto.create({
        data,
      })
    }

    revalidatePath('/gastos')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error guardando gasto:', error)
    return { success: false, error: 'Error al guardar el gasto' }
  }
}

export async function eliminarGasto(id: number) {
  try {
    await prisma.gasto.delete({
      where: { id },
    })

    revalidatePath('/gastos')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error eliminando gasto:', error)
    return { success: false, error: 'Error al eliminar el gasto' }
  }
}
