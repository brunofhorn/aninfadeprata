import type { Metadata } from 'next'
import { AdminLoginForm } from '@/features/admin/components/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Admin Login | A Ninfa de Prata',
  description: 'Acesso ao painel administrativo.',
}

export default function AdminLoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-forest-950 text-white">
      <div className="absolute inset-0">
        <div className="absolute left-[-8rem] top-16 h-72 w-72 rounded-full bg-mystic-700/25 blur-[120px]" />
        <div className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-nymph-500/12 blur-[130px]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-silver-300/10 blur-[110px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <section className="dark-surface-card w-full max-w-md p-8 sm:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-nymph-300/75">
            Painel administrativo
          </p>
          <h1 className="mt-3 text-4xl text-white">Entrar</h1>
          <p className="mt-3 text-white/65">
            Use seu usuario ou e-mail para acessar a listagem de pedidos e a operacao da loja.
          </p>

          <div className="mt-8">
            <AdminLoginForm />
          </div>
        </section>
      </div>
    </main>
  )
}
