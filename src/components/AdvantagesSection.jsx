import { advantages } from '../data/siteData'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

const AdvantagesSection = () => {
  return (
    <section id="keunggulan" className="section-space">
      <div className="container-width">
        <SectionHeader
          badge="Keunggulan"
          title="Kenapa banyak lembaga memilih pendekatan pendampingan yang lebih terarah"
          description="Kami tidak hanya membantu dari sisi teknis. Kami juga membantu agar penggunaan Wayground lebih relevan dengan proses belajar yang nyata."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {advantages.map((item) => {
            const Icon = item.icon
            return (
              <Reveal key={item.title}>
                <div className="card-base card-hover h-full p-6">
                  <div className="mb-4 inline-flex rounded-2xl bg-emerald-50 p-3 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default AdvantagesSection
