'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'
import { guardarCliente } from './actions'

interface Cliente {
  id: number
  nombre: string
  nif: string
  direccion: string
  codigoPostal: string
  ciudad: string
  provincia: string
  telefono: string | null
  email: string | null
  esAdministracion: boolean
  codigoDir3: string | null
  organoGestor: string | null
  unidadTramitadora: string | null
  oficinaContable: string | null
}

export default function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [esAdmin, setEsAdmin] = useState(cliente?.esAdministracion || false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    try {
      const result = await guardarCliente(cliente?.id, formData)
      if (result.success) {
        router.push('/clientes')
        router.refresh()
      } else {
        setError(result.error || 'Error al guardar')
      }
    } catch {
      setError('Error al guardar el cliente')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit}>
      <Card className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <Input
          name="nombre"
          label="Nombre o Razón Social"
          defaultValue={cliente?.nombre || ''}
          required
        />

        <Input
          name="nif"
          label="NIF / CIF"
          defaultValue={cliente?.nif || ''}
          required
        />

        <Input
          name="direccion"
          label="Dirección"
          defaultValue={cliente?.direccion || ''}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            name="codigoPostal"
            label="Código Postal"
            defaultValue={cliente?.codigoPostal || ''}
            required
          />
          <Input
            name="ciudad"
            label="Ciudad"
            defaultValue={cliente?.ciudad || ''}
            required
          />
          <Input
            name="provincia"
            label="Provincia"
            defaultValue={cliente?.provincia || ''}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="telefono"
            label="Teléfono"
            type="tel"
            defaultValue={cliente?.telefono || ''}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            defaultValue={cliente?.email || ''}
          />
        </div>

        {/* Sección FACe */}
        <div className="pt-4 border-t border-zebra-border">
          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox"
              name="esAdministracion"
              id="esAdministracion"
              checked={esAdmin}
              onChange={(e) => setEsAdmin(e.target.checked)}
              className="w-5 h-5 rounded border-zebra-border text-zebra-primary focus:ring-zebra-primary"
            />
            <label htmlFor="esAdministracion" className="text-base text-zebra-gray">
              Es una Administración Pública (facturación electrónica FACe)
            </label>
          </div>

          {esAdmin && (
            <div className="space-y-4 p-4 bg-zebra-primary/5 rounded-lg">
              <p className="text-sm text-zebra-primary-dark mb-4">
                Introduce los códigos DIR3 para la facturación electrónica.
                Puedes encontrarlos en el directorio DIR3.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="oficinaContable"
                  label="Oficina Contable"
                  defaultValue={cliente?.oficinaContable || ''}
                  placeholder="Ej: L01280796"
                />
                <Input
                  name="organoGestor"
                  label="Órgano Gestor"
                  defaultValue={cliente?.organoGestor || ''}
                  placeholder="Ej: L01280796"
                />
                <Input
                  name="unidadTramitadora"
                  label="Unidad Tramitadora"
                  defaultValue={cliente?.unidadTramitadora || ''}
                  placeholder="Ej: L01280796"
                />
                <Input
                  name="codigoDir3"
                  label="Código DIR3 General"
                  defaultValue={cliente?.codigoDir3 || ''}
                  placeholder="Ej: L01280796"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : cliente ? 'Guardar cambios' : 'Crear cliente'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
        </div>
      </Card>
    </form>
  )
}
