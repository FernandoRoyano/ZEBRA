import type { TDocumentDefinitions, Content, TableCell } from 'pdfmake/interfaces'
import { readFile } from 'fs/promises'
import path from 'path'

interface Sociedad {
  nombre: string
  nombreComercial: string | null
  nif: string
  direccion: string
  codigoPostal: string
  ciudad: string
  provincia: string
  telefono: string | null
  email: string | null
  iban: string | null
  logoUrl: string | null
}

interface Cliente {
  nombre: string
  nif: string
  direccion: string
  codigoPostal: string
  ciudad: string
  provincia: string
}

interface LineaFactura {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
  subtotal: number
}

interface FacturaData {
  numeroCompleto: string
  fechaEmision: Date
  fechaVencimiento: Date | null
  baseImponible: number
  totalIva: number
  totalFactura: number
  notas: string | null
  sociedad: Sociedad
  cliente: Cliente
  lineas: LineaFactura[]
}

// Las fuentes se configuran dentro de generarFacturaPDF usando Buffers

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount)
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

async function loadImageAsBase64(logoUrl: string | null): Promise<string | null> {
  if (!logoUrl) return null

  try {
    const filePath = path.join(process.cwd(), 'public', logoUrl)
    const buffer = await readFile(filePath)
    const ext = logoUrl.split('.').pop()?.toLowerCase() || 'png'
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : `image/${ext}`
    return `data:${mimeType};base64,${buffer.toString('base64')}`
  } catch {
    console.warn('No se pudo cargar el logo:', logoUrl)
    return null
  }
}

