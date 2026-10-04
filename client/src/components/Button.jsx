// Renders a consistent, accessible action button.
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  className = '',
  onClick,
}) {
  const variantClasses = variant === 'secondary'
    ? 'border border-primary bg-surface text-primary hover:bg-bg'
    : 'bg-primary text-surface hover:bg-primary/90'

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex min-h-11 items-center justify-center rounded-md px-tight py-tight text-body font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses} ${className}`}
    >
      {children}
    </button>
  )
}