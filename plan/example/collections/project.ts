import { QueryClient } from '@tanstack/react-query'

import { createCollection } from '@tanstack/react-db'
import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { projectSchema } from '../types.ts'

export const queryClient = new QueryClient()

const API_URL = 'http://localhost:3000'
const PROJECT_API_URL = API_URL + '/projects'

export const projectCollection = createCollection(
  queryCollectionOptions({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await fetch(PROJECT_API_URL)
      if (!response.ok) {
        throw new Error('Failed to fetch projects')
      }
      return response.json()
    },
    queryClient,
    getKey: (item) => item.id,
    onUpdate: async ({ transaction }) => {
      const { original, changes } = transaction.mutations[0]
      await fetch(`${PROJECT_API_URL}/${original.id}`, {
        method: 'PATCH',
        body: JSON.stringify(changes),
      })
    },
    schema: projectSchema,
  }),
)
