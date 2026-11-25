import { describe, expect, it } from 'vitest'
import { plans } from '../data'
import type { Client, Membership } from '../types'
import { addDays, toISODate } from './date'
import { applyVisit, createMembership, getStatus } from './membership'

const TODAY = '2026-11-25'

const membership = (patch: Partial<Membership> = {}): Membership => ({
  planId: 2,
  endDate: '2026-12-31',
  visitsLeft: 3,
  ...patch,
})

const client = (value: Membership | null): Client => ({
  id: 1,
  name: 'Анна Смирнова',
  phone: '+7 900 111-22-33',
  membership: value,
  visits: [],
})

describe('даты', () => {
  it('берёт местную дату, а не UTC', () => {
    expect(toISODate(new Date(2026, 0, 5, 0, 30))).toBe('2026-01-05')
  })

  it('переходит через границу месяца и года', () => {
    expect(addDays('2026-12-30', 3)).toBe('2027-01-02')
  })
})

describe('getStatus', () => {
  it('различает четыре статуса', () => {
    expect(getStatus(null, TODAY)).toBe('none')
    expect(getStatus(membership(), TODAY)).toBe('active')
    expect(getStatus(membership({ endDate: '2026-11-01' }), TODAY)).toBe('expired')
    expect(getStatus(membership({ visitsLeft: 0 }), TODAY)).toBe('used-up')
  })

  it('считает абонемент активным в последний день срока', () => {
    expect(getStatus(membership({ endDate: TODAY }), TODAY)).toBe('active')
    expect(getStatus(membership({ endDate: '2026-11-24' }), TODAY)).toBe('expired')
  })

  it('не путает безлимит с нулём занятий', () => {
    expect(getStatus(membership({ visitsLeft: null }), TODAY)).toBe('active')
  })

  it('показывает «Истёк», когда нет ни срока, ни занятий', () => {
    expect(getStatus(membership({ endDate: '2026-11-01', visitsLeft: 0 }), TODAY)).toBe('expired')
  })
})

describe('createMembership', () => {
  it('включает день покупки в срок тарифа', () => {
    expect(createMembership(plans[0], TODAY).endDate).toBe('2026-12-01')
    expect(createMembership(plans[1], TODAY)).toEqual({
      planId: 2,
      endDate: '2026-12-24',
      visitsLeft: 8,
    })
  })
})

describe('applyVisit', () => {
  it('списывает занятие и добавляет дату', () => {
    const result = applyVisit(client(membership()), TODAY)
    expect(result.membership?.visitsLeft).toBe(2)
    expect(result.visits).toEqual([TODAY])
  })

  it('у безлимита только пополняет историю', () => {
    const result = applyVisit(client(membership({ visitsLeft: null })), TODAY)
    expect(result.membership?.visitsLeft).toBeNull()
    expect(result.visits).toEqual([TODAY])
  })

  it('ничего не меняет без активного абонемента', () => {
    for (const value of [null, membership({ visitsLeft: 0 }), membership({ endDate: '2026-01-01' })]) {
      const source = client(value)
      expect(applyVisit(source, TODAY)).toBe(source)
    }
  })
})
