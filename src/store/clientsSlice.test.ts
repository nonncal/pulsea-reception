import { describe, expect, it } from 'vitest'
import { clientsReducer, membershipSold, visitMarked } from './clientsSlice'

const TODAY = '2026-11-25'
const initial = clientsReducer(undefined, { type: 'init' })
const find = (state: typeof initial, id: number) => state.items.find((item) => item.id === id)!

describe('clientsSlice', () => {
  it('продаёт абонемент клиенту без него, после чего можно отметить посещение', () => {
    const sold = clientsReducer(initial, membershipSold({ clientId: 4, planId: 1, today: TODAY }))
    expect(find(sold, 4).membership).toEqual({ planId: 1, endDate: '2026-12-01', visitsLeft: 1 })

    const visited = clientsReducer(sold, visitMarked({ clientId: 4, today: TODAY }))
    expect(find(visited, 4).membership?.visitsLeft).toBe(0)
    expect(find(visited, 4).visits).toEqual([TODAY])
  })

  it('не продаёт второй абонемент при активном', () => {
    const next = clientsReducer(initial, membershipSold({ clientId: 1, planId: 3, today: TODAY }))
    expect(next).toBe(initial)
  })

  it('не отмечает посещение по истёкшему абонементу', () => {
    const next = clientsReducer(initial, visitMarked({ clientId: 2, today: TODAY }))
    expect(find(next, 2)).toEqual(find(initial, 2))
  })
})
