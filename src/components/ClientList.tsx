import { getStatus } from '../lib/membership'
import { searchClients } from '../lib/search'
import { useAppSelector } from '../store'
import { StatusBadge } from './StatusBadge'

type Props = {
  query: string
  onQueryChange: (query: string) => void
  selectedId: number | null
  onSelect: (id: number) => void
  today: string
}

export function ClientList({ query, onQueryChange, selectedId, onSelect, today }: Props) {
  const clients = useAppSelector((state) => state.clients.items)
  const found = searchClients(clients, query)

  return (
    <section className="panel list" aria-label="Клиенты">
      <div className="list__search">
        <label className="label" htmlFor="client-search">
          Поиск по имени или телефону
        </label>
        <input
          id="client-search"
          className="input"
          type="search"
          autoComplete="off"
          placeholder="Анна или 900 111"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <p className="visually-hidden" role="status">
          Найдено клиентов: {found.length}
        </p>
      </div>

      {found.length === 0 ? (
        <p className="empty">Никого не нашли. Проверьте имя или номер.</p>
      ) : (
        <ul className="list__items">
          {found.map((client) => (
            <li key={client.id}>
              <button
                type="button"
                className="row"
                data-client-id={client.id}
                aria-current={client.id === selectedId ? 'true' : undefined}
                onClick={() => onSelect(client.id)}
              >
                <span className="row__name">{client.name}</span>
                <span className="row__phone num">{client.phone}</span>
                <StatusBadge status={getStatus(client.membership, today)} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
