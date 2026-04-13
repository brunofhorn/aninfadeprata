# Modelagem inicial do banco

## Objetivo

Esta modelagem foi pensada para suportar:

- catalogo com multiplos livros e variantes de venda
- cadastro e historico do cliente
- pedidos e pagamentos via Pix ou cartao
- area administrativa com auditoria
- relatorios operacionais e financeiros

## Dominios principais

### Administracao

- `AdminUser`
  - usuarios internos do painel administrativo
  - campos: `id`, `email`, `passwordHash`, `name`, `role`, `isActive`, `lastLoginAt`, `createdAt`, `updatedAt`
- `AdminAuditLog`
  - trilha de auditoria das acoes do admin
  - campos: `id`, `adminUserId`, `action`, `entityType`, `entityId`, `description`, `metadata`, `createdAt`

### Catalogo editorial

- `Author`
  - dados do autor
  - campos: `id`, `name`, `slug`, `headline`, `bio`, `photoUrl`, `websiteUrl`, `instagramUrl`, `tiktokUrl`, `skoobUrl`, `createdAt`, `updatedAt`
- `Book`
  - livro principal, independente de formato
  - campos: `id`, `authorId`, `slug`, `title`, `subtitle`, `tagline`, `description`, `synopsis`, `pitch`, `isbn`, `pageCount`, `language`, `publicationYear`, `coverImageUrl`, `heroImageUrl`, `status`, `publishedAt`, `createdAt`, `updatedAt`
- `Category`
  - categorias para classificacao do livro
  - campos: `id`, `slug`, `name`, `createdAt`, `updatedAt`
- `BookCategory`
  - relacionamento N:N entre livro e categoria
  - campos: `bookId`, `categoryId`, `createdAt`
- `BookChapter`
  - blocos de conteudo da pagina do livro
  - campos: `id`, `bookId`, `position`, `title`, `description`, `icon`, `createdAt`, `updatedAt`
- `BookCharacter`
  - personagens exibidos na pagina do livro
  - campos: `id`, `bookId`, `name`, `role`, `description`, `imageUrl`, `gridSpan`, `position`, `createdAt`, `updatedAt`
- `BookLocation`
  - ambientacoes exibidas na pagina do livro
  - campos: `id`, `bookId`, `name`, `description`, `imageUrl`, `gridSpan`, `position`, `createdAt`, `updatedAt`
- `BookTestimonial`
  - depoimentos ou provas sociais
  - campos: `id`, `bookId`, `authorName`, `text`, `highlight`, `position`, `createdAt`, `updatedAt`
- `BookFaqItem`
  - FAQ da pagina do livro
  - campos: `id`, `bookId`, `question`, `answer`, `position`, `createdAt`, `updatedAt`
- `ProductVariant`
  - formato comercial vendavel de um livro
  - campos: `id`, `bookId`, `sku`, `slug`, `type`, `name`, `description`, `priceAmount`, `compareAtAmount`, `giftsIncluded`, `shippingRequired`, `autographAvailable`, `deliveryEstimate`, `isActive`, `trackInventory`, `stockQuantity`, `lowStockThreshold`, `sortOrder`, `createdAt`, `updatedAt`

### Cliente

- `Customer`
  - cadastro principal do comprador
  - campos: `id`, `email`, `fullName`, `cpf`, `phone`, `marketingOptIn`, `notes`, `createdAt`, `updatedAt`
- `CustomerAddress`
  - enderecos reutilizaveis do cliente
  - campos: `id`, `customerId`, `label`, `recipientName`, `zipCode`, `street`, `number`, `complement`, `neighborhood`, `city`, `state`, `country`, `isDefault`, `createdAt`, `updatedAt`

### Pedido

- `Order`
  - cabecalho do pedido
  - campos: `id`, `code`, `customerId`, `contactChannel`, `currency`, `status`, `paymentStatus`, `fulfillmentStatus`, `subtotalAmount`, `discountAmount`, `shippingAmount`, `totalAmount`, `itemCount`, `giftWrap`, `autographMessage`, `notes`, `paidAt`, `cancelledAt`, `createdAt`, `updatedAt`
- `OrderItem`
  - itens comprados, com snapshot de preco e tipo
  - campos: `id`, `orderId`, `productVariantId`, `sku`, `title`, `productType`, `quantity`, `unitPriceAmount`, `totalPriceAmount`, `shippingRequired`, `autographAvailable`, `createdAt`
- `OrderShippingAddress`
  - endereco congelado no momento da compra
  - campos: `id`, `orderId`, `recipientName`, `zipCode`, `street`, `number`, `complement`, `neighborhood`, `city`, `state`, `country`, `createdAt`

### Pagamento

- `Payment`
  - tentativa ou cobranca vinculada ao pedido
  - campos: `id`, `orderId`, `provider`, `method`, `status`, `amount`, `currency`, `installments`, `providerPaymentId`, `providerReference`, `holderName`, `holderCpf`, `cardBrand`, `cardFirstSix`, `cardLastFour`, `pixQrCodeText`, `pixQrCodeImageUrl`, `pixExpiresAt`, `paidAt`, `failureReason`, `rawResponse`, `createdAt`, `updatedAt`
- `PaymentEvent`
  - historico de mudancas de status do pagamento
  - campos: `id`, `paymentId`, `providerEventId`, `eventType`, `previousStatus`, `nextStatus`, `payload`, `createdAt`
- `WebhookEvent`
  - log de webhooks recebidos do provedor
  - campos: `id`, `provider`, `externalEventId`, `eventType`, `processingStatus`, `payload`, `receivedAt`, `processedAt`, `errorMessage`

## Relatorios

Nao foi criada uma tabela especifica de relatorios neste primeiro momento.
Os relatorios administrativos podem ser derivados de:

- `Order` e `OrderItem` para volume de vendas, ticket medio e produtos mais vendidos
- `Payment` e `PaymentEvent` para conversao, inadimplencia, chargeback e performance por metodo
- `WebhookEvent` para auditoria operacional
- `Customer` para recorrencia e base de clientes

Se no futuro o volume crescer, podemos adicionar tabelas de agregacao diaria, como:

- `DailySalesSnapshot`
- `ProductSalesSnapshot`
- `PaymentKpiSnapshot`

## Decisoes importantes

- `Book` e `ProductVariant` ficam separados para suportar varios livros e varios formatos por livro
- `OrderItem` guarda snapshot do produto para preservar historico mesmo se o catalogo mudar
- `OrderShippingAddress` fica separado de `CustomerAddress` porque o endereco do pedido nao deve mudar retroativamente
- `Payment`, `PaymentEvent` e `WebhookEvent` juntos cobrem cobranca, conciliacao e auditoria
- `AdminAuditLog` prepara a base para painel administrativo com rastreabilidade
