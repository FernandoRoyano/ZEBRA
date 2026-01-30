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
  pais: string
  telefono: string | null
  email: string | null
  tipoEntidad: string
  nombreComercial: string | null
  movil: string | null
  website: string | null
  tags: string | null
  tipoContacto: string
  empresaAsociada: string | null
  identVat: string | null
  esAdministracion: boolean
  codigoDir3: string | null
  organoGestor: string | null
  unidadTramitadora: string | null
  oficinaContable: string | null
}

const TIPOS_CONTACTO = [
  { value: 'cliente', label: 'Cliente' },
  { value: 'proveedor', label: 'Proveedor' },
  { value: 'lead', label: 'Lead' },
  { value: 'deudor', label: 'Deudor' },
  { value: 'acreedor', label: 'Acreedor' },
  { value: 'sin_especificar', label: 'Sin especificar' },
]

export default function ClienteForm({ cliente }: { cliente?: Cliente }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [tipoEntidad, setTipoEntidad] = useState(cliente?.tipoEntidad || 'empresa')
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
      <input type="hidden" name="tipoEntidad" value={tipoEntidad} />

      <Card className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Toggle Empresa / Persona */}
        <div>
          <label className="block text-sm font-medium text-zebra-dark mb-2">Tipo de entidad</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTipoEntidad('empresa')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tipoEntidad === 'empresa'
                  ? 'bg-zebra-primary text-white shadow-md'
                  : 'bg-zebra-light text-zebra-gray hover:bg-zebra-border'
              }`}
            >
              Empresa
            </button>
            <button
              type="button"
              onClick={() => setTipoEntidad('persona')}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tipoEntidad === 'persona'
                  ? 'bg-zebra-primary text-white shadow-md'
                  : 'bg-zebra-light text-zebra-gray hover:bg-zebra-border'
              }`}
            >
              Persona
            </button>
          </div>
        </div>

        {/* Nombre */}
        <Input
          name="nombre"
          label={tipoEntidad === 'empresa' ? 'Razón Social' : 'Nombre completo'}
          defaultValue={cliente?.nombre || ''}
          required
        />

        {/* NIF */}
        <Input
          name="nif"
          label={tipoEntidad === 'empresa' ? 'NIF / CIF' : 'NIF / DNI'}
          defaultValue={cliente?.nif || ''}
          required
        />

        {/* Solo Empresa: Identificación VAT */}
        {tipoEntidad === 'empresa' && (
          <Input
            name="identVat"
            label="Identificación VAT"
            defaultValue={cliente?.identVat || ''}
            placeholder="Ej: ESB12345678"
          />
        )}

        {/* Solo Persona: Empresa asociada */}
        {tipoEntidad === 'persona' && (
          <Input
            name="empresaAsociada"
            label="Empresa"
            defaultValue={cliente?.empresaAsociada || ''}
            placeholder="Empresa a la que pertenece"
          />
        )}

        {/* Nombre comercial */}
        <Input
          name="nombreComercial"
          label="Nombre comercial"
          defaultValue={cliente?.nombreComercial || ''}
        />

        {/* Dirección */}
        <div className="pt-4 border-t border-zebra-border">
          <h3 className="text-base font-semibold text-zebra-dark mb-4">Dirección</h3>
          <div className="space-y-4">
            <Input
              name="direccion"
              label="Dirección"
              defaultValue={cliente?.direccion || ''}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="ciudad"
                label="Población"
                defaultValue={cliente?.ciudad || ''}
                required
              />
              <Input
                name="codigoPostal"
                label="Código postal"
                defaultValue={cliente?.codigoPostal || ''}
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="provincia"
                label="Provincia"
                defaultValue={cliente?.provincia || ''}
                required
              />
              <Input
                name="pais"
                label="País"
                defaultValue={cliente?.pais || 'ESP'}
              />
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div className="pt-4 border-t border-zebra-border">
          <h3 className="text-base font-semibold text-zebra-dark mb-4">Datos de contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="email"
              label="Email"
              type="email"
              defaultValue={cliente?.email || ''}
            />
            <Input
              name="telefono"
              label="Teléfono"
              type="tel"
              defaultValue={cliente?.telefono || ''}
            />
            <Input
              name="movil"
              label="Móvil"
              type="tel"
              defaultValue={cliente?.movil || ''}
            />
            <Input
              name="website"
              label="Website"
              defaultValue={cliente?.website || ''}
              placeholder="https://..."
            />
          </div>
        </div>

        {/* Tags y Tipo de contacto */}
        <div className="pt-4 border-t border-zebra-border">
          <h3 className="text-base font-semibold text-zebra-dark mb-4">Clasificación</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="tags"
              label="Tags"
              defaultValue={cliente?.tags || ''}
              placeholder="Separar con comas: vip, mayorista..."
            />
            <div>
              <label htmlFor="tipoContacto" className="block text-sm font-medium text-zebra-dark mb-1.5">
                Tipo de contacto
              </label>
              <select
                name="tipoContacto"
                id="tipoContacto"
                defaultValue={cliente?.tipoContacto || 'cliente'}
                className="w-full px-4 py-2.5 rounded-lg border border-zebra-border bg-white text-zebra-dark focus:outline-none focus:ring-2 focus:ring-zebra-primary/30 focus:border-zebra-primary transition-colors"
              >
                {TIPOS_CONTACTO.map((tipo) => (
                  <option key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
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
