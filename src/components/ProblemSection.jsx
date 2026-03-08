import { AlertCircle } from 'lucide-react'
import { painPoints } from '../data/siteData'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

const ProblemSection = () => {
  return (
    <section className="section-space">
      <div className="container-width">
        <SectionHeader
          badge="Tantangan umum"
          title="Banyak tim pengajar ingin memakai Wayground, tetapi proses awalnya sering belum tertata"
          description="Kami memahami kebutuhan praktis di lapangan. Karena itu, layanan kami difokuskan pada masalah yang paling sering dihadapi guru, tutor, dan lembaga pendidikan."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {painPoints.map((point) => (
            <Reveal key={point}>
              <div className="card-base card-hover h-full p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-rose-50 p-3 text-rose-500 dark:bg-rose-950/60">
                    <AlertCircle size={20} />
                  </div>
                  <p className="text-base leading-7 text-slate-700 dark:text-slate-200">{point}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProblemSection
