// Даты храним строками YYYY-MM-DD: их можно сравнивать как строки.

const pad = (value: number) => String(value).padStart(2, '0')

/** Дата по местному времени. toISOString() не подходит: он отдаёт дату по UTC. */
export function toISODate(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export const getToday = () => toISODate(new Date())

export function addDays(isoDate: string, days: number): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return toISODate(new Date(year, month - 1, day + days))
}

/** 2026-11-25 → 25.11.2026 */
export function formatDate(isoDate: string): string {
  return isoDate.split('-').reverse().join('.')
}
