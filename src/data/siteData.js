import {
  BookOpenCheck,
  GraduationCap,
  LayoutDashboard,
  FolderCog,
  School,
  BrainCircuit,
  RefreshCw,
  Laptop,
  Zap,
  UserRoundCheck,
  SlidersHorizontal,
  Building2,
  Sparkles,
  Headphones,
  PhoneCall,
  MessageSquareText,
  FileCheck,
  Rocket,
} from 'lucide-react'

export const navItems = [
  { label: 'Beranda', href: 'beranda' },
  { label: 'Layanan', href: 'layanan' },
  { label: 'Keunggulan', href: 'keunggulan' },
  { label: 'Paket', href: 'paket' },
  { label: 'Testimoni', href: 'testimoni' },
  { label: 'FAQ', href: 'faq' },
  { label: 'Kontak', href: 'kontak' },
]

export const trustBadges = [
  'Respons cepat',
  'Pendampingan personal',
  'Siap untuk sekolah dan lembaga',
]

export const painPoints = [
  'Guru belum sempat membuat kuis interaktif yang rapi dan menarik.',
  'Sekolah membutuhkan implementasi pembelajaran digital yang lebih terstruktur.',
  'Tim pengajar belum familiar dengan fitur Wayground secara optimal.',
  'Materi interaktif masih belum konsisten dan kurang efektif dipakai di kelas.',
  'Hasil evaluasi belajar belum tersusun dengan baik untuk kebutuhan monitoring.',
]

export const services = [
  {
    icon: GraduationCap,
    title: 'Pelatihan Wayground untuk Guru',
    description: 'Sesi pelatihan praktis agar guru lebih percaya diri menggunakan fitur Wayground dalam pembelajaran harian.',
    cta: 'Pelajari Layanan',
  },
  {
    icon: LayoutDashboard,
    title: 'Setup Akun dan Kelas',
    description: 'Bantuan setup akun, pengaturan kelas, dan struktur awal agar penggunaan platform lebih rapi sejak awal.',
    cta: 'Mulai Setup',
  },
  {
    icon: BookOpenCheck,
    title: 'Pembuatan Kuis Interaktif',
    description: 'Pembuatan kuis yang relevan, menarik, dan sesuai tujuan evaluasi untuk berbagai jenjang pembelajaran.',
    cta: 'Lihat Detail',
  },
  {
    icon: FolderCog,
    title: 'Pembuatan Materi Presentasi dan Asesmen',
    description: 'Materi belajar dan asesmen interaktif yang lebih siap pakai untuk kelas, tutor, dan program belajar.',
    cta: 'Cek Solusi',
  },
  {
    icon: School,
    title: 'Pendampingan Implementasi untuk Sekolah',
    description: 'Pendampingan terarah untuk sekolah yang ingin menerapkan pembelajaran digital dengan proses yang lebih tertib.',
    cta: 'Konsultasikan',
  },
  {
    icon: BrainCircuit,
    title: 'Konsultasi Strategi Pembelajaran Digital',
    description: 'Diskusi strategi penggunaan Wayground agar lebih selaras dengan target belajar, asesmen, dan keterlibatan siswa.',
    cta: 'Jadwalkan',
  },
  {
    icon: RefreshCw,
    title: 'Migrasi Materi dari Quizizz ke Wayground',
    description: 'Bantuan transisi materi lama ke format yang lebih siap digunakan di ekosistem Wayground.',
    cta: 'Migrasi Sekarang',
  },
  {
    icon: Laptop,
    title: 'Optimasi Penggunaan untuk Bimbel dan Tutor',
    description: 'Penyesuaian alur belajar dan evaluasi untuk bimbel, tutor privat, dan lembaga kursus agar lebih efisien.',
    cta: 'Optimalkan',
  },
]

export const advantages = [
  { icon: Zap, title: 'Proses cepat', description: 'Respon awal, analisis kebutuhan, dan penawaran dilakukan secara efisien.' },
  { icon: UserRoundCheck, title: 'Pendampingan personal', description: 'Setiap klien mendapatkan pendekatan yang lebih sesuai kebutuhan.' },
  { icon: SlidersHorizontal, title: 'Materi disesuaikan kebutuhan', description: 'Konten dan alur layanan mengikuti target pembelajaran Anda.' },
  { icon: Building2, title: 'Cocok untuk sekolah, tutor, dan bimbel', description: 'Fleksibel untuk institusi maupun layanan belajar individu.' },
  { icon: Sparkles, title: 'Pembelajaran lebih interaktif', description: 'Materi dan kuis dibuat lebih menarik agar siswa lebih terlibat.' },
  { icon: Headphones, title: 'Dukungan konsultasi lanjutan', description: 'Tersedia tindak lanjut untuk membantu implementasi berjalan lebih stabil.' },
]

export const steps = [
  { icon: PhoneCall, title: 'Hubungi tim kami', description: 'Sampaikan kebutuhan awal melalui WhatsApp atau form konsultasi.' },
  { icon: MessageSquareText, title: 'Ceritakan kebutuhan Anda', description: 'Kami pelajari konteks lembaga, target belajar, dan kendala utama.' },
  { icon: FileCheck, title: 'Kami susun solusi dan penawaran', description: 'Anda menerima rekomendasi layanan dan estimasi paket yang sesuai.' },
  { icon: Rocket, title: 'Implementasi dan pendampingan dimulai', description: 'Tim kami mulai menjalankan setup, pelatihan, atau produksi materi.' },
]

