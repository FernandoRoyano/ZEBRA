'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function guardarCliente(id: number | undefined, formData: FormData) {
  try {
    const data = {
      nombre: formData.get('nombre') as string,
      nif: formData.get('nif') as string,
      direccion: formData.get('direccion') as string,
      codigoPostal: formData.get('codigoPostal') as string,
      ciudad: formData.get('ciudad') as string,
      provincia: formData.get('provincia') as string,
      pais: (formData.get('pais') as string) || 'ESP',
      telefono: formData.get('telefono') as string || null,
      email: formData.get('email') as string || null,
      // Nuevos campos
      tipoEntidad: (formData.get('tipoEntidad') as string) || 'empresa',
      nombreComercial: formData.get('nombreComercial') as string || null,
      movil: formData.get('movil') as string || null,
      website: formData.get('website') as string || null,
      tags: formData.get('tags') as string || null,
      tipoContacto: (formData.get('tipoContacto') as string) || 'cliente',
      empresaAsociada: formData.get('empresaAsociada') as string || null,
      identVat: formData.get('identVat') as string || null,
      // Campos FACe
      esAdministracion: formData.get('esAdministracion') === 'on',
      codigoDir3: formData.get('codigoDir3') as string || null,
      organoGestor: formData.get('organoGestor') as string || null,
      unidadTramitadora: formData.get('unidadTramitadora') as string || null,
      oficinaContable: formData.get('oficinaContable') as string || null,
    }

    if (id) {
      await prisma.cliente.update({
        where: { id },
        data,
      })
    } else {
      await prisma.cliente.create({
        data,
      })
    }

    revalidatePath('/clientes')

    return { success: true }
  } catch (error) {
    console.error('Error guardando cliente:', error)
    return { success: false, error: 'Error al guardar el cliente' }
  }
}

export async function eliminarCliente(id: number) {
  try {
    // Verificar si tiene facturas
    const facturas = await prisma.factura.count({
      where: { clienteId: id },
    })

    if (facturas > 0) {
      return {
        success: false,
        error: `No se puede eliminar: el cliente tiene ${facturas} factura(s) asociada(s)`,
      }
    }

    await prisma.cliente.delete({
      where: { id },
    })

    revalidatePath('/clientes')

    return { success: true }
  } catch (error) {
    console.error('Error eliminando cliente:', error)
    return { success: false, error: 'Error al eliminar el cliente' }
  }
}
