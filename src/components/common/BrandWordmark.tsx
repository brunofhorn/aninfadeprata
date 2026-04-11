import { cn } from '@/utils/cn'

interface BrandWordmarkProps {
  className?: string
  name?: string
}

export function BrandWordmark({
  className,
  name = 'A Ninfa de Prata',
}: BrandWordmarkProps) {
  return <span className={cn('font-brand', className)}>{name}</span>
}
