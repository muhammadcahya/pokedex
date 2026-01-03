import {
  ChatCircleDots,
  CheckCircle,
  CircleDashed,
  Clock,
  XCircle,
} from '@phosphor-icons/react'
import type { ApprovalStatus, ApproverInfo, VendorData } from './types'

export const statusConfig: Record<
  ApprovalStatus,
  {
    icon: typeof Clock
    iconColor: string
    iconBg: string
    textColor: string
    highlightBar: string
    badge: string
  }
> = {
  waiting: {
    icon: CircleDashed,
    iconColor: 'text-muted-foreground',
    iconBg: 'bg-muted',
    textColor: 'text-muted-foreground',
    highlightBar: 'bg-muted-foreground/50',
    badge: 'bg-muted text-muted-foreground',
  },
  pending: {
    icon: Clock,
    iconColor: 'text-amber-600 dark:text-amber-400',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    textColor: 'text-amber-700 dark:text-amber-400',
    highlightBar: 'bg-amber-500',
    badge:
      'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  },
  approved: {
    icon: CheckCircle,
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    highlightBar: 'bg-emerald-500',
    badge:
      'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
  },
  rejected: {
    icon: XCircle,
    iconColor: 'text-rose-600 dark:text-rose-400',
    iconBg: 'bg-rose-100 dark:bg-rose-900/30',
    textColor: 'text-rose-700 dark:text-rose-400',
    highlightBar: 'bg-rose-500',
    badge: 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
  },
  'need revision': {
    icon: ChatCircleDots,
    iconColor: 'text-sky-600 dark:text-sky-400',
    iconBg: 'bg-sky-100 dark:bg-sky-900/30',
    textColor: 'text-sky-700 dark:text-sky-400',
    highlightBar: 'bg-sky-500',
    badge: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
  },
}

export const dummyApprovers: Array<ApproverInfo> = [
  {
    name: 'Pam Beesly',
    role: 'Creator',
    status: 'approved',
    decidedTime: '15/05/2023 10:30 AM',
  },
  {
    name: 'Andy Bernard',
    role: 'Ops Mgr',
    status: 'need revision',
    decidedTime: '15/05/2023 2:45 PM',
  },
  {
    name: 'Michael Scott',
    role: 'Director',
    status: 'rejected',
    decidedTime: '15/05/2023 9:15 AM',
  },
  { name: 'Dwight Schrute', role: 'Asst Mgr', status: 'pending' },
  { name: 'Jim Halpert', role: 'Sales', status: 'waiting' },
]

export const dummyVendors: Array<VendorData> = [
  {
    code: 'VEN001',
    name: 'PT. Acme Dummy Company',
    address:
      '117 Louis Henna Blvd #150a Round Rock JajarStone, Kebon Kebon, Tanah tanah, Jakarta Pusat',
    bankName: 'BCA',
    bankAccountNo: '1234567890',
    bankAccountName: 'PT. Acme Dummy Company',
    npwpNumber: '00.0000.0000.1-123.000',
    npwpFile: 'NPWP-JUK.pdf',
    branch: 'Jakarta',
    phone: '0822-9999-0000',
  },
  {
    code: 'VEN002',
    name: 'PT. Beta Industries',
    address: '45 Tech Valley, Silicon Area, Jakarta Selatan',
    bankName: 'Mandiri',
    bankAccountNo: '0987654321',
    bankAccountName: 'PT. Beta Industries',
    npwpNumber: '00.0000.0000.2-456.000',
    npwpFile: 'NPWP-BETA.pdf',
    branch: 'Jakarta',
    phone: '0811-8888-0000',
  },
]
