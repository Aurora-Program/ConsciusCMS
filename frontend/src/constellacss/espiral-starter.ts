// EspiralML + ConstellaCSS • Starter Kit
// ------------------------------------------------------------
// Objetivo: contrato mínimo, registries y un resolver determinista
// para componer UI fractal (Contenido → Sección → Componente)
// con tres dimensiones: es (estructura), fn (función), fo (forma).

// ============ Tipos base
export type Dimension = "es" | "fn" | "fo"; // Estructura, Función, Forma

export type Tokens = Record<string, string | number>;

export type ReglaID = string;      // p.ej. "spacing/md", "radius/2xl"
export type GrupoID = string;      // p.ej. "card/soft"
export type ArquetipoID = string;  // p.ej. "es:Stack/Centered", "fn:CTA/Primary", "fo:Button/Soft"

export type GrupoReglas = {
  id: GrupoID;
  clases: string[];        // clases utilitarias (Tailwind u otras)
  tokens?: Tokens;         // tokens por defecto del grupo
};

export type Arquetipo = {
  id: ArquetipoID;
  dimension: Dimension;     // es | fn | fo
  grupos: GrupoID[];        // composición de grupos (funciones puras)
  tokens?: Tokens;          // tokens por defecto del arquetipo
  allowWith?: ArquetipoID[]; // combinaciones explícitamente válidas
  denyWith?: ArquetipoID[];  // combinaciones prohibidas
};

export type SelectorContenido = {
  selector: string; // nombre simbólico del slice de estado
  map: (state: any) => any; // mapeo de estado a props puros
};

export type Nodo = {
  // EtiquetaContenido (opcional)
  contenido?: SelectorContenido;
  // Asignación de arquetipos por dimensión (obligatorio: uno por dimensión)
  es: ArquetipoID;
  fn: ArquetipoID;
  fo: ArquetipoID;
  // Overrides locales (más prioridad)
  tokens?: Tokens;
  classNameExtra?: string; // clases adicionales permitidas explícitamente
  hijos?: Nodo[]; // fractal
};

export type Theme = {
  tokens: Tokens; // tokens del tema por defecto (menor prioridad)
};

export type ResolucionNodo = {
  className: string; // clases resueltas (orden es→fn→fo)
  tokens: Tokens;    // tokens fusionados (theme < es < fn < fo < nodo)
  props: any;        // props puros del contenido
  hijos: ResolucionNodo[]; // hijos resueltos
};

// ============ Registries (inyectables)
export type Registries = {
  grupos: Record<GrupoID, GrupoReglas>;
  arquetipos: Record<ArquetipoID, Arquetipo>;
};

// ============ Utilidades de fusión
function mergeTokens(...lists: Array<Tokens | undefined>): Tokens {
  return lists.reduce<Tokens>((acc, t) => {
    if (!t) return acc;
    for (const k of Object.keys(t)) acc[k] = t[k]!;
    return acc;
  }, {});
}

function classes(...chunks: Array<string | string[] | undefined>): string {
  const flat = chunks
    .flatMap((c) => (Array.isArray(c) ? c : c ? [c] : []))
    .filter(Boolean);
  return Array.from(new Set(flat)).join(" "); // dedupe conservando orden
}

// ============ Validación de combinaciones
function assertCompatibility(a: Arquetipo, b: Arquetipo) {
  if (a.denyWith?.includes(b.id)) {
    throw new Error(`Combinación denegada: ${a.id} × ${b.id}`);
  }
  if (b.denyWith?.includes(a.id)) {
    throw new Error(`Combinación denegada: ${b.id} × ${a.id}`);
  }
  // Nota: allowWith es opcional. Si se usa, ambas direcciones deben permitir o ser undefined.
  if (a.allowWith && !a.allowWith.includes(b.id)) {
    // si el arquetipo define allowWith, todo lo no listado se considera no permitido
    throw new Error(`No permitido por allowWith: ${a.id} ↔ ${b.id}`);
  }
  if (b.allowWith && !b.allowWith.includes(a.id)) {
    throw new Error(`No permitido por allowWith: ${b.id} ↔ ${a.id}`);
  }
}

