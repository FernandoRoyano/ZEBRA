'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function cambiarEstadoPresupuesto(presupuestoId: number, nuevoEstado: string) {
  try {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId },
    })

    if (!presupuesto) {
      return { success: false, error: 'Presupuesto no encontrado' }
    }

    await prisma.presupuesto.update({
      where: { id: presupuestoId },
      data: { estado: nuevoEstado },
    })

    revalidatePath(`/presupuesto/${presupuestoId}`)
    revalidatePath('/presupuestos')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error cambiando estado:', error)
    return { success: false, error: 'Error al cambiar el estado' }
  }
}

export async function emitirPresupuestoBorrador(presupuestoId: number) {
  try {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId },
      include: { sociedad: true },
    })

    if (!presupuesto) {
      return { success: false, error: 'Presupuesto no encontrado' }
    }

    if (presupuesto.estado !== 'BORRADOR') {
      return { success: false, error: 'Solo se pueden emitir borradores' }
    }

    const nuevoNumero = presupuesto.sociedad.ultimoNumeroPresupuesto + 1
    const año = presupuesto.fechaEmision.getFullYear()
    const numeroCompleto = `P-${año}-${String(nuevoNumero).padStart(4, '0')}`

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.presupuesto.update({
        where: { id: presupuestoId },
        data: {
          estado: 'ENVIADO',
          numero: String(nuevoNumero),
          numeroCompleto,
        },
      })

      await tx.sociedad.update({
        where: { id: presupuesto.sociedadId },
        data: { ultimoNumeroPresupuesto: nuevoNumero },
      })
    })

    revalidatePath(`/presupuesto/${presupuestoId}`)
    revalidatePath('/presupuestos')
    revalidatePath('/')

    return { success: true }
  } catch (error) {
    console.error('Error emitiendo presupuesto:', error)
    return { success: false, error: 'Error al emitir el presupuesto' }
  }
}

export async function eliminarPresupuesto(presupuestoId: number) {
  try {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId },
    })

    if (!presupuesto) {
      return { success: false, error: 'Presupuesto no encontrado' }
    }

    await prisma.presupuesto.delete({
      where: { id: presupuestoId },
    })

    revalidatePath('/')
    revalidatePath('/presupuestos')

    return { success: true }
  } catch (error) {
    console.error('Error eliminando presupuesto:', error)
    return { success: false, error: 'Error al eliminar el presupuesto' }
  }
}

export async function convertirAFactura(presupuestoId: number) {
  try {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId },
      include: {
        sociedad: true,
        lineas: { orderBy: { orden: 'asc' } },
      },
    })

    if (!presupuesto) {
      return { success: false, error: 'Presupuesto no encontrado' }
    }

    if (presupuesto.facturaId) {
      return { success: false, error: 'Este presupuesto ya fue convertido a factura' }
    }

    const nuevoNumeroFactura = presupuesto.sociedad.ultimoNumero + 1
    const año = new Date().getFullYear()
    const numeroCompletoFactura = `${presupuesto.sociedad.serieActual}-${año}-${String(nuevoNumeroFactura).padStart(4, '0')}`

    const fechaVencimiento = new Date()
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 30)

    const factura = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const nuevaFactura = await tx.factura.create({
        data: {
          numero: String(nuevoNumeroFactura),
          serie: presupuesto.sociedad.serieActual,
          numeroCompleto: numeroCompletoFactura,
          fechaEmision: new Date(),
          fechaVencimiento,
          estado: 'EMITIDA',
          baseImponible: presupuesto.baseImponible,
          totalIva: presupuesto.totalIva,
          totalFactura: presupuesto.totalPresupuesto,
          notas: presupuesto.notas,
          sociedadId: presupuesto.sociedadId,
          clienteId: presupuesto.clienteId,
          lineas: {
            create: presupuesto.lineas.map((linea) => ({
              descripcion: linea.descripcion,
              cantidad: linea.cantidad,
              precioUnitario: linea.precioUnitario,
              porcentajeIva: linea.porcentajeIva,
              subtotal: linea.subtotal,
              orden: linea.orden,
            })),
          },
        },
      })

      await tx.sociedad.update({
        where: { id: presupuesto.sociedadId },
        data: { ultimoNumero: nuevoNumeroFactura },
      })

      await tx.presupuesto.update({
        where: { id: presupuestoId },
        data: { facturaId: nuevaFactura.id },
      })

      return nuevaFactura
    })

    revalidatePath(`/presupuesto/${presupuestoId}`)
    revalidatePath('/presupuestos')
    revalidatePath('/facturas')
    revalidatePath('/')

    return { success: true, facturaId: factura.id }
  } catch (error) {
    console.error('Error convirtiendo a factura:', error)
    return { success: false, error: 'Error al convertir a factura' }
  }
}

export async function actualizarPresupuesto(
  presupuestoId: number,
  input: {
    fechaEmision: Date
    fechaValidez: Date
    notas: string | null
    condiciones: string | null
    lineas: {
      descripcion: string
      cantidad: number
      precioUnitario: number
      porcentajeIva: number
    }[]
  }
) {
  try {
    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId },
    })

    if (!presupuesto) {
      return { success: false, error: 'Presupuesto no encontrado' }
    }

    if (presupuesto.estado !== 'BORRADOR') {
      return { success: false, error: 'Solo se pueden editar borradores' }
    }

    const baseImponible = input.lineas.reduce(
      (total, linea) => total + linea.cantidad * linea.precioUnitario,
      0
    )
    const totalIva = input.lineas.reduce(
      (total, linea) =>
        total + (linea.cantidad * linea.precioUnitario * linea.porcentajeIva) / 100,
      0
    )
    const totalPresupuesto = baseImponible + totalIva

    const lineasData = input.lineas.map((linea, index) => ({
      descripcion: linea.descripcion,
      cantidad: linea.cantidad,
      precioUnitario: linea.precioUnitario,
      porcentajeIva: linea.porcentajeIva,
      subtotal: linea.cantidad * linea.precioUnitario,
      orden: index + 1,
    }))

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.lineaPresupuesto.deleteMany({
        where: { presupuestoId },
      })

      await tx.presupuesto.update({
        where: { id: presupuestoId },
        data: {
          fechaEmision: input.fechaEmision,
          fechaValidez: input.fechaValidez,
          notas: input.notas,
          condiciones: input.condiciones,
          baseImponible,
          totalIva,
          totalPresupuesto,
          lineas: { create: lineasData },
        },
      })
    })

    revalidatePath(`/presupuesto/${presupuestoId}`)
    revalidatePath('/presupuestos')

    return { success: true }
  } catch (error) {
    console.error('Error actualizando presupuesto:', error)
    return { success: false, error: 'Error al actualizar el presupuesto' }
  }
}
