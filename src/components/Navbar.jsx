import { Menu, MoonStar, SunMedium, X } from 'lucide-react'
import { useState } from 'react'
import { navItems } from '../data/siteData'
import { scrollToId } from '../utils/helpers'

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [open, setOpen] = useState(false)

  const handleNav = (href) => {
    scrollToId(href)
    setOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
      <div className="container-width">
        <div className="flex h-20 items-center justify-between gap-4">
          <button onClick={() => handleNav('beranda')} className="text-left">
            <div className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
              Wayground <span className="text-gradient">Partner ID</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Pendampingan independen untuk pembelajaran digital</div>
          </button>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => handleNav(item.href)}
                className="text-sm font-medium text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={toggleDarkMode}
              className="rounded-full border border-slate-300 p-3 text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-500 dark:hover:text-brand-300"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
            </button>
            <button onClick={() => handleNav('kontak')} className="btn-primary">
              Konsultasi Gratis
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={toggleDarkMode}
              className="rounded-full border border-slate-300 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <SunMedium size={18} /> : <MoonStar size={18} />}
            </button>
            <button
              onClick={() => setOpen(!open)}
              className="rounded-full border border-slate-300 p-3 text-slate-700 dark:border-slate-700 dark:text-slate-200"
              aria-label="Toggle navigation"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="animate-fadeUp rounded-3xl border border-slate-200 bg-white p-4 pb-5 shadow-soft dark:border-slate-800 dark:bg-slate-900 lg:hidden">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => handleNav(item.href)}
                  className="rounded-2xl px-4 py-3 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  {item.label}
                </button>
              ))}
              <button onClick={() => handleNav('kontak')} className="btn-primary mt-2">
                Konsultasi Gratis
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
