import { useEffect, useState } from 'react'
import { CheckIcon } from '@phosphor-icons/react'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useThemeCustomizer } from '@/contexts/theme-customizer-context'
import { useTheme } from '@/components/theme-provider'
import { BRAND_COLOR_METADATA } from '@/lib/theme-customizer/colors'

export function PrimaryColorSection() {
  const { config, setTheme } = useThemeCustomizer()
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
      <Label className="text-xs">Primary</Label>
      <div className="grid grid-cols-3 gap-2">
        {BRAND_COLOR_METADATA.map((color) => {
          const isActive = config.theme === color.name

          return mounted ? (
            <Button
              key={color.name}
              variant="outline"
              size="sm"
              onClick={() => setTheme(color.name)}
              className={cn(
                'cursor-pointer justify-start',
                isActive && 'border-primary border-2',
              )}
            >
              {color.name === 'shadcn' ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="mr-1 h-5 w-5 shrink-0 -translate-x-1"
                  >
                    <rect width="256" height="256" fill="none" />
                    <line
                      x1="208"
                      y1="128"
                      x2="128"
                      y2="208"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                    />
                    <line
                      x1="192"
                      y1="40"
                      x2="40"
                      y2="192"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="32"
                    />
                  </svg>
                  {color.label}
                  {isActive && <CheckIcon className="ml-auto" weight="bold" />}
                </>
              ) : (
                <>
                  <span
                    className={cn(
                      'mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full',
                      color.preview[resolvedMode],
                    )}
                  >
                    {isActive && (
                      <CheckIcon
                        className={cn(
                          color.name === 'black' && resolvedMode === 'dark'
                            ? 'text-black'
                            : 'text-white',
                        )}
                        weight="bold"
                      />
                    )}
                  </span>
                  {color.label}
                </>
              )}
            </Button>
          ) : (
            <Skeleton key={color.name} className="h-8 w-full" />
          )
        })}
      </div>
    </div>
  )
}
