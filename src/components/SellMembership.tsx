import { useState, type FormEvent } from 'react'
import { plans } from '../data'
import { getToday } from '../lib/date'
import { useAppDispatch } from '../store'
import { membershipSold } from '../store/clientsSlice'

type Props = {
  clientId: number
  onSold: () => void
}

const priceFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
  maximumFractionDigits: 0,
})

export function SellMembership({ clientId, onSold }: Props) {
  const dispatch = useAppDispatch()
  // Тариф не выбран заранее, чтобы не продать абонемент случайным кликом.
  const [planId, setPlanId] = useState<number | null>(null)

  const sell = (event: FormEvent) => {
    event.preventDefault()
    if (planId === null) return
    dispatch(membershipSold({ clientId, planId, today: getToday() }))
    onSold()
  }

  return (
    <form className="panel block" onSubmit={sell}>
      <fieldset className="plans">
        <legend className="block__title">Продать абонемент</legend>
        {plans.map((plan) => (
          <label key={plan.id} className="plan">
            <input
              type="radio"
              name="plan"
              value={plan.id}
              checked={planId === plan.id}
              onChange={() => setPlanId(plan.id)}
            />
            <span className="plan__title">{plan.title}</span>
            <span className="plan__term">Срок в днях: {plan.days}</span>
            <span className="plan__price num">{priceFormat.format(plan.price)}</span>
          </label>
        ))}
      </fieldset>
      <button type="submit" className="button button--primary" disabled={planId === null}>
        Продать
      </button>
    </form>
  )
}
