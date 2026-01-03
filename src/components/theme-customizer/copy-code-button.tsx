import { useEffect, useState } from 'react'
import { CheckIcon, CopyIcon } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useThemeCustomizer } from '@/contexts/theme-customizer-context'
import { generateThemeCSS } from '@/lib/theme-customizer/generate-css'

export function CopyCodeButton() {
  const { config } = useThemeCustomizer()
  const [hasCopied, setHasCopied] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [hasCopied])

  const handleCopy = async () => {
    const css = generateThemeCSS(config)
    await navigator.clipboard.writeText(css)
    setHasCopied(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger render={<Button className="w-full">Copy Code</Button>} />
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Theme Code</DialogTitle>
          <DialogDescription>
            Copy and paste this configuration into your styles.css file.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <pre className="max-h-112.5 overflow-x-auto rounded-lg border bg-zinc-950 p-4 text-zinc-50 dark:bg-zinc-900">
            <code className="font-mono text-sm">
              {generateThemeCSS(config)}
            </code>
          </pre>
          <Button
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2"
            variant="outline"
          >
            {hasCopied ? <CheckIcon /> : <CopyIcon />}
            {hasCopied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
