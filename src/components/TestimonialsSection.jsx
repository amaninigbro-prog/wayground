import { Star } from 'lucide-react'
import { testimonials } from '../data/siteData'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

const TestimonialsSection = () => {
  return (
    <section id="testimoni" className="section-space bg-white dark:bg-slate-900/30">
      <div className="container-width">
        <SectionHeader
          badge="Testimoni"
          title="Respon positif dari pengguna layanan pendampingan kami"
          description="Contoh testimoni berikut bersifat dummy, namun disusun agar mencerminkan kebutuhan nyata di dunia pendidikan."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {testimonials.map((item) => (
            <Reveal key={item.name + item.company}>
              <div className="card-base card-hover h-full p-6">
                <div className="mb-4 flex gap-1 text-amber-400">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">“{item.review}”</p>
                <div className="mt-6 border-t border-slate-200 pt-4 dark:border-slate-800">
                  <p className="font-semibold text-slate-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.role} · {item.company}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
