import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

// ------------------------------------------------------------
// EspiralML + ConstellaCSS • Playground
// - Define grupos (reglas puras)
// - Define arquetipos (es/fn/fo) a partir de grupos
// - Elige un Nodo (es, fn, fo, contenido) y observa:
//   • className resuelta (es < fn < fo)
//   • tokens fusionados (theme < es < fn < fo < nodo)
//   • render previo básico (Button/Card/Hero/List)
// ------------------------------------------------------------

// ========= Tipos base
 type Dimension = "es" | "fn" | "fo";
 type Tokens = Record<string, string | number>;
 type ReglaID = string;
 type GrupoID = string;
 type ArquetipoID = string;

 type GrupoReglas = {
  id: GrupoID;
  clases: string[];
  tokens?: Tokens;
};

 type Arquetipo = {
  id: ArquetipoID;
  dimension: Dimension; // es | fn | fo
  grupos: GrupoID[];
  tokens?: Tokens;
  allowWith?: ArquetipoID[];
  denyWith?: ArquetipoID[];
};

 type SelectorContenido = {
  selector: string;
  map: (state: any) => any;
};

 type Nodo = {
  contenido?: SelectorContenido;
  es: ArquetipoID;
  fn: ArquetipoID;
  fo: ArquetipoID;
  tokens?: Tokens;
  classNameExtra?: string;
  hijos?: Nodo[];
};

 type Theme = { tokens: Tokens };

 type Registries = {
  grupos: Record<GrupoID, GrupoReglas>;
  arquetipos: Record<ArquetipoID, Arquetipo>;
};

 type ResolucionNodo = {
  className: string;
  tokens: Tokens;
  props: any;
  hijos: ResolucionNodo[];
};

// ========= Utils
 function mergeTokens(...lists: Array<Tokens | undefined>): Tokens {
  return lists.reduce<Tokens>((acc, t) => {
    if (!t) return acc;
    for (const k of Object.keys(t)) acc[k] = t[k]!;
    return acc;
  }, {});
}

 function classes(...chunks: Array<string | string[] | undefined>): string {
  const flat = chunks.flatMap((c) => (Array.isArray(c) ? c : c ? [c] : []));
  return Array.from(new Set(flat)).join(" ");
}

 function assertCompatibility(a: Arquetipo, b: Arquetipo) {
  if (a.denyWith?.includes(b.id)) throw new Error(`Combinación denegada: ${a.id} × ${b.id}`);
  if (b.denyWith?.includes(a.id)) throw new Error(`Combinación denegada: ${b.id} × ${a.id}`);
  if (a.allowWith && !a.allowWith.includes(b.id)) throw new Error(`No permitido por allowWith: ${a.id} ↔ ${b.id}`);
  if (b.allowWith && !b.allowWith.includes(a.id)) throw new Error(`No permitido por allowWith: ${b.id} ↔ ${a.id}`);
}

 function resolverNodo(node: Nodo, registries: Registries, theme: Theme, state?: any): ResolucionNodo {
  const es = registries.arquetipos[node.es];
  const fn = registries.arquetipos[node.fn];
  const fo = registries.arquetipos[node.fo];
  if (!es || !fn || !fo) throw new Error("Arquetipo no encontrado");
  if (es.dimension !== "es" || fn.dimension !== "fn" || fo.dimension !== "fo") throw new Error("Arquetipo en dimensión incorrecta");

  assertCompatibility(es, fn); assertCompatibility(es, fo); assertCompatibility(fn, fo);

  const resolveGrupos = (ids: GrupoID[]) => ids.map((gid) => {
    const g = registries.grupos[gid];
    if (!g) throw new Error(`Grupo no encontrado: ${gid}`);
    return g;
  });

  const gES = resolveGrupos(es.grupos);
  const gFN = resolveGrupos(fn.grupos);
  const gFO = resolveGrupos(fo.grupos);

  const className = classes(
    ...gES.map((g) => g.clases),
    ...gFN.map((g) => g.clases),
    ...gFO.map((g) => g.clases),
    node.classNameExtra
  );

  const tokens = mergeTokens(
    theme?.tokens,
    ...gES.map((g) => g.tokens), es.tokens,
    ...gFN.map((g) => g.tokens), fn.tokens,
    ...gFO.map((g) => g.tokens), fo.tokens,
    node.tokens
  );

  const props = node.contenido ? node.contenido.map(state) : {};
  const hijos = (node.hijos || []).map((child) => resolverNodo(child, registries, theme, state));
  return { className, tokens, props, hijos };
}

