import type { Project } from "@/types/project";

/**
 * Regra de produção: só renderiza `published: true`. Hoje: apenas LIVRA.
 * DUX/Vivo ficam como estrutura (published: false). Placeholders "EM BREVE"
 * aparecem só em DEV (densidade do índice), nunca em produção.
 * Launch DoD: ≥ 3 cases publicados. Ordem futura: loja-demo → LIVRA → demais.
 */
const projects: Project[] = [
  {
    slug: "livra",
    title: "LIVRA",
    client: { pt: "Projeto próprio", en: "Own product" },
    role: {
      pt: "Design, front-end e back-end serverless",
      en: "Design, front-end and serverless back-end",
    },
    year: 2025,
    type: { pt: "Product · Full-stack", en: "Product · Full-stack" },
    stack: ["React 19", "Vite PWA", "Firebase", "Cloud Functions", "Capacitor", "Stripe", "Gemini"],
    summary: {
      pt: "Um app de leitura inteiro, feito sozinho: iOS, Android e web, 300 usuários cadastrados no primeiro mês. Por baixo, 6 APIs de catálogo convergindo numa identidade canônica de livro.",
      en: "A whole reading app, built alone: iOS, Android and web, 300 registered users in its first month. Underneath, 6 catalog APIs converging into one canonical book identity.",
    },
    problem: { pt: "", en: "" },
    contribution: { pt: "", en: "" },
    results: [],
    body: {
      pt: [
        { kind: "heading", text: "Contexto" },
        {
          kind: "text",
          text: "O leitor brasileiro vive entre catálogos que não conversam: Skoob tem acervo nacional mas o produto parou no tempo; Goodreads ignora o Brasil; nenhum tem um loop de hábito de verdade. O LIVRA é um diário de leitura gamificado — streak, ligas semanais, economia de moedas, modo foco — desenhado para quem já transforma leitura em conteúdo no TikTok e no Instagram.",
        },
        { kind: "heading", text: "O problema técnico central" },
        {
          kind: "text",
          text: "Não existe uma fonte de dados de livros que resolva o Brasil. Google Books tem volume mas é ruidoso e não retorna contagem de páginas na busca; a Apple tem as melhores capas mas precisa de localização forçada; a CBL é a autoridade em edição nacional mas às vezes serve a ficha catalográfica como capa; Open Library é só fallback. Nenhuma sozinha resolve — a orquestração é o produto.",
        },
        { kind: "heading", text: "O que eu construí" },
        {
          kind: "text",
          text: "Uma busca unificada que consulta até 6 fontes em paralelo, detecta o tipo de consulta (ISBN vs. texto livre) e reconcilia tudo numa identidade canônica de obra × edição: o mesmo livro chegando como `apple-X`, `google-Y` ou `isbn:Z` converge para um único documento — o que impede cards duplicados, resenhas fragmentadas e capas inconsistentes. Avaliações são chaveadas por obra, não por edição, para que edições diferentes compartilhem as mesmas resenhas.",
        },
        {
          kind: "text",
          text: "Em volta do núcleo: scanner barcode-first (decode local via ZXing, custo zero) com IA multimodal só como fallback de foto de capa; recomendações geradas pelo Gemini mas validadas contra o catálogo real antes de virarem card; e um catálogo que se auto-cura — abrir um livro com metadados pobres dispara enriquecimento em background, então navegar melhora a base.",
        },
        { kind: "heading", text: "Por que foi feito assim" },
        {
          kind: "list",
          items: [
            { label: "Economia client-locked:", text: "moedas, XP, streak e status PRO só são escritos por Cloud Functions, com transações idempotentes por `{userId}_{reason}_{dayKey}`. O cliente nunca é confiável para dinheiro — nem o meu." },
            { label: "Regra “nunca cachear lista vazia”:", text: "uma fonte que falha e retorna `[]` envenenaria o cache pelo TTL inteiro, sumindo com livros. Toda camada de cache valida antes de persistir." },
            { label: "Custo como requisito:", text: "~40 reads por busca viraram camadas de cache com TTLs distintos (5min ISBN, 24h texto, 7 dias CBL); a cota do Google Books virou métrica observável — um 503 em produção me ensinou a diferença entre cota diária e soft rate limit, e o fix foi stagger + circuit breaker, não “tentar de novo”." },
            { label: "Defesa em profundidade como padrão:", text: "cada bug corrigido na origem (server), com defesa no client (auto-cura) e script de limpeza para os dados já gravados — o que permite evoluir um catálogo vivo sem migrações traumáticas." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "No ar na App Store, no Google Play e na web (versão 1.10 nas lojas). 300 usuários cadastrados no primeiro mês, com um app construído e operado por uma pessoa. As métricas que eu acompanho são de engenharia: custo por busca, convergência de identidade, integridade da economia.",
        },
      ],
      en: [
        { kind: "heading", text: "Context" },
        {
          kind: "text",
          text: "Brazilian readers live between catalogs that don't talk to each other: Skoob has the national collection but the product stalled years ago; Goodreads ignores Brazil; neither has a real habit loop. LIVRA is a gamified reading journal — streaks, weekly leagues, a coin economy, focus mode — built for readers who already turn books into content on TikTok and Instagram.",
        },
        { kind: "heading", text: "The core technical problem" },
        {
          kind: "text",
          text: "No single book-data source solves Brazil. Google Books has volume but is noisy and doesn't return page counts in search; Apple has the best covers but needs forced localization; CBL is the authority on Brazilian editions but sometimes serves the catalog card as the cover; Open Library is fallback only. None of them solves it alone — the orchestration is the product.",
        },
        { kind: "heading", text: "What I built" },
        {
          kind: "text",
          text: "A unified search that queries up to 6 sources in parallel, detects query type (ISBN vs. free text) and reconciles everything into a canonical work × edition identity: the same book arriving as `apple-X`, `google-Y` or `isbn:Z` converges into a single document — preventing duplicate cards, fragmented reviews and inconsistent covers. Ratings are keyed by work, not edition, so different editions share the same reviews.",
        },
        {
          kind: "text",
          text: "Around the core: a barcode-first scanner (local ZXing decode, zero cost) with multimodal AI only as a cover-photo fallback; recommendations generated by Gemini but validated against the real catalog before becoming cards; and a self-healing catalog — opening a book with poor metadata triggers background enrichment, so browsing improves the database.",
        },
        { kind: "heading", text: "Why it's built this way" },
        {
          kind: "list",
          items: [
            { label: "Client-locked economy:", text: "coins, XP, streaks and PRO status are only ever written by Cloud Functions, with idempotent transactions keyed by `{userId}_{reason}_{dayKey}`. The client is never trusted with money — not even mine." },
            { label: "The “never cache an empty list” rule:", text: "a failing source returning `[]` would poison the cache for its entire TTL, making books invisible. Every cache layer validates before persisting." },
            { label: "Cost as a requirement:", text: "~40 reads per search became layered caches with distinct TTLs (5min ISBN, 24h text, 7 days CBL); the Google Books quota became an observable metric — a production 503 taught me the difference between a daily quota and a soft rate limit, and the fix was stagger + circuit breaker, not “retry harder”." },
            { label: "Defense in depth as a pattern:", text: "every bug fixed at the source (server), with client-side defense (self-healing) and a cleanup script for already-written data — which lets a living catalog evolve without traumatic migrations." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "Live on the App Store, Google Play and the web (version 1.10 in the stores). 300 registered users in the first month, on an app built and run by one person. The metrics I watch are engineering metrics: cost per search, identity convergence, economy integrity.",
        },
      ],
    },
    live: ["uselivra.com"],
    // Fonte: o João (300 no 1º mês) e lura/docs/STATUS.md, medido em 21/09/2026.
    stats: [
      { value: "300", label: { pt: "usuários cadastrados no primeiro mês", en: "registered users in the first month" } },
      { value: "3", label: { pt: "plataformas: iOS, Android e web", en: "platforms: iOS, Android and web" } },
      { value: "203", label: { pt: "Cloud Functions no repositório", en: "Cloud Functions in the repo" } },
      { value: "1", label: { pt: "pessoa: design, front, back e nativo", en: "person: design, front, back and native" } },
    ],
    caption: {
      pt: "Quatro das seis fontes de catálogo convergindo numa obra canônica.",
      en: "Four of six catalog sources converging into one canonical work.",
    },
    cover: "",
    gallery: [],
    featured: true,
    published: true,
    order: 4,
  },

  {
    slug: "hsm-singularity",
    title: "HSM / Singularity",
    client: { pt: "HSM · Singularity", en: "HSM · Singularity" },
    role: {
      pt: "Sozinho: vitrine, componentes, app de imposto e formulários",
      en: "Solo: storefront, components, tax app and forms",
    },
    year: 2026,
    type: { pt: "Headless · Apps", en: "Headless · Apps" },
    stack: ["Shopify Hydrogen", "React Router 7", "Oxygen", "Shopify Functions", "Checkout UI extensions", "Metaobjects", "Salesforce API", "TypeScript"],
    summary: {
      pt: "Duas marcas de educação numa vitrine headless que construí sozinho, com um app próprio que retém tributos federais no checkout quando quem compra é uma empresa.",
      en: "Two education brands on one headless storefront I built alone, with a custom app that withholds federal taxes at checkout when the buyer is a company.",
    },
    problem: { pt: "", en: "" },
    contribution: { pt: "", en: "" },
    results: [],
    // Fora daqui, de propósito: o dono do Salesforce, as alíquotas e faixas do
    // cliente, nomes de campo do CRM e qualquer nome interno da agência.
    body: {
      pt: [
        { kind: "heading", text: "Contexto" },
        {
          kind: "text",
          text: "HSM e Singularity são duas marcas de educação executiva, com cursos e eventos, vendidas a partir de um admin Shopify. Construí a vitrine headless sozinho, em Hydrogen sobre React Router 7: um código só, publicado como duas vitrines no Oxygen, com as seções, os formulários e um app próprio para impostos.",
        },
        { kind: "heading", text: "O problema técnico central" },
        {
          kind: "text",
          text: "Quando uma empresa compra no Brasil, parte dos tributos federais é retida na fonte: ela paga o pedido menos a retenção e recolhe o resto direto com a Receita. O Shopify não tem esse conceito. As configurações de imposto dele só somam imposto, não subtraem, e não mudam conforme quem está comprando. E o valor que o checkout mostra precisa bater com a nota no centavo.",
        },
        { kind: "heading", text: "O que eu construí" },
        {
          kind: "list",
          items: [
            { label: "Retenção como desconto, numa Shopify Function:", text: "a regra roda numa Function de desconto e devolve um valor fixo no pedido, com o nome “Retenção na fonte”. Ela considera faixas de valor, a isenção parcial de quem é optante do Simples Nacional e três formas de reconhecer uma compra de empresa: o CNPJ, uma tag de cliente ou uma empresa B2B." },
            { label: "CNPJ validado no campo nativo:", text: "uma Function de validação confere os dígitos verificadores e trava o checkout antes do pagamento quando o número está malformado." },
            { label: "Uma extensão de checkout que mantém a Function em dia:", text: "a Function não enxerga o campo nativo de documento ao vivo. A extensão copia o CNPJ para um metafield do carrinho, cada escrita roda a regra de novo, e a própria extensão mostra o detalhamento por tributo." },
            { label: "Alíquotas como dado:", text: "faixas e alíquotas ficam num JSON em metafield que a Function, a extensão e um formulário no admin leem. Mudar uma alíquota é editar o admin, sem deploy." },
            { label: "Formulários feitos de metaobjects, entregues no Salesforce:", text: "campos e etapas são metaobjects, e cada produto escolhe o seu formulário. O servidor refaz a validação a partir da definição do admin e cria o lead no Salesforce por OAuth. Se o CRM recusa um valor, ele vai para a descrição e o envio é repetido, então um erro de digitação no admin não perde lead." },
            { label: "Duas marcas, um build:", text: "a marca é resolvida em tempo de execução pelo ambiente, o tema é isolado por atributo no HTML, e os e-mails transacionais das duas marcas saem do mesmo conjunto de templates." },
          ],
        },
        { kind: "heading", text: "Por que foi feito assim" },
        {
          kind: "list",
          items: [
            { label: "Desconto, porque imposto no Shopify só sobe:", text: "modelar a retenção como desconto de pedido com valor fixo é o jeito de o total do checkout mostrar o que a empresa realmente paga." },
            { label: "Centavos inteiros nas duas pontas:", text: "a Function e a extensão calculam separadas. Com ponto flutuante, em alguns totais elas discordariam em um centavo na frente do cliente. As duas usam a mesma conta em inteiros, com arredondamento half-up." },
            { label: "A definição do formulário vale no servidor:", text: "a validação é refeita a partir do admin, então o cliente não pula campo obrigatório, e quem edita o formulário não depende de deploy." },
            { label: "Falhar com calma no CRM:", text: "CRM recusa valor de lista o tempo todo. Um lead perdido custa mais que uma descrição bagunçada." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "Em desenvolvimento, antes do lançamento nos domínios finais. As vitrines rodam em deploys de preview e o app de imposto já está instalado na loja.",
        },
      ],
      en: [
        { kind: "heading", text: "Context" },
        {
          kind: "text",
          text: "HSM and Singularity are two executive-education brands, selling courses and events from one Shopify admin. I built the headless storefront alone, on Hydrogen and React Router 7: one codebase deployed as two storefronts on Oxygen, with the sections, the forms and a custom app for taxes.",
        },
        { kind: "heading", text: "The core technical problem" },
        {
          kind: "text",
          text: "When a company buys in Brazil, part of the federal taxes is withheld at source: the company pays the order minus the withholding and settles the rest with the tax authority. Shopify has no such concept. Its tax settings add tax; they can't subtract it, and they don't change with who is buying. And the number on the checkout has to match the invoice to the cent.",
        },
        { kind: "heading", text: "What I built" },
        {
          kind: "list",
          items: [
            { label: "Withholding as a discount, in a Shopify Function:", text: "the rule runs in a discount Function and returns a fixed order-level amount labeled “Withholding at source”. It handles value tiers, the partial exemption for companies under Simples Nacional, and three ways to recognize a company purchase: the CNPJ, a customer tag or a B2B company." },
            { label: "CNPJ validated at the native field:", text: "a validation Function checks the CNPJ check digits and blocks the checkout before payment when the number is malformed." },
            { label: "A checkout extension that keeps the Function in step:", text: "the Function can't read the native tax ID field live. The extension copies the CNPJ into a cart metafield, every write re-runs the rule, and the extension itself shows the per-tax breakdown." },
            { label: "Rates as data:", text: "tiers and rates live in a JSON metafield read by the Function, the extension and a settings form in the admin. Changing a rate is an admin edit, with no deploy." },
            { label: "Forms built from metaobjects, delivered to Salesforce:", text: "fields and steps are metaobjects, and each product picks its form. The server rebuilds validation from the admin definition and creates the lead in Salesforce over OAuth. When the CRM rejects a value, it moves into the description and the request is retried, so a typo in the admin never loses a lead." },
            { label: "Two brands, one build:", text: "the brand is resolved at runtime from the environment, the theme is scoped by an attribute on the HTML, and both brands' transactional emails come from one set of templates." },
          ],
        },
        { kind: "heading", text: "Why it's built this way" },
        {
          kind: "list",
          items: [
            { label: "A discount, because Shopify tax only goes up:", text: "modeling the withholding as a fixed order discount is how the checkout total shows what the company actually pays." },
            { label: "Integer cents on both sides:", text: "the Function and the extension compute separately. With floating point, some totals would disagree by a cent in front of the customer. Both use the same integer arithmetic with half-up rounding." },
            { label: "The form definition is enforced on the server:", text: "validation is rebuilt from the admin, so a client can't skip a required field, and whoever edits the form doesn't wait for a deploy." },
            { label: "Fail soft at the CRM:", text: "CRMs reject picklist values all the time. A lost lead costs more than a messy description field." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "In development, ahead of launch on the final domains. The storefronts run on preview deployments and the tax app is already installed on the store.",
        },
      ],
    },
    caption: {
      pt: "O CNPJ de uma empresa vira uma linha de retenção no checkout.",
      en: "A company's tax ID becomes a withholding line at checkout.",
    },
    cover: "",
    gallery: [],
    featured: true,
    published: true,
    order: 3,
  },

  // ── estrutura, não publicado (aguardando autorização/produção) ──
  {
    // Operação e métricas sob NDA: o case fica em nível de arquitetura e decisão.
    slug: "roland-boss",
    title: "Roland / Boss",
    client: { pt: "Roland Brasil", en: "Roland Brazil" },
    role: {
      pt: "Liderança técnica de squad · Front-end",
      en: "Squad tech lead · Front-end",
    },
    year: 2025,
    type: { pt: "E-commerce headless", en: "Headless e-commerce" },
    stack: ["Shopify Hydrogen", "Remix", "Oxygen", "Weaverse", "TypeScript"],
    summary: {
      pt: "Duas marcas, dois domínios, um checkout só — o primeiro carrinho compartilhado entregue pela agência.",
      en: "Two brands, two domains, one checkout — the agency's first shared cart.",
    },
    problem: { pt: "", en: "" },
    contribution: { pt: "", en: "" },
    results: [],
    body: {
      pt: [
        { kind: "heading", text: "Contexto" },
        {
          kind: "text",
          text: "Roland e Boss são marcas irmãs de equipamento musical, e operam lojas separadas no Brasil: `store.roland.com.br` e `store.bossmusic.com.br`. Duas storefronts headless em Shopify Hydrogen, servidas por uma única loja Shopify por baixo. O projeto chegou à minha squad como ongoing — manutenção e evolução contínua —, o que significa entregar features novas sem poder parar a loja para reescrever nada.",
        },
        { kind: "heading", text: "O problema técnico central" },
        {
          kind: "text",
          text: "Duas marcas, dois domínios, um catálogo. Quem entra pela Roland atrás de um sintetizador e também quer um pedal Boss não deveria comprar duas vezes. E o Shopify por baixo é o mesmo — o carrinho *poderia* ser o mesmo. Quem diz que não é o navegador: a sessão que identifica o carrinho em `store.roland.com.br` simplesmente não existe em `store.bossmusic.com.br`. A fronteira não é de plataforma, é de domínio.",
        },
        {
          kind: "text",
          text: "Era o primeiro carrinho compartilhado que a agência entregava. Não havia referência interna, nenhum “já fizemos assim da outra vez” — a arquitetura precisava ser investigada e defendida antes de virar código.",
        },
        { kind: "heading", text: "O que a squad construiu" },
        {
          kind: "list",
          items: [
            { label: "Carrinho compartilhado com checkout único:", text: "em vez de manter dois carrinhos tentando se sincronizar, as duas storefronts conversam com um ponto de conexão comum, responsável por construir e manter um carrinho só. Adicionar item por qualquer uma das marcas alimenta o mesmo checkout." },
            { label: "Busca cruzada com PDP canônica:", text: "buscar na Roland retorna o catálogo inteiro, das duas marcas. Clicar num resultado Boss leva direto à PDP no domínio da Boss — e vice-versa. O catálogo é um só; cada produto continua sendo mostrado na casa da sua marca." },
            { label: "Agendamento de campanha configurável:", text: "banners e seções com janela de entrada e saída, construídos por nós e expostos como configuração no Weaverse. O time do cliente define quando a Black Friday sobe e quando ela cai, sem depender de deploy nosso." },
            { label: "Ongoing de verdade:", text: "refação do header, evolução do sistema de banners e trabalho contínuo de performance, sempre sobre uma loja que não pode sair do ar." },
          ],
        },
        { kind: "heading", text: "Por que foi feito assim" },
        {
          kind: "list",
          items: [
            { label: "Um carrinho, não dois sincronizados:", text: "a tentação era espelhar estado entre as duas storefronts. Sincronização entre réplicas é onde moram os bugs de corrida — item somem, quantidade diverge, e o erro só aparece em produção com dois dispositivos. Centralizar a construção do carrinho num ponto comum troca um problema distribuído por um problema de integração, que é muito mais fácil de testar e de explicar." },
            { label: "Catálogo único, navegação por marca:", text: "duplicar produto por marca resolveria a busca em cinco minutos e criaria conteúdo duplicado, SEO canibalizado e dois lugares para atualizar preço. Cada produto tem um dono; a busca cruza a fronteira, a PDP canoniza no domínio certo." },
            { label: "Data de campanha é configuração, não deploy:", text: "campanha muda de data na véspera — sempre. Toda feature sazonal nasceu com janela editável pelo cliente no Weaverse. Isso tira a agência do caminho crítico da operação e elimina uma classe inteira de emergência de véspera de feriado." },
            { label: "Liderar rendeu mais que codar:", text: "por ser o primeiro do tipo na casa, meu trabalho de maior alavancagem foi investigar as soluções, validar a arquitetura e conduzir o time até ela — não escrever as linhas. Passei mais tempo destravando decisão do que digitando, e a entrega foi melhor por isso." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "Em produção, em ongoing. Números de performance e detalhes da operação estão sob acordo de confidencialidade — o que dá para mostrar aqui é a arquitetura e o raciocínio por trás dela.",
        },
      ],
      en: [
        { kind: "heading", text: "Context" },
        {
          kind: "text",
          text: "Roland and Boss are sibling music-equipment brands running separate stores in Brazil: `store.roland.com.br` and `store.bossmusic.com.br`. Two headless Shopify Hydrogen storefronts, served by a single Shopify store underneath. The project came to my squad as an ongoing engagement — continuous maintenance and evolution — which means shipping new features without ever taking the store down to rewrite anything.",
        },
        { kind: "heading", text: "The core technical problem" },
        {
          kind: "text",
          text: "Two brands, two domains, one catalog. Someone who lands on Roland for a synth and also wants a Boss pedal shouldn't have to check out twice. And the Shopify underneath is the same — the cart *could* be the same. It's the browser that says no: the session identifying the cart on `store.roland.com.br` simply doesn't exist on `store.bossmusic.com.br`. The boundary isn't the platform, it's the domain.",
        },
        {
          kind: "text",
          text: "It was the first shared cart the agency had ever delivered. There was no internal reference, no “we did it this way last time” — the architecture had to be investigated and defended before it became code.",
        },
        { kind: "heading", text: "What the squad built" },
        {
          kind: "list",
          items: [
            { label: "Shared cart with a single checkout:", text: "instead of two carts trying to stay in sync, both storefronts talk to a shared connection point that builds and owns a single cart. Adding an item from either brand feeds the same checkout." },
            { label: "Cross-brand search with canonical PDPs:", text: "searching on Roland returns the full catalog, both brands. Clicking a Boss result lands straight on the PDP under the Boss domain — and vice versa. One catalog; each product still shown in its own brand's house." },
            { label: "Configurable campaign scheduling:", text: "banners and sections with start and end windows, built by us and exposed as configuration inside Weaverse. The client's team decides when Black Friday goes up and when it comes down, with no deploy from us." },
            { label: "Real ongoing work:", text: "header rebuild, banner system evolution and continuous performance work — always on a store that can't go offline." },
          ],
        },
        { kind: "heading", text: "Why it's built this way" },
        {
          kind: "list",
          items: [
            { label: "One cart, not two in sync:", text: "the tempting path was mirroring state across both storefronts. Replica sync is where race conditions live — items vanish, quantities drift, and the bug only shows up in production with two devices. Centralizing cart construction in a shared point trades a distributed problem for an integration problem, which is far easier to test and to explain." },
            { label: "One catalog, brand-aware navigation:", text: "duplicating products per brand would have solved search in five minutes and created duplicate content, cannibalized SEO and two places to update a price. Each product has one owner; search crosses the boundary, the PDP canonicalizes on the right domain." },
            { label: "Campaign dates are config, not deploys:", text: "campaign dates change at the last minute — always. Every seasonal feature shipped with a window the client edits in Weaverse. That takes the agency off the operation's critical path and kills an entire class of night-before-the-holiday emergency." },
            { label: "Leading paid more than coding:", text: "being the first of its kind in-house, my highest-leverage work was investigating options, validating the architecture and guiding the team to it — not writing the lines. I spent more time unblocking decisions than typing, and the delivery was better for it." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "In production, ongoing. Performance figures and operational details are under NDA — what I can show here is the architecture and the reasoning behind it.",
        },
      ],
    },
    live: ["store.roland.com.br", "store.bossmusic.com.br"],
    caption: {
      pt: "Duas vitrines em dois domínios, um carrinho só.",
      en: "Two storefronts on two domains, one cart.",
    },
    cover: "/covers/roland.jpg",
    gallery: ["/covers/boss.jpg"],
    featured: true,
    published: true,
    order: 1,
  },
  {
    // Ângulo: profundidade de plataforma — o carrinho compartilhado é nota de rodapé
    // aqui, senão repete o case Roland/Boss.
    slug: "integral-medica-darkness",
    title: "Integralmédica / Darkness",
    client: { pt: "Integralmédica · Darkness", en: "Integralmédica · Darkness" },
    role: {
      pt: "Liderança técnica · Front-end · Apps Shopify",
      en: "Tech lead · Front-end · Shopify apps",
    },
    year: 2025,
    type: { pt: "Headless · Apps", en: "Headless · Apps" },
    stack: [
      "Shopify Hydrogen",
      "Remix",
      "Oxygen",
      "Shopify Functions",
      "Custom apps",
      "TypeScript",
    ],
    summary: {
      pt: "Duas marcas de suplementação num só admin — e um monte de regra de negócio que o Shopify não tem. Quando não tinha, eu construí o app.",
      en: "Two supplement brands under one admin — and a pile of business rules Shopify doesn't ship. When it didn't exist, I built the app.",
    },
    problem: { pt: "", en: "" },
    contribution: { pt: "", en: "" },
    results: [],
    body: {
      pt: [
        { kind: "heading", text: "Contexto" },
        {
          kind: "text",
          text: "Integralmédica e Darkness são marcas de suplementação que dividem o mesmo admin Shopify e o mesmo repositório: duas storefronts headless com carrinho compartilhado entre elas. Entrei na metade do desenvolvimento e assumi a liderança técnica — daí em diante, toda funcionalidade e toda decisão passaram por mim, e a maior parte foi construída por mim também.",
        },
        { kind: "heading", text: "O problema técnico central" },
        {
          kind: "text",
          text: "O carrinho compartilhado era a parte conhecida. O que fazia esse projeto ser difícil era outra coisa: o volume de regra de negócio que simplesmente não existe no Shopify de prateleira. Suplementação é uma categoria de mecânica promocional pesada, e as exigências do cliente batiam de frente com os limites do checkout e da área de conta nativos. A pergunta recorrente não era “como configuro isso”, era “isso não existe — construímos o quê?”.",
        },
        { kind: "heading", text: "O que eu construí" },
        {
          kind: "list",
          items: [
            { label: "Mecânicas promocionais em Shopify Functions:", text: "as regras de desconto e promoção que a plataforma não entrega nativamente foram implementadas como Functions, rodando no lado do Shopify em vez de virar gambiarra no front." },
            { label: "Custom apps sob medida:", text: "vários apps próprios, com interface, para cobrir o que nenhum app de marketplace resolvia." },
            { label: "Desconto de funcionário com cálculo invertido:", text: "um app com interface própria onde o desconto não sai do preço de venda: o cálculo parte do preço comparado e aplica 50% sobre ele. Uma regra pequena de enunciar e impossível de configurar num app pronto." },
            { label: "Área “Minha conta” do zero:", text: "a conta nativa do Shopify foi descartada e reconstruída inteira — identidade própria por marca, controle sobre como um pedido é exibido e filtrado, e abas que a nativa não comporta, como “Meus benefícios”, integrada ao programa de fidelidade." },
            { label: "Blocos de checkout:", text: "extensões no checkout para levar informação e função para a etapa mais sensível da compra." },
            { label: "Relatórios e integrações de dados:", text: "diversos relatórios, integrações com CRM e com scripts de terceiros — um volume relevante de dados saindo da loja para fora." },
            { label: "Seções institucionais e landing pages:", text: "construção de seções e páginas com customização profunda, para o time de conteúdo operar sem depender de deploy." },
          ],
        },
        { kind: "heading", text: "Por que foi feito assim" },
        {
          kind: "list",
          items: [
            { label: "A conta nativa não sobrevive a duas marcas:", text: "a account do Shopify é uma só por admin — e aqui um admin serve duas marcas. Na prática, isso é a mesma estilização para Integralmédica e Darkness, sem nem poder trocar o logo por marca: metade dos clientes entraria na conta e veria a identidade da outra. Junte a isso não controlar como um pedido é exibido ou filtrado, nem poder abrir uma aba nova — e a gente precisava de “Meus benefícios”, integrada ao programa de fidelidade. Reconstruir a conta inteira saiu mais barato que brigar com os três limites ao mesmo tempo." },
            { label: "Custom app em vez de assinatura de marketplace:", text: "a promoção que o cliente queria não existe nativamente. O caminho óbvio era assinar um app da App Store e seguir a vida — com uma mensalidade permanente no orçamento dele. Construí um custom app no lugar: instalado uma vez e com os produtos de brinde configurados, ele não pede manutenção recorrente nem cobra assinatura. Troquei um custo mensal perpétuo por um custo de construção único — e essa decisão só se defende porque a regra é estável. Se a mecânica mudasse a cada campanha, o app de prateleira ganharia." },
            { label: "Regra de promoção no Shopify, não no front:", text: "as mecânicas promocionais foram implementadas como Shopify Functions, do lado da plataforma. Desconto que só existe no front-end é desconto que some no checkout — e o checkout é onde o cliente decide se confia na loja." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "Integralmédica e Darkness em produção. Detalhes de operação e números sob acordo de confidencialidade.",
        },
      ],
      en: [
        { kind: "heading", text: "Context" },
        {
          kind: "text",
          text: "Integralmédica and Darkness are supplement brands sharing one Shopify admin and one repository: two headless storefronts with a cart shared between them. I joined halfway through development and took over as tech lead — from that point on, every feature and every decision went through me, and I built most of them myself.",
        },
        { kind: "heading", text: "The core technical problem" },
        {
          kind: "text",
          text: "The shared cart was the known part. What made this project hard was something else: the sheer volume of business rules that simply don't exist in off-the-shelf Shopify. Supplements are a category with heavy promotional mechanics, and the client's requirements ran straight into the limits of the native checkout and account area. The recurring question wasn't “how do I configure this”, it was “this doesn't exist — what do we build?”.",
        },
        { kind: "heading", text: "What I built" },
        {
          kind: "list",
          items: [
            { label: "Promotional mechanics as Shopify Functions:", text: "discount and promotion rules the platform doesn't ship natively, implemented as Functions running on Shopify's side instead of becoming a hack in the front-end." },
            { label: "Purpose-built custom apps:", text: "several in-house apps, with their own interfaces, covering what no marketplace app solved." },
            { label: "Employee discount with an inverted calculation:", text: "an app with its own interface where the discount doesn't come off the selling price: the math starts from the compare-at price and applies 50% on top of that. A rule that's small to state and impossible to configure in an off-the-shelf app." },
            { label: "Account area rebuilt from scratch:", text: "Shopify's native account was dropped and rebuilt end to end — per-brand identity, control over how an order is displayed and filtered, and tabs the native one can't hold, like “My benefits”, wired into the loyalty program." },
            { label: "Checkout blocks:", text: "checkout extensions bringing information and function into the most sensitive step of the purchase." },
            { label: "Reporting and data integrations:", text: "a range of reports, CRM integrations and third-party script integrations — a meaningful volume of data leaving the store." },
            { label: "Institutional sections and landing pages:", text: "deeply customizable sections and pages, so the content team can operate without waiting on a deploy." },
          ],
        },
        { kind: "heading", text: "Why it's built this way" },
        {
          kind: "list",
          items: [
            { label: "The native account doesn't survive two brands:", text: "Shopify gives you one account area per admin — and here one admin serves two brands. In practice that means identical styling for Integralmédica and Darkness, with no way to even swap the logo per brand: half the customers would log in and find the other brand's identity. Add to that no control over how an order is displayed or filtered, and no way to open a new tab — and we needed “My benefits”, wired into the loyalty program. Rebuilding the whole account came out cheaper than fighting all three limits at once." },
            { label: "A custom app instead of a marketplace subscription:", text: "the promotion the client wanted doesn't exist natively. The obvious path was subscribing to an App Store app and moving on — with a permanent monthly line in their budget. I built a custom app instead: installed once, with the gift products configured, it asks for no recurring maintenance and charges no subscription. I traded a perpetual monthly cost for a one-off build cost — and that decision only holds because the rule is stable. If the mechanic changed every campaign, the off-the-shelf app would win." },
            { label: "Promotion rules on Shopify, not in the front-end:", text: "the promotional mechanics were implemented as Shopify Functions, on the platform side. A discount that only exists in the front-end is a discount that vanishes at checkout — and checkout is where the customer decides whether they trust the store." },
          ],
        },
        { kind: "heading", text: "Status" },
        {
          kind: "text",
          text: "Integralmédica and Darkness in production. Operational details and figures under NDA.",
        },
      ],
    },
    live: ["integralmedica.com.br", "darkness.com.br"],
    caption: {
      pt: "Um admin, duas marcas — e as camadas que o Shopify não tinha.",
      en: "One admin, two brands — and the layers Shopify didn't ship.",
    },
    cover: "/covers/integralmedica.jpg",
    gallery: ["/covers/darkness.jpg"],
    featured: true,
    published: true,
    order: 2,
  },
  {
    slug: "dux",
    title: "DUX",
    client: { pt: "DUX", en: "DUX" },
    role: { pt: "Front-end · Motion", en: "Front-end · Motion" },
    year: 2024,
    type: { pt: "Branding · Homepage", en: "Branding · Homepage" },
    stack: ["Next.js", "GSAP", "Three.js"],
    summary: {
      pt: "Homepage de marca com identidade em movimento e hero 3D leve.",
      en: "Brand homepage with motion identity and a lightweight 3D hero.",
    },
    problem: { pt: "—", en: "—" },
    contribution: { pt: "—", en: "—" },
    results: [],
    cover: "",
    gallery: [],
    featured: false,
    published: false,
    order: 5,
  },
  {
    slug: "vivo-dashboard",
    title: "Vivo — Dashboard",
    client: { pt: "Vivo", en: "Vivo" },
    role: { pt: "Front-end", en: "Front-end" },
    year: 2023,
    type: { pt: "App · Dashboard", en: "App · Dashboard" },
    stack: ["React", "TypeScript", "Design System"],
    summary: {
      pt: "Painel de dados com componentes reutilizáveis e performance sob carga.",
      en: "Data dashboard with reusable components and performance under load.",
    },
    problem: { pt: "—", en: "—" },
    contribution: { pt: "—", en: "—" },
    results: [],
    cover: "",
    gallery: [],
    featured: false,
    published: false,
    order: 6,
  },

  // ── placeholders SÓ-DEV (densidade do índice). Nunca em produção. ──
  ...(["placeholder-1", "placeholder-2"].map((slug, i) => ({
    slug,
    title: "EM BREVE",
    client: { pt: "—", en: "—" },
    role: { pt: "—", en: "—" },
    year: 2025,
    type: { pt: "Em breve", en: "Soon" },
    stack: [],
    summary: { pt: "Em breve.", en: "Soon." },
    problem: { pt: "", en: "" },
    contribution: { pt: "", en: "" },
    results: [],
    cover: "",
    gallery: [],
    featured: false,
    published: false,
    order: 10 + i,
  })) satisfies Project[]),
];

const isProd = process.env.NODE_ENV === "production";

/**
 * Acesso síncrono (SSR/fallback).
 * Produção: só `published: true`. Dev: tudo — inclusive rascunhos e placeholders,
 * para dar pra revisar um case renderizado antes de publicar.
 */
export function getProjects(): Project[] {
  return projects
    .filter((p) => p.published || !isProd)
    .sort((a, b) => a.order - b.order);
}

export function getFeaturedProjects(): Project[] {
  return getProjects().filter((p) => p.featured);
}

/**
 * Fonte do seed do /admin: cases reais incluindo rascunhos (DUX, Vivo), sem os
 * placeholders "EM BREVE" — que existem só para testar densidade em dev e não
 * têm nada que valha a pena gravar no Firestore.
 */
export function getSeedProjects(): Project[] {
  return projects
    .filter((p) => !p.slug.startsWith("placeholder"))
    .sort((a, b) => a.order - b.order);
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

/**
 * Leitura real (Firestore). Lê `projects` (published:true) quando o Firebase está
 * configurado; senão (ou vazio/erro) cai nos mocks. Import dinâmico.
 */
export async function fetchPublishedProjects(): Promise<Project[]> {
  try {
    const { isFirebaseConfigured, getFirebaseApp } = await import("@/lib/firebase");
    const app = getFirebaseApp();
    if (!isFirebaseConfigured || !app) return getProjects();

    const { getFirestore, collection, getDocs, query, where } = await import(
      "firebase/firestore"
    );
    const db = getFirestore(app);
    const snap = await getDocs(
      query(collection(db, "projects"), where("published", "==", true)),
    );
    if (snap.empty) return getProjects();

    // Campos que nasceram depois do seed (`live`, `caption`) vêm do arquivo
    // local enquanto o documento não os tiver — o Firestore continua mandando
    // em tudo que ele já tem.
    const local = new Map(projects.map((p) => [p.slug, p]));
    return snap.docs
      .map((d) => {
        const doc = d.data() as Project;
        const base = local.get(doc.slug);
        return {
          ...doc,
          live: doc.live ?? base?.live,
          caption: doc.caption ?? base?.caption,
          stats: doc.stats ?? base?.stats,
        };
      })
      .sort((a, b) => a.order - b.order);
  } catch {
    return getProjects();
  }
}

export async function fetchProject(slug: string): Promise<Project | undefined> {
  const all = await fetchPublishedProjects();
  return all.find((p) => p.slug === slug);
}
