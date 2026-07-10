import { createFileRoute } from '@tanstack/react-router'
import { PurchaseOrderForm } from '@/components/purchase-order/purchase-order-form'
import { PurchaseOrderLayout } from '@/components/purchase-order/layout/purchase-order-layout'

export const Route = createFileRoute('/purchase-order/')({
  component: PurchaseOrderPage,
})

function PurchaseOrderPage() {
  return (
    <PurchaseOrderLayout>
      <div className="container mx-auto flex h-full flex-col p-4">
        <PurchaseOrderForm fixedScroll={false} />
      </div>
    </PurchaseOrderLayout>
  )
}
