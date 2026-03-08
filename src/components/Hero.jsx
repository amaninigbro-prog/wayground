import { ArrowRight, CheckCircle2, PlayCircle } from 'lucide-react'
import { trustBadges } from '../data/siteData'
import { scrollToId } from '../utils/helpers'
import Reveal from './Reveal'

const Hero = () => {
  return (
    <section id="beranda" className="relative overflow-hidden pt-10 md:pt-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(47,107,255,0.16),_transparent_25%),radial-gradient(circle_at_right,_rgba(124,58,237,0.12),_transparent_22%)]" />
      <div className="container-width">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-300">
                Solusi pendampingan Wayground
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl xl:text-6xl dark:text-white">
                Jasa Pendampingan Wayground untuk Guru, Sekolah, dan Lembaga Belajar
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                Bantu tim Anda menggunakan Wayground dengan lebih terarah. Mulai dari pelatihan guru, setup akun,
                pembuatan kuis interaktif, hingga konsultasi implementasi pembelajaran digital.
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button onClick={() => scrollToId('kontak')} className="btn-primary gap-2">
                  Konsultasi Sekarang <ArrowRight size={18} />
                </button>
                <button onClick={() => scrollToId('layanan')} className="btn-secondary gap-2">
                  <PlayCircle size={18} /> Lihat Layanan
                </button>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {trustBadges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                  >
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    {badge}
                  </span>
                ))}
              </div>

              <p className="mt-6 text-sm text-slate-500 dark:text-slate-400">
                Layanan ini bersifat independen dan bukan website resmi Wayground.
              </p>
            </div>
          </Reveal>

          <Reveal className="lg:pl-8">
            <div className="relative mx-auto max-w-xl animate-float">
              <div className="card-base overflow-hidden rounded-[32px] p-4 shadow-glow">
                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="mb-4 flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Dashboard Pembelajaran</p>
                      <p className="text-xs text-slate-500">Kelas, kuis, dan analitik lebih tertata</p>
                    </div>
                    <div className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 dark:bg-brand-950 dark:text-brand-300">
                      Live
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Progress Pengajar</p>
                          <p className="text-xs text-slate-500">Implementasi 4 kelas aktif</p>
                        </div>
                        <div className="text-sm font-bold text-brand-600">84%</div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-slate-500">
                            <span>Pelatihan guru</span>
                            <span>90%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-2 w-[90%] rounded-full bg-brand-600" />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-slate-500">
                            <span>Kuis interaktif</span>
                            <span>78%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-2 w-[78%] rounded-full bg-accent-500" />
                          </div>
                        </div>
                        <div>
                          <div className="mb-1 flex justify-between text-xs text-slate-500">
                            <span>Asesmen digital</span>
                            <span>85%</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                            <div className="h-2 w-[85%] rounded-full bg-emerald-500" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-3xl bg-white p-5 shadow-sm dark:bg-slate-900">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">Aktivitas Mingguan</p>
                        <div className="mt-4 flex h-28 items-end gap-2">
                          {[35, 52, 48, 68, 58, 76, 82].map((value, index) => (
                            <div key={index} className="flex-1 rounded-t-2xl bg-brand-500/90" style={{ height: `${value}%` }} />
                          ))}
                        </div>
                      </div>

                      <div className="rounded-3xl bg-brand-600 p-5 text-white shadow-sm">
                        <p className="text-sm font-semibold">Siap untuk implementasi</p>
                        <p className="mt-2 text-sm text-white/85">
                          Setup, pelatihan, dan konten interaktif disiapkan lebih efisien.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Hero
