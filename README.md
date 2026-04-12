# A Ninfa de Prata

Landing page comercial com checkout funcional para venda de livro em formatos digital e fisico.

## Stack

- Next.js + React + TypeScript
- TailwindCSS
- Axios
- React Hook Form + Zod
- TanStack Query
- Zustand
- React Icons
- Framer Motion
- Sonner

## Como rodar

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev`: ambiente local
- `npm run build`: build de producao
- `npm run start`: sobe a build de producao
- `npm run lint`: lint
- `npm run typecheck`: validacao TypeScript

## Estrutura

```txt
app/
src/
  app/
    providers/
    styles/
  components/
    common/
    ui/
  constants/
  features/
    author/
    catalog/
    checkout/
    payment/
  hooks/
  integrations/
    api/
  layouts/
  views/
  types/
  utils/
  mocks/
```

## Fluxo atual

1. A pessoa escolhe uma variante do livro na landing ou na pagina de detalhes.
2. A escolha vai para a store do checkout com persistencia em `sessionStorage`.
3. O checkout valida os dados com Zod e adapta os campos conforme o produto.
4. Para Pix, a UI gera QR Code, exibe copia e cola e consulta o status.
5. Para cartao, a base envia um payload pronto para evoluir para tokenizacao real via backend seguro.
6. Sucesso e falha possuem paginas dedicadas.

## Arquitetura

- `features/catalog`: livro, autora, seções comerciais e variantes de compra
- `features/checkout`: formulario, resumo, store, schema e servico de pedidos
- `features/payment`: seletor de pagamento, Pix, cartao, polling de status e camada de servico
- `components/ui`: primitives reutilizaveis
- `components/common`: header, footer, SEO, estados de tela
- `integrations/api`: ponto central para Axios e endpoints

## Importante sobre pagamentos

Esta base simula o backend com mocks em `sessionStorage` para acelerar a implementacao visual e arquitetural.

Em producao:

- o frontend nao deve conter segredo do PagBank
- para checkout transparente com cartao, o frontend deve usar apenas a chave publica do PagBank e enviar o cartao criptografado para o backend
- a tokenizacao do cartao deve ocorrer com SDK seguro ou campos do provedor
- o backend deve criar cobrancas, receber webhooks e persistir status oficiais
- o frontend deve falar apenas com a API intermediaria da aplicacao

## Proximos passos recomendados

- ligar `catalogService`, `checkoutService` e `paymentService` a uma API real ou Route Handlers do Next
- adicionar cupons, frete e calculo logistico
- criar area do cliente e rastreio de pedidos
- preparar admin para conteudo, estoque e campanhas
