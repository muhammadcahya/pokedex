import { PencilSimpleIcon, TrashIcon } from '@phosphor-icons/react'
import type { ItemInfo } from '@/lib/purchase-order/types'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

interface ItemRowProps {
  item: ItemInfo
  index: number
  onEdit: (item: ItemInfo) => void
  onDelete: (item: ItemInfo) => void
  accountingView?: boolean
}

export function ItemRow({
  item,
  index,
  onEdit,
  onDelete,
  accountingView = false,
}: ItemRowProps) {
  if (accountingView) {
    return (
      <TableRow className={index % 2 === 0 ? '' : 'bg-muted/50'}>
        <TableCell className="text-center">{index + 1}</TableCell>
        <TableCell className="text-left">{`PR000${index + 1}`}</TableCell>
        <TableCell className="text-left">
          <span className="text-primary cursor-pointer hover:underline">
            {item.description}
          </span>
        </TableCell>
        <TableCell className="text-center font-mono">{item.qty}</TableCell>
        <TableCell className="text-center">{item.uom}</TableCell>
        <TableCell className="text-right font-mono">
          {item.total.toFixed(2)}
        </TableCell>
        <TableCell className="text-right font-mono">
          {item.totalBaseCurrency.toFixed(2)}
        </TableCell>
        <TableCell className="text-left">{item.transactionGroup}</TableCell>
        <TableCell className="text-left">-</TableCell>
        <TableCell className="text-left">{item.costCenter}</TableCell>
        <TableCell className="text-left">{item.project}</TableCell>
        <TableCell className="text-center">
          <Button variant="secondary" size="icon" onClick={() => onEdit(item)}>
            <PencilSimpleIcon />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(item)}
          >
            <TrashIcon />
          </Button>
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow className={index % 2 === 0 ? '' : 'bg-muted/50'}>
      <TableCell className="text-center">{index + 1}</TableCell>
      <TableCell className="text-left">{`PR000${index + 1}`}</TableCell>
      <TableCell className="text-left">
        <span className="text-primary cursor-pointer hover:underline">
          {item.description}
        </span>
      </TableCell>
      <TableCell className="text-left">{item.sku}</TableCell>
      <TableCell className="text-center font-mono">{item.qty}</TableCell>
      <TableCell className="text-center">{item.uom}</TableCell>
      <TableCell className="text-right font-mono">
        {item.unitPrice.toFixed(2)}
      </TableCell>
      <TableCell className="text-right font-mono">
        {item.discountPercentage.toFixed(2)}
      </TableCell>
      <TableCell className="text-right font-mono">
        {item.discount.toFixed(2)}
      </TableCell>
      <TableCell className="text-right font-mono">
        {item.nettPrice.toFixed(2)}
      </TableCell>
      <TableCell className="text-right font-mono">
        {item.total.toFixed(2)}
      </TableCell>
      <TableCell className="text-right font-mono">
        {item.totalBaseCurrency.toFixed(2)}
      </TableCell>
      <TableCell className="text-right font-mono">
        {item.vat.toFixed(2)}
      </TableCell>
      <TableCell className="text-left">{item.transactionGroup}</TableCell>
      <TableCell className="text-left">{item.costCenter}</TableCell>
      <TableCell className="text-left">{item.project}</TableCell>
      <TableCell className="text-center">
        <Button variant="secondary" size="icon" onClick={() => onEdit(item)}>
          <PencilSimpleIcon />
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onDelete(item)}
        >
          <TrashIcon />
        </Button>
      </TableCell>
    </TableRow>
  )
}
