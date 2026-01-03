import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useThemeCustomizer } from '@/contexts/theme-customizer-context'
import { RADIUS_OPTIONS } from '@/lib/theme-customizer/types'

export function RadiusSection() {
  const { config, setRadius } = useThemeCustomizer()

  return (
    <div className="space-y-1.5">
      <Label className="text-xs">Radius</Label>
      <div className="grid grid-cols-5 gap-2">
        {RADIUS_OPTIONS.map((value) => {
          const isActive = config.radius === value

          return (
            <Button
              key={value}
              variant="outline"
              size="sm"
              onClick={() => setRadius(value)}
              className={cn(
                'flex cursor-pointer items-center justify-center gap-2',
                isActive && 'border-primary border-2',
              )}
            >
              <i
                style={{
                  borderTopLeftRadius: `${value}rem`,
                }}
                className={cn(
                  'h-6 w-6 border-t-2 border-l-2',
                  isActive
                    ? 'bg-primary/20 border-primary/70'
                    : 'bg-muted border-muted-foreground/30 grayscale',
                )}
              />
              <span>{value}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
