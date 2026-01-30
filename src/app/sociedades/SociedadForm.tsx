'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button, Input, Card, Textarea } from '@/components/ui'
import { guardarSociedad } from './actions'
import LogoUploader from './[id]/LogoUploader'

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
  clausulaProteccionDatos: string | null
  activa: boolean
}

export default function SociedadForm({ sociedad }: { sociedad?: Sociedad }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [logoUrl, setLogoUrl] = useState<string | null>(sociedad?.logoUrl ?? null)

  const isEditing = !!sociedad

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError('')

    try {
      const result = await guardarSociedad(sociedad?.id, formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      }
      // Si no hay error, la función hace redirect
    } catch {
      setError('Error al guardar los cambios')
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
            defaultValue={sociedad?.nombre ?? ''}
            required
          />
          <Input
            name="nombreComercial"
            label="Nombre Comercial"
            defaultValue={sociedad?.nombreComercial ?? ''}
            helpText="Nombre que aparecerá en las facturas"
          />
        </div>

        <Input
          name="nif"
          label="NIF"
          defaultValue={sociedad?.nif ?? ''}
          required
        />

        <Input
          name="direccion"
          label="Dirección"
          defaultValue={sociedad?.direccion ?? ''}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Input
            name="codigoPostal"
            label="Código Postal"
            defaultValue={sociedad?.codigoPostal ?? ''}
            required
          />
          <Input
            name="ciudad"
            label="Ciudad"
            defaultValue={sociedad?.ciudad ?? ''}
            required
          />
          <Input
            name="provincia"
            label="Provincia"
            defaultValue={sociedad?.provincia ?? ''}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            name="telefono"
            label="Teléfono"
            type="tel"
            defaultValue={sociedad?.telefono ?? ''}
          />
          <Input
            name="email"
            label="Email"
            type="email"
            defaultValue={sociedad?.email ?? ''}
          />
        </div>

        <Input
          name="iban"
          label="Número de cuenta (IBAN)"
          defaultValue={sociedad?.iban ?? ''}
          helpText="Cuenta bancaria para recibir pagos"
          placeholder="ES00 0000 0000 0000 0000 0000"
        />

        <Input
          name="serieActual"
          label="Serie de facturas"
          defaultValue={sociedad?.serieActual ?? 'A'}
          required
          helpText="Letra o código que precede al número de factura"
        />

        <LogoUploader currentLogo={logoUrl} onLogoChange={setLogoUrl} />
        <input type="hidden" name="logoUrl" value={logoUrl || ''} />

        <Textarea
          name="clausulaProteccionDatos"
          label="Cláusula de protección de datos (LOPD/RGPD)"
          defaultValue={sociedad?.clausulaProteccionDatos ?? ''}
          placeholder="En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), le informamos de que sus datos personales serán tratados por..."
          rows={4}
        />

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="activa"
            id="activa"
            defaultChecked={sociedad?.activa ?? true}
            className="w-5 h-5 rounded border-zebra-border text-zebra-primary focus:ring-zebra-primary"
          />
          <label htmlFor="activa" className="text-base text-zebra-gray">
            Sociedad activa (aparece en el selector de nueva factura)
          </label>
        </div>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Crear sociedad'}
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