// ============ Resolver determinista con precedencia
export function resolverNodo(
  nodo: Nodo,
  registries: Registries,
  theme: Theme,
  state?: any
): ResolucionNodo {
  // 1. Obtener arquetipos del registry
  const esArq = registries.arquetipos[nodo.es];
  const fnArq = registries.arquetipos[nodo.fn];
  const foArq = registries.arquetipos[nodo.fo];

  if (!esArq) throw new Error(`Arquetipo es no encontrado: ${nodo.es}`);
  if (!fnArq) throw new Error(`Arquetipo fn no encontrado: ${nodo.fn}`);
  if (!foArq) throw new Error(`Arquetipo fo no encontrado: ${nodo.fo}`);

  // 2. Validar compatibilidad entre arquetipos
  assertCompatibility(esArq, fnArq);
  assertCompatibility(fnArq, foArq);
  assertCompatibility(esArq, foArq);

  // 3. Resolver clases con precedencia es → fn → fo
  const clasesEs = esArq.grupos.flatMap(g => registries.grupos[g]?.clases || []);
  const clasesFn = fnArq.grupos.flatMap(g => registries.grupos[g]?.clases || []);
  const clasesFo = foArq.grupos.flatMap(g => registries.grupos[g]?.clases || []);
  
  const className = classes(
    clasesEs,
    clasesFn, 
    clasesFo,
    nodo.classNameExtra
  );

  // 4. Fusionar tokens con precedencia theme < es < fn < fo < nodo
  const tokensGruposEs = mergeTokens(...esArq.grupos.map(g => registries.grupos[g]?.tokens));
  const tokensGruposFn = mergeTokens(...fnArq.grupos.map(g => registries.grupos[g]?.tokens));
  const tokensGruposFo = mergeTokens(...foArq.grupos.map(g => registries.grupos[g]?.tokens));

  const tokens = mergeTokens(
    theme.tokens,        // Prioridad 1: Theme base
    tokensGruposEs,      // Prioridad 2: Grupos de estructura
    esArq.tokens,        // Prioridad 3: Arquetipo estructura
    tokensGruposFn,      // Prioridad 4: Grupos de función
    fnArq.tokens,        // Prioridad 5: Arquetipo función
    tokensGruposFo,      // Prioridad 6: Grupos de forma
    foArq.tokens,        // Prioridad 7: Arquetipo forma
    nodo.tokens          // Prioridad 8: Override local (máxima)
  );

  // 5. Resolver props del contenido
  const props = nodo.contenido && state 
    ? nodo.contenido.map(state)
    : {};

  // 6. Resolver hijos recursivamente (fractal)
  const hijos = nodo.hijos?.map(hijo => 
    resolverNodo(hijo, registries, theme, state)
  ) || [];

  return {
    className,
    tokens,
    props,
    hijos
  };
}

// ============ PACK DE ARQUETIPOS BASE
// Convención de naming: dimensión:categoria/variant

