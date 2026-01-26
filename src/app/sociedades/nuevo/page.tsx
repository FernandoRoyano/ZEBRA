import SociedadForm from '../SociedadForm'

export default function NuevaSociedadPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zebra-dark">Nueva Sociedad</h1>
        <p className="text-zebra-gray mt-1">Registra una nueva empresa emisora de facturas</p>
      </div>

      <SociedadForm />
    </div>
  )
}
