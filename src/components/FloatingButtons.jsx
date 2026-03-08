import { ArrowUp, MessageCircle } from 'lucide-react'
import { contactInfo } from '../data/siteData'

const FloatingButtons = ({ showBackToTop }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-soft transition hover:-translate-y-1 hover:text-brand-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <a
        href={contactInfo.whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-3 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:-translate-y-1"
      >
        <MessageCircle size={18} />
        WhatsApp
      </a>
    </div>
  )
}

export default FloatingButtons
