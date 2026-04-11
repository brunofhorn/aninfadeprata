import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiStar } from 'react-icons/fi'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/constants/routes'
import type { Book } from '@/features/catalog/types/catalog.types'

interface HeroSectionProps {
  book: Book
}

export function HeroSection({ book }: HeroSectionProps) {
  return (
    <section className="page-shell section-spacing grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm text-brand-700 shadow-soft">
          <FiStar className="text-brand-500" />
          Lancamento editorial com versoes digitais e fisicas
        </div>

        <h1 className="mt-6 text-5xl leading-tight sm:text-6xl">{book.title}</h1>
        <p className="mt-4 text-xl text-brand-600">{book.subtitle}</p>
        <p className="mt-6 max-w-2xl text-brand-700">{book.tagline}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="#edicoes">
            <Button>
              Escolher edicao
              <FiArrowRight />
            </Button>
          </a>
          <Link to={ROUTES.bookDetails}>
            <Button variant="secondary">Ver detalhes do livro</Button>
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="surface-card overflow-hidden p-6"
      >
        <div className="rounded-[28px] bg-brand-900 p-8 text-brand-50">
          <p className="text-xs uppercase tracking-[0.24em] text-brand-200">Edicao em destaque</p>
          <div className="mt-8 rounded-[24px] border border-white/10 bg-linear-to-br from-brand-700 to-brand-950 p-8">
            <p className="font-display text-4xl leading-tight">{book.title}</p>
            <p className="mt-4 text-brand-100">{book.author.name}</p>
            <div className="mt-10 h-44 rounded-[22px] border border-dashed border-brand-300/40 bg-white/5" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-2xl bg-white/6 p-4">
              <p className="font-bold">{book.pageCount}</p>
              <p className="text-brand-200">paginas</p>
            </div>
            <div className="rounded-2xl bg-white/6 p-4">
              <p className="font-bold">{book.language}</p>
              <p className="text-brand-200">idioma</p>
            </div>
            <div className="rounded-2xl bg-white/6 p-4">
              <p className="font-bold">{book.publicationYear}</p>
              <p className="text-brand-200">edicao</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
