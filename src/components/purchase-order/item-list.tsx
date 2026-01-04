import { ItemRow } from './item-row'
import type { ItemInfo } from '@/lib/purchase-order/types'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface ItemListProps {
  items: Array<ItemInfo>
  onEdit: (item: ItemInfo) => void
  onDelete: (item: ItemInfo) => void
  subTotal: number
  finalDiscount: number
  vat: number
  grandTotal: number
}

export function ItemList({
  items,
  onEdit,
  onDelete,
  subTotal,
  finalDiscount,
  vat,
  grandTotal,
}: ItemListProps) {
  return (
    <div className="overflow-hidden rounded-b-lg">
      <Table className="w-full text-xs">
        <TableHeader className="bg-muted/80 border-t whitespace-nowrap">
          <TableRow className="bg-muted hover:bg-muted">
            <TableHead className="text-center">#</TableHead>
            <TableHead className="text-left">PR Number</TableHead>
            <TableHead className="text-left">Description</TableHead>
            <TableHead className="text-left">SKU</TableHead>
            <TableHead className="text-center">Qty</TableHead>
            <TableHead className="text-center">UOM</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Disc (%)</TableHead>
            <TableHead className="text-right">Disc</TableHead>
            <TableHead className="text-right">Nett Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Total (Base Cur)</TableHead>
            <TableHead className="text-right">VAT</TableHead>
            <TableHead className="text-left">Transaction Group</TableHead>
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
            />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableHead colSpan={10} className="text-right font-bold">
              Sub Total
            </TableHead>
            <TableHead className="text-right font-mono font-bold">
              {subTotal.toFixed(2)}
            </TableHead>
            <TableHead className="text-right font-mono font-bold">
              {(subTotal * 15500).toFixed(2)}
            </TableHead>
            <TableHead colSpan={5}></TableHead>
          </TableRow>
          <TableRow>
            <TableHead colSpan={10} className="text-right font-bold">
              Final Discount
            </TableHead>
            <TableHead className="text-right font-mono">
              <Input
                type="number"
                className="w-32 bg-transparent text-right"
                placeholder="0.00"
                value={finalDiscount.toFixed(2)}
                onChange={() => {}}
              />
            </TableHead>
            <TableHead className="text-right font-mono">
              ({(finalDiscount * 15500).toFixed(2)})
            </TableHead>
            <TableHead colSpan={5}></TableHead>
          </TableRow>
          <TableRow>
            <TableHead colSpan={10} className="text-right font-bold">
              VAT
            </TableHead>
            <TableHead className="text-right font-mono">
              {vat.toFixed(2)}
            </TableHead>
            <TableHead className="text-right font-mono">
              {(vat * 15500).toFixed(2)}
            </TableHead>
            <TableHead colSpan={5}></TableHead>
          </TableRow>
          <TableRow className="bg-muted">
            <TableHead colSpan={10} className="text-right font-bold">
              Grand Total
            </TableHead>
            <TableHead className="text-right font-mono font-bold">
              {grandTotal.toFixed(2)}
            </TableHead>
            <TableHead className="text-right font-mono font-bold">
              {(grandTotal * 15500).toFixed(2)}
            </TableHead>
            <TableHead colSpan={5}></TableHead>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}
