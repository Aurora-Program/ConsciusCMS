import React from "react";

/**
 * ConstellaCSS – Núcleo mínimo + Página de ejemplo
 * - Catálogo cerrado (Tokens, Grupos, Arquetipos)
 * - Nodo con 1 arquetipo por dimensión (es, fn, fo)
 * - Precedencia: es → fn → fo
 * - Resolver determinista: className + style(tokens)
 */

// ===== Tipos =====
type Dim = 'es' | 'fn' | 'fo';

type Grupo = {
  id: string;            // p.ej. "es/layout/stack"
  dimension: Dim;        // a qué dimensión pertenece
  clases: string[];      // utilidades CSS (Tailwind)
  tokens?: Record<string, string | number>;
};

type Arquetipo = {
  id: string;            // p.ej. "fo:Button/Primary"
  dimension: Dim;
  grupos: string[];      // IDs de grupos
  tokens?: Record<string, string | number>;
  allowWith?: string[];
  denyWith?: string[];
};

type Registries = {
  grupos: Record<string, Grupo>;
  arquetipos: Record<string, Arquetipo>;
};

type Theme = { tokens: Record<string, string | number> };

type Nodo = {
  id: string;
  es: string; // arquetipo id (es:*)
  fn: string; // arquetipo id (fn:*)
  fo: string; // arquetipo id (fo:*)
  tokens?: Record<string, string | number>;
  classNameExtra?: string;
  kind?: 'section' | 'button' | 'card' | 'text' | 'custom'; // opcional (deducible por fo)
  children?: Nodo[];
  props?: { label?: string; desc?: string; href?: string; icon?: React.ReactNode };
};

// ===== Utils =====
const cx = (...xs: (string | string[] | undefined)[]) =>
  Array.from(new Set(xs.flatMap(x => Array.isArray(x) ? x : x ? [x] : []))).join(' ');

function assertArquetipo(arq: Arquetipo, registries: Registries) {
  const wrong = arq.grupos.filter(id => registries.grupos[id]?.dimension !== arq.dimension);
  if (wrong.length) throw new Error(`Arquetipo ${arq.id} mezcla dimensiones: ${wrong.join(', ')}`);
}

function assertCompatibility(a: Arquetipo, b: Arquetipo) {
  if (a.denyWith?.includes(b.id)) throw new Error(`Incompatible: ${a.id} × ${b.id}`);
  if (b.denyWith?.includes(a.id)) throw new Error(`Incompatible: ${b.id} × ${a.id}`);
  if (a.allowWith && !a.allowWith.includes(b.id)) throw new Error(`No permitido por allowWith: ${a.id} × ${b.id}`);
  if (b.allowWith && !b.allowWith.includes(a.id)) throw new Error(`No permitido por allowWith: ${b.id} × ${a.id}`);
}

function resolve(node: Nodo, registries: Registries, theme: Theme) {
  const es = registries.arquetipos[node.es], fn = registries.arquetipos[node.fn], fo = registries.arquetipos[node.fo];
  if (!es || !fn || !fo) throw new Error('Nodo inválido: faltan arquetipos es/fn/fo');
  [es, fn, fo].forEach(a => assertArquetipo(a, registries));
  assertCompatibility(es, fn); assertCompatibility(es, fo); assertCompatibility(fn, fo);

  const G = (ids: string[]) => ids.map(id => registries.grupos[id]).filter(Boolean);
  const gES = G(es.grupos), gFN = G(fn.grupos), gFO = G(fo.grupos);

  const className = cx(
    ...gES.map(g => g.clases),
    ...gFN.map(g => g.clases),
    ...gFO.map(g => g.clases),
    node.classNameExtra
  );

  const style = Object.assign(
    {},
    theme.tokens,
    ...gES.map(g => g.tokens), es.tokens,
    ...gFN.map(g => g.tokens), fn.tokens,
    ...gFO.map(g => g.tokens), fo.tokens,
    node.tokens
  ) as React.CSSProperties;

  return { className, style };
}

// ===== Catálogo base =====
const createTheme = (): Theme => ({
  tokens: {
    '--brand-600': '#2563eb',
    '--brand-300': '#93c5fd',
    '--on-brand': '#ffffff',
    '--surface': '#ffffff',
    '--on-surface': '#111827',
    '--muted': '#6b7280',
    '--gap-md': '1rem',
    '--px-md': '1rem',
    '--radius-md': '0.75rem',
  }
});

