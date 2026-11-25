import type { Client, Plan } from './types'

export const plans: Plan[] = [
  { id: 1, title: 'Разовое', visits: 1, days: 7, price: 1000 },
  { id: 2, title: '8 занятий', visits: 8, days: 30, price: 6000 },
  { id: 3, title: 'Безлимит', visits: null, days: 30, price: 9000 },
]

export const clients: Client[] = [
  {
    id: 1,
    name: 'Анна Смирнова',
    phone: '+7 900 111-22-33',
    membership: { planId: 2, endDate: '2026-12-31', visitsLeft: 3 },
    visits: ['2026-11-10', '2026-11-14'],
  },
  {
    id: 2,
    name: 'Олег Петров',
    phone: '+7 900 222-33-44',
    membership: { planId: 3, endDate: '2026-11-01', visitsLeft: null },
    visits: ['2026-10-20'],
  },
  {
    id: 3,
    name: 'Мария Иванова',
    phone: '+7 900 333-44-55',
    membership: { planId: 2, endDate: '2026-12-20', visitsLeft: 0 },
    visits: [],
  },
  { id: 4, name: 'Игорь Ким', phone: '+7 900 444-55-66', membership: null, visits: [] },
  {
    id: 5,
    name: 'Елена Орлова',
    phone: '+7 900 555-66-77',
    membership: { planId: 3, endDate: '2026-12-15', visitsLeft: null },
    visits: ['2026-11-12', '2026-11-15', '2026-11-17'],
  },
]
