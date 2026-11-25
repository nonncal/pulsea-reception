import { statusLabels, type MembershipStatus } from '../lib/membership'

export function StatusBadge({ status }: { status: MembershipStatus }) {
  return <span className={`badge badge--${status}`}>{statusLabels[status]}</span>
}
