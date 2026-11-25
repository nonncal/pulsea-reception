import { useEffect, useRef, useState } from 'react'
import { plans } from '../data'
import { formatDate, getToday } from '../lib/date'
import { getStatus } from '../lib/membership'
import { useAppDispatch } from '../store'
import { visitMarked } from '../store/clientsSlice'
import type { Client } from '../types'
import { SellMembership } from './SellMembership'
import { StatusBadge } from './StatusBadge'
import { VisitHistory } from './VisitHistory'

type Props = {
  client: Client
  today: string
  onBack: () => void
}

export function ClientCard({ client, today, onBack }: Props) {
  const dispatch = useAppDispatch()
  const [notice, setNotice] = useState('')
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Переводим фокус на открытую карточку: это важно для клавиатуры и телефона.
  useEffect(() => {
    window.scrollTo(0, 0)
    headingRef.current?.focus({ preventScroll: true })
  }, [])

  const { membership } = client
  const status = getStatus(membership, today)
  const isActive = status === 'active'
  const plan = plans.find((item) => item.id === membership?.planId)
  const todayCount = client.visits.filter((visit) => visit === today).length

  const visitsLeft = () => {
    if (!membership) return '—'
    return membership.visitsLeft === null ? 'Безлимит' : membership.visitsLeft
  }

  const markVisit = () => {
    // Сразу после полуночи today на экране может отставать, поэтому проверяем заново.
    const now = getToday()
    if (getStatus(membership, now) !== 'active') {
      setNotice('Абонемент больше не активен')
      return
    }
    dispatch(visitMarked({ clientId: client.id, today: now }))
    setNotice('Посещение отмечено')
    // После последнего занятия кнопка отключается и теряет фокус.
    if (membership?.visitsLeft === 1) headingRef.current?.focus()
  }

  // Форма продажи исчезает вместе с фокусом, поэтому возвращаем его на имя клиента.
  const onSold = () => {
    setNotice('Абонемент продан')
    headingRef.current?.focus()
  }

  return (
    <article className="card" aria-labelledby="client-name">
      <button type="button" className="button button--outline card__back" onClick={onBack}>
        ← К списку
      </button>

      <section className="panel block">
        <header className="card__header">
          <div>
            <h2 id="client-name" className="card__name" ref={headingRef} tabIndex={-1}>
              {client.name}
            </h2>
            <a className="card__phone num" href={`tel:${client.phone.replace(/[^\d+]/g, '')}`}>
              {client.phone}
            </a>
          </div>
          <StatusBadge status={status} />
        </header>

        <dl className="facts">
          <div>
            <dt>Тариф</dt>
            <dd>{membership ? (plan?.title ?? 'Неизвестный тариф') : '—'}</dd>
          </div>
          <div>
            <dt>Действует до</dt>
            <dd className="num">{membership ? formatDate(membership.endDate) : '—'}</dd>
          </div>
          <div>
            <dt>Осталось занятий</dt>
            <dd className="num">{visitsLeft()}</dd>
          </div>
        </dl>

        <div className="visit">
          <button
            type="button"
            className="button button--primary"
            disabled={!isActive}
            aria-describedby="visit-hint"
            onClick={markVisit}
          >
            Отметить посещение
          </button>
          <p id="visit-hint" className="hint">
            {!isActive && 'Нет активного абонемента'}
            {isActive && todayCount > 0 && `Сегодня уже отмечено: ${todayCount}`}
          </p>
        </div>
        <p className="notice" role="status">
          {notice}
        </p>
      </section>

      {!isActive && (
        <SellMembership clientId={client.id} onSold={onSold} />
      )}

      <VisitHistory visits={client.visits} />
    </article>
  )
}
