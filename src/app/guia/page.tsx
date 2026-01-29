import GuiaContent from './GuiaContent'

export default function GuiaPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-zebra-dark">Guía de uso</h1>
        <p className="text-zebra-gray mt-1">
          Aprende a usar todas las funcionalidades de ZEBRA
        </p>
      </div>
      <GuiaContent />
    </div>
  )
}
