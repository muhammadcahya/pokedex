import { useEffect, useState } from 'react'
import { MonitorIcon, MoonIcon, SunIcon } from '@phosphor-icons/react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/theme-provider'

export function ModeSection() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Mode</Label>
      <div className="grid grid-cols-3 gap-2">
        {mounted ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme('light')}
              className={cn(
                'cursor-pointer',
                theme === 'light' && 'border-primary border-2',
              )}
            >
              <SunIcon className="mr-1 -translate-x-1" />
              Light
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme('dark')}
              className={cn(
                'cursor-pointer',
                theme === 'dark' && 'border-primary border-2',
              )}
            >
              <MoonIcon className="mr-1 -translate-x-1" />
              Dark
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setTheme('system')}
              className={cn(
                'cursor-pointer',
                theme === 'system' && 'border-primary border-2',
              )}
            >
              <MonitorIcon className="mr-1 -translate-x-1" />
              System
            </Button>
          </>
        ) : (
          <>
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </>
        )}
      </div>
    </div>
  )
}
