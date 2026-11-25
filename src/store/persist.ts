import type { Client, Membership } from '../types'

const STORAGE_KEY = 'pulsea-reception:clients:v1'

const isMembership = (value: unknown): value is Membership => {
  if (typeof value !== 'object' || value === null) return false
  const { planId, endDate, visitsLeft } = value as Record<string, unknown>
  return (
    typeof planId === 'number' &&
    typeof endDate === 'string' &&
    (visitsLeft === null || typeof visitsLeft === 'number')
  )
}

const isClient = (value: unknown): value is Client => {
  if (typeof value !== 'object' || value === null) return false
  const { id, name, phone, membership, visits } = value as Record<string, unknown>
  return (
    typeof id === 'number' &&
    typeof name === 'string' &&
    typeof phone === 'string' &&
    (membership === null || isMembership(membership)) &&
    Array.isArray(visits) &&
    visits.every((visit) => typeof visit === 'string')
  )
}

/** Повреждённые или чужие данные игнорируем: приложение откроется на моках. */
export function loadClients(): Client[] | null {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')
    return Array.isArray(parsed) && parsed.length > 0 && parsed.every(isClient) ? parsed : null
  } catch {
    return null
  }
}

export function saveClients(clients: Client[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clients))
  } catch {
    // Хранилище переполнено или запрещено: работаем без сохранения.
  }
}
