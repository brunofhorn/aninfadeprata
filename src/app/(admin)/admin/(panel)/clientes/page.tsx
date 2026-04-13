import { getPrismaClient, hasDatabaseUrl } from '@/server/db/prisma'
import { requireAdminPage } from '@/server/admin/auth'
import { formatCurrency, formatDate } from '@/features/admin/utils/display'

export default async function AdminCustomersPage() {
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
  const customers = await prisma.customer.findMany({
    include: {
      orders: {
        orderBy: {
          createdAt: 'desc',
        },
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
          Clientes
        </p>
        <h1 className="mt-3 text-4xl text-white">Base de compradores</h1>
        <p className="mt-3 max-w-2xl text-white/65">
          Veja quem ja comprou, quantos pedidos cada cliente possui e o valor movimentado.
        </p>
      </section>

      <section className="dark-surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/[0.03] text-white/55">
              <tr>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Contato</th>
                <th className="px-6 py-4 font-semibold">Pedidos</th>
                <th className="px-6 py-4 font-semibold">Total pago</th>
                <th className="px-6 py-4 font-semibold">Ultimo pedido</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => {
                const paidRevenue = customer.orders
                  .filter((order) => order.paymentStatus === 'PAID')
                  .reduce((sum, order) => sum + Number(order.totalAmount), 0)
                const lastOrder = customer.orders[0]

                return (
                  <tr key={customer.id} className="border-t border-white/6 text-white/78">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{customer.fullName}</div>
                      <div className="text-white/40">{customer.cpf || 'Sem CPF'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white">{customer.email}</div>
                      <div className="text-white/55">{customer.phone || 'Sem telefone'}</div>
                    </td>
                    <td className="px-6 py-4">{customer.orders.length}</td>
                    <td className="px-6 py-4 font-semibold text-silver-200">
                      {formatCurrency(paidRevenue)}
                    </td>
                    <td className="px-6 py-4 text-white/55">
                      {lastOrder ? formatDate(lastOrder.createdAt) : 'Nenhum pedido'}
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
