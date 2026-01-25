import { create } from 'xmlbuilder2'

interface Sociedad {
  nombre: string
  nombreComercial: string | null
  nif: string
  direccion: string
  codigoPostal: string
  ciudad: string
  provincia: string
  pais: string
  telefono: string | null
  email: string | null
  iban: string | null
}

interface Cliente {
  nombre: string
  nif: string
  direccion: string
  codigoPostal: string
  ciudad: string
  provincia: string
  pais: string
  esAdministracion: boolean
  codigoDir3: string | null
  organoGestor: string | null
  unidadTramitadora: string | null
  oficinaContable: string | null
}

interface LineaFactura {
  descripcion: string
  cantidad: number
  precioUnitario: number
  porcentajeIva: number
  subtotal: number
}

interface FacturaData {
  id: number
  numero: string
  serie: string
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

function formatAmount(amount: number): string {
  return amount.toFixed(2)
}

function formatDate(date: Date): string {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function generarFacturaeXML(factura: FacturaData): string {
  const nifEmisor = factura.sociedad.nif.replace(/^ES/i, '')
  const nifCliente = factura.cliente.nif.replace(/^ES/i, '')

  // Agrupar líneas por tipo de IVA
  const ivasPorTipo = factura.lineas.reduce(
    (acc, linea) => {
      const key = linea.porcentajeIva
      if (!acc[key]) {
        acc[key] = { base: 0, cuota: 0 }
      }
      acc[key].base += linea.subtotal
      acc[key].cuota += (linea.subtotal * linea.porcentajeIva) / 100
      return acc
    },
    {} as Record<number, { base: number; cuota: number }>
  )

  const root = create({ version: '1.0', encoding: 'UTF-8' })
    .ele('fe:Facturae', {
      'xmlns:ds': 'http://www.w3.org/2000/09/xmldsig#',
      'xmlns:fe': 'http://www.facturae.gob.es/formato/Versiones/Facturaev3_2_2',
    })

  // FileHeader
  const fileHeader = root.ele('FileHeader')
  fileHeader.ele('SchemaVersion').txt('3.2.2')
  fileHeader.ele('Modality').txt('I') // Individual
  fileHeader.ele('InvoiceIssuerType').txt('EM') // Emisor

  const batch = fileHeader.ele('Batch')
  batch.ele('BatchIdentifier').txt(`ES${nifEmisor}${factura.numeroCompleto}`)
  batch.ele('InvoicesCount').txt('1')

  const totalInvoicesAmount = batch.ele('TotalInvoicesAmount')
  totalInvoicesAmount.ele('TotalAmount').txt(formatAmount(factura.totalFactura))

  const totalOutstandingAmount = batch.ele('TotalOutstandingAmount')
  totalOutstandingAmount.ele('TotalAmount').txt(formatAmount(factura.totalFactura))

  const totalExecutableAmount = batch.ele('TotalExecutableAmount')
  totalExecutableAmount.ele('TotalAmount').txt(formatAmount(factura.totalFactura))

  batch.ele('InvoiceCurrencyCode').txt('EUR')

  // Parties
  const parties = root.ele('Parties')

  // SellerParty (Emisor)
  const sellerParty = parties.ele('SellerParty')
  const sellerTaxId = sellerParty.ele('TaxIdentification')
  sellerTaxId.ele('PersonTypeCode').txt('J') // Jurídica
  sellerTaxId.ele('ResidenceTypeCode').txt('R') // Residente
  sellerTaxId.ele('TaxIdentificationNumber').txt(`ES${nifEmisor}`)

  const sellerLegalEntity = sellerParty.ele('LegalEntity')
  sellerLegalEntity.ele('CorporateName').txt(factura.sociedad.nombre)
  if (factura.sociedad.nombreComercial) {
    sellerLegalEntity.ele('TradeName').txt(factura.sociedad.nombreComercial)
  }

  const sellerAddress = sellerLegalEntity.ele('AddressInSpain')
  sellerAddress.ele('Address').txt(factura.sociedad.direccion)
  sellerAddress.ele('PostCode').txt(factura.sociedad.codigoPostal)
  sellerAddress.ele('Town').txt(factura.sociedad.ciudad)
  sellerAddress.ele('Province').txt(factura.sociedad.provincia)
  sellerAddress.ele('CountryCode').txt(factura.sociedad.pais || 'ESP')

  // BuyerParty (Cliente)
  const buyerParty = parties.ele('BuyerParty')
  const buyerTaxId = buyerParty.ele('TaxIdentification')
  buyerTaxId.ele('PersonTypeCode').txt('J') // Jurídica (asumimos)
  buyerTaxId.ele('ResidenceTypeCode').txt('R')
  buyerTaxId.ele('TaxIdentificationNumber').txt(`ES${nifCliente}`)

  // Administrative centres (para FACe)
  if (factura.cliente.esAdministracion) {
    const adminCentres = buyerParty.ele('AdministrativeCentres')

    // Oficina contable
    if (factura.cliente.oficinaContable) {
      const centre1 = adminCentres.ele('AdministrativeCentre')
      centre1.ele('CentreCode').txt(factura.cliente.oficinaContable)
      centre1.ele('RoleTypeCode').txt('01') // Oficina contable
      centre1.ele('Name').txt('Oficina Contable')
    }

    // Órgano gestor
    if (factura.cliente.organoGestor) {
      const centre2 = adminCentres.ele('AdministrativeCentre')
      centre2.ele('CentreCode').txt(factura.cliente.organoGestor)
      centre2.ele('RoleTypeCode').txt('02') // Órgano gestor
      centre2.ele('Name').txt('Órgano Gestor')
    }

    // Unidad tramitadora
    if (factura.cliente.unidadTramitadora) {
      const centre3 = adminCentres.ele('AdministrativeCentre')
      centre3.ele('CentreCode').txt(factura.cliente.unidadTramitadora)
      centre3.ele('RoleTypeCode').txt('03') // Unidad tramitadora
      centre3.ele('Name').txt('Unidad Tramitadora')
    }
  }

  const buyerLegalEntity = buyerParty.ele('LegalEntity')
  buyerLegalEntity.ele('CorporateName').txt(factura.cliente.nombre)

  const buyerAddress = buyerLegalEntity.ele('AddressInSpain')
  buyerAddress.ele('Address').txt(factura.cliente.direccion)
  buyerAddress.ele('PostCode').txt(factura.cliente.codigoPostal)
  buyerAddress.ele('Town').txt(factura.cliente.ciudad)
  buyerAddress.ele('Province').txt(factura.cliente.provincia)
  buyerAddress.ele('CountryCode').txt(factura.cliente.pais || 'ESP')

  // Invoices
  const invoices = root.ele('Invoices')
  const invoice = invoices.ele('Invoice')

  // InvoiceHeader
  const invoiceHeader = invoice.ele('InvoiceHeader')
  invoiceHeader.ele('InvoiceNumber').txt(factura.numero)
  invoiceHeader.ele('InvoiceSeriesCode').txt(factura.serie)
  invoiceHeader.ele('InvoiceDocumentType').txt('FC') // Factura completa
  invoiceHeader.ele('InvoiceClass').txt('OO') // Original

  // InvoiceIssueData
  const issueData = invoice.ele('InvoiceIssueData')
  issueData.ele('IssueDate').txt(formatDate(factura.fechaEmision))
  issueData.ele('InvoiceCurrencyCode').txt('EUR')
  issueData.ele('TaxCurrencyCode').txt('EUR')
  issueData.ele('LanguageName').txt('es')

  // TaxesOutputs
  const taxesOutputs = invoice.ele('TaxesOutputs')
  for (const [porcentaje, { base, cuota }] of Object.entries(ivasPorTipo)) {
    const tax = taxesOutputs.ele('Tax')
    tax.ele('TaxTypeCode').txt('01') // IVA
    tax.ele('TaxRate').txt(formatAmount(parseFloat(porcentaje)))
    const taxableBase = tax.ele('TaxableBase')
    taxableBase.ele('TotalAmount').txt(formatAmount(base))
    const taxAmount = tax.ele('TaxAmount')
    taxAmount.ele('TotalAmount').txt(formatAmount(cuota))
  }

  // InvoiceTotals
  const totals = invoice.ele('InvoiceTotals')
  totals.ele('TotalGrossAmount').txt(formatAmount(factura.baseImponible))
  totals.ele('TotalGrossAmountBeforeTaxes').txt(formatAmount(factura.baseImponible))
  totals.ele('TotalTaxOutputs').txt(formatAmount(factura.totalIva))
  totals.ele('TotalTaxesWithheld').txt('0.00')
  totals.ele('InvoiceTotal').txt(formatAmount(factura.totalFactura))
  totals.ele('TotalOutstandingAmount').txt(formatAmount(factura.totalFactura))
  totals.ele('TotalExecutableAmount').txt(formatAmount(factura.totalFactura))

  // Items
  const items = invoice.ele('Items')
  factura.lineas.forEach((linea, index) => {
    const invoiceLine = items.ele('InvoiceLine')
    invoiceLine.ele('ItemDescription').txt(linea.descripcion)
    invoiceLine.ele('Quantity').txt(formatAmount(linea.cantidad))
    invoiceLine.ele('UnitOfMeasure').txt('01') // Unidades
    invoiceLine.ele('UnitPriceWithoutTax').txt(formatAmount(linea.precioUnitario))
    invoiceLine.ele('TotalCost').txt(formatAmount(linea.subtotal))
    invoiceLine.ele('GrossAmount').txt(formatAmount(linea.subtotal))

    const lineTaxes = invoiceLine.ele('TaxesOutputs')
    const lineTax = lineTaxes.ele('Tax')
    lineTax.ele('TaxTypeCode').txt('01')
    lineTax.ele('TaxRate').txt(formatAmount(linea.porcentajeIva))
    const lineBase = lineTax.ele('TaxableBase')
    lineBase.ele('TotalAmount').txt(formatAmount(linea.subtotal))
    const lineAmount = lineTax.ele('TaxAmount')
    lineAmount.ele('TotalAmount').txt(formatAmount((linea.subtotal * linea.porcentajeIva) / 100))
  })

  // PaymentDetails
  if (factura.sociedad.iban) {
    const paymentDetails = invoice.ele('PaymentDetails')
    const installment = paymentDetails.ele('Installment')
    installment
      .ele('InstallmentDueDate')
      .txt(formatDate(factura.fechaVencimiento || factura.fechaEmision))
    installment.ele('InstallmentAmount').txt(formatAmount(factura.totalFactura))
    installment.ele('PaymentMeans').txt('04') // Transferencia
    const account = installment.ele('AccountToBeCredited')
    // Formatear IBAN sin espacios
    account.ele('IBAN').txt(factura.sociedad.iban.replace(/\s/g, ''))
  }

  // AdditionalData (notas)
  if (factura.notas) {
    const additionalData = invoice.ele('AdditionalData')
    additionalData.ele('InvoiceAdditionalInformation').txt(factura.notas)
  }

  return root.end({ prettyPrint: true })
}
