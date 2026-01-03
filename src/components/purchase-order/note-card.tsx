import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Textarea } from '@/components/ui/textarea'

export function NoteCard() {
  return (
    <Accordion defaultValue={['note']}>
      <AccordionItem value="note" className="rounded-lg border">
        <AccordionTrigger className="px-4">Note</AccordionTrigger>
        <AccordionContent className="pb-0">
          <Textarea
            placeholder="Enter additional notes here..."
            className="focus-visible:ring-ring/30 min-h-25 w-full resize-none rounded-none rounded-b-lg border-0 border-t bg-transparent px-4 py-3 text-sm focus-visible:ring-1"
          />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
