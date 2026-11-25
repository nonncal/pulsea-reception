import { formatDate } from '../lib/date'

export function VisitHistory({ visits }: { visits: string[] }) {
  const newestFirst = [...visits].sort().reverse()

  return (
    <section className="panel block" aria-labelledby="history-title">
      <h3 id="history-title" className="block__title">
        История посещений
      </h3>
      {newestFirst.length === 0 ? (
        <p className="empty">Посещений пока нет.</p>
      ) : (
        <ol className="history">
          {newestFirst.map((visit, index) => (
            // В один день посещений может быть несколько, поэтому дата не уникальна.
            <li key={`${visit}-${newestFirst.length - index}`} className="num">
              <time dateTime={visit}>{formatDate(visit)}</time>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
