import { useState } from 'react'
import { MagnifyingGlassIcon, TrashIcon, UserIcon } from '@phosphor-icons/react'
import type { VendorData } from '@/lib/purchase-order/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Input } from '@/components/ui/input'
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { dummyVendors } from '@/lib/purchase-order/constants'

export function VendorInfo() {
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredVendors = dummyVendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleVendorSelect = (vendor: VendorData) => {
    setSelectedVendor(vendor)
    setIsSearchOpen(false)
  }

  const handleRemoveVendor = () => {
    setSelectedVendor(null)
  }

  return (
    <>
      <Accordion defaultValue={['vendor']}>
        <AccordionItem
          value="vendor"
          className="bg-card rounded-lg border shadow-sm"
        >
          <AccordionTrigger className="bg-muted px-4">
            Vendor
          </AccordionTrigger>
          <AccordionContent className="overflow-x-auto pb-0">
            {!selectedVendor ? (
              <Empty className="border-t py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UserIcon />
                  </EmptyMedia>
                  <EmptyTitle>No Vendor Selected</EmptyTitle>
                  <EmptyDescription>
                    Please select a vendor to see their information
                  </EmptyDescription>
                </EmptyHeader>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <MagnifyingGlassIcon />
                  Select Vendor
                </Button>
              </Empty>
            ) : (
              <div className="overflow-hidden rounded-b-lg">
                <Table className="w-full border-t">
                  <TableBody>
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="border-b px-4 py-3">
                        <div className="font-mono text-xs">
                          <div className="text-foreground mb-1 font-bold">
                            {selectedVendor.name}
                          </div>
                          <div className="text-muted-foreground">
                            {selectedVendor.address}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="border-t"></TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      <TableCell className="text-muted-foreground w-1 border-b p-2 align-baseline text-[10px] font-bold whitespace-nowrap uppercase">
                        Delivery To
                      </TableCell>
                      <TableCell colSpan={5} className="border-b p-2">
                        <div className="font-mono text-xs">
                          <div className="text-foreground font-bold">
                            Head Office
                          </div>
                          <div className="text-muted-foreground">
                            {selectedVendor.address}
                          </div>
                          <div className="text-muted-foreground">
                            {selectedVendor.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="border-t"></TableCell>
                    </TableRow>
                    <TableRow className="whitespace-nowrap hover:bg-transparent">
                      <TableCell className="text-muted-foreground w-1 border-b p-2 text-[10px] font-bold uppercase">
                        Vendor Code
                      </TableCell>
                      <TableCell className="text-foreground w-1 border-b p-2 font-mono text-xs">
                        {selectedVendor.code}
                      </TableCell>
                      <TableCell className="text-muted-foreground w-1 border-b p-2 text-[10px] font-bold uppercase">
                        Bank Name
                      </TableCell>
                      <TableCell className="text-foreground w-1 border-b p-2 font-mono text-xs">
                        {selectedVendor.bankName}
                      </TableCell>
                      <TableCell className="text-muted-foreground w-1 border-b p-2 text-[10px] font-bold uppercase">
                        NPWP Number
                      </TableCell>
                      <TableCell className="text-foreground w-1 border-b p-2 font-mono text-xs">
                        {selectedVendor.npwpNumber}
                      </TableCell>
                      <TableCell className="border-t"></TableCell>
                    </TableRow>
                    <TableRow className="bg-muted/50 hover:bg-muted/50 whitespace-nowrap">
                      <TableCell className="text-muted-foreground w-1 border-b p-2 text-[10px] font-bold uppercase">
                        Tax Document
                      </TableCell>
                      <TableCell className="w-1 border-b p-2 font-mono text-xs">
                        <a
                          href="#"
                          className="text-primary hover:text-primary/80"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {selectedVendor.npwpFile}
                        </a>
                      </TableCell>
                      <TableCell className="text-muted-foreground w-1 border-b p-2 text-[10px] font-bold uppercase">
                        Branch
                      </TableCell>
                      <TableCell className="text-foreground w-1 border-b p-2 font-mono text-xs">
                        {selectedVendor.branch}
                      </TableCell>
                      <TableCell className="text-muted-foreground w-1 border-b p-2 text-[10px] font-bold uppercase">
                        Bank Acc No
                      </TableCell>
                      <TableCell className="text-foreground w-1 border-b p-2 font-mono text-xs">
                        {selectedVendor.bankAccountNo}
                      </TableCell>
                      <TableCell className="border-t"></TableCell>
                    </TableRow>
                    <TableRow className="whitespace-nowrap hover:bg-transparent">
                      <TableCell className="text-muted-foreground w-1 border-b p-2 text-[10px] font-bold uppercase">
                        Bank Acc Name
                      </TableCell>
                      <TableCell
                        colSpan={5}
                        className="text-foreground border-b p-2 font-mono text-xs"
                      >
                        {selectedVendor.bankAccountName}
                      </TableCell>
                      <TableCell className="border-t border-b"></TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-transparent">
                      <TableCell colSpan={6} className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsSearchOpen(true)}
                          >
                            <MagnifyingGlassIcon />
                            Select Vendor
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveVendor}
                          >
                            <TrashIcon />
                            Remove Vendor
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-full lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Select Vendor</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <Input
                placeholder="Search vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="max-h-100 space-y-2 overflow-y-auto">
              {filteredVendors.map((vendor) => (
                <Item
                  key={vendor.code}
                  variant="outline"
                  render={(props) => (
                    <button
                      {...props}
                      onClick={() => handleVendorSelect(vendor)}
                      className={cn(
                        props.className,
                        'hover:bg-muted cursor-pointer',
                      )}
                    />
                  )}
                >
                  <ItemContent>
                    <div className="flex items-start justify-between gap-2">
                      <ItemTitle>{vendor.name}</ItemTitle>
                      <span className="text-muted-foreground shrink-0 text-sm">
                        {vendor.code}
                      </span>
                    </div>
                    <ItemDescription>{vendor.address}</ItemDescription>
                    <div className="text-muted-foreground flex flex-wrap items-center gap-x-2 text-xs">
                      <span>{vendor.bankName}</span>
                      <span>•</span>
                      <span>{vendor.npwpNumber}</span>
                      <span>•</span>
                      <span>{vendor.branch}</span>
                    </div>
                  </ItemContent>
                </Item>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
