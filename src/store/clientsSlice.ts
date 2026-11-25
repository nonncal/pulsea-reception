import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { clients, plans } from '../data'
import { applyVisit, createMembership, getStatus } from '../lib/membership'
import type { Client } from '../types'

export type ClientsState = {
  items: Client[]
}

// «Сегодня» приходит в payload: редьюсер остаётся чистой функцией.
type VisitPayload = { clientId: number; today: string }
type SellPayload = VisitPayload & { planId: number }

const initialState: ClientsState = { items: clients }

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    visitMarked(state, { payload }: PayloadAction<VisitPayload>) {
      const index = state.items.findIndex((client) => client.id === payload.clientId)
      if (index === -1) return
      state.items[index] = applyVisit(state.items[index], payload.today)
    },
    membershipSold(state, { payload }: PayloadAction<SellPayload>) {
      const client = state.items.find((item) => item.id === payload.clientId)
      const plan = plans.find((item) => item.id === payload.planId)
      // Второй активный абонемент продать нельзя.
      if (!client || !plan || getStatus(client.membership, payload.today) === 'active') return
      client.membership = createMembership(plan, payload.today)
    },
  },
})

export const { visitMarked, membershipSold } = clientsSlice.actions
export const clientsReducer = clientsSlice.reducer
