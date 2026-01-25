-- CreateTable
CREATE TABLE "Sociedad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nombreComercial" TEXT,
    "nif" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'ESP',
    "telefono" TEXT,
    "email" TEXT,
    "iban" TEXT,
    "swift" TEXT,
    "logoUrl" TEXT,
    "ultimoNumero" INTEGER NOT NULL DEFAULT 0,
    "serieActual" TEXT NOT NULL DEFAULT 'A',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "nif" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "provincia" TEXT NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'ESP',
    "telefono" TEXT,
    "email" TEXT,
    "esAdministracion" BOOLEAN NOT NULL DEFAULT false,
    "codigoDir3" TEXT,
    "organoGestor" TEXT,
    "unidadTramitadora" TEXT,
    "oficinaContable" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Factura" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "serie" TEXT NOT NULL,
    "numeroCompleto" TEXT NOT NULL,
    "fechaEmision" DATETIME NOT NULL,
    "fechaVencimiento" DATETIME,
    "fechaOperacion" DATETIME,
    "estado" TEXT NOT NULL DEFAULT 'BORRADOR',
    "baseImponible" REAL NOT NULL,
    "totalIva" REAL NOT NULL,
    "totalFactura" REAL NOT NULL,
    "notas" TEXT,
    "formaPago" TEXT NOT NULL DEFAULT 'TRANSFERENCIA',
    "diasPago" INTEGER NOT NULL DEFAULT 30,
    "sociedadId" INTEGER NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Factura_sociedadId_fkey" FOREIGN KEY ("sociedadId") REFERENCES "Sociedad" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Factura_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "LineaFactura" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facturaId" INTEGER NOT NULL,
    "descripcion" TEXT NOT NULL,
    "cantidad" REAL NOT NULL,
    "precioUnitario" REAL NOT NULL,
    "descuento" REAL NOT NULL DEFAULT 0,
    "tipoIva" TEXT NOT NULL DEFAULT 'IVA',
    "porcentajeIva" REAL NOT NULL DEFAULT 21,
    "subtotal" REAL NOT NULL,
    "orden" INTEGER NOT NULL,
    CONSTRAINT "LineaFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ArchivoFactura" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facturaId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "rutaArchivo" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ArchivoFactura_facturaId_fkey" FOREIGN KEY ("facturaId") REFERENCES "Factura" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Sociedad_nif_key" ON "Sociedad"("nif");

-- CreateIndex
CREATE UNIQUE INDEX "Factura_numeroCompleto_key" ON "Factura"("numeroCompleto");
