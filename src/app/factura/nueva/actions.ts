'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

interface LineaFacturaInput {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
}

interface CrearFacturaInput {
  sociedadId: number
  clienteId: number
  fechaEmision: Date
  diasPago: number
  notas: string | null
  lineas: LineaFacturaInput[]
  comoBorrador?: boolean
}

export async function crearFactura(input: CrearFacturaInput) {
  try {
    // Obtener sociedad para número de factura
    const sociedad = await prisma.sociedad.findUnique({
      where: { id: input.sociedadId },
    })

    if (!sociedad) {
      return { success: false, error: 'Sociedad no encontrada' }
    }

    // Calcular totales
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

    // Calcular fecha de vencimiento
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

    if (input.comoBorrador) {
      // Crear como borrador: sin número secuencial
      const factura = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const nuevaFactura = await tx.factura.create({
          data: {
            numero: '0',
            serie: sociedad.serieActual,
            numeroCompleto: `BORRADOR-TEMP-${Date.now()}`,
            fechaEmision: input.fechaEmision,
            fechaVencimiento,
            estado: 'BORRADOR',
            baseImponible,
            totalIva,
            totalFactura,
            notas: input.notas,
            diasPago: input.diasPago,
            sociedadId: input.sociedadId,
            clienteId: input.clienteId,
            lineas: { create: lineasData },
          },
        })

        await tx.factura.update({
          where: { id: nuevaFactura.id },
          data: { numeroCompleto: `BORRADOR-${nuevaFactura.id}` },
        })

        return nuevaFactura
      })

      revalidatePath('/')
      revalidatePath('/facturas')
      revalidatePath('/borradores')

      return { success: true, facturaId: factura.id }
    }

    // Crear como emitida: con número secuencial
    const nuevoNumero = sociedad.ultimoNumero + 1
    const año = input.fechaEmision.getFullYear()
    const numeroCompleto = `${sociedad.serieActual}-${año}-${String(nuevoNumero).padStart(4, '0')}`

    const factura = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const nuevaFactura = await tx.factura.create({
        data: {
          numero: String(nuevoNumero),
          serie: sociedad.serieActual,
          numeroCompleto,
          fechaEmision: input.fechaEmision,
          fechaVencimiento,
          estado: 'EMITIDA',
          baseImponible,
          totalIva,
          totalFactura,
          notas: input.notas,
          diasPago: input.diasPago,
          sociedadId: input.sociedadId,
          clienteId: input.clienteId,
          lineas: { create: lineasData },
        },
      })

      await tx.sociedad.update({
        where: { id: input.sociedadId },
        data: { ultimoNumero: nuevoNumero },
      })

      return nuevaFactura
    })

    revalidatePath('/')
    revalidatePath('/facturas')

    return { success: true, facturaId: factura.id }
  } catch (error) {
    console.error('Error creando factura:', error)
    return { success: false, error: 'Error al crear la factura' }
  }
}
