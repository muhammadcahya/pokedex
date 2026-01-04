import { ClockIcon } from '@phosphor-icons/react'
import { ApprovalSteps } from './approval-steps'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { dummyApprovers, statusConfig } from '@/lib/purchase-order/constants'

export function ApprovalList() {
  return (
    <div className="w-full overflow-x-auto">
      <nav className="w-full md:w-max" aria-label="Approval Progress">
        <ol className="border-border bg-muted/40 flex w-full flex-col overflow-hidden rounded-lg border shadow-sm md:flex-row">
          {dummyApprovers.map((approver) => {
            const StatusIcon = statusConfig[approver.status].icon
            return (
              <li key={approver.name} className="flex-none">
                <Dialog>
                  <DialogTrigger
                    render={(props) => (
                      <div
                        {...props}
                        className="border-border bg-card hover:bg-muted/50 relative flex cursor-pointer items-start border-b p-4 transition-colors md:h-full md:border-r md:border-b-0"
                      >
                        {/* Highlight bar */}
                        <div
                          className={cn(
                            'absolute inset-y-0 left-0 w-1 md:top-auto md:right-0 md:bottom-0 md:left-0 md:h-1 md:w-full',
                            statusConfig[approver.status].highlightBar,
                          )}
                          aria-hidden="true"
                        />

                        {/* Icon */}
                        <div className="shrink-0">
                          <div
                            className={cn(
                              'flex h-10 w-10 items-center justify-center rounded-full',
                              statusConfig[approver.status].iconBg,
                            )}
                          >
                            <StatusIcon
                              className={cn(
                                'h-5 w-5',
                                statusConfig[approver.status].iconColor,
                              )}
                            />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="ml-4 min-w-0 flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p
                              className={cn(
                                'text-sm font-medium',
                                statusConfig[approver.status].textColor,
                              )}
                            >
                              {approver.name}
                            </p>
                            <span
                              className={cn(
                                'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap capitalize',
                                statusConfig[approver.status].badge,
                              )}
                            >
                              {approver.status}
                            </span>
                          </div>
                          <p className="text-muted-foreground mt-0.5 text-sm">
                            {approver.role}
                          </p>
                          {approver.decidedTime && (
                            <div className="text-muted-foreground mt-1 flex items-center text-xs">
                              <ClockIcon className="mr-1 h-3 w-3" />
                              {approver.decidedTime}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  />
                  <DialogContent className="max-h-[80vh] max-w-full lg:max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Purchase Order Approval</DialogTitle>
                      <DialogDescription>3 / 5 Steps</DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[calc(80vh-7rem)] overflow-y-auto">
                      <ApprovalSteps />
                    </div>
                  </DialogContent>
                </Dialog>
              </li>
            )
          })}
        </ol>
      </nav>
    </div>
  )
}
