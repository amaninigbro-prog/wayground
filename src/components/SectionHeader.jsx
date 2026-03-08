const SectionHeader = ({ badge, title, description, center = true }) => {
  return (
    <div className={center ? 'mx-auto mb-12 max-w-3xl text-center' : 'mb-12 max-w-3xl'}>
      {badge && (
        <span className="mb-4 inline-flex rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:border-brand-900 dark:bg-brand-950 dark:text-brand-300">
          {badge}
        </span>
      )}
      <h2 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl dark:text-white">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-7 text-slate-600 md:text-lg dark:text-slate-300">
          {description}
        </p>
      )}
    </div>
  )
}

export default SectionHeader
