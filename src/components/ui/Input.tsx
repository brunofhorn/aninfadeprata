import type { InputHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-brand-800" htmlFor={id}>
      <span>{label}</span>
      <input
        id={id}
        className={cn(
          'h-12 rounded-2xl border border-brand-200 bg-white px-4 text-sm text-brand-950 placeholder:text-brand-400',
          error && 'border-red-400 focus-visible:ring-red-300',
          className,
        )}
        {...props}
      />
      {error ? <span className="text-xs text-red-600">{error}</span> : null}
    </label>
  )
}
