import { MessageCircleMore, CalendarCheck2 } from 'lucide-react'
import { contactInfo } from '../data/siteData'
import Reveal from './Reveal'
import { scrollToId } from '../utils/helpers'

const CTASection = () => {
  return (
    <section className="section-space">
      <div className="container-width">
        <Reveal>
          <div className="overflow-hidden rounded-[32px] bg-gradient-to-r from-brand-600 via-brand-600 to-accent-500 p-8 text-white shadow-glow md:p-12">
            <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">Siap mulai</p>
                <h2 className="mt-4 text-3xl font-extrabold leading-tight md:text-4xl">
                  Siap Mengoptimalkan Wayground untuk Pembelajaran yang Lebih Interaktif?
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-white/85">
                  Diskusikan kebutuhan lembaga, kelas, atau program belajar Anda. Kami bantu susun langkah yang lebih jelas dan realistis.
                </p>
              </div>

              <div className="flex flex-col gap-4 lg:items-end">
                <button onClick={() => scrollToId('kontak')} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-slate-100">
                  <CalendarCheck2 size={18} /> Jadwalkan Konsultasi
                </button>
                <a
                  href={contactInfo.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                  <MessageCircleMore size={18} /> Chat WhatsApp
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default CTASection
