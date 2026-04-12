import type { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import type { CheckoutFormData } from '@/features/checkout/types/checkout.types'
import { formatCpf, formatPhone, formatZipCode } from '@/utils/masks'

interface CustomerFormFieldsProps {
  register: UseFormRegister<CheckoutFormData>
  setValue: UseFormSetValue<CheckoutFormData>
  errors: FieldErrors<CheckoutFormData>
  showShippingAddress: boolean
  showAutographField: boolean
}

export function CustomerFormFields({
  register,
  setValue,
  errors,
  showShippingAddress,
  showAutographField,
}: CustomerFormFieldsProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-nymph-300/75">
            Comprador
          </p>
          <h2 className="text-2xl text-white">Dados da compra</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            id="fullName"
            label="Nome completo"
            error={errors.customer?.fullName?.message}
            placeholder="Seu nome"
            tone="dark"
            {...register('customer.fullName')}
          />
          <Input
            id="email"
            label="Email"
            error={errors.customer?.email?.message}
            placeholder="voce@email.com"
            tone="dark"
            {...register('customer.email')}
          />
          <Input
            id="phone"
            label="Telefone"
            error={errors.customer?.phone?.message}
            placeholder="(11) 99999-9999"
            tone="dark"
            {...register('customer.phone', {
              onChange: (event) => setValue('customer.phone', formatPhone(event.target.value)),
            })}
          />
          <Input
            id="cpf"
            label="CPF"
            error={errors.customer?.cpf?.message}
            placeholder="000.000.000-00"
            tone="dark"
            {...register('customer.cpf', {
              onChange: (event) => setValue('customer.cpf', formatCpf(event.target.value)),
            })}
          />
        </div>
      </section>

      {showShippingAddress ? (
        <section className="space-y-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-silver-300/75">
              Logistica
            </p>
            <h2 className="text-2xl text-white">Endereco de entrega</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              id="zipCode"
              label="CEP"
              error={errors.shippingAddress?.zipCode?.message}
              placeholder="00000-000"
              tone="dark"
              {...register('shippingAddress.zipCode', {
                onChange: (event) =>
                  setValue('shippingAddress.zipCode', formatZipCode(event.target.value)),
              })}
            />
            <Input
              id="street"
              label="Rua"
              error={errors.shippingAddress?.street?.message}
              placeholder="Rua das Mareas"
              tone="dark"
              {...register('shippingAddress.street')}
            />
            <Input
              id="number"
              label="Numero"
              error={errors.shippingAddress?.number?.message}
              placeholder="123"
              tone="dark"
              {...register('shippingAddress.number')}
            />
            <Input
              id="complement"
              label="Complemento"
              error={errors.shippingAddress?.complement?.message}
              placeholder="Apto, bloco, referencia"
              tone="dark"
              {...register('shippingAddress.complement')}
            />
            <Input
              id="neighborhood"
              label="Bairro"
              error={errors.shippingAddress?.neighborhood?.message}
              placeholder="Centro"
              tone="dark"
              {...register('shippingAddress.neighborhood')}
            />
            <Input
              id="city"
              label="Cidade"
              error={errors.shippingAddress?.city?.message}
              placeholder="Sao Paulo"
              tone="dark"
              {...register('shippingAddress.city')}
            />
            <Input
              id="state"
              className="uppercase"
              label="UF"
              error={errors.shippingAddress?.state?.message}
              maxLength={2}
              placeholder="SP"
              tone="dark"
              {...register('shippingAddress.state')}
            />
          </div>
        </section>
      ) : null}

      {showAutographField ? (
        <section className="space-y-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-5 sm:p-6">
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-mystic-400/75">
              Autografo
            </p>
            <h2 className="text-2xl text-white">Dedicacao opcional</h2>
          </div>
          <Textarea
            id="autographMessage"
            label="Mensagem para o autografo"
            error={errors.autographMessage?.message}
            maxLength={140}
            placeholder="Para quem a autora deve dedicar o exemplar?"
            tone="dark"
            {...register('autographMessage')}
          />
        </section>
      ) : null}
    </div>
  )
}
