import { useState } from 'react'
import { ClientCard } from './components/ClientCard'
import { ClientList } from './components/ClientList'
import { formatDate } from './lib/date'
import { useToday } from './lib/useToday'
import { useAppSelector } from './store'

export default function App() {
  const clients = useAppSelector((state) => state.clients.items)
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const today = useToday()
  const selected = clients.find((client) => client.id === selectedId)

  const backToList = () => {
    const id = selectedId
    setSelectedId(null)
    // Возвращаем фокус на строку клиента, когда список снова на экране.
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(`[data-client-id="${id}"]`)?.focus()
    })
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1 className="topbar__title">
          Pulsea <span>Ресепшен</span>
        </h1>
        <p className="topbar__date num">
          Сегодня <time dateTime={today}>{formatDate(today)}</time>
        </p>
      </header>

      {/* На телефоне виден либо список, либо карточка. */}
      <main className={selected ? 'layout layout--card' : 'layout'}>
        <ClientList
          query={query}
          onQueryChange={setQuery}
          selectedId={selectedId}
          onSelect={setSelectedId}
          today={today}
        />
        {selected ? (
          // key сбрасывает выбранный тариф и сообщения при смене клиента.
          <ClientCard key={selected.id} client={selected} today={today} onBack={backToList} />
        ) : (
          <p className="panel placeholder">Выберите клиента в списке, чтобы открыть карточку.</p>
        )}
      </main>
    </div>
  )
}
