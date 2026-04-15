# NuuPlayer

Uma plataforma de jogos web que **aprende com o seu comportamento** e adapta a experiência automaticamente. Quanto mais você joga, mais o sistema entende o seu perfil e reorganiza os jogos, muda o banner e personaliza as sugestões.

---

## Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Perfis de Jogador](#perfis-de-jogador)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológica](#stack-tecnológica)
- [Como Rodar Localmente](#como-rodar-localmente)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)

---

## Sobre o Projeto

NuuPlayer monitora interações do usuário (cliques, tempo em cada jogo, saídas rápidas, jogos visitados) e classifica o jogador em um de cinco perfis comportamentais. Com base nesse perfil, a UI adapta:

- **Ordem dos jogos** — jogos mais relevantes aparecem primeiro
- **Banner da home** — mensagem e emoji personalizados
- **Sugestões** — ao terminar um jogo, mostra títulos similares ao perfil
- **Badge no header** — exibe o perfil detectado com nível de confiança em %

Nenhum dado é enviado a um servidor. Tudo vive no `localStorage` do browser.

---

## Perfis de Jogador

| Perfil | Gatilho | Descrição |
|--------|---------|-----------|
| ❓ **Novo Jogador** | Estado inicial | Ainda sem dados suficientes |
| ⚡ **Impaciente** | ≥ 3 saídas rápidas (< 15s) | Prefere jogos rápidos e reflexivos |
| 🔭 **Explorador** | ≥ 4 jogos diferentes visitados | Gosta de variedade e novidades |
| 🎯 **Focado** | > 90s num único jogo | Prefere jogos profundos e desafiadores |
| 😎 **Casual** | Várias sessões curtas e tranquilas | Prefere relaxar sem pressão |

---

## Funcionalidades

- **Detecção de perfil em tempo real** — store reativo derivado de métricas de sessão, sem polling
- **UI adaptativa** — banner, ordem de jogos e sugestões mudam automaticamente
- **Jogos internos em Svelte** — Snake, Memory Match e Campo Minado rodando puramente no browser
- **Jogos externos** — embutidos via `<iframe>` com fallback seguro
- **Navegação por teclado** — `←` `→` para navegar, `Space` para selecionar, `Backspace` para voltar
- **Dark mode** — alternância entre claro e escuro com persistência
- **Persistência** — sessão e perfil salvos no `localStorage` com validação de esquema
- **Painel de debug** — atalho `D` abre painel com todas as métricas ao vivo

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Framework | [SvelteKit 2](https://kit.svelte.dev) + Svelte 5 (runes) |
| Linguagem | TypeScript 6 (strict) |
| Estilo | [Tailwind CSS 4](https://tailwindcss.com) |
| Componentes UI | [shadcn-svelte](https://www.shadcn-svelte.com) + [bits-ui](https://bits-ui.com) |
| Ícones | [@lucide/svelte](https://lucide.dev) |
| Toasts | [svelte-sonner](https://svelte-sonner.vercel.app) |
| Testes | [Vitest 4](https://vitest.dev) + vitest-browser-svelte |
| Deploy | [Vercel](https://vercel.com) (adapter-vercel) |

---

## Como Rodar Localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior
- [npm](https://www.npmjs.com) 9 ou superior

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/nuuplayer.git
cd nuuplayer

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Abra [http://localhost:5173](http://localhost:5173) no browser.

### Outros comandos

```bash
# Compilar para produção
npm run build

# Visualizar o build de produção localmente
npm run preview

# Checar erros de TypeScript e Svelte
npm run check
```

---

## Testes

O projeto usa **Vitest** com dois ambientes:

| Ambiente | Arquivos | Descrição |
|----------|----------|-----------|
| `server` | `*.spec.ts` | Testes de lógica pura (sem DOM) |
| `client` | `*.svelte.spec.ts` | Testes de componentes no browser (requer Playwright) |

### Rodar os testes

```bash
# Rodar todos os testes uma vez (mostra pass/fail para cada um)
npm test

# Rodar em modo watch (re-executa ao salvar o arquivo)
npm run test:unit
```

### Instalar o browser para testes de componente

Na primeira vez, o Playwright precisa baixar o Chromium:

```bash
npx playwright install chromium
```

### Onde estão os testes

```
src/
└── lib/
    ├── services/
    │   └── gameScorer.spec.ts      # lógica de pontuação e reordenação de jogos
    ├── utils/
    │   ├── profileColors.spec.ts   # nomes, cores e ícones de perfil
    │   └── validation.spec.ts      # validação e sanitização de dados do localStorage
    └── vitest-examples/
        ├── greet.spec.ts           # exemplo de teste unitário simples
        └── Welcome.svelte.spec.ts  # exemplo de teste de componente Svelte
```

### Entendendo um teste (para iniciantes)

Cada teste segue sempre a mesma estrutura em três etapas:

```ts
import { describe, it, expect } from 'vitest';
import { getProfileDisplayName } from '$lib/utils/profileColors';

describe('getProfileDisplayName', () => {          // 1. Nome do grupo de testes
  it('retorna "Impaciente" para Impatient', () => { // 2. O que estou testando
    expect(                                        // 3. "espero que..."
      getProfileDisplayName('Impatient')           //    ...o resultado da função...
    ).toBe('Impaciente');                          //    ...seja igual a isso
  });
});
```

Matchers mais usados:

| Matcher | Significado |
|---------|-------------|
| `.toBe(valor)` | Igual exato (===) |
| `.toBeNull()` | É nulo |
| `.toContain(x)` | Array ou string contém `x` |
| `.toHaveLength(n)` | Tamanho do array é `n` |
| `.toBeGreaterThan(n)` | Número maior que `n` |
| `.not.toBeNull()` | Não é nulo |

---

## Estrutura do Projeto

```
src/
├── app.html              # template HTML base
├── app.css               # imports globais
├── routes/
│   ├── +layout.svelte    # layout global (header, footer, tracker)
│   ├── +page.svelte      # home — banner adaptativo + grid de jogos
│   ├── layout.css        # tokens do design system (CSS custom properties)
│   └── game/[id]/
│       └── +page.svelte  # página individual de cada jogo
└── lib/
    ├── components/
    │   ├── common/       # header, footer, game-card, profile-badge, etc.
    │   └── ui/           # componentes base: button, badge, sheet, sonner...
    ├── data/
    │   └── list-games.ts # catálogo completo de jogos
    ├── games/
    │   ├── snake.svelte        # jogo da cobrinha
    │   ├── memory-match.svelte # jogo da memória
    │   └── minesweeper.svelte  # campo minado
    ├── services/
    │   ├── gameScorer.ts       # pontuação e reordenação de jogos por perfil
    │   ├── storageService.ts   # leitura/escrita no localStorage com validação
    │   └── tracking/
    │       ├── eventTracker.ts    # interface e tracker composto
    │       ├── sessionTracker.ts  # repassa eventos para o store de sessão
    │       └── domTracker.ts      # captura cliques, teclado e scroll do DOM
    ├── stores/
    │   ├── profile.ts   # store derivado — detecta o perfil automaticamente
    │   ├── session.ts   # store de sessão com métricas acumuladas
    │   └── ui.ts        # store de adaptações da UI baseadas no perfil
    ├── tracking/
    │   └── tracker.ts   # instância global e funções auxiliares
    ├── types/
    │   └── index.ts     # tipos TypeScript globais do projeto
    └── utils/
        ├── profileColors.ts  # cores, ícones e nomes dos perfis
        └── validation.ts     # validação e sanitização de dados externos
```

---

## Deploy

O projeto usa o adapter oficial do Vercel. Para fazer deploy:

1. Faça um fork ou push do repositório para o GitHub
2. Acesse [vercel.com/new](https://vercel.com/new) e importe o repositório
3. O Vercel detecta o SvelteKit automaticamente — clique em **Deploy**

A partir daí, cada push na branch `main` dispara um deploy automático.

```bash
# Build local para verificar antes do deploy
npm run build
npm run preview
```

---

## Licença

Este projeto foi criado para fins de aprendizado e demonstração. Sinta-se livre para usar como referência.
