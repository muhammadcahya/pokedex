import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import {
  MagnifyingGlassIcon,
  SpeakerHifiIcon,
  XIcon,
} from '@phosphor-icons/react'
import { z } from 'zod'

import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

import { Header } from '@/components/layout/header'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/components/ui/input-group'

const CategorySchema = z.enum(['electronics', 'clothing', 'books', 'toys'])
const SearchSortOptionsSchema = z.enum(['newest', 'oldest'])

type Category = z.infer<typeof CategorySchema>

const categoryOptions: Array<Category> = [
  'electronics',
  'clothing',
  'books',
  'toys',
]

const ItemFiltersSchema = z.object({
  query: z.string().optional(),
  hasDiscount: z.boolean().optional(),
  categories: z.array(CategorySchema).optional(),
  sort: SearchSortOptionsSchema.optional(),
})

type ItemFilters = z.infer<typeof ItemFiltersSchema>

export const Route = createFileRoute('/search')({
  validateSearch: zodValidator(ItemFiltersSchema),
  component: Search,
})

function Search() {
  const { query, hasDiscount, categories, sort } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  const normalizeSearch = (search: ItemFilters): ItemFilters => {
    return {
      query: search.query || undefined,
      hasDiscount: search.hasDiscount || undefined,
      categories: search.categories?.length ? search.categories : undefined,
      sort: search.sort || undefined,
    }
  }

  const updateFilters = <TKey extends keyof ItemFilters>(
    name: TKey,
    value: ItemFilters[TKey],
  ) => {
    navigate({
      search: (prev: ItemFilters) =>
        normalizeSearch({
          ...prev,
          [name]: value,
        }),
    })
  }

  const resetFilters = () => {
    navigate({
      search: () => ({}),
    })
  }

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8 flex flex-col gap-2">
          <h2 className="text-3xl font-bold tracking-tight">Search</h2>
          <p className="text-muted-foreground">
            Find what you are looking for.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-[300px_1fr]">
          {/* Filters Sidebar */}
          <div className="flex flex-col gap-6">
            <div className="bg-card rounded-lg border p-4 shadow-sm">
              <h3 className="mb-4 font-semibold">Filters</h3>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="search-query">Keywords</Label>
                  <InputGroup>
                    <InputGroupInput
                      id="search-query"
                      placeholder="Search..."
                      value={query || ''}
                      onChange={(e) => updateFilters('query', e.target.value)}
                    />
                    <InputGroupAddon>
                      <MagnifyingGlassIcon />
                    </InputGroupAddon>
                    {query && (
                      <InputGroupAddon align="inline-end">
                        <InputGroupButton
                          onClick={() => updateFilters('query', undefined)}
                        >
                          <XIcon className="h-4 w-4" />
                        </InputGroupButton>
                      </InputGroupAddon>
                    )}
                  </InputGroup>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="discount-switch" className="cursor-pointer">
                    Has Discount
                  </Label>
                  <Switch
                    id="discount-switch"
                    checked={hasDiscount || false}
                    onCheckedChange={(checked) =>
                      updateFilters('hasDiscount', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <Label htmlFor="sort-select" className="cursor-pointer">
                    Sort
                  </Label>
                  <Select
                    value={sort}
                    onValueChange={(value) =>
                      updateFilters(
                        'sort',
                        value as 'newest' | 'oldest' | undefined,
                      )
                    }
                  >
                    <SelectTrigger id="sort-select">
                      <SelectValue>Select...</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="grid gap-2 rounded-lg border p-3">
                    {categoryOptions.map((category) => {
                      const isSelected = categories?.includes(category) ?? false
                      return (
                        <Label
                          key={category}
                          className="hover:text-primary flex cursor-pointer items-center gap-2 text-sm font-normal"
                        >
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              const current = categories || []
                              const next = checked
                                ? [...current, category]
                                : current.filter((c) => c !== category)
                              updateFilters(
                                'categories',
                                next.length ? next : undefined,
                              )
                            }}
                          />
                          <span className="capitalize">{category}</span>
                        </Label>
                      )
                    })}
                  </div>
                  <Button onClick={resetFilters}>Reset filters</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex flex-col gap-4">
            <div className="bg-card rounded-xl border p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold">Debug View</h3>
              <div className="bg-muted/50 max-w-full overflow-auto rounded-lg p-4 font-mono text-sm">
                <pre>
                  {JSON.stringify(
                    { query, hasDiscount, categories, sort },
                    null,
                    2,
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
