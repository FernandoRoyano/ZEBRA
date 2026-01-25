'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, SearchBar } from '@/components/ui'

interface Cliente {
  id: number
  nombre: string
  nif: string
  direccion: string
  ciudad: string
  esAdministracion: boolean
  _count: {
    facturas: number
  }
}

export default function ClientesList({ clientes }: { clientes: Cliente[] }) {
  const [busqueda, setBusqueda] = useState('')

  const clientesFiltrados = clientes.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      cliente.nif.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <SearchBar
        placeholder="Buscar por nombre o NIF..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {clientesFiltrados.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-zebra-gray text-lg">
              {busqueda ? 'No se encontraron clientes' : 'No hay clientes guardados'}
            </p>
            {!busqueda && (
              <p className="text-zebra-gray/70 mt-1">
                Los clientes se guardan automáticamente al crear facturas
              </p>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clientesFiltrados.map((cliente) => (
            <Link key={cliente.id} href={`/clientes/${cliente.id}`}>
              <Card clickable className="h-full">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-zebra-dark">{cliente.nombre}</h3>
                    <p className="text-sm text-zebra-gray">NIF: {cliente.nif}</p>
                  </div>
                  {cliente.esAdministracion && (
                    <span className="px-2 py-1 bg-zebra-primary/10 text-zebra-primary-dark text-xs font-medium rounded-full">
                      FACe
                    </span>
                  )}
                </div>
                <p className="text-sm text-zebra-gray mt-2">
                  {cliente.direccion}, {cliente.ciudad}
                </p>
                <p className="text-sm text-zebra-gray/70 mt-2">
                  {cliente._count.facturas} factura{cliente._count.facturas !== 1 ? 's' : ''}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