export const pricingPlans = [
  {
    name: 'Basic',
    price: 'Rp499.000',
    description: 'Cocok untuk kebutuhan awal guru atau tutor individu.',
    features: [
      '1 sesi konsultasi online',
      'Setup akun dasar',
      'Setup 1 kelas',
      'Bantuan 3 kuis interaktif',
      'Panduan penggunaan dasar',
    ],
    highlighted: false,
  },
  {
    name: 'Pro',
    price: 'Rp1.499.000',
    description: 'Pilihan ideal untuk sekolah kecil, tutor aktif, atau bimbel berkembang.',
    features: [
      '2 sesi konsultasi online',
      'Setup akun dan kelas',
      'Pelatihan guru atau tim',
      'Bantuan 10 kuis interaktif',
      'Template asesmen dan materi',
      'Pendampingan 14 hari',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 'Rp3.500.000',
    description: 'Untuk sekolah dan lembaga yang butuh implementasi lebih menyeluruh.',
    features: [
      'Audit kebutuhan lembaga',
      'Pelatihan intensif tim pengajar',
      'Setup multi kelas',
      'Produksi kuis dan materi prioritas',
      'Konsultasi strategi implementasi',
      'Pendampingan lanjutan 30 hari',
    ],
    highlighted: false,
  },
]

export const testimonials = [
  {
    name: 'Rina Wulandari',
    role: 'Guru SMP',
    company: 'SMP Cerdas Nusantara',
    review: 'Timnya membantu kami memahami penggunaan Wayground dengan lebih cepat. Materi pelatihannya jelas dan mudah diikuti.',
    rating: 5,
  },
  {
    name: 'Andi Pratama',
    role: 'Tutor',
    company: 'Kelas Belajar Mandiri',
    review: 'Saya terbantu dalam menyiapkan kuis interaktif untuk kelas online. Prosesnya rapi dan komunikasinya enak.',
    rating: 5,
  },
  {
    name: 'Maya Lestari',
    role: 'Pemilik Bimbel',
    company: 'Bimbel Pilar Ilmu',
    review: 'Pendampingannya terasa personal. Tim tidak hanya membantu teknis, tetapi juga memberi arahan penggunaan yang lebih efektif.',
    rating: 5,
  },
  {
    name: 'Doni Saputra',
    role: 'Koordinator Sekolah',
    company: 'Sekolah Global Harapan',
    review: 'Kami butuh proses implementasi yang terstruktur. Layanan ini membantu menata penggunaan platform dengan lebih baik.',
    rating: 5,
  },
  {
    name: 'Siti Aisyah',
    role: 'Guru SD',
    company: 'SD Pelita Bangsa',
    review: 'Kuis yang dibuat menarik dan sesuai kebutuhan siswa. Waktu persiapan saya jadi jauh lebih ringan.',
    rating: 5,
  },
  {
    name: 'Bambang Hidayat',
    role: 'Tutor Privat',
    company: 'Program Belajar Intensif',
    review: 'Sangat cocok untuk tutor yang ingin tampilan pembelajaran lebih interaktif tanpa harus belajar semuanya dari nol.',
    rating: 5,
  },
]

export const faqs = [
  {
    question: 'Apakah ini website resmi Wayground?',
    answer: 'Bukan. Website ini adalah layanan pendampingan independen yang membantu penggunaan Wayground secara profesional untuk kebutuhan pembelajaran.',
  },
  {
    question: 'Siapa yang cocok menggunakan jasa ini?',
    answer: 'Layanan ini cocok untuk guru, tutor, pemilik bimbel, koordinator sekolah, dan lembaga pendidikan yang ingin menggunakan Wayground dengan lebih efektif.',
  },
  {
    question: 'Apakah bisa untuk pelatihan guru di sekolah?',
    answer: 'Ya. Kami menyediakan pelatihan online maupun pendampingan yang disesuaikan dengan kebutuhan tim pengajar di sekolah.',
  },
  {
    question: 'Apakah bisa bantu membuat kuis dan asesmen?',
    answer: 'Bisa. Kami dapat membantu menyiapkan kuis interaktif, asesmen, dan materi presentasi yang relevan dengan tujuan pembelajaran.',
  },
  {
    question: 'Apakah tersedia konsultasi online?',
    answer: 'Ya. Konsultasi online tersedia untuk pembahasan kebutuhan awal, strategi implementasi, maupun tindak lanjut penggunaan.',
  },
  {
    question: 'Berapa lama proses pengerjaannya?',
    answer: 'Durasi bergantung pada jenis layanan, jumlah materi, dan kebutuhan lembaga. Untuk kebutuhan dasar, proses awal biasanya dapat dimulai dalam waktu singkat setelah brief diterima.',
  },
]

export const contactInfo = {
  email: 'halo@waygroundpartnerid.com',
  phone: '+62 812-3456-7890',
  address: 'Jl. Pendidikan Digital No. 12, Jakarta',
  whatsappLink: 'https://wa.me/6281234567890?text=Halo%20Wayground%20Partner%20ID,%20saya%20ingin%20konsultasi.',
}
