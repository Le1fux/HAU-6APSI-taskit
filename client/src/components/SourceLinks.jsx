export default function SourceLinks({ sourceIds = [], sources = [] }) {
  const linkedSources = sourceIds
    .map((id) => sources.find((source) => source.id === id))
    .filter(Boolean)

  if (!linkedSources.length) return null

  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span className="font-semibold text-slate-500">References:</span>
      {linkedSources.map((source) => (
        <a
          key={source.id}
          href={source.url}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          {source.title} (opens in new tab)
        </a>
      ))}
    </div>
  )
}
