import { Check } from 'lucide-react'
import { pricingPlans } from '../data/siteData'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'
import { cn, scrollToId } from '../utils/helpers'

const PricingSection = () => {
  return (
    <section id="paket" className="section-space">
      <div className="container-width">
        <SectionHeader
          badge="Paket harga"
          title="Pilih paket yang sesuai dengan kebutuhan penggunaan dan pendampingan Anda"
          description="Mulai dari kebutuhan dasar hingga implementasi yang lebih menyeluruh untuk sekolah dan lembaga pendidikan."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Reveal key={plan.name}>
              <div
                className={cn(
                  'card-base relative h-full p-8',
                  plan.highlighted && 'scale-[1.02] border-brand-300 ring-4 ring-brand-100 dark:border-brand-700 dark:ring-brand-950'
                )}
              >
                {plan.highlighted && (
                  <span className="absolute right-6 top-6 rounded-full bg-brand-600 px-3 py-1 text-xs font-semibold text-white">
                    Paling diminati
                  </span>
                )}

                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{plan.description}</p>
                  <div className="mt-6 text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</div>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Harga mulai, dapat disesuaikan kebutuhan</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                      <span className="mt-0.5 inline-flex rounded-full bg-emerald-100 p-1 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-300">
                        <Check size={14} />
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <button onClick={() => scrollToId('kontak')} className={cn('mt-8 w-full', plan.highlighted ? 'btn-primary' : 'btn-secondary')}>
                  Pilih Paket
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection
