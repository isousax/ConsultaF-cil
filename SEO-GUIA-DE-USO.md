# 📖 Guia de Uso - Componente SEO

## 🎯 Como usar o componente SEO em novas páginas

### Importações necessárias
```tsx
import { SEO } from '../components/SEO';
import { SEO_CONFIG } from '../config/seo';
```

---

## 📝 Exemplos Práticos

### 1. Página Simples (usando config)
```tsx
import { SEO } from '../components/SEO';
import { SEO_CONFIG } from '../config/seo';

export const LoginPage = () => {
  return (
    <>
      <SEO
        title={SEO_CONFIG.login.title}
        description={SEO_CONFIG.login.description}
        keywords={SEO_CONFIG.login.keywords}
      />
      
      {/* Conteúdo da página */}
      <div>...</div>
    </>
  );
};
```

### 2. Página com SEO Customizado
```tsx
export const BlogPostPage = () => {
  const post = {
    title: "Como acompanhar suas consultas médicas",
    description: "Aprenda a usar o ConsultaFácil para gerenciar...",
    image: "/blog/post-1-cover.jpg"
  };

  return (
    <>
      <SEO
        title={post.title}
        description={post.description}
        keywords={["consultas", "tutorial", "guia médico"]}
        ogType="article"
        ogImage={post.image}
        author="Dr. João Silva"
      />
      
      <article>...</article>
    </>
  );
};
```

### 3. Página Dinâmica (com dados da API)
```tsx
export const CodeDetailsPage = () => {
  const { code } = useParams();
  const [codeData, setCodeData] = useState(null);

  useEffect(() => {
    // Buscar dados...
  }, [code]);

  if (!codeData) return <Loading />;

  return (
    <>
      <SEO
        title={`Código ${codeData.code}`}
        description={`Status: ${codeData.status}. Criado em ${codeData.created_at}`}
        keywords={["código", "autorização", codeData.status]}
        noindex={true} // Página privada, não indexar
      />
      
      <div>...</div>
    </>
  );
};
```

### 4. Página que NÃO deve ser indexada
```tsx
export const AdminPage = () => {
  return (
    <>
      <SEO
        title="Painel Admin"
        description="Área administrativa"
        keywords={[]}
        noindex={true}  // ← Importante!
      />
      
      <div>...</div>
    </>
  );
};
```

### 5. Página com Canonical URL customizada
```tsx
export const ProfilePage = () => {
  const { username } = useParams();

  return (
    <>
      <SEO
        title={`Perfil de ${username}`}
        description={`Veja o perfil público de ${username}`}
        keywords={["perfil", "usuário"]}
        canonical={`https://consultafacil.com/profile/${username}`}
      />
      
      <div>...</div>
    </>
  );
};
```

---

## 🆕 Adicionando nova página na config

### 1. Adicionar em `src/config/seo.ts`
```typescript
export const SEO_CONFIG: Record<string, PageSEO> = {
  // ... outras páginas
  
  faq: {
    title: 'Perguntas Frequentes',
    description: 'Encontre respostas para as dúvidas mais comuns sobre o ConsultaFácil',
    keywords: [
      'faq',
      'dúvidas',
      'perguntas frequentes',
      'ajuda',
      'suporte',
    ],
  },
};
```

### 2. Usar na página
```tsx
import { SEO } from '../components/SEO';
import { SEO_CONFIG } from '../config/seo';

export const FAQPage = () => {
  return (
    <>
      <SEO
        title={SEO_CONFIG.faq.title}
        description={SEO_CONFIG.faq.description}
        keywords={SEO_CONFIG.faq.keywords}
      />
      
      <div>
        <h1>Perguntas Frequentes</h1>
        {/* ... */}
      </div>
    </>
  );
};
```

### 3. Adicionar no sitemap.xml
```xml
<url>
  <loc>https://consultafacil.com/faq</loc>
  <lastmod>2025-01-28</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

---

## 🎨 Propriedades do Componente SEO

```typescript
interface SEOProps {
  title?: string;              // Título da página (será: "Title | ConsultaFácil")
  description?: string;        // Descrição (150-160 caracteres ideal)
  keywords?: string[];         // Array de palavras-chave
  ogImage?: string;           // Imagem para compartilhamento (1200x630)
  ogType?: 'website' | 'article'; // Tipo de conteúdo
  canonical?: string;         // URL canônica (auto-detect por padrão)
  noindex?: boolean;          // true = não indexar no Google
  author?: string;            // Autor do conteúdo
}
```

