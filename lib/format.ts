import { format, parseISO } from 'date-fns'
import type { HouseholdSettings } from './types'
import { DEFAULT_SETTINGS } from './types'

export function formatCurrency(
  amount: number,
  settings: HouseholdSettings = DEFAULT_SETTINGS
): string {
  return amount.toLocaleString(settings.locale, {
    style: 'currency',
    currency: settings.currency,
    minimumFractionDigits: settings.showCents ? 2 : 0,
    maximumFractionDigits: settings.showCents ? 2 : 0,
  })
}

export function formatDate(
  date: string | Date,
  settings: HouseholdSettings = DEFAULT_SETTINGS
): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, settings.dateFormat)
}

export function formatNumber(
  num: number,
  settings: HouseholdSettings = DEFAULT_SETTINGS
): string {
  return num.toLocaleString(settings.locale)
}

// Currency options for settings
export const CURRENCY_OPTIONS = [
  { value: 'EUR', label: 'Euro (€)', symbol: '€' },
  { value: 'USD', label: 'US Dollar ($)', symbol: '$' },
  { value: 'GBP', label: 'British Pound (£)', symbol: '£' },
  { value: 'CHF', label: 'Swiss Franc (CHF)', symbol: 'CHF' },
  { value: 'JPY', label: 'Japanese Yen (¥)', symbol: '¥' },
  { value: 'CAD', label: 'Canadian Dollar (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'Australian Dollar (A$)', symbol: 'A$' },
]

// Locale options for settings
export const LOCALE_OPTIONS = [
  { value: 'de-DE', label: 'German (Germany)' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'fr-FR', label: 'French (France)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'it-IT', label: 'Italian (Italy)' },
  { value: 'nl-NL', label: 'Dutch (Netherlands)' },
]

// Date format options
export const DATE_FORMAT_OPTIONS = [
  { value: 'dd.MM.yyyy', label: 'DD.MM.YYYY (31.12.2024)' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (12/31/2024)' },
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (2024-12-31)' },
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (31/12/2024)' },
]
