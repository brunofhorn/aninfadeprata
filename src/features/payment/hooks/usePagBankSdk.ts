'use client'

import { useEffect } from 'react'
import { loadPagBankSdk } from '@/features/payment/utils/pagbank'
import { PAYMENT_METHODS } from '@/types/enums'

export function usePagBankSdk(paymentMethod: string) {
  useEffect(() => {
    if (
      paymentMethod !== PAYMENT_METHODS.CREDIT_CARD ||
      !process.env.NEXT_PUBLIC_PAGBANK_PUBLIC_KEY
    ) {
      return
    }

    void loadPagBankSdk()
  }, [paymentMethod])
}
