import type { Client, Membership, Plan } from '../types'
import { addDays } from './date'

export type MembershipStatus = 'active' | 'expired' | 'used-up' | 'none'

export const statusLabels: Record<MembershipStatus, string> = {
  active: 'Активен',
  expired: 'Истёк',
  'used-up': 'Занятия закончились',
  none: 'Нет абонемента',
}

/**
 * Статус не хранится, а вычисляется: так он не может разойтись с данными.
 * В день endDate абонемент ещё действует.
 * Если истёк срок и кончились занятия, показываем «Истёк».
 */
export function getStatus(membership: Membership | null, today: string): MembershipStatus {
  if (!membership) return 'none'
  if (membership.endDate < today) return 'expired'
  if (membership.visitsLeft !== null && membership.visitsLeft <= 0) return 'used-up'
  return 'active'
}

/** День покупки входит в срок: 30 дней с 25.11 заканчиваются 24.12. */
export function createMembership(plan: Plan, today: string): Membership {
  return {
    planId: plan.id,
    endDate: addDays(today, plan.days - 1),
    visitsLeft: plan.visits,
  }
}

/** Возвращает нового клиента; без активного абонемента ничего не меняет. */
export function applyVisit(client: Client, today: string): Client {
  const { membership } = client
  if (!membership || getStatus(membership, today) !== 'active') return client

  return {
    ...client,
    membership: {
      ...membership,
      visitsLeft: membership.visitsLeft === null ? null : membership.visitsLeft - 1,
    },
    visits: [...client.visits, today],
  }
}
