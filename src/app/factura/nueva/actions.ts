'use server'

import { prisma } from '@/lib/prisma'
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

    // Calcular número de factura
    const nuevoNumero = sociedad.ultimoNumero + 1
    const año = input.fechaEmision.getFullYear()
    const numeroCompleto = `${sociedad.serieActual}-${año}-${String(nuevoNumero).padStart(4, '0')}`

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

    // Crear factura con transacción
    const factura = await prisma.$transaction(async (tx) => {
      // Crear factura
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
          lineas: {
            create: input.lineas.map((linea, index) => ({
              descripcion: linea.descripcion,
              cantidad: linea.cantidad,
              precioUnitario: linea.precioUnitario,
              porcentajeIva: linea.porcentajeIva,
              subtotal: linea.cantidad * linea.precioUnitario,
              orden: index + 1,
            })),
          },
        },
      })

      // Actualizar número de factura en sociedad
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
