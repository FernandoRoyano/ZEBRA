import type { TDocumentDefinitions, Content, TableCell } from 'pdfmake/interfaces'

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
  logoUrl: string | null
  clausulaProteccionDatos: string | null
}

interface Cliente {
  nombre: string
  nif: string
  direccion: string
  codigoPostal: string
  ciudad: string
  provincia: string
}

interface LineaPresupuesto {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
  subtotal: number
}

interface PresupuestoData {
  numeroCompleto: string
  fechaEmision: Date
  fechaValidez: Date | null
  baseImponible: number
  totalIva: number
  totalPresupuesto: number
  notas: string | null
  condiciones: string | null
  sociedad: Sociedad
  cliente: Cliente
  lineas: LineaPresupuesto[]
}

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

async function loadLogoBuffer(logoUrl: string | null): Promise<Buffer | null> {
  if (!logoUrl) return null

  try {
    if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) {
      const response = await fetch(logoUrl)
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      const arrayBuffer = await response.arrayBuffer()
      return Buffer.from(arrayBuffer)
    } else {
      console.warn('Logo con ruta local no soportada en serverless:', logoUrl)
      return null
    }
  } catch (error) {
    console.warn('No se pudo cargar el logo:', logoUrl, error)
    return null
  }
}

export async function generarPresupuestoPDF(presupuesto: PresupuestoData): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PdfPrinter = require('pdfmake')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const vfsFonts = require('pdfmake/build/vfs_fonts')

  const fonts = {
    Roboto: {
      normal: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
      bold: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Medium.ttf'], 'base64'),
      italics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-Italic.ttf'], 'base64'),
      bolditalics: Buffer.from(vfsFonts.pdfMake.vfs['Roboto-MediumItalic.ttf'], 'base64'),
    },
  }

  const printer = new PdfPrinter(fonts)

  const nombreEmisor = presupuesto.sociedad.nombreComercial || presupuesto.sociedad.nombre
  const logoBuffer = await loadLogoBuffer(presupuesto.sociedad.logoUrl)

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
          logoBuffer
            ? {
                image: logoBuffer,
                width: 70,
                margin: [0, 0, 15, 0] as [number, number, number, number],
              }
            : { text: '', width: 0 },
          {
            width: '*',
            stack: [
              { text: nombreEmisor, style: 'companyName' },
              { text: presupuesto.sociedad.nif, style: 'companyInfo' },
              { text: presupuesto.sociedad.direccion, style: 'companyInfo' },
              {
                text: `${presupuesto.sociedad.codigoPostal} ${presupuesto.sociedad.ciudad}`,
                style: 'companyInfo',
              },
              presupuesto.sociedad.telefono
                ? { text: `Tel: ${presupuesto.sociedad.telefono}`, style: 'companyInfo' }
                : '',
              presupuesto.sociedad.email
                ? { text: presupuesto.sociedad.email, style: 'companyInfo' }
                : '',
            ].filter(Boolean) as Content[],
          },
          {
            width: 200,
            stack: [
              { text: 'PRESUPUESTO', style: 'invoiceTitle' },
              { text: presupuesto.numeroCompleto, style: 'invoiceNumber' },
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
              { text: 'PRESUPUESTO PARA:', style: 'sectionLabel' },
              { text: presupuesto.cliente.nombre, style: 'clientName' },
              { text: `NIF: ${presupuesto.cliente.nif}`, style: 'clientInfo' },
              { text: presupuesto.cliente.direccion, style: 'clientInfo' },
              {
                text: `${presupuesto.cliente.codigoPostal} ${presupuesto.cliente.ciudad}`,
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
                  { text: formatDate(presupuesto.fechaEmision), style: 'dateValue' },
                ],
              },
              presupuesto.fechaValidez
                ? {
                    columns: [
                      { text: 'Válido hasta:', width: 100, style: 'dateLabel' },
                      { text: formatDate(presupuesto.fechaValidez), style: 'dateValue' },
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
            [
              { text: 'DESCRIPCIÓN', style: 'tableHeader' },
              { text: 'CANT.', style: 'tableHeader', alignment: 'center' },
              { text: 'PRECIO', style: 'tableHeader', alignment: 'right' },
              { text: 'IVA', style: 'tableHeader', alignment: 'center' },
              { text: 'SUBTOTAL', style: 'tableHeader', alignment: 'right' },
            ] as TableCell[],
            ...presupuesto.lineas.map(
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
                  { text: formatCurrency(presupuesto.baseImponible), style: 'totalValue' },
                ],
                margin: [0, 5, 0, 0] as [number, number, number, number],
              },
              {
                columns: [
                  { text: 'IVA:', style: 'totalLabel' },
                  { text: formatCurrency(presupuesto.totalIva), style: 'totalValue' },
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
                  { text: formatCurrency(presupuesto.totalPresupuesto), style: 'grandTotalValue' },
                ],
              },
            ],
          },
        ],
        margin: [0, 20, 0, 30] as [number, number, number, number],
      },

      // Condiciones
      presupuesto.condiciones
        ? {
            stack: [
              { text: 'CONDICIONES', style: 'sectionLabel' },
              { text: presupuesto.condiciones, margin: [0, 5, 0, 0] as [number, number, number, number], color: '#374151' },
            ],
            margin: [0, 0, 0, 20] as [number, number, number, number],
          }
        : null,

      // Notas
      presupuesto.notas
        ? {
            stack: [
              { text: 'OBSERVACIONES', style: 'sectionLabel' },
              { text: presupuesto.notas, margin: [0, 5, 0, 0] as [number, number, number, number], color: '#6b7280' },
            ],
          }
        : null,

      // Cláusula de protección de datos
      presupuesto.sociedad.clausulaProteccionDatos
        ? {
            stack: [
              {
                canvas: [
                  { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 0.5, lineColor: '#e5e7eb' },
                ],
                margin: [0, 20, 0, 10] as [number, number, number, number],
              },
              { text: 'PROTECCIÓN DE DATOS', fontSize: 7, bold: true, color: '#9ca3af', margin: [0, 0, 0, 3] as [number, number, number, number] },
              { text: presupuesto.sociedad.clausulaProteccionDatos, fontSize: 7, color: '#9ca3af', lineHeight: 1.3 },
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
        color: '#009680',
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
