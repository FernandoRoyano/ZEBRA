'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'

interface LineaPresupuestoInput {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
}

interface CrearPresupuestoInput {
  sociedadId: number
  clienteId: number
  fechaEmision: Date
  fechaValidez: Date
  notas: string | null
  condiciones: string | null
  lineas: LineaPresupuestoInput[]
  comoBorrador?: boolean
}

export async function crearPresupuesto(input: CrearPresupuestoInput) {
  try {
    const sociedad = await prisma.sociedad.findUnique({
      where: { id: input.sociedadId },
    })

    if (!sociedad) {
      return { success: false, error: 'Sociedad no encontrada' }
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

    if (input.comoBorrador) {
      const presupuesto = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const nuevo = await tx.presupuesto.create({
          data: {
            numero: '0',
            serie: 'P',
            numeroCompleto: `BORRADOR-P-TEMP-${Date.now()}`,
            fechaEmision: input.fechaEmision,
            fechaValidez: input.fechaValidez,
            estado: 'BORRADOR',
            baseImponible,
            totalIva,
            totalPresupuesto,
            notas: input.notas,
            condiciones: input.condiciones,
            sociedadId: input.sociedadId,
            clienteId: input.clienteId,
            lineas: { create: lineasData },
          },
        })

        await tx.presupuesto.update({
          where: { id: nuevo.id },
          data: { numeroCompleto: `BORRADOR-P-${nuevo.id}` },
        })

        return nuevo
      })

      revalidatePath('/')
      revalidatePath('/presupuestos')

      return { success: true, presupuestoId: presupuesto.id }
    }

    // Crear con número secuencial
    const nuevoNumero = sociedad.ultimoNumeroPresupuesto + 1
    const año = input.fechaEmision.getFullYear()
    const numeroCompleto = `P-${año}-${String(nuevoNumero).padStart(4, '0')}`

    const presupuesto = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const nuevo = await tx.presupuesto.create({
        data: {
          numero: String(nuevoNumero),
          serie: 'P',
          numeroCompleto,
          fechaEmision: input.fechaEmision,
          fechaValidez: input.fechaValidez,
          estado: 'ENVIADO',
          baseImponible,
          totalIva,
          totalPresupuesto,
          notas: input.notas,
          condiciones: input.condiciones,
          sociedadId: input.sociedadId,
          clienteId: input.clienteId,
          lineas: { create: lineasData },
        },
      })

      await tx.sociedad.update({
        where: { id: input.sociedadId },
        data: { ultimoNumeroPresupuesto: nuevoNumero },
      })

      return nuevo
    })

    revalidatePath('/')
    revalidatePath('/presupuestos')

    return { success: true, presupuestoId: presupuesto.id }
  } catch (error) {
    console.error('Error creando presupuesto:', error)
    return { success: false, error: 'Error al crear el presupuesto' }
  }
}
