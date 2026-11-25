import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import { clientsReducer } from './clientsSlice'
import { loadClients, saveClients } from './persist'

const savedClients = loadClients()

export const store = configureStore({
  reducer: { clients: clientsReducer },
  preloadedState: savedClients ? { clients: { items: savedClients } } : undefined,
})

let lastSaved = store.getState().clients.items

store.subscribe(() => {
  const { items } = store.getState().clients
  if (items === lastSaved) return
  lastSaved = items
  saveClients(items)
})

export type RootState = ReturnType<typeof store.getState>

export const useAppDispatch = useDispatch.withTypes<typeof store.dispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
