'use client'

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { HouseholdSettings } from '@/lib/types'
import { DEFAULT_SETTINGS } from '@/lib/types'

interface MonthData {
  month: string
  income: number
  expenses: number
}

interface Props {
  data: MonthData[]
  settings?: HouseholdSettings
}

export function MonthlyTrendChart({ data, settings = DEFAULT_SETTINGS }: Props) {
  const formatCurrency = (value: number) => {
    return value.toLocaleString(settings.locale, {
      style: 'currency',
      currency: settings.currency,
      maximumFractionDigits: 0,
    })
  }

  const formatMonth = (month: string) => {
    const date = new Date(month + '-01')
    return date.toLocaleDateString(settings.locale, { month: 'short' })
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ left: 10, right: 10, top: 10, bottom: 10 }}>
        <XAxis
          dataKey="month"
          tickFormatter={formatMonth}
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          tickFormatter={formatCurrency}
          tick={{ fontSize: 12 }}
          stroke="hsl(var(--muted-foreground))"
          width={80}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          labelFormatter={(label) => {
            const date = new Date(label + '-01')
            return date.toLocaleDateString(settings.locale, {
              month: 'long',
              year: 'numeric',
            })
          }}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="income"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Income"
        />
        <Line
          type="monotone"
          dataKey="expenses"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Expenses"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
