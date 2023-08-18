import { JsonApiBodyBuilder } from '@distributedlab/jac'

import { api } from '@/api'
import { config } from '@/config'
import { PROMOCODE_STATUSES } from '@/enums'
import { PageOrder, Promocode } from '@/types'

export function usePromocodes() {
  const getPromocodes = (opts: {
    pageLimit?: number
    pageOrder?: PageOrder
    status?: PROMOCODE_STATUSES[]
  }) => {
    return api.get<Promocode[]>('/integrations/core/promocodes', {
      query: {
        page: {
          limit: opts.pageLimit ?? config.DEFAULT_PAGE_LIMIT,
          order: opts.pageOrder ?? 'desc',
        },
        filter: {
          ...(opts.status?.length ? { state: opts.status.join(',') } : {}),
        },
      },
    })
  }

  const updatePromocode = (opts: {
    id: string
    initial_usages: number
    expiration_date: string
    promocode?: string
    booksIds?: Array<number>
  }) => {
    const body = new JsonApiBodyBuilder()
      .setAttributes({
        initial_usages: opts.initial_usages,
        expiration_date: opts.expiration_date,
        promocode: opts.promocode,
        books: opts.booksIds ?? [],
      })
      .build()

    return api.patch(`/integrations/core/promocodes/${opts.id}`, {
      body,
    })
  }

  const createPromocode = (opts: {
    discount: number
    initial_usages: number
    expiration_date: string
    promocode?: string
    booksIds?: Array<number>
  }) => {
    const body = new JsonApiBodyBuilder()
      .setAttributes({
        discount: opts.discount,
        expiration_date: opts.expiration_date,
        initial_usages: opts.initial_usages,
        promocode: opts.promocode,
        books: opts.booksIds ?? [],
      })
      .build()

    return api.post<Promocode>('/integrations/core/promocodes', {
      body,
    })
  }

  const deletePromocode = (id: string) => {
    return api.delete(`/integrations/core/promocodes/${id}`)
  }

  return {
    getPromocodes,
    updatePromocode,
    createPromocode,
    deletePromocode,
  }
}
