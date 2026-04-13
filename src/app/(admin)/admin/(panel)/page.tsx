import { FiDollarSign, FiShoppingBag, FiTrendingUp, FiUsers } from 'react-icons/fi'
import { requireAdminPage } from '@/server/admin/auth'
import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { formatCurrency, formatDate, getStatusBadgeTone } from '@/features/admin/utils/display'

export default async function AdminDashboardPage() {
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
  const [orders, customersCount, paidOrdersCount, grossRevenue] = await Promise.all([
    prisma.order.findMany({
      include: {
        customer: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 8,
    }),
    prisma.customer.count(),
    prisma.order.count({
      where: {
        paymentStatus: 'PAID',
      },
    }),
    prisma.order.aggregate({
      _sum: {
        totalAmount: true,
      },
      where: {
        paymentStatus: 'PAID',
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <section className="dark-surface-card p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-nymph-300/75">
          Dashboard
        </p>
        <h1 className="mt-3 text-4xl text-white">Visao geral da operacao</h1>
        <p className="mt-3 max-w-2xl text-white/65">
          Acompanhe vendas, base de clientes e o ritmo recente dos pedidos em um unico painel.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="dark-surface-card p-6">
          <div className="flex items-center gap-3 text-nymph-300">
            <FiShoppingBag />
            <span className="text-sm uppercase tracking-[0.22em] text-white/55">Pedidos</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{orders.length}</p>
          <p className="mt-2 text-sm text-white/55">Ultimos pedidos recentes no sistema.</p>
        </div>

        <div className="dark-surface-card p-6">
          <div className="flex items-center gap-3 text-silver-300">
            <FiUsers />
            <span className="text-sm uppercase tracking-[0.22em] text-white/55">Clientes</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{customersCount}</p>
          <p className="mt-2 text-sm text-white/55">Base total de compradores cadastrados.</p>
        </div>

        <div className="dark-surface-card p-6">
          <div className="flex items-center gap-3 text-mystic-400">
            <FiTrendingUp />
            <span className="text-sm uppercase tracking-[0.22em] text-white/55">Pagos</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{paidOrdersCount}</p>
          <p className="mt-2 text-sm text-white/55">Pedidos com pagamento confirmado.</p>
        </div>

        <div className="dark-surface-card p-6">
          <div className="flex items-center gap-3 text-silver-200">
            <FiDollarSign />
            <span className="text-sm uppercase tracking-[0.22em] text-white/55">Receita</span>
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {formatCurrency(Number(grossRevenue._sum.totalAmount ?? 0))}
          </p>
          <p className="mt-2 text-sm text-white/55">Receita acumulada de pedidos pagos.</p>
        </div>
      </section>

      <section className="dark-surface-card overflow-hidden">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl text-white">Pedidos recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/55">
              <tr>
                <th className="px-6 py-4 font-semibold">Pedido</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Valor</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-white/6 text-white/78">
                  <td className="px-6 py-4 font-semibold text-white">{order.code}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{order.customer.fullName}</div>
                    <div className="text-white/55">{order.customer.email}</div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-silver-200">
                    {formatCurrency(Number(order.totalAmount))}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeTone(order.paymentStatus)}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/55">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
