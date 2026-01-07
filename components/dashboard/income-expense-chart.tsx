'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import type { HouseholdSettings } from '@/lib/types'
import { DEFAULT_SETTINGS } from '@/lib/types'

interface Props {
  income: number
  expenses: number
  settings?: HouseholdSettings
}

export function IncomeExpenseChart({ income, expenses, settings = DEFAULT_SETTINGS }: Props) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString(settings.locale, {
      style: 'currency',
      currency: settings.currency,
      maximumFractionDigits: 0,
    })
  }

  const data = [
    { name: 'Income', value: income, color: 'hsl(142, 76%, 36%)' },
    { name: 'Expenses', value: expenses, color: 'hsl(0, 84%, 60%)' },
  ].filter((d) => d.value > 0)

  const total = income + expenses
  const incomePercent = total > 0 ? ((income / total) * 100).toFixed(0) : 0
  const expensePercent = total > 0 ? ((expenses / total) * 100).toFixed(0) : 0

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
        No transactions this month
      </div>
    )
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => formatCurrency(Number(value))}
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '6px',
            }}
          />
          <Legend
            formatter={(value, entry) => {
              const percent = value === 'Income' ? incomePercent : expensePercent
              return `${value} (${percent}%)`
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none" style={{ marginTop: '-14px' }}>
        <p className="text-xs text-muted-foreground">Balance</p>
        <p className={`text-lg font-bold ${income - expenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {formatCurrency(income - expenses)}
        </p>
      </div>
    </div>
  )
}
