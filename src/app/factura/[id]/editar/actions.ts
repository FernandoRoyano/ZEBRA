'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

interface LineaInput {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
}

interface ActualizarBorradorInput {
  facturaId: number
  sociedadId: number
  clienteId: number
  fechaEmision: Date
  diasPago: number
  notas: string | null
  lineas: LineaInput[]
  emitir?: boolean
}

export async function actualizarBorrador(input: ActualizarBorradorInput) {
  try {
    const factura = await prisma.factura.findUnique({
      where: { id: input.facturaId },
    })

    if (!factura) return { success: false, error: 'Borrador no encontrado' }
    if (factura.estado !== 'BORRADOR') return { success: false, error: 'Solo se pueden editar borradores' }

    // Recalcular totales
    const baseImponible = input.lineas.reduce(
      (total, linea) => total + linea.cantidad * linea.precioUnitario,
      0
    )
    const totalIva = input.lineas.reduce(
      (total, linea) =>
        total + (linea.cantidad * linea.precioUnitario * linea.porcentajeIva) / 100,
      0
    )
    const totalFactura = baseImponible + totalIva

    const fechaVencimiento = new Date(input.fechaEmision)
    fechaVencimiento.setDate(fechaVencimiento.getDate() + input.diasPago)

    const lineasData = input.lineas.map((linea, index) => ({
      descripcion: linea.descripcion,
      cantidad: linea.cantidad,
      precioUnitario: linea.precioUnitario,
      porcentajeIva: linea.porcentajeIva,
      subtotal: linea.cantidad * linea.precioUnitario,
      orden: index + 1,
    }))

    if (input.emitir) {
      // Guardar y emitir en una transacción
      const sociedad = await prisma.sociedad.findUnique({
        where: { id: input.sociedadId },
      })
      if (!sociedad) return { success: false, error: 'Sociedad no encontrada' }

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.lineaFactura.deleteMany({ where: { facturaId: input.facturaId } })

        const nuevoNumero = sociedad.ultimoNumero + 1
        const año = input.fechaEmision.getFullYear()
        const numeroCompleto = `${sociedad.serieActual}-${año}-${String(nuevoNumero).padStart(4, '0')}`

        await tx.factura.update({
          where: { id: input.facturaId },
          data: {
            sociedadId: input.sociedadId,
            clienteId: input.clienteId,
            fechaEmision: input.fechaEmision,
            fechaVencimiento,
            diasPago: input.diasPago,
            notas: input.notas,
            baseImponible,
            totalIva,
            totalFactura,
            estado: 'EMITIDA',
            numero: String(nuevoNumero),
            serie: sociedad.serieActual,
            numeroCompleto,
            lineas: { create: lineasData },
          },
        })

        await tx.sociedad.update({
          where: { id: input.sociedadId },
          data: { ultimoNumero: nuevoNumero },
        })
      })
    } else {
      // Solo guardar como borrador
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.lineaFactura.deleteMany({ where: { facturaId: input.facturaId } })

        await tx.factura.update({
          where: { id: input.facturaId },
          data: {
            sociedadId: input.sociedadId,
            clienteId: input.clienteId,
            fechaEmision: input.fechaEmision,
            fechaVencimiento,
            diasPago: input.diasPago,
            notas: input.notas,
            baseImponible,
            totalIva,
            totalFactura,
            lineas: { create: lineasData },
          },
        })
      })
    }

    revalidatePath('/')
    revalidatePath('/borradores')
    revalidatePath('/facturas')
    revalidatePath(`/factura/${input.facturaId}`)

    return { success: true, facturaId: input.facturaId }
  } catch (error) {
    console.error('Error actualizando borrador:', error)
    return { success: false, error: 'Error al actualizar el borrador' }
  }
}
