export interface HeaderData {
  company: string
  currency: string
  deliveryTo: string
  docNumber: string
  rate: string
  vendorSalesOrder: string
  poDate: string
  priority: string
  expenseType: string
  terms: string
  expenseGroup: string
  submittedBy: string
}

export interface ItemInfo {
  id: string
  prNumber: string
  description: string
  sku: string
  qty: number
  uom: string
  unitPrice: number
  discountPercentage: number
  discount: number
  nettPrice: number
  total: number
  totalBaseCurrency: number
  vat: number
  transactionGroup: string
  costCenter: string
  project: string
}

export interface VendorData {
  code: string
  name: string
  address: string
  bankName: string
  bankAccountNo: string
  bankAccountName: string
  npwpNumber: string
  npwpFile: string
  branch: string
  phone: string
}

export interface AttachmentInfo {
  id: string
  name: string
  size: string
  type: string
}

export type ApprovalStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'need revision'
  | 'waiting'

export interface ApproverInfo {
  name: string
  role: string
  status: ApprovalStatus
  decidedTime?: string
}

export interface ApprovalStep {
  title: string
  status: ApprovalStatus
  timeDecided?: string
  comment?: string
  approver: string
}
