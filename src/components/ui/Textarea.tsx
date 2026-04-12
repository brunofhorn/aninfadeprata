import type { TextareaHTMLAttributes } from 'react'
import { cn } from '@/utils/cn'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
  tone?: 'light' | 'dark'
}

export function Textarea({
  className,
  label,
  error,
  id,
  tone = 'light',
  ...props
}: TextareaProps) {
  const isDark = tone === 'dark'

  return (
    <label
      className={cn(
        'flex flex-col gap-2 text-sm font-medium',
        isDark ? 'text-white/78' : 'text-brand-800',
      )}
      htmlFor={id}
    >
      <span>{label}</span>
      <textarea
        id={id}
        className={cn(
          'min-h-28 rounded-2xl px-4 py-3 text-sm',
          isDark
            ? 'border border-white/10 bg-forest-950/70 text-white placeholder:text-white/28 focus-visible:ring-nymph-400/60 focus-visible:ring-offset-forest-950'
            : 'border border-brand-200 bg-white text-brand-950 placeholder:text-brand-400',
          error &&
            (isDark
              ? 'border-red-400/80 focus-visible:ring-red-300'
              : 'border-red-400 focus-visible:ring-red-300'),
          className,
        )}
        {...props}
      />
      {error ? (
        <span className={cn('text-xs', isDark ? 'text-red-300' : 'text-red-600')}>
          {error}
        </span>
      ) : null}
    </label>
  )
}
