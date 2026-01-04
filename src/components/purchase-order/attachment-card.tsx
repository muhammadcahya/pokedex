import { useRef, useState } from 'react'
import { PaperclipIcon, PlusIcon, TrashIcon } from '@phosphor-icons/react'
import type { AttachmentInfo } from '@/lib/purchase-order/types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
      <Accordion defaultValue={['attachment']}>
        <AccordionItem
          value="attachment"
          className="bg-card rounded-lg border shadow-sm"
        >
          <AccordionTrigger className="bg-muted px-4">
            Attachment
          </AccordionTrigger>
          <AccordionContent className="pb-0">
            <div className="bg-muted flex gap-2 border-t p-3">
              <Button variant="outline" size="sm" onClick={openFileModal}>
                <PlusIcon />
                Add Attachment
              </Button>
            </div>
            {attachments.length === 0 ? (
              <Empty className="border-t py-8">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <PaperclipIcon />
                  </EmptyMedia>
                  <EmptyTitle>No Attachments</EmptyTitle>
                  <EmptyDescription>
                    Click Add Attachment to upload files.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <ul className="space-y-2 border-t px-4 py-3">
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
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

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
