import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generarFacturaeXML } from '@/lib/facturae/generator'

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

    const xml = generarFacturaeXML(factura)

    return new NextResponse(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="${factura.numeroCompleto}.xml"`,
      },
    })
  } catch (error) {
    console.error('Error generando XML:', error)
    return NextResponse.json(
      { error: 'Error al generar el XML' },
      { status: 500 }
    )
  }
}
