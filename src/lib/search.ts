import type { Client } from '../types'

const normalize = (text: string) => text.toLowerCase().replaceAll('ё', 'е').trim()
const onlyDigits = (text: string) => text.replace(/\D/g, '')

/** Телефон ищем по цифрам, чтобы пробелы, скобки и дефисы не мешали. */
function matchesPhone(phone: string, query: string): boolean {
  if (!/^[\d\s()+-]+$/.test(query)) return false

  const digits = onlyDigits(query)
  if (!digits) return false

  const phoneDigits = onlyDigits(phone)
  if (phoneDigits.includes(digits)) return true

  // Администратор может набрать номер с восьмёрки вместо +7.
  return digits.length > 1 && digits.startsWith('8') && phoneDigits.startsWith(`7${digits.slice(1)}`)
}

/** Слова имени можно вводить в любом порядке: «смирнова анна». */
function matchesName(name: string, query: string): boolean {
  const normalizedName = normalize(name)
  return query.split(/\s+/).every((word) => normalizedName.includes(word))
}

export function searchClients(clients: Client[], rawQuery: string): Client[] {
  const query = normalize(rawQuery)
  if (!query) return clients

  return clients.filter(
    (client) => matchesName(client.name, query) || matchesPhone(client.phone, query),
  )
}
