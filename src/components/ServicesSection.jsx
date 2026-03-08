import { ArrowUpRight } from 'lucide-react'
import { services } from '../data/siteData'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'
import { scrollToId } from '../utils/helpers'

const ServicesSection = () => {
  return (
    <section id="layanan" className="section-space bg-white dark:bg-slate-900/30">
      <div className="container-width">
        <SectionHeader
          badge="Layanan"
          title="Layanan yang dirancang untuk membantu penggunaan Wayground jadi lebih efektif"
          description="Setiap layanan dibuat untuk menjawab kebutuhan implementasi, pelatihan, produksi konten, dan strategi pembelajaran digital yang lebih terukur."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <Reveal key={service.title}>
                <div className="card-base card-hover h-full p-6">
                  <div className="flex h-full flex-col">
                    <div className="mb-5 inline-flex w-fit rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{service.title}</h3>
                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-600 dark:text-slate-300">
                      {service.description}
                    </p>
                    <button
                      onClick={() => scrollToId('kontak')}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700 dark:text-brand-300"
                    >
                      {service.cta} <ArrowUpRight size={16} />
                    </button>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
