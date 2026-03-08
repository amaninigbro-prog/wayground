import { Mail, MapPin, Phone } from 'lucide-react'
import { useState } from 'react'
import { contactInfo } from '../data/siteData'
import { validateEmail, validatePhone } from '../utils/helpers'
import Reveal from './Reveal'
import SectionHeader from './SectionHeader'

const initialForm = {
  name: '',
  email: '',
  whatsapp: '',
  institution: '',
  message: '',
}

const ContactSection = ({ setToast }) => {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!form.name.trim()) newErrors.name = 'Nama wajib diisi'
    if (!form.email.trim()) newErrors.email = 'Email wajib diisi'
    else if (!validateEmail(form.email)) newErrors.email = 'Format email belum valid'

    if (!form.whatsapp.trim()) newErrors.whatsapp = 'Nomor WhatsApp wajib diisi'
    else if (!validatePhone(form.whatsapp)) newErrors.whatsapp = 'Format nomor WhatsApp belum valid'

    if (!form.institution.trim()) newErrors.institution = 'Instansi wajib diisi'
    if (!form.message.trim()) newErrors.message = 'Pesan wajib diisi'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      setToast({ message: 'Mohon lengkapi form dengan benar.', type: 'error' })
      return
    }

    setToast({ message: 'Terima kasih. Permintaan konsultasi Anda berhasil dikirim.', type: 'success' })
    setForm(initialForm)
    setErrors({})
  }

  return (
    <section id="kontak" className="section-space bg-slate-100/70 dark:bg-slate-900/40">
      <div className="container-width">
        <SectionHeader
          badge="Kontak"
          title="Diskusikan kebutuhan Anda dengan tim kami"
          description="Isi form berikut untuk konsultasi awal. Anda juga dapat langsung menghubungi kami melalui WhatsApp."
        />

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <Reveal>
            <div className="card-base p-6 md:p-8">
              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Nama</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} className="input-base" placeholder="Nama lengkap" />
                  {errors.name && <p className="mt-2 text-sm text-rose-500">{errors.name}</p>}
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Email</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} className="input-base" placeholder="nama@email.com" />
                    {errors.email && <p className="mt-2 text-sm text-rose-500">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Nomor WhatsApp</label>
                    <input type="text" name="whatsapp" value={form.whatsapp} onChange={handleChange} className="input-base" placeholder="08xxxxxxxxxx" />
                    {errors.whatsapp && <p className="mt-2 text-sm text-rose-500">{errors.whatsapp}</p>}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Instansi</label>
                  <input type="text" name="institution" value={form.institution} onChange={handleChange} className="input-base" placeholder="Nama sekolah, bimbel, atau lembaga" />
                  {errors.institution && <p className="mt-2 text-sm text-rose-500">{errors.institution}</p>}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-200">Pesan</label>
                  <textarea name="message" value={form.message} onChange={handleChange} rows="5" className="input-base resize-none" placeholder="Ceritakan kebutuhan Anda secara singkat" />
                  {errors.message && <p className="mt-2 text-sm text-rose-500">{errors.message}</p>}
                </div>

                <button type="submit" className="btn-primary w-full">
                  Kirim Permintaan
                </button>

                <p className="text-xs leading-6 text-slate-500 dark:text-slate-400">
                  Disclaimer: Wayground Partner ID adalah layanan pendampingan independen dan bukan bagian dari website resmi Wayground.
                </p>
              </form>
            </div>
          </Reveal>

          <Reveal>
            <div className="space-y-6">
              <div className="card-base p-6 md:p-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Informasi Kontak</h3>
                <div className="mt-6 space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Email</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{contactInfo.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">WhatsApp</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{contactInfo.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-brand-50 p-3 text-brand-600 dark:bg-brand-950 dark:text-brand-300">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Alamat</p>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{contactInfo.address}</p>
                    </div>
                  </div>
                </div>

                <a
                  href={contactInfo.whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary mt-8 w-full"
                >
                  Chat WhatsApp Sekarang
                </a>
              </div>

              <div className="card-base overflow-hidden p-3">
                <div className="h-[320px] overflow-hidden rounded-[24px] bg-slate-200 dark:bg-slate-800">
                  <iframe
                    title="Lokasi Wayground Partner ID"
                    src="https://www.google.com/maps?q=Jakarta&output=embed"
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