### Valores Padrão
```typescript
const DEFAULT_SEO = {
  title: 'ConsultaFácil - Acompanhe suas Consultas Médicas',
  description: 'Gerencie e acompanhe suas consultas médicas...',
  keywords: ['consultas médicas', 'autorização médica', ...],
  ogImage: '/og-image.png',
  siteUrl: 'https://consultafacil.com',
};
```

---

## 📊 Boas Práticas

### ✅ DO (Faça)
```tsx
// 1. Sempre adicione SEO no topo do JSX
<>
  <SEO title="..." />
  <div>Conteúdo</div>
</>

// 2. Use títulos descritivos (50-60 caracteres)
title: "Como Agendar Consulta - Guia Completo"

// 3. Descriptions entre 150-160 caracteres
description: "Aprenda passo a passo como agendar sua consulta médica no ConsultaFácil. Processo rápido, seguro e 100% online."

// 4. Keywords relevantes (5-10 termos)
keywords: ["agendar consulta", "consulta online", "médico"]

// 5. Noindex em páginas privadas
<SEO noindex={true} /> // dashboard, admin, perfil privado
```

### ❌ DON'T (Evite)
```tsx
// 1. Título muito longo
title: "Agende sua consulta médica com os melhores profissionais..."

// 2. Description muito curta
description: "Consultas online"

// 3. Keyword stuffing
keywords: ["consulta", "consulta médica", "consultar médico", "consultas"]

// 4. Esquecer de adicionar noindex em páginas privadas
// Dashboard sem noindex = Google pode indexar área privada!

// 5. Imagem OG muito pequena
ogImage: "/logo-50x50.png" // Mínimo 1200x630!
```

---

## 🔍 Checklist por Página

Ao criar nova página pública:
- [ ] Adicionar config em `seo.ts`
- [ ] Importar e usar componente `<SEO />`
- [ ] Adicionar no `sitemap.xml`
- [ ] Atualizar `robots.txt` se necessário
- [ ] Testar meta tags no DevTools
- [ ] Validar no Facebook Debugger
- [ ] Verificar Lighthouse SEO score

Ao criar nova página privada:
- [ ] Adicionar `<SEO noindex={true} />`
- [ ] NÃO adicionar no sitemap
- [ ] Adicionar Disallow no robots.txt

---

## 🎯 Tipos de Páginas

### Públicas (devem ser indexadas)
- Landing pages
- Blog posts
- FAQ
- Sobre
- Contato
- Termos/Privacidade

```tsx
<SEO
  title="..."
  description="..."
  keywords={[...]}
  // noindex NÃO especificado (padrão = false)
/>
```

### Privadas (NÃO indexar)
- Dashboard
- Perfil do usuário
- Configurações
- Admin
- Páginas pós-login

```tsx
<SEO
  title="..."
  description="..."
  noindex={true} // ← IMPORTANTE
/>
```

---

## 🚀 Performance

### Code Splitting
O componente SEO é leve, mas se houver muitas páginas:

```tsx
// Lazy load do config
const SEO_CONFIG = React.lazy(() => import('../config/seo'));

// Ou manter estático (recomendado)
import { SEO_CONFIG } from '../config/seo';
```

### Server-Side Rendering (futuro)
Se migrar para Next.js/Remix:
```tsx
// O react-helmet-async já está preparado para SSR
// Basta configurar o HelmetProvider no servidor
```

---

## 📚 Referências

- [React Helmet Async Docs](https://github.com/staylor/react-helmet-async)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Docs](https://developer.twitter.com/en/docs/twitter-for-websites/cards)
- [Schema.org](https://schema.org/)
- [Google SEO Guide](https://developers.google.com/search/docs)

---

## ❓ FAQ

### Como testar se o SEO está funcionando?
```javascript
// Console do navegador
document.title // Ver título
document.querySelector('meta[name="description"]').content
document.querySelector('meta[property="og:title"]').content
```

### Quando o Google vai indexar?
- Após deploy: 1-7 dias
- Acelerar: Enviar sitemap no Google Search Console

### Posso ter múltiplos componentes SEO na mesma página?
Não recomendado. Apenas um `<SEO />` por página, de preferência no topo.

### Como alterar a imagem OG?
```tsx
<SEO ogImage="/caminho/para/imagem.png" />
// Ou absoluto:
<SEO ogImage="https://cdn.com/imagem.png" />
```

### Preciso adicionar SEO em todos os componentes?
**Não**, apenas em **componentes de página** (rotas):
- ✅ `pages/LoginPage.tsx`
- ✅ `pages/BlogPostPage.tsx`
- ❌ `components/Button.tsx`
- ❌ `components/Card.tsx`

---

**Última atualização:** 28/01/2025  
**Versão:** 1.0.0
