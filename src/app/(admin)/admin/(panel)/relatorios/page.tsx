import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { requireAdminPage } from '@/server/admin/auth'
import { formatCurrency } from '@/features/admin/utils/display'

export default async function AdminReportsPage() {
  await requireAdminPage()

  if (!hasDatabaseUrl()) {
    return (
      <section className="dark-surface-card p-8">
        <h1 className="text-3xl text-white">Banco nao configurado</h1>
        <p className="mt-3 text-white/65">
          Defina a `DATABASE_URL` e rode as migrations para habilitar o painel.
        </p>
      </section>
    )
  }

  const prisma = getPrismaClient()
  const [orders, payments] = await Promise.all([
    prisma.order.findMany({
      include: {
        items: true,
      },
    }),
    prisma.payment.findMany(),
  ])

  const paidOrders = orders.filter((order) => order.paymentStatus === 'PAID')
  const grossRevenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0)
  const averageTicket = paidOrders.length > 0 ? grossRevenue / paidOrders.length : 0
  const paymentBreakdown = payments.reduce<Record<string, { count: number; amount: number }>>(
    (acc, payment) => {
      const current = acc[payment.method] ?? { count: 0, amount: 0 }
      acc[payment.method] = {
        count: current.count + 1,
        amount: current.amount + Number(payment.amount),
      }
      return acc
    },
    {},
  )

  return (
    <div className="space-y-6">
      <section className="dark-surface-card p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-nymph-300/75">
          Relatorios
        </p>
        <h1 className="mt-3 text-4xl text-white">Indicadores principais</h1>
        <p className="mt-3 max-w-2xl text-white/65">
          Um retrato rapido da receita, ticket medio e distribuicao por metodo de pagamento.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="dark-surface-card p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-white/55">Pedidos pagos</p>
          <p className="mt-4 text-3xl font-semibold text-white">{paidOrders.length}</p>
        </div>
        <div className="dark-surface-card p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-white/55">Receita bruta</p>
          <p className="mt-4 text-3xl font-semibold text-white">{formatCurrency(grossRevenue)}</p>
        </div>
        <div className="dark-surface-card p-6">
          <p className="text-sm uppercase tracking-[0.22em] text-white/55">Ticket medio</p>
          <p className="mt-4 text-3xl font-semibold text-white">
            {formatCurrency(averageTicket)}
          </p>
        </div>
      </section>

      <section className="dark-surface-card overflow-hidden">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl text-white">Metodos de pagamento</h2>
        </div>
        <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
          {Object.entries(paymentBreakdown).map(([method, values]) => (
            <div key={method} className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-white/55">{method}</p>
              <p className="mt-3 text-2xl font-semibold text-white">{values.count} pagamentos</p>
              <p className="mt-2 text-white/65">{formatCurrency(values.amount)}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
