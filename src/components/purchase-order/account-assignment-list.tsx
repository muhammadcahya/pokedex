import { ItemRow } from './item-row'
import type { ItemInfo } from '@/lib/purchase-order/types'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface AccountAssignmentListProps {
  items: Array<ItemInfo>
  onEdit: (item: ItemInfo) => void
  onDelete: (item: ItemInfo) => void
}

export function AccountAssignmentList({
  items,
  onEdit,
  onDelete,
}: AccountAssignmentListProps) {
  return (
    <div className="overflow-hidden rounded-b-lg">
      <Table className="text-xs">
        <TableHeader className="bg-muted/80 border-t whitespace-nowrap">
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="text-center">#</TableHead>
            <TableHead className="text-left">PR Number</TableHead>
            <TableHead className="text-left">Description</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead className="text-center">UOM</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Total (Base Cur)</TableHead>
            <TableHead className="text-left">Transaction Group</TableHead>
            <TableHead className="text-left">Chart of Account</TableHead>
            <TableHead className="text-left">Cost Center</TableHead>
            <TableHead className="text-left">Project</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="whitespace-nowrap">
          {items.map((item, index) => (
            <ItemRow
              key={item.id}
              item={item}
              index={index}
              onEdit={onEdit}
              onDelete={onDelete}
              accountingView
            />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
