import { useEffect, useState } from 'react'
import { CheckIcon } from '@phosphor-icons/react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useThemeCustomizer } from '@/contexts/theme-customizer-context'
import { useTheme } from '@/components/theme-provider'
import { SURFACE_COLOR_METADATA } from '@/lib/theme-customizer/colors'

export function SurfaceColorSection() {
  const { config, setSurface } = useThemeCustomizer()
  const { theme: mode } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Resolve system mode to actual light/dark
  const resolvedMode =
    mode === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : mode

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Surface</Label>
      <div className="grid grid-cols-5 gap-2">
        {SURFACE_COLOR_METADATA.map((color) => {
          const isActive = config.surface === color.name

          return mounted ? (
            <Button
              key={color.name}
              variant="outline"
              size="sm"
              onClick={() =>
                setSurface(
                  color.name as 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone',
                )
              }
              className={cn(
                'cursor-pointer justify-start',
                isActive && 'border-primary border-2',
              )}
            >
              <span
                className={cn(
                  'mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full',
                  color.preview[resolvedMode],
                )}
              >
                {isActive && <CheckIcon className="text-white" weight="bold" />}
              </span>
              {color.label}
            </Button>
          ) : (
            <Skeleton key={color.name} className="h-8 w-full" />
          )
        })}
      </div>
    </div>
  )
}
