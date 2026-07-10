import { useRef, useState } from 'react'
import { PaperclipIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import { ContentSection } from './content-section'
import type { AttachmentInfo } from '@/lib/purchase-order/types'
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
import { formatFileSize } from '@/lib/purchase-order/calculations'

export function AttachmentCard() {
  const [attachments, setAttachments] = useState<Array<AttachmentInfo>>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const openFileModal = () => {
    setIsModalOpen(true)
  }

  const closeFileModal = () => {
    setIsModalOpen(false)
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      const newAttachments: Array<AttachmentInfo> = Array.from(files).map(
        (file) => ({
          id: Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: formatFileSize(file.size),
          type: file.type,
        }),
      )
      setAttachments((prevAttachments) => [
        ...prevAttachments,
        ...newAttachments,
      ])
    }
    closeFileModal()
  }

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter((attachment) => attachment.id !== id))
  }

  return (
    <>
      <ContentSection
        tabs={[
          {
            id: 'attachments',
            label: 'Attachments',
            content: (
              <>
                {/* Mobile Actions */}
                <div className="flex border-b p-3 md:hidden">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openFileModal}
                    className="w-full"
                  >
                    <PlusIcon />
                    Add Attachment
                  </Button>
                </div>
                <ul className="space-y-2 px-4 py-3">
                  {attachments.map((attachment) => (
                    <li
                      key={attachment.id}
                      className="border-border flex items-center justify-between rounded-md border p-2"
                    >
                      <div className="flex items-center">
                        <PaperclipIcon className="text-muted-foreground mr-2 h-4 w-4" />
                        <span className="text-sm">{attachment.name}</span>
                        <span className="text-muted-foreground ml-2 text-xs">
                          ({attachment.size}) - {attachment.type}
                        </span>
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeAttachment(attachment.id)}
                      >
                        <TrashIcon />
                      </Button>
                    </li>
                  ))}
                </ul>
              </>
            ),
          },
        ]}
        actions={
          <Button variant="outline" size="sm" onClick={openFileModal}>
            <PlusIcon />
            Add Attachment
          </Button>
        }
        isEmpty={attachments.length === 0}
        emptyState={
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <PaperclipIcon />
              </EmptyMedia>
              <EmptyTitle>No Attachments</EmptyTitle>
              <EmptyDescription>
                Click Add Attachment to upload files.
              </EmptyDescription>
            </EmptyHeader>
            <Button
              variant="outline"
              size="sm"
              onClick={openFileModal}
              className="md:hidden"
            >
              <PlusIcon />
              Add Attachment
            </Button>
          </Empty>
        }
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Attachments</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              Choose Files
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