const createRegistries = (): Registries => ({
  grupos: {
    // ES (estructura)
    'es/layout/stack': { id:'es/layout/stack', dimension:'es', clases:['flex','flex-col','gap-[var(--gap-md)]'] },
    'es/container/section': { id:'es/container/section', dimension:'es', clases:['max-w-screen-xl','mx-auto','px-[var(--px-md)]'] },
    'es/grid/responsive': { id:'es/grid/responsive', dimension:'es', clases:['grid','gap-[var(--gap-md)]','md:grid-cols-2','lg:grid-cols-3'] },

    // FN (función)
    'fn/interactive/cta': { id:'fn/interactive/cta', dimension:'fn', clases:['cursor-pointer','transition','duration-200','hover:brightness-105','focus:outline-none','focus:ring','focus:ring-[var(--brand-300)]','active:translate-y-[1px]'] },
    'fn/interactive/card': { id:'fn/interactive/card', dimension:'fn', clases:['transition','duration-200','hover:shadow-lg'] },

    // FO (forma)
    'fo/button/primary': { id:'fo/button/primary', dimension:'fo', clases:['bg-[var(--brand-600)]','text-[var(--on-brand)]','rounded-[var(--radius-md)]','px-4','py-2','font-medium','shadow','shadow-black/10'] },
    'fo/button/secondary': { id:'fo/button/secondary', dimension:'fo', clases:['border','border-gray-300','bg-white','text-gray-900','rounded-[var(--radius-md)]','px-4','py-2','font-medium'] },
    'fo/card/surface': { id:'fo/card/surface', dimension:'fo', clases:['bg-[var(--surface)]','text-[var(--on-surface)]','rounded-[var(--radius-md)]','shadow','shadow-black/10','border','border-gray-200','p-5'] },
    'fo/text/title': { id:'fo/text/title', dimension:'fo', clases:['text-3xl','md:text-4xl','font-bold','text-[var(--on-surface)]'] },
    'fo/text/subtle': { id:'fo/text/subtle', dimension:'fo', clases:['text-sm','text-[var(--muted)]'] },
  },
  arquetipos: {
    // ES
    'es:Section/Container': { id:'es:Section/Container', dimension:'es', grupos:['es/container/section'] },
    'es:Layout/Stacked': { id:'es:Layout/Stacked', dimension:'es', grupos:['es/layout/stack'] },
    'es:Layout/Grid': { id:'es:Layout/Grid', dimension:'es', grupos:['es/grid/responsive'] },

    // FN
    'fn:Interactive/CTA': { id:'fn:Interactive/CTA', dimension:'fn', grupos:['fn/interactive/cta'] },
    'fn:Interactive/Card': { id:'fn:Interactive/Card', dimension:'fn', grupos:['fn/interactive/card'] },

    // FO
    'fo:Button/Primary': { id:'fo:Button/Primary', dimension:'fo', grupos:['fo/button/primary'] },
    'fo:Button/Secondary': { id:'fo:Button/Secondary', dimension:'fo', grupos:['fo/button/secondary'] },
    'fo:Card/Surface': { id:'fo:Card/Surface', dimension:'fo', grupos:['fo/card/surface'] },
    'fo:Text/Title': { id:'fo:Text/Title', dimension:'fo', grupos:['fo/text/title'] },
    'fo:Text/Subtle': { id:'fo:Text/Subtle', dimension:'fo', grupos:['fo/text/subtle'] },
  }
});

// ===== Render por tipo =====
function RenderNodo({ nodo, registries, theme }: { nodo: Nodo; registries: Registries; theme: Theme }) {
  const { className, style } = resolve(nodo, registries, theme);
  const kind = nodo.kind ?? (
    nodo.fo.startsWith('fo:Button/') ? 'button' :
    nodo.fo.startsWith('fo:Card/')   ? 'card'   :
    nodo.fo.startsWith('fo:Text/')   ? 'text'   : 'custom'
  );

  const content = (
    <>
      {nodo.props?.icon && <span className="inline-flex items-center mr-2">{nodo.props.icon}</span>}
      <span>{nodo.props?.label ?? 'Elemento'}</span>
      {nodo.props?.desc && kind !== 'button' && (
        <span className="block mt-1 text-sm opacity-80">{nodo.props.desc}</span>
      )}
    </>
  );

  if (kind === 'button') return <button className={className} style={style}>{content}</button>;
  if (kind === 'card')   return <div className={className} style={style}>{content}{nodo.children?.map(c => (
    <div key={c.id} className="mt-4"><RenderNodo nodo={c} registries={registries} theme={theme} /></div>
  ))}</div>;
  if (kind === 'text')   return <span className={className} style={style}>{content}</span>;
  return <div className={className} style={style}>{content}{nodo.children?.map(c => (
    <div key={c.id} className="mt-4"><RenderNodo nodo={c} registries={registries} theme={theme} /></div>
  ))}</div>;
}

