import { useEffect, useMemo, useState } from 'react'
import AdvantagesSection from './components/AdvantagesSection'
import ContactSection from './components/ContactSection'
import CTASection from './components/CTASection'
import FAQSection from './components/FAQSection'
import FloatingButtons from './components/FloatingButtons'
import Footer from './components/Footer'
import Hero from './components/Hero'
import HowItWorksSection from './components/HowItWorksSection'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import PricingSection from './components/PricingSection'
import ProblemSection from './components/ProblemSection'
import ServicesSection from './components/ServicesSection'
import TestimonialsSection from './components/TestimonialsSection'
import Toast from './components/Toast'

const App = () => {
  const [darkMode, setDarkMode] = useState(false)
  const [toast, setToast] = useState({ message: '', type: 'success' })
  const [loading, setLoading] = useState(true)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const storedMode = localStorage.getItem('wayground-theme')
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const enabled = storedMode ? storedMode === 'dark' : systemDark

    setDarkMode(enabled)
    document.documentElement.classList.toggle('dark', enabled)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    localStorage.setItem('wayground-theme', darkMode ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  useEffect(() => {
    if (!toast.message) return
    const timer = setTimeout(() => {
      setToast({ message: '', type: 'success' })
    }, 3000)
    return () => clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const schemaData = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'Wayground Partner ID',
      serviceType: 'Jasa pendampingan penggunaan Wayground',
      areaServed: 'Indonesia',
      description:
        'Layanan pendampingan independen untuk pelatihan guru, setup akun, pembuatan kuis interaktif, asesmen, dan implementasi Wayground untuk sekolah, tutor, dan lembaga pendidikan.',
    }),
    []
  )

  const toggleDarkMode = () => setDarkMode((prev) => !prev)

  return (
    <>
      {loading && <LoadingScreen />}

      <script type="application/ld+json">{JSON.stringify(schemaData)}</script>

      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <Hero />
          <ProblemSection />
          <ServicesSection />
          <AdvantagesSection />
          <HowItWorksSection />
          <PricingSection />
          <TestimonialsSection />
          <FAQSection />
          <CTASection />
          <ContactSection setToast={setToast} />
        </main>
        <Footer />
        <FloatingButtons showBackToTop={showBackToTop} />
        <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: 'success' })} />
      </div>
    </>
  )
}

export default App
