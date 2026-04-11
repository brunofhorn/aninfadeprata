import { Button } from '@/components/ui/Button'

export function ContactSection() {
  return (
    <section id="contato" className="relative overflow-hidden bg-forest-900 py-24 text-white">
      <div className="absolute inset-0 z-0 opacity-10">
        <img
          alt="Floresta noturna"
          className="h-full w-full object-cover"
          referrerPolicy="no-referrer"
          src="https://picsum.photos/seed/forest-night/1920/1080"
        />
      </div>

      <div className="page-shell relative z-10 max-w-4xl">
        <div className="glass-card rounded-[3rem] border border-white/10 p-12">
          <h2 className="mb-8 text-center font-display text-4xl font-bold">
            Fale com o grimorio
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="px-2 text-xs font-bold uppercase tracking-[0.28em] text-nymph-300">
                  Nome
                </label>
                <input
                  className="w-full rounded-t-xl border-b border-white/10 bg-forest-900/50 p-3 outline-none transition-colors focus:border-silver-300"
                  placeholder="Seu nome..."
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <label className="px-2 text-xs font-bold uppercase tracking-[0.28em] text-nymph-300">
                  Email
                </label>
                <input
                  className="w-full rounded-t-xl border-b border-white/10 bg-forest-900/50 p-3 outline-none transition-colors focus:border-silver-300"
                  placeholder="seu@email.com"
                  type="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="px-2 text-xs font-bold uppercase tracking-[0.28em] text-nymph-300">
                Mensagem
              </label>
              <textarea
                className="w-full rounded-t-xl border-b border-white/10 bg-forest-900/50 p-3 outline-none transition-colors focus:border-silver-300"
                placeholder="Sua mensagem magica..."
                rows={4}
              />
            </div>

            <Button
              className="w-full rounded-xl bg-linear-to-r from-silver-300 to-silver-200 py-4 font-bold text-forest-900 shadow-lg hover:scale-[1.02]"
              type="submit"
              variant="ghost"
            >
              Enviar mensagem
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
