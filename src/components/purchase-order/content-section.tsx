import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ContentTab {
  id: string
  label: string
  content: React.ReactNode
}

interface ContentSectionProps {
  title?: string
  tabs?: Array<ContentTab>
  defaultTab?: string
  actions?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  isEmpty?: boolean
  emptyState?: React.ReactNode
  className?: string
}

export function ContentSection({
  tabs,
  defaultTab,
  actions,
  children,
  footer,
  isEmpty,
  emptyState,
  className,
}: ContentSectionProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs?.[0]?.id)

  // Determine if we have tabs
  const hasTabs = tabs && tabs.length > 0

  return (
    <div
      className={cn(
        'bg-card overflow-hidden rounded-xl border shadow-sm',
        className,
      )}
    >
      {/* Tab Bar or Header */}
      {hasTabs && (
        <div className="bg-card flex flex-col items-stretch border-b md:flex-row md:items-center md:justify-between">
          {/* Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto px-2 pt-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-t-lg border border-b-0 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200',
                  'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                  activeTab === tab.id
                    ? 'border-primary/20 bg-primary/10 text-primary relative z-10'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted/70 hover:text-foreground border-transparent',
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex flex-wrap items-center gap-2 px-2 py-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="bg-card overflow-hidden rounded-b-xl">
        {isEmpty && emptyState ? (
          <div className="p-8">{emptyState}</div>
        ) : hasTabs ? (
          tabs.find((tab) => tab.id === activeTab)?.content
        ) : (
          children
        )}
      </div>

      {/* Footer */}
      {footer && !isEmpty && (
        <div className="bg-muted/50 rounded-b-xl border-t">{footer}</div>
      )}
    </div>
  )
}
