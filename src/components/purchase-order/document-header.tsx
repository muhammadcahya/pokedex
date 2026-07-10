import { CalendarBlankIcon, PencilIcon } from '@phosphor-icons/react'
import { format } from 'date-fns'
import { ApprovalList } from './approval-list'
import { ContentSection } from './content-section'
import type { HeaderData } from '@/lib/purchase-order/types'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'

interface DocumentHeaderProps {
  headerData: HeaderData
  setHeaderData: React.Dispatch<React.SetStateAction<HeaderData>>
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export function DocumentHeader({
  headerData,
  setHeaderData,
  isModalOpen,
  setIsModalOpen,
}: DocumentHeaderProps) {
  const handleInputChange = (field: keyof HeaderData, value: string) => {
    setHeaderData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsModalOpen(false)
  }

  return (
    <>
      <ContentSection
        tabs={[
          {
            id: 'header',
            label: 'Document Header',
            content: (
              <>
                {/* Mobile Actions */}
                <div className="flex border-b p-3 md:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full"
                  >
                    <PencilIcon />
                    Edit Header
                  </Button>
                </div>
                <div className="border-b px-4 py-3">
                  <ApprovalList />
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableBody className="whitespace-nowrap">
                      <TableRow className="bg-background hover:bg-background">
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Company
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle font-mono text-xs">
                          {headerData.company}
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Currency
                        </TableCell>
                        <TableCell
                          className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.currency}
                          </span>
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Delivery To
                        </TableCell>
                        <TableCell
                          className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.deliveryTo}
                          </span>
                        </TableCell>
                        <TableCell className="border-border border-t"></TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Doc Number
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle font-mono text-xs italic">
                          {headerData.docNumber}
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Rate
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle font-mono text-xs">
                          {headerData.rate}
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Vendor Sales Order
                        </TableCell>
                        <TableCell
                          className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.vendorSalesOrder}
                          </span>
                        </TableCell>
                        <TableCell className="border-border border-t"></TableCell>
                      </TableRow>
                      <TableRow className="bg-background hover:bg-background">
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          PO Date
                        </TableCell>
                        <TableCell
                          className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.poDate}
                          </span>
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Priority
                        </TableCell>
                        <TableCell
                          className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.priority}
                          </span>
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Expense Type
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle">
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.expenseType}
                          </span>
                        </TableCell>
                        <TableCell className="border-border border-t"></TableCell>
                      </TableRow>
                      <TableRow className="bg-muted/50 hover:bg-muted/50">
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Terms (Days)
                        </TableCell>
                        <TableCell
                          className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.terms}
                          </span>
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Expense Group
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle">
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.expenseGroup}
                          </span>
                        </TableCell>
                        <TableCell className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle text-[10px] font-bold uppercase">
                          Submitted By
                        </TableCell>
                        <TableCell
                          className="border-border w-1 border-t border-r p-1.5 pr-3 align-middle"
                          onClick={() => setIsModalOpen(true)}
                        >
                          <span className="text-primary cursor-pointer font-mono text-xs">
                            {headerData.submittedBy}
                          </span>
                        </TableCell>
                        <TableCell className="border-border border-t"></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </>
            ),
          },
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
          >
            <PencilIcon />
            Edit Header
          </Button>
        }
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-full lg:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Header Information</DialogTitle>
            <DialogDescription>
              Update the purchase order header details below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} id="header-form">
            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Currency</FieldLabel>
                  <Select
                    value={headerData.currency}
                    onValueChange={(value) =>
                      value && handleInputChange('currency', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Delivery To</FieldLabel>
                  <Select
                    value={headerData.deliveryTo}
                    onValueChange={(value) =>
                      value && handleInputChange('deliveryTo', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACME Office">ACME Office</SelectItem>
                      <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                      <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Rate</FieldLabel>
                  <Input
                    value={headerData.rate}
                    onChange={(e) => handleInputChange('rate', e.target.value)}
                    placeholder="Enter rate"
                  />
                </Field>

                <Field>
                  <FieldLabel>Vendor Sales Order</FieldLabel>
                  <Input
                    value={headerData.vendorSalesOrder}
                    onChange={(e) =>
                      handleInputChange('vendorSalesOrder', e.target.value)
                    }
                    placeholder="Enter vendor sales order"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>PO Date</FieldLabel>
                  <Popover>
                    <PopoverTrigger
                      render={(props) => (
                        <Button
                          {...props}
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !headerData.poDate && 'text-muted-foreground',
                          )}
                        >
                          <CalendarBlankIcon />
                          {headerData.poDate
                            ? format(new Date(headerData.poDate), 'PPP')
                            : 'Pick a date'}
                        </Button>
                      )}
                    />
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={
                          headerData.poDate
                            ? new Date(headerData.poDate)
                            : undefined
                        }
                        onSelect={(date) =>
                          date &&
                          handleInputChange(
                            'poDate',
                            format(date, 'yyyy-MM-dd'),
                          )
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </Field>

                <Field>
                  <FieldLabel>Priority</FieldLabel>
                  <Select
                    value={headerData.priority}
                    onValueChange={(value) =>
                      value && handleInputChange('priority', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Terms (Days)</FieldLabel>
                  <Input
                    type="number"
                    value={headerData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    placeholder="Enter terms in days"
                  />
                </Field>

                <Field>
                  <FieldLabel>Expense Type</FieldLabel>
                  <Select
                    value={headerData.expenseType}
                    onValueChange={(value) =>
                      value && handleInputChange('expenseType', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CAPEX">CAPEX</SelectItem>
                      <SelectItem value="OPEX">OPEX</SelectItem>
                      <SelectItem value="-">-</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel>Expense Group</FieldLabel>
                  <Select
                    value={headerData.expenseGroup}
                    onValueChange={(value) =>
                      value && handleInputChange('expenseGroup', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Group A">Group A</SelectItem>
                      <SelectItem value="Group B">Group B</SelectItem>
                      <SelectItem value="-">-</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Submitted By</FieldLabel>
                  <Input
                    value={headerData.submittedBy}
                    onChange={(e) =>
                      handleInputChange('submittedBy', e.target.value)
                    }
                    placeholder="Enter submitter name"
                  />
                </Field>
              </div>
            </FieldGroup>
          </form>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="header-form">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
