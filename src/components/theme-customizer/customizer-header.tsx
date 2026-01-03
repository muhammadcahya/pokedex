import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useThemeCustomizer } from '@/contexts/theme-customizer-context'

export function CustomizerHeader() {
  const { resetConfig } = useThemeCustomizer()

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="leading-none font-semibold tracking-tight">
          Customize
        </div>
        <div className="text-muted-foreground text-xs">
          Pick colors and radius for your theme.
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={resetConfig}
      >
        <ArrowCounterClockwiseIcon />
        <span className="sr-only">Reset</span>
      </Button>
    </div>
  )
}
