import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generarFacturaPDF } from '@/lib/pdf/generator'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const facturaId = parseInt(id)

    const factura = await prisma.factura.findUnique({
      where: { id: facturaId },
      include: {
        sociedad: true,
        cliente: true,
        lineas: {
          orderBy: { orden: 'asc' },
        },
      },
    })

    if (!factura) {
      return NextResponse.json(
        { error: 'Factura no encontrada' },
        { status: 404 }
      )
    }

    const pdfBuffer = await generarFacturaPDF(factura)

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${factura.numeroCompleto}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generando PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar el PDF', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
