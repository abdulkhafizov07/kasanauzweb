import type { QueryClient } from '@tanstack/react-query'

export interface RouterContext {
  head: string
  queryClient: QueryClient
}
