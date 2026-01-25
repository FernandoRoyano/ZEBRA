import ClienteForm from '../ClienteForm'

export default function NuevoClientePage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zebra-dark">Nuevo Cliente</h1>
        <p className="text-zebra-gray mt-1">Añade un nuevo cliente a tu lista</p>
      </div>

      <ClienteForm />
    </div>
  )
}
