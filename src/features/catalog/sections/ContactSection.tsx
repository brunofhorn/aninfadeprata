import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import contactBackground from '@/assets/img/background-contact.jpg'
import { Button } from '@/components/ui/Button'
import { contactService } from '@/features/contact/services/contact.service'
import type { ContactFormData } from '@/features/contact/types/contact.types'
import { contactSchema } from '@/features/contact/validators/contact.schema'
import { formatPhone } from '@/utils/masks'

const contactFieldClassName =
  'w-full rounded-lg border-b border-white/10 bg-forest-900/50 p-3 outline-none transition-colors focus:border-white/10 focus:outline-none focus:ring-0 focus-visible:border-white/10 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0'

export function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await contactService.sendMessage(data)
      toast.success('Mensagem enviada com sucesso.')
      reset()
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Não foi possível enviar a mensagem.'
      toast.error(message)
    }
  }

  return (
    <section id="contato" className="relative overflow-hidden bg-forest-900 py-24 text-white">
      <div className="absolute inset-0 z-0 opacity-40">
        <img
          alt="Floresta noturna"
          className="h-full w-full object-cover"
          src={contactBackground.src}
        />
      </div>

      <div className="page-shell relative z-10 max-w-4xl">
        <div className="glass-card rounded-xl border border-white/10 p-12">
          <h2 className="mb-8 text-center font-display text-4xl font-bold text-white">
            Envie sua mensagem para o meu grimório
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="px-2 text-xs font-bold uppercase tracking-[0.28em] text-nymph-300">
                  Nome
                </label>
                <input
                  className={contactFieldClassName}
                  placeholder="Seu nome"
                  type="text"
                  {...register('name')}
                />
                {errors.name ? (
                  <p className="px-2 text-sm text-red-300">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="px-2 text-xs font-bold uppercase tracking-[0.28em] text-nymph-300">
                  E-mail
                </label>
                <input
                  className={contactFieldClassName}
                  placeholder="seu@email.com"
                  type="email"
                  {...register('email')}
                />
                {errors.email ? (
                  <p className="px-2 text-sm text-red-300">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="px-2 text-xs font-bold uppercase tracking-[0.28em] text-nymph-300">
                  Celular
                </label>
                <input
                  className={contactFieldClassName}
                  placeholder="(11) 99999-9999"
                  type="tel"
                  {...register('phone', {
                    onChange: (event) => setValue('phone', formatPhone(event.target.value)),
                  })}
                />
                {errors.phone ? (
                  <p className="px-2 text-sm text-red-300">{errors.phone.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-2">
              <label className="px-2 text-xs font-bold uppercase tracking-[0.28em] text-nymph-300">
                Mensagem
              </label>
              <textarea
                className={contactFieldClassName}
                placeholder="Sua mensagem mágica aqui"
                rows={4}
                {...register('message')}
              />
              {errors.message ? (
                <p className="px-2 text-sm text-red-300">{errors.message.message}</p>
              ) : null}
            </div>

            <Button
              className="w-full cursor-pointer rounded-lg bg-linear-to-r from-silver-300 to-silver-200 py-4 font-bold text-forest-900 shadow-lg hover:scale-[1.02]"
              disabled={isSubmitting}
              type="submit"
              variant="ghost"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar mensagem'}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
