interface ErrorStateProps {
  title: string
  description: string
  theme?: 'light' | 'dark'
}

export function ErrorState({
  title,
  description,
  theme = 'light',
}: ErrorStateProps) {
  return (
    <div
      className={
        theme === 'dark'
          ? 'dark-surface-card p-8 text-center'
          : 'surface-card p-8 text-center'
      }
    >
      <h2 className={theme === 'dark' ? 'text-2xl text-white' : 'text-2xl'}>{title}</h2>
      <p className={theme === 'dark' ? 'mt-3 text-white/65' : 'mt-3 text-brand-700'}>
        {description}
      </p>
    </div>
  )
}