// ========= Catálogo base
 const gruposBase: Record<string, GrupoReglas> = {
  // ESTRUCTURA
  "layout/stack": { id: "layout/stack", clases: ["flex", "flex-col", "gap-[var(--gap-md)]"] },
  "layout/grid-2": { id: "layout/grid-2", clases: ["grid", "grid-cols-1", "md:grid-cols-2", "gap-[var(--gap-lg)]"] },
  "container/section": { id: "container/section", clases: ["max-w-screen-xl", "mx-auto", "px-[var(--px-md)]"] },
  "section/vspace": { id: "section/vspace", clases: ["py-[var(--py-section)]"] },
  "align/center": { id: "align/center", clases: ["items-center", "justify-center"] },

  // FUNCIÓN
  "interactive/clickable": { id: "interactive/clickable", clases: ["cursor-pointer", "transition", "duration-200", "select-none"] },
  "interactive/focus-ring": { id: "interactive/focus-ring", clases: ["focus:outline-none", "focus:ring", "focus:ring-[var(--ring-color)]"] },
  "interactive/hoverable": { id: "interactive/hoverable", clases: ["hover:brightness-105"] },
  "list/selectable": { id: "list/selectable", clases: ["[&>li]:cursor-pointer", "[&>li:hover]:bg-black/5", "[&>li:focus]:outline-none"] },
  "scroll/area": { id: "scroll/area", clases: ["overflow-auto"] },

  // FORMA
  "visual/filled-brand": { id: "visual/filled-brand", clases: ["bg-[var(--brand-600)]", "text-[var(--on-brand)]"], tokens: { "--ring-color": "var(--brand-300)" } },
  "visual/outlined": { id: "visual/outlined", clases: ["border", "border-[var(--border)]", "text-[var(--on-surface)]"] },
  "visual/card-surface": { id: "visual/card-surface", clases: ["bg-[var(--surface)]", "text-[var(--on-surface)]", "shadow", "shadow-black/10"] },
  "visual/hero": { id: "visual/hero", clases: ["bg-gradient-to-b", "from-[var(--hero-from)]", "to-[var(--hero-to)]", "text-[var(--on-hero)]"] },

  // TOKENS/UTILITY
  "typo/hero": { id: "typo/hero", clases: ["[&>h1]:text-4xl", "md:[&>h1]:text-6xl", "[&>p]:text-lg", "md:[&>p]:text-xl", "[&>h1]:font-semibold", "[&>*]:leading-snug"] },
  "typo/card": { id: "typo/card", clases: ["[&>h3]:text-xl", "[&>p]:text-sm", "[&>h3]:font-medium", "[&>*]:leading-relaxed"] },
  "padding/button-md": { id: "padding/button-md", clases: ["px-4", "py-2"] },
  "padding/card-md": { id: "padding/card-md", clases: ["p-4", "md:p-6"] },
  "padding/hero": { id: "padding/hero", clases: ["py-16", "md:py-24"] },
  "radius/xl": { id: "radius/xl", clases: ["rounded-2xl"] },
  "radius/lg": { id: "radius/lg", clases: ["rounded-xl"] },
};

 const arquetiposBase: Record<string, Arquetipo> = {
  // es
  "es:Section/Container": { id: "es:Section/Container", dimension: "es", grupos: ["container/section", "section/vspace"], tokens: { "--py-section": "4rem", "--px-md": "1rem" } },
  "es:Layout/Stacked": { id: "es:Layout/Stacked", dimension: "es", grupos: ["layout/stack"] },
  "es:Layout/Grid2": { id: "es:Layout/Grid2", dimension: "es", grupos: ["layout/grid-2"] },
  "es:Align/Center": { id: "es:Align/Center", dimension: "es", grupos: ["align/center"] },

  // fn
  "fn:Interactive/Clickable": { id: "fn:Interactive/Clickable", dimension: "fn", grupos: ["interactive/clickable", "interactive/focus-ring"] },
  "fn:Interactive/Hoverable": { id: "fn:Interactive/Hoverable", dimension: "fn", grupos: ["interactive/hoverable", "interactive/focus-ring"] },
  "fn:List/Selectable": { id: "fn:List/Selectable", dimension: "fn", grupos: ["list/selectable"] },
  "fn:Scroll/Area": { id: "fn:Scroll/Area", dimension: "fn", grupos: ["scroll/area"] },

  // fo
  "fo:Button/FilledBrand": { id: "fo:Button/FilledBrand", dimension: "fo", grupos: ["visual/filled-brand", "padding/button-md", "radius/xl"] },
  "fo:Button/Outlined": { id: "fo:Button/Outlined", dimension: "fo", grupos: ["visual/outlined", "padding/button-md", "radius/xl"] },
  "fo:Card/SurfaceSoft": { id: "fo:Card/SurfaceSoft", dimension: "fo", grupos: ["visual/card-surface", "padding/card-md", "radius/lg", "typo/card"] },
  "fo:List/Plain": { id: "fo:List/Plain", dimension: "fo", grupos: ["visual/outlined"] },
  "fo:Hero/Banner": { id: "fo:Hero/Banner", dimension: "fo", grupos: ["visual/hero", "padding/hero", "typo/hero"], tokens: { "--hero-from": "var(--brand-700)", "--hero-to": "var(--brand-600)", "--on-hero": "#ffffff" } },
};

 const registriesBase: Registries = { grupos: gruposBase, arquetipos: arquetiposBase };
 const themeBase: Theme = {
  tokens: {
    "--brand-700": "#1d4ed8",
    "--brand-600": "#2563eb",
    "--brand-300": "#93c5fd",
    "--surface": "#ffffff",
    "--on-surface": "#111827",
    "--on-brand": "#ffffff",
    "--border": "#e5e7eb",
    "--px-md": "1rem",
    "--gap-md": "0.75rem",
    "--gap-lg": "1.25rem",
  }
};

