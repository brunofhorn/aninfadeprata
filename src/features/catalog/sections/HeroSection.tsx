import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import { IoLeafOutline } from 'react-icons/io5'
import { LuSparkles } from 'react-icons/lu'
import { BrandWordmark } from '@/components/common/BrandWordmark'
import { ROUTES } from '@/constants/routes'
import { Button } from '@/components/ui/Button'
import type { Book } from '@/features/catalog/types/catalog.types'

interface HeroSectionProps {
  book: Book
}

export function HeroSection({ book }: HeroSectionProps) {
  const navigate = useNavigate()

  return (
    <section
      id="inicio"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-20"
    >
      <div className="absolute inset-0 z-0">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-mystic-700/35 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-nymph-500/18 blur-[100px]" />
      </div>

      <div className="page-shell relative z-10 grid items-center gap-12 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-nymph-400/30 px-4 py-1 text-xs font-bold uppercase tracking-[0.28em] text-nymph-300">
            <FiStar />
            Uma jornada epica
          </span>

          <div>
            <p className="mb-4 italic text-nymph-300/80">
              <BrandWordmark className="text-xl" name={book.title} />
            </p>
            <h2 className="font-display text-5xl font-bold leading-tight text-white md:text-7xl">
              Onde a <span className="text-silver-200 drop-shadow-[0_0_10px_rgba(198,198,198,0.5)]">prata</span>{' '}
              encontra a magia
            </h2>
          </div>

          <p className="max-w-xl text-lg leading-relaxed text-white/70">
            Em uma floresta onde as arvores sussurram segredos antigos, uma ninfa esquecida despertara o poder que pode salvar ou consumir todo o reino.
          </p>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button
              className="rounded-xl bg-linear-to-r from-silver-300 to-silver-200 px-8 py-4 font-bold text-forest-900 shadow-[0_0_20px_rgba(237,177,255,0.3)] hover:scale-105"
              type="button"
              variant="ghost"
              onClick={() => navigate(ROUTES.checkout)}
            >
              Garantir meu exemplar
              <FiArrowRight />
            </Button>

            <a href="#sinopse">
              <Button
                className="rounded-xl border border-mystic-400/40 px-8 py-4 font-bold text-mystic-400 hover:bg-mystic-400/10"
                type="button"
                variant="ghost"
              >
                Ler amostra gratis
              </Button>
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, rotate: 5, scale: 0.8 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, rotate: 3, scale: 1 }}
          className="relative flex justify-center"
        >
          <div className="group relative">
            <div className="absolute -inset-4 rounded-full bg-mystic-500/20 blur-2xl transition-all duration-700 group-hover:bg-mystic-500/30" />
            <img
              alt="Capa do livro"
              className="silver-glow relative w-72 rounded-lg border border-white/10 shadow-2xl md:w-96"
              referrerPolicy="no-referrer"
              src="https://picsum.photos/seed/fantasy-book/600/900"
            />
            <div className="pointer-events-none absolute -right-10 -top-10 text-silver-300/40">
              <IoLeafOutline className="size-16" />
            </div>
            <div className="pointer-events-none absolute -bottom-6 -left-10 text-mystic-400/40">
              <LuSparkles className="size-12" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
