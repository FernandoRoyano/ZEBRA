'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Card } from '@/components/ui'

interface MonthlyData {
  month: string
  ingresos: number
  gastos: number
}

function formatCurrency(value: number): string {
  return value.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

export default function MetricsChart({ data }: { data: MonthlyData[] }) {
  if (data.length === 0) {
    return (
      <Card>
        <div className="text-center py-8">
          <p className="text-zebra-gray">No hay datos suficientes para mostrar el gráfico</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-zebra-dark">Últimos 12 meses</h2>
      <Card>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e4e9" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: '#626262' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e4e9' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#626262' }}
              tickLine={false}
              axisLine={{ stroke: '#e2e4e9' }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value: number | undefined, name: string | undefined) => [
                formatCurrency(typeof value === 'number' ? value : 0),
                name === 'ingresos' ? 'Ingresos' : 'Gastos',
              ]}
              labelStyle={{ fontWeight: 'bold', color: '#0a0a0a' }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e2e4e9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              }}
            />
            <Legend
              formatter={(value: string) => (value === 'ingresos' ? 'Ingresos' : 'Gastos')}
              iconType="circle"
            />
            <Bar dataKey="ingresos" fill="#009680" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
