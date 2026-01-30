'use client'

import { useState } from 'react'
import { Card } from '@/components/ui'

interface FinanceData {
  last30: { ingresos: number; gastos: number }
  mesActual: { ingresos: number; gastos: number }
}

function formatCurrency(value: number): string {
  return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

export default function FinancePanel({ data }: { data: FinanceData }) {
  const [periodo, setPeriodo] = useState<'mesActual' | 'last30'>('mesActual')
  const current = data[periodo]
  const beneficio = current.ingresos - current.gastos

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zebra-dark">Finanzas</h2>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value as 'mesActual' | 'last30')}
          className="px-3 py-2 rounded-lg border border-zebra-border bg-white text-sm text-zebra-dark focus:outline-none focus:ring-2 focus:ring-zebra-primary/30 focus:border-zebra-primary transition-colors"
        >
          <option value="mesActual">Mes actual</option>
          <option value="last30">Últimos 30 días</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingresos */}
        <Card className="border-l-4 border-l-green-500">
          <div className="text-center">
            <p className="text-sm font-medium text-zebra-gray mb-1">Ingresos</p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(current.ingresos)}
            </p>
          </div>
        </Card>

        {/* Gastos */}
        <Card className="border-l-4 border-l-red-500">
          <div className="text-center">
            <p className="text-sm font-medium text-zebra-gray mb-1">Gastos</p>
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(current.gastos)}
            </p>
          </div>
        </Card>

        {/* Beneficio */}
        <Card className={`border-l-4 ${beneficio >= 0 ? 'border-l-zebra-primary' : 'border-l-red-500'}`}>
          <div className="text-center">
            <p className="text-sm font-medium text-zebra-gray mb-1">Beneficio</p>
            <p className={`text-3xl font-bold ${beneficio >= 0 ? 'text-zebra-primary' : 'text-red-600'}`}>
              {formatCurrency(beneficio)}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
