import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-brand-900 text-brand-50 hover:bg-brand-950',
        secondary: 'bg-brand-100 text-brand-900 hover:bg-brand-200',
        ghost: 'bg-transparent text-brand-900 hover:bg-brand-100',
        accent: 'bg-accent-600 text-white hover:bg-accent-500',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      fullWidth: false,
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> &
  PropsWithChildren

export function Button({
  children,
  className,
  variant,
  fullWidth,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, fullWidth }), className)}
      {...props}
    >
      {children}
    </button>
  )
}
