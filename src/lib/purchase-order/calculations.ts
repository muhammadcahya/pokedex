import type { ItemInfo } from './types'

export const calculateTotals = (items: Array<ItemInfo>) => {
  const subTotal = items.reduce((sum, item) => sum + item.total, 0)
  const finalDiscount = 0
  const vatTotal = items.reduce(
    (sum, item) => sum + (item.total * item.vat) / 100,
    0,
  )
  const grandTotal = subTotal - finalDiscount + vatTotal

  return {
    subTotal,
    finalDiscount,
    vat: vatTotal,
    grandTotal,
  }
}

export const calculateItemTotals = (item: ItemInfo): ItemInfo => {
  const discount = (item.unitPrice * item.qty * item.discountPercentage) / 100
  const nettPrice =
    item.unitPrice - (item.unitPrice * item.discountPercentage) / 100
  const total = nettPrice * item.qty
  const totalBaseCurrency = total * 15500

  return {
    ...item,
    discount,
    nettPrice,
    total,
    totalBaseCurrency,
  }
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
