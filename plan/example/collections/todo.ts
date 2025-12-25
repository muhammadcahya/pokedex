import { QueryClient } from '@tanstack/react-query'

import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { todoSchema } from '../types.ts'

export const queryClient = new QueryClient()

const API_URL = 'http://localhost:3000'
const TODO_API_URL = API_URL + '/todos'

export const todoCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['todos'],
    queryFn: async () => {
      const response = await fetch(TODO_API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch todos')
      }
      return response.json()
    },
    queryClient,
    getKey: (item) => item.id,
    onInsert: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map((mutation) =>
          fetch(TODO_API_URL, {
            method: 'POST',
            body: JSON.stringify(mutation),
          }),
        ),
      )
    },
    onUpdate: async ({ transaction }) => {
      await Promise.all(
        transaction.mutations.map(({ original, changes }) =>
          fetch(`${TODO_API_URL}/${original.id}`, {
            method: 'PATCH',
            body: JSON.stringify(changes),
          }),
        ),
      )
    },
    schema: todoSchema,
  }),
)
