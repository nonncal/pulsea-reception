import { useEffect, useState } from 'react'
import { getToday } from './date'

/**
 * Экран на ресепшене могут не закрывать сутками, поэтому дату обновляем:
 * раз в минуту и при возвращении на вкладку.
 */
export function useToday(): string {
  const [today, setToday] = useState(getToday)

  useEffect(() => {
    const update = () => setToday(getToday())
    const timer = window.setInterval(update, 60_000)
    document.addEventListener('visibilitychange', update)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return today
}
