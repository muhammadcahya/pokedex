import { PaletteIcon } from '@phosphor-icons/react'
import { Customizer } from './customizer'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useIsMobile } from '@/hooks/use-mobile'

export function ThemeCustomizerButton() {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="outline" size="icon">
              <PaletteIcon />
              <span className="sr-only">Customize theme</span>
            </Button>
          }
        />
        <SheetContent
          side="right"
          className="w-full overflow-y-auto p-6 sm:max-w-md"
        >
          <Customizer />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="icon">
            <PaletteIcon />
            <span className="sr-only">Customize theme</span>
          </Button>
        }
      />
      <PopoverContent align="end" className="w-120 p-6" sideOffset={8}>
        <Customizer />
      </PopoverContent>
    </Popover>
  )
}
