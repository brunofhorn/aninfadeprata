import 'dotenv/config'

import { scryptSync } from 'node:crypto'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { PaymentProvider } from '../src/generated/prisma/enums'
import { bookMock } from '../src/mocks/book'

function getRequiredEnv(name: string) {
  const value = process.env[name]?.trim()

  if (!value) {
    throw new Error(`A variavel ${name} precisa estar definida para rodar o seed.`)
  }

  return value
}

function hashPassword(email: string, password: string) {
  const salt = email.trim().toLowerCase()
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `scrypt:${salt}:${hash}`
}

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function getVariantSeedMeta(variantId: string) {
  const metaById: Record<string, { sku: string; slug: string }> = {
    'variant-epub-pdf': {
      sku: 'ANP-DIGITAL-001',
      slug: 'a-ninfa-de-prata-digital-epub-pdf',
    },
    'variant-signed-gift': {
      sku: 'ANP-FISICO-001',
      slug: 'a-ninfa-de-prata-fisico-autografado-brindes',
    },
  }

  return (
    metaById[variantId] ?? {
      sku: `ANP-${variantId.toUpperCase()}`,
      slug: slugify(variantId),
    }
  )
}

async function main() {
  const databaseUrl = getRequiredEnv('DATABASE_URL')
  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
    log: ['warn', 'error'],
  })

  try {
    const adminEmail =
      (process.env.SEED_ADMIN_EMAIL?.trim() || 'admin@aninfadeprata.com').toLowerCase()
    const adminUsername = (process.env.SEED_ADMIN_USERNAME?.trim() || 'saraadmin').toLowerCase()
    const adminPassword = process.env.SEED_ADMIN_PASSWORD?.trim() || 'Admin123!'
    const adminName = process.env.SEED_ADMIN_NAME?.trim() || 'Sara Borges Admin'

    const admin = await prisma.adminUser.upsert({
      where: {
        email: adminEmail,
      },
      update: {
        name: adminName,
        username: adminUsername,
        passwordHash: hashPassword(adminEmail, adminPassword),
        role: 'SUPER_ADMIN',
        isActive: true,
      },
      create: {
        email: adminEmail,
        username: adminUsername,
        name: adminName,
        passwordHash: hashPassword(adminEmail, adminPassword),
        role: 'SUPER_ADMIN',
      },
    })

    const instagramUrl =
      bookMock.author.socialLinks.find((link) => link.label.toLowerCase().includes('instagram'))
        ?.url || null
    const websiteUrl =
      bookMock.author.socialLinks.find((link) => link.label.toLowerCase().includes('site'))?.url ||
      null
    const tiktokUrl =
      bookMock.author.socialLinks.find((link) => link.label.toLowerCase().includes('tiktok'))
        ?.url || null

    const author = await prisma.author.upsert({
      where: {
        slug: slugify(bookMock.author.name),
      },
      update: {
        name: bookMock.author.name,
        headline: bookMock.author.headline,
        bio: bookMock.author.bio,
        photoUrl: bookMock.author.photoUrl,
        websiteUrl,
        instagramUrl,
        tiktokUrl,
      },
      create: {
        id: bookMock.author.id,
        slug: slugify(bookMock.author.name),
        name: bookMock.author.name,
        headline: bookMock.author.headline,
        bio: bookMock.author.bio,
        photoUrl: bookMock.author.photoUrl,
        websiteUrl,
        instagramUrl,
        tiktokUrl,
      },
    })

    const book = await prisma.book.upsert({
      where: {
        slug: bookMock.slug,
      },
      update: {
        authorId: author.id,
        title: bookMock.title,
        subtitle: bookMock.subtitle,
        tagline: bookMock.tagline,
        description: bookMock.description,
        synopsis: bookMock.synopsis,
        pitch: bookMock.pitch,
        isbn: bookMock.isbn,
        pageCount: bookMock.pageCount,
        language: bookMock.language,
        publicationYear: bookMock.publicationYear,
        status: 'ACTIVE',
        publishedAt: new Date('2026-01-10T12:00:00.000Z'),
      },
      create: {
        id: bookMock.id,
        authorId: author.id,
        slug: bookMock.slug,
        title: bookMock.title,
        subtitle: bookMock.subtitle,
        tagline: bookMock.tagline,
        description: bookMock.description,
        synopsis: bookMock.synopsis,
        pitch: bookMock.pitch,
        isbn: bookMock.isbn,
        pageCount: bookMock.pageCount,
        language: bookMock.language,
        publicationYear: bookMock.publicationYear,
        status: 'ACTIVE',
        publishedAt: new Date('2026-01-10T12:00:00.000Z'),
      },
    })

    for (const categoryName of bookMock.categories) {
      const category = await prisma.category.upsert({
        where: {
          slug: slugify(categoryName),
        },
        update: {
          name: categoryName,
        },
        create: {
          slug: slugify(categoryName),
          name: categoryName,
        },
      })

      await prisma.bookCategory.upsert({
        where: {
          bookId_categoryId: {
            bookId: book.id,
            categoryId: category.id,
          },
        },
        update: {},
        create: {
          bookId: book.id,
          categoryId: category.id,
        },
      })
    }

    for (const chapter of bookMock.chapters) {
      await prisma.bookChapter.upsert({
        where: {
          id: chapter.id,
        },
        update: {
          bookId: book.id,
          position: Number(chapter.id),
          title: chapter.title,
          description: chapter.description,
          icon: chapter.icon,
        },
        create: {
          id: chapter.id,
          bookId: book.id,
          position: Number(chapter.id),
          title: chapter.title,
          description: chapter.description,
          icon: chapter.icon,
        },
      })
    }

    for (const character of bookMock.characters) {
      await prisma.bookCharacter.upsert({
        where: {
          id: character.id,
        },
        update: {
          bookId: book.id,
          name: character.name,
          role: character.role,
          description: character.description,
          imageUrl: character.imageUrl,
          gridSpan: character.gridSpan,
        },
        create: {
          id: character.id,
          bookId: book.id,
          name: character.name,
          role: character.role,
          description: character.description,
          imageUrl: character.imageUrl,
          gridSpan: character.gridSpan,
        },
      })
    }

    for (const location of bookMock.locations) {
      await prisma.bookLocation.upsert({
        where: {
          id: location.id,
        },
        update: {
          bookId: book.id,
          name: location.name,
          description: location.description,
          imageUrl: location.imageUrl,
          gridSpan: location.gridSpan,
        },
        create: {
          id: location.id,
          bookId: book.id,
          name: location.name,
          description: location.description,
          imageUrl: location.imageUrl,
          gridSpan: location.gridSpan,
        },
      })
    }

    for (const testimonial of bookMock.testimonials) {
      await prisma.bookTestimonial.upsert({
        where: {
          id: testimonial.id,
        },
        update: {
          bookId: book.id,
          authorName: testimonial.authorName,
          text: testimonial.text,
          highlight: testimonial.highlight,
        },
        create: {
          id: testimonial.id,
          bookId: book.id,
          authorName: testimonial.authorName,
          text: testimonial.text,
          highlight: testimonial.highlight,
        },
      })
    }

    for (const faq of bookMock.faqs) {
      await prisma.bookFaqItem.upsert({
        where: {
          id: faq.id,
        },
        update: {
          bookId: book.id,
          question: faq.question,
          answer: faq.answer,
        },
        create: {
          id: faq.id,
          bookId: book.id,
          question: faq.question,
          answer: faq.answer,
        },
      })
    }

    for (const [sortOrder, variant] of bookMock.variants.entries()) {
      const meta = getVariantSeedMeta(variant.id)

      await prisma.productVariant.upsert({
        where: {
          id: variant.id,
        },
        update: {
          bookId: book.id,
          sku: meta.sku,
          slug: meta.slug,
          type: variant.type,
          name: variant.name,
          description: variant.description,
          priceAmount: variant.price,
          compareAtAmount: variant.compareAtPrice,
          giftsIncluded: variant.giftsIncluded ?? [],
          shippingRequired: variant.shippingRequired,
          autographAvailable: variant.autographAvailable,
          deliveryEstimate: variant.deliveryEstimate,
          isActive: true,
          sortOrder,
        },
        create: {
          id: variant.id,
          bookId: book.id,
          sku: meta.sku,
          slug: meta.slug,
          type: variant.type,
          name: variant.name,
          description: variant.description,
          priceAmount: variant.price,
          compareAtAmount: variant.compareAtPrice,
          giftsIncluded: variant.giftsIncluded ?? [],
          shippingRequired: variant.shippingRequired,
          autographAvailable: variant.autographAvailable,
          deliveryEstimate: variant.deliveryEstimate,
          isActive: true,
          sortOrder,
        },
      })
    }

    const fakeCustomer = await prisma.customer.upsert({
      where: {
        email: 'leitora.seed@example.com',
      },
      update: {
        fullName: 'Marina Costa',
        phone: '(48) 98888-0001',
        cpf: '12345678901',
        notes: 'Cliente criada pelo seed inicial.',
      },
      create: {
        id: 'seed-customer-001',
        email: 'leitora.seed@example.com',
        fullName: 'Marina Costa',
        phone: '(48) 98888-0001',
        cpf: '12345678901',
        notes: 'Cliente criada pelo seed inicial.',
      },
    })

    await prisma.customerAddress.upsert({
      where: {
        id: 'seed-customer-address-001',
      },
      update: {
        customerId: fakeCustomer.id,
        label: 'Casa',
        recipientName: fakeCustomer.fullName,
        zipCode: '88034001',
        street: 'Rua das Conchas',
        number: '128',
        complement: 'Apto 302',
        neighborhood: 'Centro',
        city: 'Florianopolis',
        state: 'SC',
        isDefault: true,
      },
      create: {
        id: 'seed-customer-address-001',
        customerId: fakeCustomer.id,
        label: 'Casa',
        recipientName: fakeCustomer.fullName,
        zipCode: '88034001',
        street: 'Rua das Conchas',
        number: '128',
        complement: 'Apto 302',
        neighborhood: 'Centro',
        city: 'Florianopolis',
        state: 'SC',
        isDefault: true,
      },
    })

    const paidVariant = bookMock.variants.find((variant) => variant.id === 'variant-signed-gift')

    if (!paidVariant) {
      throw new Error('A variante fisica do mock nao foi encontrada para criar o pedido fake.')
    }

    const fakeOrder = await prisma.order.upsert({
      where: {
        code: 'SEED-ORDER-0001',
      },
      update: {
        customerId: fakeCustomer.id,
        status: 'FULFILLED',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'DELIVERED',
        subtotalAmount: paidVariant.price,
        totalAmount: paidVariant.price,
        itemCount: 1,
        giftWrap: true,
        autographMessage: 'Para Marina, com carinho.',
        paidAt: new Date('2026-02-18T19:45:00.000Z'),
        notes: 'Pedido de exemplo criado pelo seed.',
      },
      create: {
        id: 'seed-order-001',
        code: 'SEED-ORDER-0001',
        customerId: fakeCustomer.id,
        status: 'FULFILLED',
        paymentStatus: 'PAID',
        fulfillmentStatus: 'DELIVERED',
        subtotalAmount: paidVariant.price,
        totalAmount: paidVariant.price,
        itemCount: 1,
        giftWrap: true,
        autographMessage: 'Para Marina, com carinho.',
        paidAt: new Date('2026-02-18T19:45:00.000Z'),
        notes: 'Pedido de exemplo criado pelo seed.',
      },
    })

    await prisma.orderItem.upsert({
      where: {
        id: 'seed-order-item-001',
      },
      update: {
        orderId: fakeOrder.id,
        productVariantId: paidVariant.id,
        sku: getVariantSeedMeta(paidVariant.id).sku,
        title: paidVariant.name,
        productType: paidVariant.type,
        quantity: 1,
        unitPriceAmount: paidVariant.price,
        totalPriceAmount: paidVariant.price,
        shippingRequired: paidVariant.shippingRequired,
        autographAvailable: paidVariant.autographAvailable,
      },
      create: {
        id: 'seed-order-item-001',
        orderId: fakeOrder.id,
        productVariantId: paidVariant.id,
        sku: getVariantSeedMeta(paidVariant.id).sku,
        title: paidVariant.name,
        productType: paidVariant.type,
        quantity: 1,
        unitPriceAmount: paidVariant.price,
        totalPriceAmount: paidVariant.price,
        shippingRequired: paidVariant.shippingRequired,
        autographAvailable: paidVariant.autographAvailable,
      },
    })

    await prisma.orderShippingAddress.upsert({
      where: {
        orderId: fakeOrder.id,
      },
      update: {
        recipientName: fakeCustomer.fullName,
        zipCode: '88034001',
        street: 'Rua das Conchas',
        number: '128',
        complement: 'Apto 302',
        neighborhood: 'Centro',
        city: 'Florianopolis',
        state: 'SC',
      },
      create: {
        id: 'seed-order-shipping-001',
        orderId: fakeOrder.id,
        recipientName: fakeCustomer.fullName,
        zipCode: '88034001',
        street: 'Rua das Conchas',
        number: '128',
        complement: 'Apto 302',
        neighborhood: 'Centro',
        city: 'Florianopolis',
        state: 'SC',
      },
    })

    const fakePayment = await prisma.payment.upsert({
      where: {
        id: 'seed-payment-001',
      },
      update: {
        orderId: fakeOrder.id,
        provider: PaymentProvider.MERCADO_PAGO,
        method: 'PIX',
        status: 'PAID',
        amount: paidVariant.price,
        providerReference: fakeOrder.code,
        pixQrCodeText: 'SEED-PIX-PAID',
        paidAt: new Date('2026-02-18T19:45:00.000Z'),
        rawResponse: {
          seed: true,
          source: 'prisma/seed.ts',
        },
      },
      create: {
        id: 'seed-payment-001',
        orderId: fakeOrder.id,
        provider: PaymentProvider.MERCADO_PAGO,
        method: 'PIX',
        status: 'PAID',
        amount: paidVariant.price,
        providerReference: fakeOrder.code,
        pixQrCodeText: 'SEED-PIX-PAID',
        paidAt: new Date('2026-02-18T19:45:00.000Z'),
        rawResponse: {
          seed: true,
          source: 'prisma/seed.ts',
        },
      },
    })

    await prisma.paymentEvent.upsert({
      where: {
        id: 'seed-payment-event-001',
      },
      update: {
        paymentId: fakePayment.id,
        eventType: 'PAYMENT_CONFIRMED',
        previousStatus: 'AWAITING_PAYMENT',
        nextStatus: 'PAID',
        payload: {
          seed: true,
          confirmedBy: 'seed-script',
        },
      },
      create: {
        id: 'seed-payment-event-001',
        paymentId: fakePayment.id,
        eventType: 'PAYMENT_CONFIRMED',
        previousStatus: 'AWAITING_PAYMENT',
        nextStatus: 'PAID',
        payload: {
          seed: true,
          confirmedBy: 'seed-script',
        },
      },
    })

    await prisma.adminAuditLog.upsert({
      where: {
        id: 'seed-admin-audit-001',
      },
      update: {
        adminUserId: admin.id,
        action: 'SEED_BOOTSTRAP',
        entityType: 'SYSTEM',
        entityId: 'initial-seed',
        description: 'Seed inicial executado com sucesso.',
        metadata: {
          adminEmail,
          bookSlug: book.slug,
          fakeOrderCode: fakeOrder.code,
        },
      },
      create: {
        id: 'seed-admin-audit-001',
        adminUserId: admin.id,
        action: 'SEED_BOOTSTRAP',
        entityType: 'SYSTEM',
        entityId: 'initial-seed',
        description: 'Seed inicial executado com sucesso.',
        metadata: {
          adminEmail,
          bookSlug: book.slug,
          fakeOrderCode: fakeOrder.code,
        },
      },
    })

    console.log('Seed concluido com sucesso.')
    console.log(`Admin: ${adminEmail}`)
    console.log(`Usuario: ${adminUsername}`)
    console.log(`Senha seed: ${adminPassword}`)
    console.log(`Livro: ${book.title}`)
    console.log(`Pedido fake: ${fakeOrder.code}`)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((error) => {
  console.error('Falha ao executar o seed.')
  console.error(error)
  process.exit(1)
})
