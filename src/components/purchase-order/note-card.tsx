import { ContentSection } from './content-section'
import { Textarea } from '@/components/ui/textarea'

export function NoteCard() {
  return (
    <ContentSection
      tabs={[
        {
          id: 'notes',
          label: 'Notes',
          content: (
            <Textarea
              placeholder="Enter additional notes here..."
              className="focus-visible:ring-ring/30 min-h-25 w-full resize-none rounded-none rounded-b-xl border-0 bg-transparent px-4 py-3 text-sm focus-visible:ring-1"
            />
          ),
        },
      ]}
    />
  )
}
