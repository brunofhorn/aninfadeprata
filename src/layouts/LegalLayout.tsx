'use client'

import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/common/Footer'
import { Navbar } from '@/components/common/Navbar'
import { useScrollToTop } from '@/hooks/useScrollToTop'

export function LegalLayout({ children }: PropsWithChildren) {
  useScrollToTop()

  return (
    <div className="min-h-screen">
      <Navbar minimal />
      <main className="page-shell py-12 sm:py-16">
        {children}
      </main>
      <Footer />
    </div>
  )
}
