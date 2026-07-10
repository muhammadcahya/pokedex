import { useState } from 'react'
import { PackageIcon } from '@phosphor-icons/react'
import { Link } from '@tanstack/react-router'
import { AttachmentCard } from './attachment-card'
import { DocumentHeader } from './document-header'
import { ItemsCard } from './items-card'
import { NoteCard } from './note-card'
import { VendorInfo } from './vendor-info'
import type { HeaderData } from '@/lib/purchase-order/types'
import { Button } from '@/components/ui/button'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { cn } from '@/lib/utils'

interface PurchaseOrderFormProps {
  fixedScroll?: boolean
}

export function PurchaseOrderForm({
  fixedScroll = true,
}: PurchaseOrderFormProps) {
  const [headerData, setHeaderData] = useState<HeaderData>({
    company: 'ACME',
    currency: 'USD',
    deliveryTo: 'ACME Office',
    docNumber: 'PO/ACME/12/23/000001',
    rate: '15.500,00',
    vendorSalesOrder: '-',
    poDate: '2024-08-29',
    priority: 'Urgent',
    expenseType: '-',
    terms: '30',
    expenseGroup: '-',
    submittedBy: 'David',
  })
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb className="bg-card rounded-md border p-2 shadow-sm">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              render={(props) => (
                <Link
                  to="/purchase-order"
                  {...props}
                  className="flex items-center gap-2"
                >
                  <PackageIcon />
                  Purchase Order
                </Link>
              )}
            />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>PO/ACME/12/23/000001</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        className={cn(
          'flex flex-col gap-6',
          fixedScroll && 'max-h-[calc(100vh-200px)] overflow-y-auto',
        )}
      >
        <DocumentHeader
          headerData={headerData}
          setHeaderData={setHeaderData}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
        <VendorInfo />
        <ItemsCard />
        <AttachmentCard />
        <NoteCard />
      </div>
      <div className="flex space-x-2">
        <Button variant="default">Submit</Button>
        <Button variant="destructive">Cancel</Button>
        <Button variant="secondary">Save as Draft</Button>
      </div>
    </div>
  )
}
