import { useState } from 'react'
import { PackageIcon, PlusIcon } from '@phosphor-icons/react'
import { ItemList } from './item-list'
import { ItemModal } from './item-modal'
import type { ItemInfo } from '@/lib/purchase-order/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { calculateTotals } from '@/lib/purchase-order/calculations'

export function ItemsCard() {
  const [items, setItems] = useState<Array<ItemInfo>>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState<ItemInfo | null>(null)

  const handleAddItem = (newItem: ItemInfo) => {
    setItems([...items, { ...newItem, id: Date.now().toString() }])
    setIsAddModalOpen(false)
  }

  const handleEditItem = (updatedItem: ItemInfo) => {
    setItems(
      items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    )
    setIsEditModalOpen(false)
  }

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    setIsDeleteModalOpen(false)
  }

  const openEditModal = (item: ItemInfo) => {
    setCurrentItem(item)
    setIsEditModalOpen(true)
  }

  const openDeleteModal = (item: ItemInfo) => {
    setCurrentItem(item)
    setIsDeleteModalOpen(true)
  }

  const { subTotal, finalDiscount, vat, grandTotal } = calculateTotals(items)

  return (
    <>
      <Accordion defaultValue={['items']}>
        <AccordionItem
          value="items"
          className="bg-card rounded-lg border shadow-sm"
        >
          <AccordionTrigger className="bg-muted px-4">
            Items
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="bg-muted flex gap-2 border-t p-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusIcon />
                Add Inventory Item
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddModalOpen(true)}
              >
                <PlusIcon />
                Add Freetext Item
              </Button>
            </div>
            {items.length === 0 ? (
              <Empty className="border-t py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <PackageIcon />
                  </EmptyMedia>
                  <EmptyTitle>No Items Added</EmptyTitle>
                  <EmptyDescription>
                    Click on Add Inventory Item or Add Freetext Item to add new
                    items.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ItemList
                items={items}
                onEdit={openEditModal}
                onDelete={openDeleteModal}
                subTotal={subTotal}
                finalDiscount={finalDiscount}
                vat={vat}
                grandTotal={grandTotal}
              />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <ItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddItem}
        item={null}
      />
      <ItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditItem}
        item={currentItem}
      />

      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{currentItem?.description}". This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentItem && handleDeleteItem(currentItem.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
