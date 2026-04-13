export const API_ENDPOINTS = {
  bookBySlug: (slug: string) => `/public/books/${slug}`,
  createOrder: '/checkout/orders',
  getOrder: (orderId: string) => `/checkout/orders/${orderId}`,
  createPixPayment: (orderId: string) => `/checkout/orders/${orderId}/payments/pix`,
  createCardPayment: (orderId: string) => `/checkout/orders/${orderId}/payments/card`,
  paymentStatus: (orderId: string) => `/checkout/orders/${orderId}/payment-status`,
} as const