// GRUPOS DE REGLAS REUTILIZABLES
export const GRUPOS_BASE: Record<GrupoID, GrupoReglas> = {
  // ========== GRUPOS DE ESTRUCTURA (es) ==========
  "layout/stack": {
    id: "layout/stack",
    clases: ["flex", "flex-col"],
    tokens: { 
      "--layout-type": "stack",
      "--flex-direction": "column" 
    }
  },
  
  "layout/centered": {
    id: "layout/centered", 
    clases: ["items-center", "justify-center"],
    tokens: {
      "--alignment": "center",
      "--justify": "center"
    }
  },

  "layout/container": {
    id: "layout/container",
    clases: ["max-w-7xl", "mx-auto", "px-4"],
    tokens: {
      "--max-width": "80rem",
      "--margin": "0 auto",
      "--padding-x": "1rem"
    }
  },

  "layout/grid": {
    id: "layout/grid",
    clases: ["grid", "gap-4"],
    tokens: {
      "--display": "grid",
      "--gap": "1rem"
    }
  },

  "spacing/comfortable": {
    id: "spacing/comfortable",
    clases: ["p-6", "gap-4"],
    tokens: {
      "--padding": "1.5rem",
      "--gap": "1rem"
    }
  },

  "spacing/compact": {
    id: "spacing/compact", 
    clases: ["p-3", "gap-2"],
    tokens: {
      "--padding": "0.75rem",
      "--gap": "0.5rem"
    }
  },

  // ========== GRUPOS DE FUNCIÓN (fn) ==========
  "interactive/clickable": {
    id: "interactive/clickable",
    clases: ["cursor-pointer", "transition-all", "duration-200"],
    tokens: {
      "--cursor": "pointer",
      "--transition": "all 0.2s ease"
    }
  },

  "interactive/hoverable": {
    id: "interactive/hoverable", 
    clases: ["hover:scale-105", "hover:shadow-lg"],
    tokens: {
      "--hover-scale": "1.05",
      "--hover-shadow": "0 10px 15px rgba(0,0,0,0.1)"
    }
  },

  "semantic/landmark": {
    id: "semantic/landmark",
    clases: [],
    tokens: {
      "--role": "landmark",
      "--aria-level": "1"
    }
  },

  "semantic/navigation": {
    id: "semantic/navigation",
    clases: [],
    tokens: {
      "--role": "navigation",
      "--aria-label": "main"
    }
  },

  // ========== GRUPOS DE FORMA (fo) ==========
  "surface/card": {
    id: "surface/card",
    clases: ["bg-white", "rounded-lg", "shadow-md"],
    tokens: {
      "--background": "white",
      "--border-radius": "0.5rem", 
      "--shadow": "0 4px 6px rgba(0,0,0,0.1)"
    }
  },

  "surface/elevated": {
    id: "surface/elevated",
    clases: ["shadow-xl", "border", "border-gray-100"],
    tokens: {
      "--shadow": "0 20px 25px rgba(0,0,0,0.1)",
      "--border": "1px solid rgb(243 244 246)"
    }
  },

  "color/primary": {
    id: "color/primary",
    clases: ["bg-blue-600", "text-white"],
    tokens: {
      "--bg-color": "rgb(37 99 235)",
      "--text-color": "white"
    }
  },

  "color/secondary": {
    id: "color/secondary",
    clases: ["bg-gray-100", "text-gray-900"],
    tokens: {
      "--bg-color": "rgb(243 244 246)",
      "--text-color": "rgb(17 24 39)"
    }
  },

  "typography/heading": {
    id: "typography/heading",
    clases: ["font-bold", "text-2xl", "leading-tight"],
    tokens: {
      "--font-weight": "700",
      "--font-size": "1.5rem",
      "--line-height": "1.25"
    }
  },

  "typography/body": {
    id: "typography/body",
    clases: ["text-base", "leading-relaxed"],
    tokens: {
      "--font-size": "1rem",
      "--line-height": "1.625"
    }
  }
};

