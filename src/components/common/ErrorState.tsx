interface ErrorStateProps {
  title: string
  description: string
}

export function ErrorState({ title, description }: ErrorStateProps) {
  return (
    <div className="surface-card p-8 text-center">
      <h2 className="text-2xl">{title}</h2>
      <p className="mt-3 text-brand-700">{description}</p>
    </div>
  )
}
