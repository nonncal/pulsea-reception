export type Plan = {
  id: number
  title: string
  /** null: без ограничения по занятиям */
  visits: number | null
  days: number
  price: number
}

export type Membership = {
  planId: number
  /** YYYY-MM-DD, включительно */
  endDate: string
  /** null: безлимит */
  visitsLeft: number | null
}

export type Client = {
  id: number
  name: string
  phone: string
  membership: Membership | null
  /** Даты посещений в формате YYYY-MM-DD */
  visits: string[]
}
