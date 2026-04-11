import { motion } from 'framer-motion'
import { RiDoubleQuotesL, RiDoubleQuotesR } from 'react-icons/ri'
import type { Book } from '@/features/catalog/types/catalog.types'

interface SynopsisSectionProps {
  book: Book
}

export function SynopsisSection({ book }: SynopsisSectionProps) {
  return (
    <section id="sinopse" className="relative bg-forest-800 py-24 text-white">
      <div className="page-shell max-w-4xl">
        <div className="mb-16 text-center">
          <h2 className="font-display text-4xl font-bold">A lenda de Elara</h2>
          <div className="mx-auto mt-4 h-1 w-24 bg-linear-to-r from-transparent via-silver-300 to-transparent" />
        </div>

        <motion.article
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card relative rounded-[2rem] p-10 md:p-20"
        >
          <RiDoubleQuotesL className="absolute -left-6 -top-6 size-12 text-mystic-400/60" />

          <div className="space-y-6 text-center font-display text-xl leading-loose font-light italic text-white/80">
            <p>
              Nas profundezas do Bosque Prateado, o tempo nao flui como nos reinos dos homens. Elara, a ultima de sua linhagem, guarda o coracao da floresta e sustenta a vida com uma prata liquida quase sagrada.
            </p>
            <p>
              Mas quando a sombra da ganancia rasteja entre as raizes seculares, ela precisa escolher entre seu dever milenar e um estranho ferido que traz noticias de um mundo em chamas.
            </p>
            <p>{book.synopsis}</p>
          </div>

          <RiDoubleQuotesR className="absolute -bottom-6 -right-6 size-12 text-mystic-400/60" />
        </motion.article>
      </div>
    </section>
  )
}
