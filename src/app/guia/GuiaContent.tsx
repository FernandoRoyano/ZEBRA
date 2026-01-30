'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'

interface SeccionGuia {
  id: string
  titulo: string
  icono: React.ReactNode
  contenido: React.ReactNode
}

const secciones: SeccionGuia[] = [
  {
    id: 'inicio',
    titulo: 'Panel principal (Inicio)',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          El panel principal es tu punto de partida. Te da la bienvenida con un saludo personalizado y te ofrece un resumen completo de la actividad financiera de tu negocio.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Panel de Finanzas</p>
              <p className="text-sm text-zebra-gray">En la parte superior encontrarás 3 tarjetas con los datos financieros clave: <strong>Ingresos</strong> (verde), <strong>Gastos</strong> (rojo) y <strong>Beneficio</strong> (ingresos menos gastos). Puedes cambiar el periodo entre <strong>&quot;Mes actual&quot;</strong> y <strong>&quot;Últimos 30 días&quot;</strong> con el desplegable de la esquina.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Tarjetas de resumen</p>
              <p className="text-sm text-zebra-gray">Debajo del panel de finanzas verás 4 tarjetas con: total de facturas emitidas, facturas del mes actual, número de clientes y el total facturado en euros.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Gráfico de los últimos 12 meses</p>
              <p className="text-sm text-zebra-gray">Un gráfico de barras agrupadas te muestra la evolución de <strong>ingresos</strong> (verde) y <strong>gastos</strong> (rojo) mes a mes durante el último año. Pasa el ratón sobre las barras para ver los importes exactos.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p className="font-medium text-zebra-dark">Facturación por entidad</p>
              <p className="text-sm text-zebra-gray">Se muestra un desglose de la facturación acumulada por cada sociedad/asociación que tengas registrada.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">5</span>
            <div>
              <p className="font-medium text-zebra-dark">Accesos rápidos y últimas facturas</p>
              <p className="text-sm text-zebra-gray">Cada sociedad activa tiene un botón para crear una factura directamente. Al final del panel verás una tabla con las 5 facturas más recientes.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'clientes',
    titulo: 'Gestión de clientes',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          Gestiona tus contactos comerciales: clientes, proveedores, leads y más. Puedes registrarlos como empresa o persona.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Vista de tabla</p>
              <p className="text-sm text-zebra-gray">La sección <strong>&quot;Clientes&quot;</strong> muestra todos tus contactos en una tabla con columnas: Nombre, ID (NIF), Email, Teléfono, Población, Tags y Tipo. Puedes buscar por nombre, NIF, email o tags.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Personalizar columnas</p>
              <p className="text-sm text-zebra-gray">Pulsa el botón <strong>&quot;Columnas&quot;</strong> para mostrar u ocultar las columnas que prefieras. Tu selección se guarda automáticamente para la próxima vez.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Crear un nuevo contacto</p>
              <p className="text-sm text-zebra-gray">Pulsa <strong>&quot;Nuevo Cliente&quot;</strong> y selecciona si es <strong>Empresa</strong> o <strong>Persona</strong>:</p>
              <ul className="mt-2 text-sm text-zebra-gray list-disc list-inside space-y-1">
                <li><strong>Empresa:</strong> Razón social, NIF/CIF, identificación VAT, nombre comercial, dirección completa, datos de contacto (email, teléfono, móvil, website), tags y tipo de contacto.</li>
                <li><strong>Persona:</strong> Nombre completo, NIF/DNI, empresa a la que pertenece, nombre comercial, dirección completa, datos de contacto, tags y tipo de contacto.</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p className="font-medium text-zebra-dark">Tipo de contacto</p>
              <p className="text-sm text-zebra-gray">Cada contacto puede clasificarse como:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">Cliente</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Proveedor</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">Lead</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">Deudor</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">Acreedor</span>
                <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Sin especificar</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">5</span>
            <div>
              <p className="font-medium text-zebra-dark">Tags</p>
              <p className="text-sm text-zebra-gray">Añade etiquetas a tus contactos para organizarlos mejor (ej: &quot;vip&quot;, &quot;mayorista&quot;, &quot;diseño&quot;). Separa los tags con comas. Aparecerán como badges de color en la tabla.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">6</span>
            <div>
              <p className="font-medium text-zebra-dark">Editar un contacto</p>
              <p className="text-sm text-zebra-gray">Haz clic en cualquier fila de la tabla para acceder a su ficha y modificar sus datos. Los cambios se guardan al pulsar &quot;Guardar cambios&quot;.</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Consejo:</strong> Si el contacto es una Administración Pública, marca la casilla correspondiente en el formulario para habilitar los campos de facturación electrónica FACe (códigos DIR3).
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'gastos',
    titulo: 'Gestión de gastos',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          Registra y controla los gastos de tu negocio. Los gastos se reflejan automáticamente en el panel de finanzas del inicio y en el gráfico de los últimos 12 meses.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Ver gastos</p>
              <p className="text-sm text-zebra-gray">La sección <strong>&quot;Gastos&quot;</strong> muestra una tabla con todos los gastos registrados: concepto, importe, fecha, categoría, proveedor y sociedad. En la parte inferior verás el total acumulado.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Crear un nuevo gasto</p>
              <p className="text-sm text-zebra-gray">Pulsa <strong>&quot;Nuevo Gasto&quot;</strong> y rellena los datos:</p>
              <ul className="mt-1 text-sm text-zebra-gray list-disc list-inside space-y-1">
                <li><strong>Concepto:</strong> Descripción breve del gasto (obligatorio)</li>
                <li><strong>Importe:</strong> Cantidad en euros (obligatorio)</li>
                <li><strong>Fecha:</strong> Fecha del gasto (obligatorio)</li>
                <li><strong>Categoría:</strong> Material, Servicios, Personal, Alquiler, Suministros, Transporte u Otros</li>
                <li><strong>Proveedor:</strong> Nombre del proveedor (opcional)</li>
                <li><strong>Sociedad:</strong> Sociedad a la que se asigna el gasto (obligatorio)</li>
                <li><strong>Descripción:</strong> Notas adicionales (opcional)</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Editar o eliminar</p>
              <p className="text-sm text-zebra-gray">Cada gasto tiene botones de edición y eliminación en la columna de acciones. Al eliminar, se pide confirmación antes de borrar.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p className="font-medium text-zebra-dark">Búsqueda</p>
              <p className="text-sm text-zebra-gray">Utiliza la barra de búsqueda superior para filtrar gastos por concepto, proveedor o categoría.</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Consejo:</strong> Registra los gastos de forma regular para que el panel de finanzas del inicio refleje datos reales de tu beneficio (ingresos - gastos).
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'presupuestos',
    titulo: 'Presupuestos',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          Los presupuestos son documentos previos a la factura que envías a tus clientes para que aprueben un trabajo o servicio antes de realizarlo.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Crear un presupuesto</p>
              <p className="text-sm text-zebra-gray">Ve a <strong>&quot;Presupuestos&quot;</strong> en el menú y pulsa <strong>&quot;Nuevo Presupuesto&quot;</strong>. El proceso es similar a crear una factura: selecciona sociedad, cliente y añade las líneas con conceptos, cantidades y precios. Adicionalmente puedes añadir <strong>condiciones</strong> del presupuesto y <strong>días de validez</strong>.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Estados del presupuesto</p>
              <p className="text-sm text-zebra-gray">Un presupuesto pasa por varios estados:</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-700">Borrador</span>
                  <span className="text-sm text-zebra-gray">Presupuesto en preparación, editable</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Enviado</span>
                  <span className="text-sm text-zebra-gray">Enviado al cliente, esperando respuesta</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-700">Aceptado</span>
                  <span className="text-sm text-zebra-gray">El cliente ha aceptado el presupuesto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Rechazado</span>
                  <span className="text-sm text-zebra-gray">El cliente ha rechazado el presupuesto</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-orange-100 text-orange-700">Expirado</span>
                  <span className="text-sm text-zebra-gray">Ha pasado la fecha de validez</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Convertir a factura</p>
              <p className="text-sm text-zebra-gray">Cuando un presupuesto es <strong>aceptado</strong>, puedes convertirlo en factura directamente pulsando el botón <strong>&quot;Convertir a factura&quot;</strong>. Se creará una factura con los mismos datos y líneas del presupuesto. El presupuesto quedará vinculado a la factura generada.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p className="font-medium text-zebra-dark">Descargar PDF</p>
              <p className="text-sm text-zebra-gray">Desde la vista de detalle de cualquier presupuesto emitido puedes descargar su PDF. El documento lleva el título &quot;PRESUPUESTO&quot; e incluye los conceptos, totales, condiciones y la cláusula de protección de datos si está configurada.</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Consejo:</strong> La numeración de presupuestos es independiente de las facturas. Los presupuestos usan el formato P-AÑO-NÚMERO (ej: P-2026-0001).
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'crear-factura',
    titulo: 'Crear una factura',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          Para crear una factura, ve a <strong>&quot;Nueva Factura&quot;</strong> en el menú lateral. El proceso se divide en pasos claros:
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Selecciona la sociedad emisora</p>
              <p className="text-sm text-zebra-gray">Elige desde qué sociedad o asociación quieres emitir la factura. Si solo tienes una, se seleccionará automáticamente.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Selecciona el cliente</p>
              <p className="text-sm text-zebra-gray">Elige el cliente destinatario de la factura. Puedes buscar por nombre o NIF. Si el cliente no existe, puedes crearlo desde la sección de Clientes.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Añade las líneas de la factura</p>
              <p className="text-sm text-zebra-gray">Agrega los conceptos, cantidades, precios unitarios e IVA de cada línea. Puedes añadir tantas líneas como necesites. El total se calcula automáticamente.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p className="font-medium text-zebra-dark">Revisa y emite</p>
              <p className="text-sm text-zebra-gray">Revisa todos los datos antes de emitir. Puedes guardarla como <strong>borrador</strong> para editarla después, o <strong>emitirla</strong> directamente. Una vez emitida, se genera automáticamente el número de factura y se crean los archivos PDF y XML.</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Consejo:</strong> Si no tienes todos los datos listos, guarda la factura como borrador. Podrás editarla y completarla más adelante desde la sección de Borradores.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'borradores',
    titulo: 'Borradores',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          Los borradores son facturas que aún no han sido emitidas. Son útiles cuando necesitas preparar una factura pero todavía no tienes todos los datos.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Ver borradores</p>
              <p className="text-sm text-zebra-gray">Accede a la sección <strong>&quot;Borradores&quot;</strong> del menú para ver todos tus borradores pendientes. Cada uno muestra el cliente, sociedad, fecha y total estimado.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Editar un borrador</p>
              <p className="text-sm text-zebra-gray">Haz clic en el borrador para abrirlo. Desde la vista de detalle podrás editar todos sus campos: cliente, líneas, importes, etc.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Emitir un borrador</p>
              <p className="text-sm text-zebra-gray">Cuando estés listo, pulsa <strong>&quot;Emitir factura&quot;</strong>. Se le asignará un número de factura definitivo y se generarán los archivos PDF y XML automáticamente.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p className="font-medium text-zebra-dark">Eliminar un borrador</p>
              <p className="text-sm text-zebra-gray">Si ya no necesitas un borrador, puedes eliminarlo directamente desde la lista de borradores pulsando el botón de eliminar.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'historial',
    titulo: 'Historial de facturas',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          El historial muestra todas las facturas emitidas. Puedes buscar, filtrar, descargar y eliminar facturas.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Filtros de búsqueda</p>
              <p className="text-sm text-zebra-gray">Utiliza los filtros superiores para buscar por número de factura o nombre del cliente, filtrar por sociedad emisora, o seleccionar un mes concreto.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Estados de la factura</p>
              <p className="text-sm text-zebra-gray">Cada factura tiene un estado identificado por colores:</p>
              <div className="mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">Emitida</span>
                  <span className="text-sm text-zebra-gray">Factura creada y lista para enviar</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-yellow-50 text-yellow-700 border border-yellow-200">Enviada</span>
                  <span className="text-sm text-zebra-gray">Factura ya enviada al cliente</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-zebra-primary/10 text-zebra-primary-dark border border-zebra-primary/20">Pagada</span>
                  <span className="text-sm text-zebra-gray">Factura cobrada</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-50 text-red-700 border border-red-200">Anulada</span>
                  <span className="text-sm text-zebra-gray">Factura cancelada</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Descargar PDF y XML</p>
              <p className="text-sm text-zebra-gray">En la columna de acciones de cada factura encontrarás botones para descargar el PDF (para enviar al cliente) y el XML (formato FACe para administraciones públicas).</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p className="font-medium text-zebra-dark">Eliminar una factura</p>
              <p className="text-sm text-zebra-gray">Pulsa el icono de papelera en la columna de acciones. Aparecerá un mensaje de confirmación antes de eliminar. <strong>Esta acción no se puede deshacer.</strong></p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">5</span>
            <div>
              <p className="font-medium text-zebra-dark">Resumen inferior</p>
              <p className="text-sm text-zebra-gray">En la parte inferior de la tabla verás el número de facturas mostradas y el total acumulado de las facturas filtradas.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'sociedades',
    titulo: 'Gestión de sociedades',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          Las sociedades son las entidades emisoras de tus facturas. Puedes tener varias sociedades o asociaciones y facturar desde cualquiera de ellas.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Ver sociedades</p>
              <p className="text-sm text-zebra-gray">La sección <strong>&quot;Sociedades&quot;</strong> muestra todas tus entidades emisoras con su nombre, NIF, y el total facturado.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Crear una sociedad</p>
              <p className="text-sm text-zebra-gray">Pulsa <strong>&quot;Nueva sociedad&quot;</strong> y rellena: nombre fiscal, nombre comercial (opcional), NIF/CIF, dirección completa, email, teléfono y el prefijo para la numeración de facturas.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Logo de la sociedad</p>
              <p className="text-sm text-zebra-gray">Puedes subir un logo que aparecerá en los PDFs de las facturas emitidas por esa sociedad. El logo se muestra en la cabecera de la factura.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">4</span>
            <div>
              <p className="font-medium text-zebra-dark">Prefijo de facturación</p>
              <p className="text-sm text-zebra-gray">Cada sociedad tiene un prefijo único (ej: &quot;FAC&quot;, &quot;ASO&quot;). Las facturas se numeran automáticamente con este prefijo seguido de un número secuencial (ej: FAC-001, FAC-002...).</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">5</span>
            <div>
              <p className="font-medium text-zebra-dark">Editar o eliminar</p>
              <p className="text-sm text-zebra-gray">Haz clic en una sociedad para editar sus datos. También puedes eliminarla si no tiene facturas asociadas.</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'proteccion-datos',
    titulo: 'Cláusula de protección de datos',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          Puedes configurar un texto legal de protección de datos (LOPD/RGPD) para que aparezca automáticamente al pie de tus facturas y presupuestos en PDF.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Configurar la cláusula</p>
              <p className="text-sm text-zebra-gray">Ve a <strong>&quot;Sociedades&quot;</strong>, edita la sociedad deseada, y rellena el campo <strong>&quot;Cláusula de protección de datos (LOPD/RGPD)&quot;</strong> con el texto legal que quieras incluir.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Aparición en PDFs</p>
              <p className="text-sm text-zebra-gray">Si la sociedad tiene una cláusula configurada, aparecerá automáticamente en letra pequeña al pie de todos los PDFs de facturas y presupuestos emitidos por esa sociedad.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Texto sugerido</p>
              <p className="text-sm text-zebra-gray">El campo incluye un placeholder con un ejemplo de cláusula RGPD que puedes adaptar a tu empresa. Recuerda sustituir los datos entre corchetes por los de tu sociedad.</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <strong>Importante:</strong> La cláusula es opcional. Si no la configuras, no se mostrará ningún texto legal al pie de los documentos. Cada sociedad puede tener su propia cláusula personalizada.
          </p>
        </div>
      </div>
    ),
  },
  {
    id: 'pdf-xml',
    titulo: 'Descargas: PDF y XML (FACe)',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    contenido: (
      <div className="space-y-4">
        <p className="text-zebra-gray">
          ZEBRA genera automáticamente los archivos PDF y XML de cada factura emitida.
        </p>
        <div className="space-y-3">
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">1</span>
            <div>
              <p className="font-medium text-zebra-dark">Descargar PDF</p>
              <p className="text-sm text-zebra-gray">El PDF es el formato estándar para enviar facturas a clientes. Incluye la cabecera con el logo de la sociedad, los datos del emisor y receptor, las líneas de detalle, los totales con desglose de IVA, y la información fiscal.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">2</span>
            <div>
              <p className="font-medium text-zebra-dark">Descargar XML (FACe)</p>
              <p className="text-sm text-zebra-gray">El archivo XML en formato FacturaE/FACe es necesario para presentar facturas a administraciones públicas españolas. Solo está disponible cuando el cliente es una administración pública.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-zebra-primary/10 text-zebra-primary flex items-center justify-center text-sm font-bold">3</span>
            <div>
              <p className="font-medium text-zebra-dark">Dónde descargar</p>
              <p className="text-sm text-zebra-gray">Puedes descargar los archivos desde dos sitios:</p>
              <ul className="mt-1 text-sm text-zebra-gray list-disc list-inside space-y-1">
                <li><strong>Historial de facturas:</strong> Usa los iconos de descarga en la columna de acciones de cada fila</li>
                <li><strong>Detalle de factura:</strong> Abre cualquier factura haciendo clic en su número para acceder a los botones de descarga</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-700">
            <strong>Nota:</strong> El botón de XML solo aparece para facturas cuyo cliente sea una administración pública (marcada con la casilla FACe activada).
          </p>
        </div>
      </div>
    ),
  },
]

export default function GuiaContent() {
  const [seccionAbierta, setSeccionAbierta] = useState<string | null>('inicio')

  function toggleSeccion(id: string) {
    setSeccionAbierta(seccionAbierta === id ? null : id)
  }

  return (
    <div className="space-y-3">
      {secciones.map((seccion) => {
        const abierta = seccionAbierta === seccion.id
        return (
          <Card key={seccion.id}>
            <button
              onClick={() => toggleSeccion(seccion.id)}
              className="w-full flex items-center gap-4 text-left"
            >
              <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${abierta ? 'bg-zebra-primary text-white' : 'bg-zebra-light text-zebra-primary'}`}>
                {seccion.icono}
              </div>
              <span className="flex-1 text-lg font-semibold text-zebra-dark">
                {seccion.titulo}
              </span>
              <svg
                className={`w-5 h-5 text-zebra-gray transition-transform duration-200 ${abierta ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${abierta ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
              <div className="overflow-hidden">
                <div className={`pt-4 mt-4 border-t border-zebra-border transition-opacity duration-300 ${abierta ? 'opacity-100' : 'opacity-0'}`}>
                  {seccion.contenido}
                </div>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
