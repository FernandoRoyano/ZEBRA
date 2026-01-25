'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card } from '@/components/ui'
import { actualizarSociedad } from './actions'
import LogoUploader from './LogoUploader'

interface Sociedad {
  id: number
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
  serieActual: string
  activa: boolean
}

export default function SociedadForm({ sociedad }: { sociedad: Sociedad }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(sociedad.logoUrl)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    try {
      const result = await actualizarSociedad(sociedad.id, formData)
      if (result.success) {
        router.push('/sociedades')
        router.refresh()
      } else {
        setError(result.error || 'Error al guardar')
      }
    } catch {
      setError('Error al guardar los cambios')
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="nombre"
            label="Razón Social"
            defaultValue={sociedad.nombre}
            required
          />
          <Input
            name="nombreComercial"
            label="Nombre Comercial"
            defaultValue={sociedad.nombreComercial || ''}
            helpText="Nombre que aparecerá en las facturas"
          />
        </div>

        <Input
          name="nif"
          label="NIF"
          defaultValue={sociedad.nif}
          required
        />

        <Input
          name="direccion"
          label="Dirección"
          defaultValue={sociedad.direccion}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            name="codigoPostal"
            label="Código Postal"
            defaultValue={sociedad.codigoPostal}
            required
          />
          <Input
            name="ciudad"
            label="Ciudad"
            defaultValue={sociedad.ciudad}
            required
          />
          <Input
            name="provincia"
            label="Provincia"
            defaultValue={sociedad.provincia}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="telefono"
            label="Teléfono"
            type="tel"
            defaultValue={sociedad.telefono || ''}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            defaultValue={sociedad.email || ''}
          />
        </div>

        <Input
          name="iban"
          label="Número de cuenta (IBAN)"
          defaultValue={sociedad.iban || ''}
          helpText="Cuenta bancaria para recibir pagos"
          placeholder="ES00 0000 0000 0000 0000 0000"
        />

        <Input
          name="serieActual"
          label="Serie de facturas"
          defaultValue={sociedad.serieActual}
          required
          helpText="Letra o código que precede al número de factura"
        />

        <LogoUploader currentLogo={logoUrl} onLogoChange={setLogoUrl} />
        <input type="hidden" name="logoUrl" value={logoUrl || ''} />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="activa"
            id="activa"
            defaultChecked={sociedad.activa}
            className="w-5 h-5 rounded border-zebra-border text-zebra-primary focus:ring-zebra-primary"
          />
          <label htmlFor="activa" className="text-base text-zebra-gray">
            Sociedad activa (aparece en el selector de nueva factura)
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar cambios'}
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
