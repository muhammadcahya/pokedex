import * as React from 'react'
import { AppSidebar } from './app-sidebar'
import { SiteHeader } from './site-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

interface PurchaseOrderLayoutProps {
  children: React.ReactNode
}

export function PurchaseOrderLayout({ children }: PurchaseOrderLayoutProps) {
  return (
    <div className="[--header-height:--spacing(14)]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset className="overflow-x-hidden">
            <div className="flex flex-1 flex-col">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  )
}
