// Shows an accessible progress indicator with a status message.
export default function Spinner({ label }) {
  return (
    <div className="flex items-center gap-tight text-body" role="status" aria-live="polite">
      <span className="size-5 animate-spin rounded-full border-2 border-surface/40 border-t-surface" aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}