import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generarPresupuestoPDF } from '@/lib/pdf/presupuesto-generator'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const presupuestoId = parseInt(id)

    const presupuesto = await prisma.presupuesto.findUnique({
      where: { id: presupuestoId },
      include: {
        sociedad: true,
        cliente: true,
        lineas: {
          orderBy: { orden: 'asc' },
        },
      },
    })

    if (!presupuesto) {
      return NextResponse.json(
        { error: 'Presupuesto no encontrado' },
        { status: 404 }
      )
    }

    const pdfBuffer = await generarPresupuestoPDF(presupuesto)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${presupuesto.numeroCompleto}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generando PDF de presupuesto:', error)
    return NextResponse.json(
      { error: 'Error al generar el PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
