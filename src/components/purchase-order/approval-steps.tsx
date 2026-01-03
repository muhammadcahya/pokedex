import { ClockIcon } from '@phosphor-icons/react'
import type { ApprovalStep } from '@/lib/purchase-order/types'
import { cn } from '@/lib/utils'
import { statusConfig } from '@/lib/purchase-order/constants'

const approvalSteps: Array<ApprovalStep> = [
  {
    title: 'Step 1: Request Created',
    status: 'approved',
    timeDecided: '15/05/2023 10:30 AM',
    comment: 'Purchase request created and submitted for approval.',
    approver: 'Pam Beesly (Creator)',
  },
  {
    title: 'Step 2: Operations Manager Review',
    status: 'need revision',
    timeDecided: '15/05/2023 2:45 PM',
    comment:
      'Please provide more details about the project timeline and expected delivery dates.',
    approver: 'Andy Bernard (Ops Mgr)',
  },
  {
    title: 'Step 3: Director Approval',
    status: 'rejected',
    timeDecided: '15/05/2023 9:15 AM',
    comment: 'Budget constraints - please reduce the order quantity by 20%.',
    approver: 'Michael Scott (Director)',
  },
  {
    title: 'Step 4: Assistant Manager Review',
    status: 'pending',
    approver: 'Dwight Schrute (Asst Mgr)',
  },
  {
    title: 'Step 5: Final Approval',
    status: 'waiting',
    approver: 'Jim Halpert (Sales)',
  },
]

export function ApprovalSteps() {
  return (
    <div className="space-y-4 p-4">
      {approvalSteps.map((step, index) => {
        const StatusIcon = statusConfig[step.status].icon
        const isLast = index === approvalSteps.length - 1

        return (
          <div key={step.title} className="flex gap-4">
            {/* Timeline indicator */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full',
                  statusConfig[step.status].iconBg,
                )}
              >
                <StatusIcon
                  className={cn('h-4 w-4', statusConfig[step.status].iconColor)}
                />
              </div>
              {!isLast && <div className="bg-border w-0.5 flex-1" />}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between">
                <h3
                  className={cn(
                    'font-semibold',
                    statusConfig[step.status].textColor,
                  )}
                >
                  {step.title}
                </h3>
                <span
                  className={cn(
                    'rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap capitalize',
                    statusConfig[step.status].badge,
                  )}
                >
                  {step.status}
                </span>
              </div>

              <p className="text-muted-foreground mt-1 text-sm">
                {step.approver}
              </p>

              {step.timeDecided && (
                <div className="text-muted-foreground mt-2 flex items-center text-xs">
                  <ClockIcon className="mr-1 h-3 w-3" />
                  {step.timeDecided}
                </div>
              )}

              {step.comment && (
                <div className="bg-muted mt-2 rounded-lg p-3">
                  <p className="text-sm">{step.comment}</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
