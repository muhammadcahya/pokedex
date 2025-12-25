import { useEffect, useState } from 'react'
import { MagnifyingGlassIcon, XIcon } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useDebounce } from '@/hooks/use-debounce'
import { DEBOUNCE_DELAYS } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search Pokemon by name or number...',
  className,
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value)
  const debouncedValue = useDebounce(inputValue, DEBOUNCE_DELAYS.search)

  // Sync external value changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Trigger onChange when debounced value changes
  useEffect(() => {
    if (debouncedValue !== value) {
      onChange(debouncedValue)
    }
  }, [debouncedValue, onChange, value])

  const handleClear = () => {
    setInputValue('')
    onChange('')
  }

  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <MagnifyingGlassIcon className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2" />
      <Input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pr-9 pl-9"
      />
      {inputValue && (
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={handleClear}
          className="absolute top-1/2 right-2 -translate-y-1/2"
        >
          <XIcon className="size-3" />
        </Button>
      )}
    </div>
  )
}
