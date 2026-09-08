// Maps PostStatus enum values to badge class names and labels
const STATUS_MAP = {
  DRAFT:     { cls: 'badge-draft',     label: 'Draft' },
  SCHEDULED: { cls: 'badge-scheduled', label: 'Scheduled' },
  PUBLISHED: { cls: 'badge-published', label: 'Published' },
  FAILED:    { cls: 'badge-failed',    label: 'Failed' },
}

export default function StatusBadge({ status }) {
  const { cls, label } = STATUS_MAP[status] || { cls: 'badge-draft', label: status }
  return <span className={`badge ${cls}`}>{label}</span>
}
