import { Link, NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="border-b border-slate-200 bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="TaskIt home">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-lg font-bold text-white shadow-soft">T</span>
          <span className="text-xl font-bold tracking-tight text-text">TaskIt</span>
        </Link>
        <nav aria-label="Primary navigation">
          <NavLink
            to="/"
            className={({ isActive }) => `text-sm font-semibold transition ${isActive ? 'text-primary' : 'text-slate-500 hover:text-text'}`}
          >
            My materials
          </NavLink>
        </nav>
      </div>
    </header>
  )
}
