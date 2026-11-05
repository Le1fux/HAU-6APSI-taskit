import { Link, NavLink } from 'react-router-dom'

// Provides the StudyLens brand and primary navigation.
export default function Header() {
  return (
    <header className="border-b border-text/10 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-screen py-tight">
        <Link to="/" className="flex items-center gap-tight" aria-label="StudyLens home">
          <span className="grid size-10 place-items-center rounded-xl bg-primary text-body font-bold text-surface" aria-hidden="true">S</span>
          <span className="text-heading text-text">StudyLens</span>
        </Link>
        <nav aria-label="Primary navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `text-body font-bold transition-colors ${isActive ? 'text-primary' : 'text-text hover:text-primary'}`}
          >
            My library
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
