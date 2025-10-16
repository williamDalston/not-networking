'use client'

import { CommandPalette, useCommandPalette } from '@/components/navigation/command-palette'

interface DashboardClientProps {
  children: React.ReactNode
}

export function DashboardClient({ children }: DashboardClientProps) {
  const { isOpen, close } = useCommandPalette()

  return (
    <>
      {children}
      <CommandPalette isOpen={isOpen} onClose={close} />
    </>
  )
}
