import { Facebook, Instagram, Linkedin, Mail, Phone } from 'lucide-react'
import { contactInfo, navItems } from '../data/siteData'
import { scrollToId } from '../utils/helpers'

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-14 dark:border-slate-800 dark:bg-slate-950">
      <div className="container-width">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              Wayground <span className="text-gradient">Partner ID</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Layanan pendampingan independen untuk membantu guru, sekolah, tutor, dan lembaga belajar mengoptimalkan penggunaan Wayground.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Quick Links</h4>
            <div className="mt-5 space-y-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollToId(item.href)}
                  className="block text-sm text-slate-600 transition hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-300"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Kontak</h4>
            <div className="mt-5 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-3"><Mail size={16} /> {contactInfo.email}</div>
              <div className="flex items-center gap-3"><Phone size={16} /> {contactInfo.phone}</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white">Sosial Media</h4>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="rounded-full border border-slate-300 p-3 text-slate-700 transition hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-brand-500 dark:hover:text-brand-300"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <p>© 2026 Wayground Partner ID. Seluruh hak cipta dilindungi.</p>
          <p className="mt-2">Disclaimer: Layanan ini merupakan jasa pendampingan independen dan bukan website resmi Wayground.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
