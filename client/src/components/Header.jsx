import { Link, NavLink } from 'react-router-dom'

// Provides the StudyLens brand and primary navigation.
export default function Header({ isDarkMode, onToggleTheme }) {
  return (
    <header className="border-b border-text/10 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-screen py-tight">
        <Link to="/" className="flex min-w-0 items-center gap-tight" aria-label="StudyLens home">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-body font-bold text-white" aria-hidden="true">S</span>
          <span className="text-body font-bold leading-tight text-text">StudyLens</span>
        </Link>
        <div className="flex shrink-0 items-center gap-4 sm:gap-6">
          <nav aria-label="Primary navigation">
            <NavLink
              to="/"
              className={({ isActive }) => `text-body font-bold transition-colors ${isActive ? 'text-primary' : 'text-text hover:text-primary'}`}
            >
              My library
            </NavLink>
          </nav>
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            aria-pressed={isDarkMode}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-text/20 bg-surface px-3 text-small font-bold text-text transition-colors hover:bg-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {isDarkMode ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
    </header>
  )
}
