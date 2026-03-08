import { steps } from '../data/siteData'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

const HowItWorksSection = () => {
  return (
    <section className="section-space bg-slate-100/70 dark:bg-slate-900/40">
      <div className="container-width">
        <SectionHeader
          badge="Cara kerja"
          title="Alur kerja yang sederhana, jelas, dan mudah diikuti"
          description="Kami menjaga proses tetap praktis agar Anda bisa cepat bergerak dari kebutuhan awal menuju implementasi."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <Reveal key={step.title}>
                <div className="card-base h-full p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                      <Icon size={22} />
                    </div>
                    <span className="text-sm font-bold text-slate-300 dark:text-slate-700">0{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default HowItWorksSection
