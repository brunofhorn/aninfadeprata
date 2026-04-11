import emailjs from '@emailjs/browser'
import type { ContactFormData } from '@/features/contact/types/contact.types'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export const contactService = {
  async sendMessage(data: ContactFormData) {
    if (!serviceId || !templateId || !publicKey) {
      throw new Error(
        'Configure VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID e VITE_EMAILJS_PUBLIC_KEY.',
      )
    }

    return emailjs.send(
      serviceId,
      templateId,
      {
        from_name: data.name,
        from_email: data.email,
        from_phone: data.phone,
        message: data.message,
      },
      {
        publicKey,
      },
    )
  },
}
