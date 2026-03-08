const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-white/90 backdrop-blur-sm dark:bg-slate-950/90">
      <div className="flex flex-col items-center gap-4">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
        <div className="text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-white">Wayground Partner ID</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">Memuat halaman...</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
