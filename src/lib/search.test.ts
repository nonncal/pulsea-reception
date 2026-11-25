import { describe, expect, it } from 'vitest'
import { clients } from '../data'
import { searchClients } from './search'

const names = (query: string) => searchClients(clients, query).map((client) => client.name)

describe('searchClients', () => {
  it('возвращает всех при пустом запросе', () => {
    expect(names('   ')).toHaveLength(clients.length)
  })

  it('ищет по части имени без учёта регистра и порядка слов', () => {
    expect(names('СМИР')).toEqual(['Анна Смирнова'])
    expect(names('смирнова анна')).toEqual(['Анна Смирнова'])
  })

  it('ищет телефон в любом формате', () => {
    for (const query of ['900 111', '9001112233', '+7 (900) 111-22-33', '8 900 111', '22-33']) {
      expect(names(query)).toContain('Анна Смирнова')
    }
  })

  it('ничего не находит по чужому запросу', () => {
    expect(names('Фёдор')).toEqual([])
    expect(names('000000')).toEqual([])
    expect(names('+')).toEqual([])
  })
})