// ARQUETIPOS BASE CON NAMING SISTEMÁTICO
export const ARQUETIPOS_BASE: Record<ArquetipoID, Arquetipo> = {
  // ========== ARQUETIPOS DE ESTRUCTURA (es:) ==========
  "es:Stack/Centered": {
    id: "es:Stack/Centered",
    dimension: "es",
    grupos: ["layout/stack", "layout/centered", "spacing/comfortable"],
    tokens: { "--layout-variant": "stack-centered" }
  },

  "es:Container/Wide": {
    id: "es:Container/Wide", 
    dimension: "es",
    grupos: ["layout/container", "spacing/comfortable"],
    tokens: { "--container-variant": "wide" }
  },

  "es:Grid/Responsive": {
    id: "es:Grid/Responsive",
    dimension: "es", 
    grupos: ["layout/grid", "spacing/comfortable"],
    tokens: { 
      "--grid-variant": "responsive",
      "--grid-cols": "repeat(auto-fit, minmax(300px, 1fr))"
    }
  },

  "es:Inline/Flow": {
    id: "es:Inline/Flow",
    dimension: "es",
    grupos: ["spacing/compact"],
    tokens: { "--display": "inline-block" }
  },

  // ========== ARQUETIPOS DE FUNCIÓN (fn:) ==========
  "fn:CTA/Primary": {
    id: "fn:CTA/Primary",
    dimension: "fn",
    grupos: ["interactive/clickable", "interactive/hoverable", "semantic/navigation"],
    tokens: { 
      "--interaction-priority": "high",
      "--semantic-role": "primary-action"
    }
  },

  "fn:CTA/Secondary": {
    id: "fn:CTA/Secondary", 
    dimension: "fn",
    grupos: ["interactive/clickable"],
    tokens: {
      "--interaction-priority": "medium", 
      "--semantic-role": "secondary-action"
    }
  },

  "fn:Hero/Presentation": {
    id: "fn:Hero/Presentation",
    dimension: "fn",
    grupos: ["semantic/landmark"],
    tokens: {
      "--semantic-role": "hero-banner",
      "--content-priority": "highest"
    }
  },

  "fn:Content/Section": {
    id: "fn:Content/Section",
    dimension: "fn", 
    grupos: [],
    tokens: {
      "--semantic-role": "content-section",
      "--content-type": "informational"
    }
  },

  "fn:Navigation/Menu": {
    id: "fn:Navigation/Menu",
    dimension: "fn",
    grupos: ["interactive/clickable", "semantic/navigation"],
    tokens: {
      "--semantic-role": "navigation",
      "--interaction-type": "menu"
    }
  },

  // ========== ARQUETIPOS DE FORMA (fo:) ==========
  "fo:Button/Primary": {
    id: "fo:Button/Primary",
    dimension: "fo",
    grupos: ["surface/card", "color/primary", "spacing/compact"],
    tokens: { 
      "--visual-weight": "heavy",
      "--button-variant": "primary"
    }
  },

  "fo:Button/Secondary": {
    id: "fo:Button/Secondary",
    dimension: "fo", 
    grupos: ["surface/card", "color/secondary", "spacing/compact"],
    tokens: {
      "--visual-weight": "medium",
      "--button-variant": "secondary"
    }
  },

  "fo:Card/Elevated": {
    id: "fo:Card/Elevated",
    dimension: "fo",
    grupos: ["surface/card", "surface/elevated", "spacing/comfortable"],
    tokens: {
      "--visual-depth": "high",
      "--card-variant": "elevated"
    }
  },

  "fo:Card/Flat": {
    id: "fo:Card/Flat",
    dimension: "fo",
    grupos: ["surface/card", "spacing/comfortable"],
    tokens: {
      "--visual-depth": "low", 
      "--card-variant": "flat"
    }
  },

  "fo:Hero/Brand": {
    id: "fo:Hero/Brand",
    dimension: "fo",
    grupos: ["color/primary", "typography/heading", "spacing/comfortable"],
    tokens: {
      "--hero-style": "brand",
      "--visual-impact": "maximum"
    }
  },

  "fo:Text/Heading": {
    id: "fo:Text/Heading",
    dimension: "fo",
    grupos: ["typography/heading"],
    tokens: {
      "--text-variant": "heading",
      "--visual-hierarchy": "high"
    }
  },

  "fo:Text/Body": {
    id: "fo:Text/Body", 
    dimension: "fo",
    grupos: ["typography/body"],
    tokens: {
      "--text-variant": "body",
      "--visual-hierarchy": "normal"
    }
  }
};

// REGISTRIES COMPLETOS
export const REGISTRIES_BASE: Registries = {
  grupos: GRUPOS_BASE,
  arquetipos: ARQUETIPOS_BASE
};

// TEMA BASE
export const TEMA_BASE: Theme = {
  tokens: {
    "--color-primary": "rgb(37 99 235)",
    "--color-secondary": "rgb(243 244 246)",
    "--color-text": "rgb(17 24 39)",
    "--space-xs": "0.25rem",
    "--space-sm": "0.5rem", 
    "--space-md": "1rem",
    "--space-lg": "1.5rem",
    "--space-xl": "2rem",
    "--radius-sm": "0.25rem",
    "--radius-md": "0.5rem",
    "--radius-lg": "0.75rem",
    "--font-sans": "system-ui, sans-serif",
    "--font-mono": "Monaco, monospace"
  }
};

