'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { updateHouseholdSettingsAction } from '@/app/actions'
import type { HouseholdSettings } from '@/lib/types'
import {
  CURRENCY_OPTIONS,
  LOCALE_OPTIONS,
  DATE_FORMAT_OPTIONS,
  formatCurrency,
} from '@/lib/format'

interface Props {
  householdId: string
  settings: HouseholdSettings
}

export function SettingsDialog({ householdId, settings }: Props) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localSettings, setLocalSettings] = useState<HouseholdSettings>(settings)
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const result = await updateHouseholdSettingsAction(householdId, localSettings)
      if (result.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        })
      } else {
        toast({
          title: 'Settings saved',
          description: 'Your preferences have been updated.',
        })
        setOpen(false)
        router.refresh()
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Preview amount with current settings
  const previewAmount = formatCurrency(1234.56, localSettings)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Household Settings</DialogTitle>
          <DialogDescription>
            Configure how amounts and dates are displayed.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="currency">Currency</Label>
            <Select
              value={localSettings.currency}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, currency: value })
              }
            >
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="locale">Number Format</Label>
            <Select
              value={localSettings.locale}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, locale: value })
              }
            >
              <SelectTrigger id="locale">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {LOCALE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="dateFormat">Date Format</Label>
            <Select
              value={localSettings.dateFormat}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, dateFormat: value })
              }
            >
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                {DATE_FORMAT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="showCents">Show Cents</Label>
            <Select
              value={localSettings.showCents ? 'true' : 'false'}
              onValueChange={(value) =>
                setLocalSettings({ ...localSettings, showCents: value === 'true' })
              }
            >
              <SelectTrigger id="showCents">
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Yes (€1,234.56)</SelectItem>
                <SelectItem value="false">No (€1,235)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md bg-muted p-3">
            <p className="text-sm text-muted-foreground mb-1">Preview:</p>
            <p className="text-lg font-semibold">{previewAmount}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