// ===== Página de ejemplo =====
export default function ConstellaDemoPage() {
  const theme = React.useMemo(createTheme, []);
  const registries = React.useMemo(createRegistries, []);

  // --- Sección (container) ---
  const section: Nodo = {
    id: 'home_section',
    es: 'es:Section/Container',
    fn: 'fn:Interactive/Card', // neutro para sección
    fo: 'fo:Card/Surface',
    kind: 'section',
    tokens: { '--gap-md': '1.25rem' },
  };

  // --- Hero ---
  const heroTitle: Nodo = {
    id: 'hero_title', es:'es:Layout/Stacked', fn:'fn:Interactive/Card', fo:'fo:Text/Title', kind:'text',
    props: { label: 'EspiralML × ConstellaCSS', desc: 'UIs fractales y consistentes para agentes de IA' }
  };

  const heroActions: Nodo = {
    id: 'hero_actions', es:'es:Layout/Stacked', fn:'fn:Interactive/Card', fo:'fo:Card/Surface', kind:'card',
    classNameExtra: 'bg-transparent border-0 shadow-none p-0',
    children: [
      { id:'cta_primary', es:'es:Layout/Stacked', fn:'fn:Interactive/CTA', fo:'fo:Button/Primary', kind:'button', props:{ label:'Empezar ahora' } },
      { id:'cta_secondary', es:'es:Layout/Stacked', fn:'fn:Interactive/CTA', fo:'fo:Button/Secondary', kind:'button', props:{ label:'Ver documentación' } },
    ]
  };

  // --- Grid de Cards (features) ---
  const featuresSection: Nodo = {
    id: 'features', es:'es:Layout/Grid', fn:'fn:Interactive/Card', fo:'fo:Card/Surface', kind:'card',
    children: [
      { id:'f1', es:'es:Layout/Stacked', fn:'fn:Interactive/Card', fo:'fo:Card/Surface', kind:'card', props:{ label:'Fractalidad', desc:'Contenido → Sección → Componente, repetible y anidable.' } },
      { id:'f2', es:'es:Layout/Stacked', fn:'fn:Interactive/Card', fo:'fo:Card/Surface', kind:'card', props:{ label:'Consistencia', desc:'Catálogo cerrado de estilos y precedencia determinista.' } },
      { id:'f3', es:'es:Layout/Stacked', fn:'fn:Interactive/Card', fo:'fo:Card/Surface', kind:'card', props:{ label:'Velocidad', desc:'IA compone sin inventar CSS, solo elige arquetipos.' } },
    ]
  };

  // --- Página (árbol) ---
  const pageTree: Nodo = {
    ...section,
    children: [
      { ...heroTitle },
      { ...heroActions },
      { ...featuresSection },
    ]
  };

  // Helper para envolver árbol respetando layout/espaciado
  function RenderTree({ nodo }: { nodo: Nodo }) {
    const { className, style } = resolve(nodo, registries, theme);
    return (
      <section className={cx(className, 'py-10 md:py-16') as string} style={style}>
        <div className="flex flex-col gap-[var(--gap-md)]">
          {/* HERO */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-[var(--gap-md)]">
            <RenderNodo nodo={heroTitle} registries={registries} theme={theme} />
            <div className="flex gap-3">
              {heroActions.children?.map(btn => (
                <RenderNodo key={btn.id} nodo={btn} registries={registries} theme={theme} />
              ))}
            </div>
          </div>

          {/* FEATURES */}
          <div>
            <div className={resolve(featuresSection, registries, theme).className}>
              {featuresSection.children?.map(card => (
                <RenderNodo key={card.id} nodo={card} registries={registries} theme={theme} />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <RenderTree nodo={pageTree} />

      {/* Inspector rápido */}
      <div className="max-w-screen-xl mx-auto px-4 pb-16">
        <details className="mt-8 bg-gray-900 text-gray-100 rounded-lg p-4">
          <summary className="cursor-pointer text-sm">🔍 Ver configuración de arquetipos y tokens</summary>
          <pre className="mt-3 text-xs overflow-x-auto">{JSON.stringify({ theme, registries }, null, 2)}</pre>
        </details>
      </div>
    </main>
  );
}
