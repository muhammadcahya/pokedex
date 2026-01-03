import { useEffect, useState } from 'react'
import type { ItemInfo } from '@/lib/purchase-order/types'
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
import { calculateItemTotals } from '@/lib/purchase-order/calculations'

interface ItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (item: ItemInfo) => void
  item: ItemInfo | null
}

export function ItemModal({ isOpen, onClose, onSubmit, item }: ItemModalProps) {
  const [formData, setFormData] = useState<ItemInfo>({
    id: '',
    prNumber: '',
    description: '',
    sku: '',
    qty: 0,
    uom: '',
    unitPrice: 0,
    discountPercentage: 0,
    discount: 0,
    nettPrice: 0,
    total: 0,
    totalBaseCurrency: 0,
    vat: 0,
    transactionGroup: '',
    costCenter: '',
    project: '',
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        id: '',
        prNumber: '',
        description: '',
        sku: '',
        qty: 0,
        uom: '',
        unitPrice: 0,
        discountPercentage: 0,
        discount: 0,
        nettPrice: 0,
        total: 0,
        totalBaseCurrency: 0,
        vat: 0,
        transactionGroup: '',
        costCenter: '',
        project: '',
      })
    }
  }, [item])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]:
          name === 'description' ||
          name === 'sku' ||
          name === 'uom' ||
          name === 'transactionGroup' ||
          name === 'costCenter' ||
          name === 'project'
            ? value
            : Number(value),
      }
      return calculateItemTotals(updatedData)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item
              ? 'Update the item details below.'
              : 'Enter the details for the new item.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} id="item-form">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="sku">SKU</FieldLabel>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="uom">UOM</FieldLabel>
                <Input
                  id="uom"
                  name="uom"
                  value={formData.uom}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="qty">Quantity</FieldLabel>
                <Input
                  id="qty"
                  name="qty"
                  type="number"
                  value={formData.qty}
                  onChange={handleChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="unitPrice">Unit Price</FieldLabel>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  required
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="discountPercentage">
                  Discount (%)
                </FieldLabel>
                <Input
                  id="discountPercentage"
                  name="discountPercentage"
                  type="number"
                  step="0.01"
                  value={formData.discountPercentage}
                  onChange={handleChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="vat">VAT (%)</FieldLabel>
                <Input
                  id="vat"
                  name="vat"
                  type="number"
                  step="0.01"
                  value={formData.vat}
                  onChange={handleChange}
                />
              </Field>
            </div>
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="item-form">
            {item ? 'Update' : 'Add'} Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
