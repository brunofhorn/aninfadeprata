import type { PaymentMethod, PaymentStatus } from '@/types/enums'

export interface Customer {
  fullName: string
  email: string
  phone: string
  cpf: string
}

export interface Address {
  zipCode: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
}

export interface CardForm {
  holderName: string
  holderCpf: string
  cardNumber: string
  expiry: string
  cvv: string
  installments: number
}

export interface CheckoutFormData {
  customer: Customer
  shippingAddress?: Partial<Address>
  paymentMethod: PaymentMethod
  autographMessage?: string
  giftWrap?: boolean
  card?: Partial<CardForm>
}

export interface OrderItem {
  productVariantId: string
  title: string
  quantity: number
  unitPrice: number
}

export interface Order {
  id: string
  code: string
  customer: Customer
  shippingAddress?: Address
  item: OrderItem
  total: number
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  createdAt: string
}
