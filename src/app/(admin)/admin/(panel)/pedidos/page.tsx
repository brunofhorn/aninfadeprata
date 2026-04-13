import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { requireAdminPage } from '@/server/admin/auth'
import { formatCurrency, formatDate, getStatusBadgeTone } from '@/features/admin/utils/display'

export default async function AdminOrdersPage() {
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
  const orders = await prisma.order.findMany({
    include: {
      customer: true,
      items: true,
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <section className="dark-surface-card p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-nymph-300/75">
          Pedidos
        </p>
        <h1 className="mt-3 text-4xl text-white">Listagem de pedidos</h1>
        <p className="mt-3 max-w-2xl text-white/65">
          Visualize os pedidos mais recentes, com status do pagamento e resumo da compra.
        </p>
      </section>

      <section className="dark-surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/55">
              <tr>
                <th className="px-6 py-4 font-semibold">Pedido</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Item</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Pagamento</th>
                <th className="px-6 py-4 font-semibold">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const latestPayment = order.payments[0]
                const firstItem = order.items[0]

                return (
                  <tr key={order.id} className="border-t border-white/6 text-white/78">
                    <td className="px-6 py-4 align-top">
                      <div className="font-semibold text-white">{order.code}</div>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeTone(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusBadgeTone(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-white">{order.customer.fullName}</div>
                      <div className="text-white/55">{order.customer.email}</div>
                      <div className="text-white/40">{order.customer.phone || 'Sem telefone'}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-white">{firstItem?.title ?? 'Sem item'}</div>
                      <div className="text-white/55">Qtd: {firstItem?.quantity ?? 0}</div>
                    </td>
                    <td className="px-6 py-4 align-top font-semibold text-silver-200">
                      {formatCurrency(Number(order.totalAmount))}
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-white">
                        {latestPayment?.method ?? 'Sem pagamento'}
                      </div>
                      <div className="text-white/55">
                        {latestPayment ? latestPayment.status : 'Aguardando'}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-white/55">
                      {formatDate(order.createdAt)}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
