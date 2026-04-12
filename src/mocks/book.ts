import type { Book } from '@/features/catalog/types/catalog.types'
import { PRODUCT_TYPES } from '@/types/enums'

export const bookMock: Book = {
  id: 'book-001',
  slug: 'a-ninfa-de-prata',
  title: 'A Ninfa de Prata',
  subtitle: 'Entre memorias, mar e destino',
  tagline: 'Uma fantasia sensivel para quem procura beleza, misterio e coragem.',
  description:
    'Um romance de fantasia lirica que costura segredos familiares, viagens interiores e um mundo que parece sussurrar para quem ainda sabe escutar.',
  synopsis:
    'Quando ecos de um passado esquecido voltam a emergir, uma jovem autora de mapas emocionais se ve obrigada a atravessar a costa prateada onde lendas nunca morreram. Entre escolhas afetivas, promessas antigas e um chamado quase impossivel de ignorar, ela descobre que alguns livros nao contam apenas uma historia: eles abrem portais para aquilo que ainda precisamos nos tornar.',
  pitch:
    'Uma landing page pensada para converter curiosidade em compra, destacando a atmosfera do livro, a voz da autora e as diferentes experiencias de aquisicao para leitoras e leitores que desejam colecionar mais do que uma leitura.',
  isbn: '978-65-00000-01-1',
  pageCount: 312,
  language: 'Portugues',
  publicationYear: 2026,
  categories: ['Fantasia', 'Romance', 'Drama'],
  author: {
    id: 'author-001',
    name: 'Sara Borges',
    headline: 'Autora de fantasia contemporanea e narrativas de atmosfera poetica.',
    bio: 'Helena Maris escreve historias centradas em memoria, identidade e paisagens afetivas. Seus livros investigam o encontro entre o fantastico e o intimo, sempre com foco em personagens que precisam atravessar transformacoes profundas.',
    photoUrl: 'https://picsum.photos/seed/author-helena/600/600',
    socialLinks: [
      { label: 'Instagram', url: 'https://instagram.com/saraborgesch' },
      { label: 'Site oficial', url: 'https://autorasaraborges.com.br/' },
    ],
  },
  characters: [
    {
      id: 'char-1',
      name: 'Lina',
      role: 'Protagonista',
      description: 'Cartografa emocional que aprende a ler silencios como mapas.',
      imageUrl: 'https://picsum.photos/seed/nymph-guardian/900/900',
      gridSpan: 'md:col-span-2',
    },
    {
      id: 'char-2',
      name: 'Ari',
      role: 'Guardiao das mareas',
      description: 'Um aliado enigmatico que conhece os ritos e os perigos da costa.',
      imageUrl: 'https://picsum.photos/seed/forest-messenger/700/900',
    },
    {
      id: 'char-3',
      name: 'Mara',
      role: 'Voz do passado',
      description: 'Figura central na heranca afetiva e espiritual que move a trama.',
      imageUrl: 'https://picsum.photos/seed/silver-oracle/700/900',
    },
  ],
  locations: [
    {
      id: 'loc-1',
      name: 'Costa de Vidro',
      description: 'Falesias, agua fria e um horizonte que parece guardar pressagios.',
      imageUrl: 'https://picsum.photos/seed/glass-coast/900/900',
      gridSpan: 'md:col-span-2',
    },
    {
      id: 'loc-2',
      name: 'Casa das Mareas',
      description: 'Uma residencia ancestral onde o tempo dobra sobre si.',
      imageUrl: 'https://picsum.photos/seed/tide-house/700/900',
    },
    {
      id: 'loc-3',
      name: 'Biblioteca Submersa',
      description: 'Espaco simbolico onde lembrancas e escolhas voltam a respirar.',
      imageUrl: 'https://picsum.photos/seed/submerged-library/700/900',
    },
  ],
  chapters: [
    {
      id: '01',
      title: 'O despertar da floresta',
      description: 'As raizes se movem antes que a protagonista compreenda o chamado.',
      icon: 'sparkles',
    },
    {
      id: '02',
      title: 'O segredo da prata',
      description: 'Uma heranca viva revela o custo real de manter o equilibrio.',
      icon: 'eye',
    },
    {
      id: '03',
      title: 'A cancao da ninfa',
      description: 'A voz ancestral que cura tambem pode acordar aquilo que dorme.',
      icon: 'music',
    },
  ],
  testimonials: [
    {
      id: 'test-1',
      authorName: 'Leitora beta',
      text: 'Uma fantasia delicada e poderosa, com cenas que ficam ecoando por dias.',
      highlight: 'Delicada e poderosa',
    },
    {
      id: 'test-2',
      authorName: 'Clube de leitura Aurora',
      text: 'O livro mistura lirismo e tensao de um jeito raro. E impossivel sair igual da leitura.',
      highlight: 'Impossivel sair igual',
    },
    {
      id: 'test-3',
      authorName: 'Editora convidada',
      text: 'Um projeto com enorme potencial comercial e emocional, especialmente em edicoes especiais.',
      highlight: 'Potencial comercial e emocional',
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Qual a diferença entre EPUB e PDF?',
      answer:
        'O EPUB se adapta melhor ao tamanho da tela e costuma ser ideal para e-readers (Kindle, Kobo ou Boox). O PDF preserva o layout original da edição.',
    },
    {
      id: 'faq-2',
      question: 'Como funciona a versão com autógrafo?',
      answer:
        'No checkout, a pessoa compradora pode informar o nome para autógrafo, e marcar caso queira uma dedicatoria curta. O pedido segue para a autora apenas após a confirmação do pagamento.',
    },
    {
      id: 'faq-3',
      question: 'O pagamento por PIX confirma na hora?',
      answer:
        'Na maioria dos casos sim. O site acompanha o status automaticamente e redireciona quando confirma o pagamento.',
    },
  ],
  variants: [
    {
      id: 'variant-epub-pdf',
      type: PRODUCT_TYPES.EPUB,
      name: 'Digital EPUB & PDF',
      description: 'Arquivo flexivel para Kindle, Kobo, Boox e leitores compatíveis.',
      price: 1.0,
      compareAtPrice: 39.9,
      shippingRequired: false,
      autographAvailable: false,
      deliveryEstimate: 'Entrega imediata por e-mail.',
    },
    {
      id: 'variant-signed-gift',
      type: PRODUCT_TYPES.PHYSICAL_SIGNED_GIFT,
      name: 'Físico com autógrafo e brindes',
      description: 'Livro autografado com marcador especial, adesivos e outros brindes.',
      price: 99.9,
      compareAtPrice: 119.9,
      shippingRequired: true,
      autographAvailable: true,
      giftsIncluded: ['Autografado', 'Marcador personalizado', '6 adesivos', 'Brindes extras'],
      deliveryEstimate: 'Postagem em até 7 dias úteis.',
    },
  ],
}
