import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { faqs } from '../data/siteData'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'
import { cn } from '../utils/helpers'

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="section-space">
      <div className="container-width">
        <SectionHeader
          badge="FAQ"
          title="Pertanyaan yang paling sering diajukan"
          description="Kami rangkum beberapa pertanyaan umum agar Anda bisa memahami layanan ini dengan lebih cepat."
        />

        <div className="mx-auto max-w-4xl space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index
            return (
              <Reveal key={faq.question}>
                <div className="card-base overflow-hidden">
                  <button
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className="text-base font-semibold text-slate-900 dark:text-white">{faq.question}</span>
                    <ChevronDown className={cn('shrink-0 transition', isOpen && 'rotate-180')} size={20} />
                  </button>
                  {isOpen && (
                    <div className="border-t border-slate-200 px-6 pb-5 pt-4 text-sm leading-7 text-slate-600 dark:border-slate-800 dark:text-slate-300">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FAQSection
