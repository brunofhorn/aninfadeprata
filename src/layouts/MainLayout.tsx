'use client'

import type { PropsWithChildren } from 'react'
import { Footer } from '@/components/common/Footer'
import { Navbar } from '@/components/common/Navbar'
import { useScrollToTop } from '@/hooks/useScrollToTop'

export function MainLayout({ children }: PropsWithChildren) {
  useScrollToTop()

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  )
}
