const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null

  return (
    <div className="fixed bottom-24 right-4 z-[70] animate-fadeUp rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-soft dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className={`h-2.5 w-2.5 rounded-full ${type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <p className="text-sm font-medium text-slate-700 dark:text-slate-100">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 text-sm text-slate-400 transition hover:text-slate-700 dark:hover:text-white"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}

export default Toast