// ========= Estado simulado (Redux-like)
 const initialState = {
  ui: { cta: "Empezar" },
  card: { title: "Título de la tarjeta", body: "Descripción corta de la tarjeta." },
  list: { items: ["Uno", "Dos", "Tres"] },
  hero: { h1: "Construye con IA", p: "Interfaces coherentes, escalables y bellas." },
};

// ========= Componentes UI del playground
 function Pill({ children }: { children: React.ReactNode }) {
  return <span className="text-xs px-2 py-1 rounded-full bg-black/5">{children}</span>;
}

 function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow p-4 md:p-6 border border-black/5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

 function Select({ value, onChange, options }: { value: string; onChange: (v: string)=>void; options: string[] }) {
  return (
    <select className="w-full border rounded-lg px-3 py-2 bg-white" value={value} onChange={(e)=>onChange(e.target.value)}>
      {options.map(o=> <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

 function CodeBlock({ code }: { code: string }) {
  return <pre className="text-xs bg-black/90 text-white rounded-xl p-3 overflow-auto max-h-64 whitespace-pre-wrap">{code}</pre>;
}

// ========= Render básico por fo:*
 function RenderBasico({ node, state }: { node: Nodo; state: any }) {
  const r = useMemo(()=>resolverNodo(node, registriesBase, themeBase, state), [node, state]);
  const style = r.tokens as React.CSSProperties;

  const isButton = node.fo.startsWith("fo:Button/");
  const isCard   = node.fo.startsWith("fo:Card/");
  const isHero   = node.fo.startsWith("fo:Hero/");
  const isList   = node.fo.startsWith("fo:List/");

  if (isButton) {
    return <button className={r.className} style={style}>{r.props.label ?? "CTA"}</button>;
  }
  if (isCard) {
    return (
      <article className={r.className} style={style}>
        <h3>{r.props.title ?? "Título"}</h3>
        <p>{r.props.body ?? "Descripción."}</p>
      </article>
    );
  }
  if (isHero) {
    return (
      <section className={r.className} style={style}>
        <h1>{r.props.h1 ?? "Hero"}</h1>
        <p>{r.props.p ?? "Subtítulo"}</p>
      </section>
    );
  }
  if (isList) {
    const items: string[] = r.props.items ?? [];
    return (
      <ul className={r.className} style={style}>
        {items.map((it, i)=> <li key={i} className="px-3 py-2">{it}</li>)}
      </ul>
    );
  }
  return <div className={r.className} style={style}></div>;
}

// ========= Página principal
 export default function EspiralMLPlayground() {
  // Nodo configurable
  const [es, setES] = useState<ArquetipoID>("es:Layout/Stacked");
  const [fn, setFN] = useState<ArquetipoID>("fn:Interactive/Clickable");
  const [fo, setFO] = useState<ArquetipoID>("fo:Button/FilledBrand");
  const [state, setState] = useState<any>(initialState);

  const node: Nodo = useMemo(()=>({
    es, fn, fo,
    classNameExtra: fo.startsWith("fo:Button/") ? "inline-flex items-center justify-center min-w-40 text-center" : undefined,
    contenido: fo.startsWith("fo:Button/") ? { selector: "ui", map: (s:any) => ({ label: s?.ui?.cta }) }
            : fo.startsWith("fo:Card/")   ? { selector: "card", map: (s:any)=> ({ title: s?.card?.title, body: s?.card?.body }) }
            : fo.startsWith("fo:List/")   ? { selector: "list", map: (s:any)=> ({ items: s?.list?.items }) }
            : fo.startsWith("fo:Hero/")   ? { selector: "hero", map: (s:any)=> ({ h1: s?.hero?.h1, p: s?.hero?.p }) }
            : undefined,
  }), [es, fn, fo]);

  const r = useMemo(()=>resolverNodo(node, registriesBase, themeBase, state), [node, state]);

  const esOptions = Object.keys(arquetiposBase).filter(k=>k.startsWith("es:"));
  const fnOptions = Object.keys(arquetiposBase).filter(k=>k.startsWith("fn:"));
  const foOptions = Object.keys(arquetiposBase).filter(k=>k.startsWith("fo:"));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Panel de configuración */}
        <SectionCard title="Configurar Nodo (es / fn / fo)">
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="text-xs font-medium">Estructura (es)</label>
              <Select value={es} onChange={setES} options={esOptions} />
            </div>
            <div>
              <label className="text-xs font-medium">Función (fn)</label>
              <Select value={fn} onChange={setFN} options={fnOptions} />
            </div>
            <div>
              <label className="text-xs font-medium">Forma (fo)</label>
              <Select value={fo} onChange={setFO} options={foOptions} />
            </div>
          </div>
        </SectionCard>

        {/* Panel de preview */}
        <SectionCard title="Preview">
          <div className="min-h-[180px] grid place-items-center">
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 160, damping: 18 }}>
              <RenderBasico node={node} state={state} />
            </motion.div>
          </div>
        </SectionCard>

        {/* Panel de resolución */}
        <SectionCard title="Resolución (clases + tokens)">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Pill>{es}</Pill>
            <Pill>{fn}</Pill>
            <Pill>{fo}</Pill>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold mb-1">className</div>
              <CodeBlock code={r.className} />
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">tokens</div>
              <CodeBlock code={JSON.stringify(r.tokens, null, 2)} />
            </div>
          </div>
        </SectionCard>

        {/* Panel de datos (estado) */}
        <SectionCard title="Estado (simulado)">
          <div className="grid grid-cols-1 gap-2 text-sm">
            <label className="grid gap-1">
              <span className="text-xs">CTA</span>
              <input className="border rounded-lg px-3 py-2" value={state.ui.cta} onChange={(e)=>setState((s:any)=>({...s, ui: { ...s.ui, cta: e.target.value }}))} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs">Card title</span>
              <input className="border rounded-lg px-3 py-2" value={state.card.title} onChange={(e)=>setState((s:any)=>({...s, card: { ...s.card, title: e.target.value }}))} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs">Card body</span>
              <input className="border rounded-lg px-3 py-2" value={state.card.body} onChange={(e)=>setState((s:any)=>({...s, card: { ...s.card, body: e.target.value }}))} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs">Hero h1</span>
              <input className="border rounded-lg px-3 py-2" value={state.hero.h1} onChange={(e)=>setState((s:any)=>({...s, hero: { ...s.hero, h1: e.target.value }}))} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs">Hero p</span>
              <input className="border rounded-lg px-3 py-2" value={state.hero.p} onChange={(e)=>setState((s:any)=>({...s, hero: { ...s.hero, p: e.target.value }}))} />
            </label>
            <label className="grid gap-1">
              <span className="text-xs">List items (coma)</span>
              <input className="border rounded-lg px-3 py-2" value={state.list.items.join(", ")} onChange={(e)=>{
                const items = e.target.value.split(",").map(v=>v.trim()).filter(Boolean);
                setState((s:any)=>({...s, list: { ...s.list, items }}));
              }} />
            </label>
          </div>
        </SectionCard>

        {/* Panel catálogo (solo lectura) */}
        <SectionCard title="Catálogo (grupos / arquetipos)">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold mb-1">Grupos</div>
              <CodeBlock code={JSON.stringify(gruposBase, null, 2)} />
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">Arquetipos</div>
              <CodeBlock code={JSON.stringify(arquetiposBase, null, 2)} />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
 }