// ============ EJEMPLOS DE USO

// Nodo Hero con CTA
export const EJEMPLO_HERO: Nodo = {
  es: "es:Stack/Centered",
  fn: "fn:Hero/Presentation", 
  fo: "fo:Hero/Brand",
  tokens: {
    "--min-height": "60vh",
    "--text-align": "center"
  },
  hijos: [
    {
      es: "es:Inline/Flow",
      fn: "fn:Content/Section",
      fo: "fo:Text/Heading",
      contenido: {
        selector: "hero.title",
        map: (state) => ({ children: state.hero?.title || "Hero Title" })
      }
    },
    {
      es: "es:Inline/Flow", 
      fn: "fn:CTA/Primary",
      fo: "fo:Button/Primary",
      contenido: {
        selector: "hero.cta",
        map: (state) => ({ 
          children: state.hero?.ctaText || "Get Started",
          onClick: () => console.log("CTA clicked")
        })
      }
    }
  ]
};

// Resolver ejemplo
export function ejemploResolver() {
  const state = {
    hero: {
      title: "Bienvenido a EspiralML",
      ctaText: "Comenzar Ahora"
    }
  };

  const resolucion = resolverNodo(EJEMPLO_HERO, REGISTRIES_BASE, TEMA_BASE, state);
  console.log("Resolución Hero:", resolucion);
  return resolucion;
}

// ============ GUÍA DE NAMING SISTEMÁTICA

/**
 * CONVENCIÓN DE NAMING PARA ARQUETIPOS:
 * 
 * Formato: {dimension}:{categoria}/{variant}
 * 
 * ESTRUCTURA (es:):
 * - es:Stack/Centered, es:Stack/Left, es:Stack/Right
 * - es:Container/Wide, es:Container/Narrow, es:Container/Full
 * - es:Grid/Responsive, es:Grid/Fixed, es:Grid/Masonry
 * - es:Flex/Row, es:Flex/Column, es:Flex/Wrap
 * - es:Inline/Flow, es:Inline/Block
 * 
 * FUNCIÓN (fn:):
 * - fn:CTA/Primary, fn:CTA/Secondary, fn:CTA/Tertiary
 * - fn:Hero/Presentation, fn:Hero/Video, fn:Hero/Minimal
 * - fn:Content/Section, fn:Content/Article, fn:Content/Aside
 * - fn:Navigation/Menu, fn:Navigation/Breadcrumb, fn:Navigation/Tabs
 * - fn:Form/Input, fn:Form/Submit, fn:Form/Validation
 * 
 * FORMA (fo:):
 * - fo:Button/Primary, fo:Button/Secondary, fo:Button/Ghost
 * - fo:Card/Elevated, fo:Card/Flat, fo:Card/Outlined
 * - fo:Hero/Brand, fo:Hero/Minimal, fo:Hero/Gradient
 * - fo:Text/Heading, fo:Text/Body, fo:Text/Caption
 * - fo:Surface/Light, fo:Surface/Dark, fo:Surface/Glass
 * 
 * EJEMPLOS DE COMBINACIONES VÁLIDAS:
 * 
 * // Botón primario centrado
 * {
 *   es: "es:Inline/Flow",
 *   fn: "fn:CTA/Primary", 
 *   fo: "fo:Button/Primary"
 * }
 * 
 * // Hero de marca con stack centrado  
 * {
 *   es: "es:Stack/Centered",
 *   fn: "fn:Hero/Presentation",
 *   fo: "fo:Hero/Brand" 
 * }
 * 
 * // Card elevada en grid responsivo
 * {
 *   es: "es:Grid/Responsive",
 *   fn: "fn:Content/Section",
 *   fo: "fo:Card/Elevated"
 * }
 */
