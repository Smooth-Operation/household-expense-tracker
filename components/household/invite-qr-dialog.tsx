'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { QrCode, Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface Props {
  inviteCode: string
  householdName: string
}

export function InviteQRDialog({ inviteCode, householdName }: Props) {
  const [copied, setCopied] = useState(false)

  // Create the invite URL (points to setup page with code)
  const inviteUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/setup?code=${inviteCode}`
    : `/setup?code=${inviteCode}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(inviteCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(inviteUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <QrCode className="h-4 w-4" />
          Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite to {householdName}</DialogTitle>
          <DialogDescription>
            Scan this QR code or share the invite code to join
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-lg">
            <QRCodeSVG
              value={inviteUrl}
              size={200}
              level="M"
              includeMargin={false}
            />
          </div>

          {/* Invite Code */}
          <div className="flex items-center gap-2">
            <code className="text-2xl font-mono font-bold tracking-wider bg-muted px-4 py-2 rounded">
              {inviteCode}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>

          <p className="text-sm text-muted-foreground text-center">
            New members can scan this QR code or enter the invite code on the setup page
          </p>

          {/* Copy Link Button */}
          <Button variant="outline" onClick={handleCopyLink} className="w-full gap-2">
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Invite Link
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