export async function generarFacturaPDF(factura: FacturaData): Promise<Buffer> {
  // pdfmake 0.2.x - importar y configurar fuentes como Buffers
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PdfPrinter = require('pdfmake')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const vfsFonts = require('pdfmake/build/vfs_fonts')

  // Convertir fuentes de base64 a Buffer para Node.js
  const fonts = {
    Roboto: {
      normal: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
      bold: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
      italics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
      bolditalics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-MediumItalic.ttf'], 'base64'),
    },
  }

  const printer = new PdfPrinter(fonts)

  const nombreEmisor = factura.sociedad.nombreComercial || factura.sociedad.nombre
  const logoBase64 = await loadImageAsBase64(factura.sociedad.logoUrl)

  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 40, 40, 60],
    defaultStyle: {
      font: 'Roboto',
      fontSize: 10,
    },
    content: [
      // Cabecera con datos del emisor
      {
        columns: [
          // Logo (si existe)
          logoBase64
            ? {
                image: logoBase64,
                width: 70,
                margin: [0, 0, 15, 0] as [number, number, number, number],
              }
            : { text: '', width: 0 },
          // Datos empresa
          {
            width: '*',
            stack: [
              { text: nombreEmisor, style: 'companyName' },
              { text: factura.sociedad.nif, style: 'companyInfo' },
              { text: factura.sociedad.direccion, style: 'companyInfo' },
              {
                text: `${factura.sociedad.codigoPostal} ${factura.sociedad.ciudad}`,
                style: 'companyInfo',
              },
              factura.sociedad.telefono
                ? { text: `Tel: ${factura.sociedad.telefono}`, style: 'companyInfo' }
                : '',
              factura.sociedad.email
                ? { text: factura.sociedad.email, style: 'companyInfo' }
                : '',
            ].filter(Boolean) as Content[],
          },
          // Número factura
          {
            width: 200,
            stack: [
              { text: 'FACTURA', style: 'invoiceTitle' },
              { text: factura.numeroCompleto, style: 'invoiceNumber' },
            ],
          },
        ],
      },

      // Línea separadora
      {
        canvas: [
          {
            type: 'line',
            x1: 0,
            y1: 10,
            x2: 515,
            y2: 10,
            lineWidth: 1,
            lineColor: '#e5e7eb',
          },
        ],
        margin: [0, 10, 0, 20] as [number, number, number, number],
      },

      // Datos del cliente y fechas
      {
        columns: [
          {
            width: '*',
            stack: [
              { text: 'FACTURAR A:', style: 'sectionLabel' },
              { text: factura.cliente.nombre, style: 'clientName' },
              { text: `NIF: ${factura.cliente.nif}`, style: 'clientInfo' },
              { text: factura.cliente.direccion, style: 'clientInfo' },
              {
                text: `${factura.cliente.codigoPostal} ${factura.cliente.ciudad}`,
                style: 'clientInfo',
              },
            ],
          },
          {
            width: 180,
            stack: [
              {
                columns: [
                  { text: 'Fecha emisión:', width: 100, style: 'dateLabel' },
                  { text: formatDate(factura.fechaEmision), style: 'dateValue' },
                ],
              },
              factura.fechaVencimiento
                ? {
                    columns: [
                      { text: 'Fecha vencimiento:', width: 100, style: 'dateLabel' },
                      { text: formatDate(factura.fechaVencimiento), style: 'dateValue' },
                    ],
                  }
                : null,
            ].filter(Boolean) as Content[],
          },
        ],
        margin: [0, 0, 0, 30] as [number, number, number, number],
      },

      // Tabla de conceptos
      {
        table: {
          headerRows: 1,
          widths: ['*', 50, 70, 50, 80],
          body: [
            // Header
            [
              { text: 'DESCRIPCIÓN', style: 'tableHeader' },
              { text: 'CANT.', style: 'tableHeader', alignment: 'center' },
              { text: 'PRECIO', style: 'tableHeader', alignment: 'right' },
              { text: 'IVA', style: 'tableHeader', alignment: 'center' },
              { text: 'SUBTOTAL', style: 'tableHeader', alignment: 'right' },
            ] as TableCell[],
            // Items
            ...factura.lineas.map(
              (linea) =>
                [
                  { text: linea.descripcion, style: 'tableCell' },
                  { text: String(linea.cantidad), style: 'tableCell', alignment: 'center' },
                  {
                    text: formatCurrency(linea.precioUnitario),
                    style: 'tableCell',
                    alignment: 'right',
                  },
                  { text: `${linea.porcentajeIva}%`, style: 'tableCell', alignment: 'center' },
                  {
                    text: formatCurrency(linea.subtotal),
                    style: 'tableCell',
                    alignment: 'right',
                  },
                ] as TableCell[]
            ),
          ],
        },
        layout: {
          hLineWidth: (i: number, node: { table: { body: unknown[] } }) =>
            i === 0 || i === 1 || i === node.table.body.length ? 1 : 0,
          vLineWidth: () => 0,
          hLineColor: () => '#e5e7eb',
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
      },

      // Totales
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 200,
            stack: [
              {
                columns: [
                  { text: 'Base imponible:', style: 'totalLabel' },
                  { text: formatCurrency(factura.baseImponible), style: 'totalValue' },
                ],
                margin: [0, 5, 0, 0] as [number, number, number, number],
              },
              {
                columns: [
                  { text: 'IVA:', style: 'totalLabel' },
                  { text: formatCurrency(factura.totalIva), style: 'totalValue' },
                ],
                margin: [0, 5, 0, 0] as [number, number, number, number],
              },
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 200, y2: 0, lineWidth: 1, lineColor: '#374151' },
                ],
                margin: [0, 10, 0, 5] as [number, number, number, number],
              },
              {
                columns: [
                  { text: 'TOTAL:', style: 'grandTotalLabel' },
                  { text: formatCurrency(factura.totalFactura), style: 'grandTotalValue' },
                ],
              },
            ],
          },
        ],
        margin: [0, 20, 0, 30] as [number, number, number, number],
      },

      // Datos de pago
      factura.sociedad.iban
        ? {
            stack: [
              { text: 'FORMA DE PAGO', style: 'sectionLabel' },
              { text: 'Transferencia bancaria', margin: [0, 5, 0, 0] as [number, number, number, number] },
              {
                text: `IBAN: ${factura.sociedad.iban}`,
                style: 'ibanText',
                margin: [0, 5, 0, 0] as [number, number, number, number],
              },
            ],
            margin: [0, 0, 0, 20] as [number, number, number, number],
          }
        : null,

      // Notas
      factura.notas
        ? {
            stack: [
              { text: 'OBSERVACIONES', style: 'sectionLabel' },
              { text: factura.notas, margin: [0, 5, 0, 0] as [number, number, number, number], color: '#6b7280' },
            ],
          }
        : null,
    ].filter(Boolean) as Content[],

    styles: {
      companyName: {
        fontSize: 18,
        bold: true,
        color: '#1f2937',
      },
      companyInfo: {
        fontSize: 9,
        color: '#6b7280',
        margin: [0, 2, 0, 0] as [number, number, number, number],
      },
      invoiceTitle: {
        fontSize: 24,
        bold: true,
        color: '#2563eb',
        alignment: 'right',
      },
      invoiceNumber: {
        fontSize: 14,
        color: '#374151',
        alignment: 'right',
        margin: [0, 5, 0, 0] as [number, number, number, number],
      },
      sectionLabel: {
        fontSize: 9,
        bold: true,
        color: '#6b7280',
        margin: [0, 0, 0, 5] as [number, number, number, number],
      },
      clientName: {
        fontSize: 12,
        bold: true,
        color: '#1f2937',
      },
      clientInfo: {
        fontSize: 10,
        color: '#374151',
        margin: [0, 2, 0, 0] as [number, number, number, number],
      },
      dateLabel: {
        fontSize: 9,
        color: '#6b7280',
      },
      dateValue: {
        fontSize: 10,
        color: '#1f2937',
        alignment: 'right',
      },
      tableHeader: {
        fontSize: 9,
        bold: true,
        color: '#374151',
        fillColor: '#f3f4f6',
      },
      tableCell: {
        fontSize: 10,
        color: '#1f2937',
      },
      totalLabel: {
        fontSize: 10,
        color: '#6b7280',
      },
      totalValue: {
        fontSize: 10,
        color: '#1f2937',
        alignment: 'right',
      },
      grandTotalLabel: {
        fontSize: 12,
        bold: true,
        color: '#1f2937',
      },
      grandTotalValue: {
        fontSize: 14,
        bold: true,
        color: '#1f2937',
        alignment: 'right',
      },
      ibanText: {
        fontSize: 11,
        font: 'Roboto',
        color: '#1f2937',
      },
    },
  }

  return new Promise((resolve, reject) => {
    try {
      const pdfDoc = printer.createPdfKitDocument(docDefinition)
      const chunks: Buffer[] = []

      pdfDoc.on('data', (chunk: Buffer) => {
        chunks.push(chunk)
      })

      pdfDoc.on('end', () => {
        const result = Buffer.concat(chunks)
        resolve(result)
      })

      pdfDoc.on('error', reject)

      pdfDoc.end()
    } catch (error) {
      reject(error)
    }
  })
}
