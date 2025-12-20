import type { PokemonStat } from '@/types/pokemon'
import { cn } from '@/lib/utils'
import { formatStatName } from '@/lib/pokemon-utils'
import { STAT_MAX_VALUES } from '@/lib/constants'

interface PokemonStatsProps {
  stats: Array<PokemonStat>
  className?: string
}

export function PokemonStats({ stats, className }: PokemonStatsProps) {
  const total = stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  const getStatColor = (value: number, max: number) => {
    const percentage = (value / max) * 100
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-lime-500'
    if (percentage >= 40) return 'bg-yellow-500'
    if (percentage >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  return (
    <div className={cn('space-y-3', className)}>
      {stats.map((stat) => {
        const statName = stat.stat.name as keyof typeof STAT_MAX_VALUES
        const max = STAT_MAX_VALUES[statName]
        const percentage = Math.min((stat.base_stat / max) * 100, 100)

        return (
          <div key={stat.stat.name} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground w-20">
                {formatStatName(stat.stat.name)}
              </span>
              <span className="font-medium">{stat.base_stat}</span>
            </div>
            <div className="bg-muted relative h-2 w-full overflow-hidden rounded-full">
              <div
                className={cn(
                  'h-full transition-all duration-500',
                  getStatColor(stat.base_stat, max),
                )}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      })}

      {/* Total stats */}
      <div className="border-t pt-3">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Total</span>
          <span className="font-bold">{total}</span>
        </div>
        <div className="bg-muted relative mt-1 h-2.5 w-full overflow-hidden rounded-full">
          <div
            className="bg-primary h-full transition-all duration-500"
            style={{
              width: `${Math.min((total / STAT_MAX_VALUES.total) * 100, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  )
}
