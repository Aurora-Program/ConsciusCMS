/**
 * EspiralML + ConstellaCSS • Starter Kit (TypeScript)
 * Sistema de diseño fractal basado en Arquetipos, Roles y Composición (ARC)
 * 
 * @version 1.0.0
 * @author Agente Aurora
 * @description Sistema completo de tipos y utilidades para EspiralML
 */

// ========================================
// TIPOS BASE DEL SISTEMA
// ========================================

/**
 * Dimensiones del sistema ARC
 * es = estructura, fn = función, fo = forma
 */
export type Dimension = 'es' | 'fn' | 'fo';

/**
 * Grupo reutilizable de reglas CSS con nombre identificativo
 */
export interface GrupoReglas {
  id: string;
  descripcion: string;
  tokens: Record<string, string>;
  props?: Record<string, any>;
  allowWith?: string[];  // IDs de arquetipos compatibles
  denyWith?: string[];   // IDs de arquetipos incompatibles
}

/**
 * Arquetipo con dimensión específica
 * Formato: "dimension:categoria/variant"
 */
export interface Arquetipo {
  id: string;            // e.g., "es:Stack/Centered"
  dimension: Dimension;
  categoria: string;     // e.g., "Stack"
  variant: string;       // e.g., "Centered"
  descripcion: string;
  grupos: string[];      // IDs de grupos aplicados
  tokens: Record<string, string>;
  props?: Record<string, any>;
  allowWith?: string[];
  denyWith?: string[];
}

/**
 * Nodo individual que combina arquetipos de las tres dimensiones
 */
export interface Nodo {
  es?: string;           // Arquetipo de estructura
  fn?: string;           // Arquetipo de función
  fo?: string;           // Arquetipo de forma
  tokens?: Record<string, string>;  // Tokens específicos del nodo
  props?: Record<string, any>;      // Props específicas del nodo
  hijos?: Nodo[];        // Nodos hijos para composición fractal
}

/**
 * Resultado de resolver un nodo con precedencia aplicada
 */
export interface ResolucionNodo {
  className: string;
  tokens: Record<string, string>;
  props: Record<string, any>;
  hijos: ResolucionNodo[];
  debug?: {
    arquetiposAplicados: string[];
    gruposAplicados: string[];
    precedencia: Array<{ fuente: string; tokens: Record<string, string> }>;
  };
}

/**
 * Tema base con tokens globales
 */
export interface Theme {
  id: string;
  descripcion: string;
  tokens: Record<string, string>;
}

/**
 * Registros inyectables para modularidad
 */
export interface Registries {
  grupos: Record<string, GrupoReglas>;
  arquetipos: Record<string, Arquetipo>;
}

// ========================================
// GRUPOS BASE REUTILIZABLES
// ========================================

export const GRUPOS_BASE: Record<string, GrupoReglas> = {
  
  // Layout Groups
  "layout-stack": {
    id: "layout-stack",
    descripcion: "Disposición vertical con flexbox",
    tokens: {
      "--display": "flex",
      "--flex-direction": "column",
      "--gap": "var(--space-md, 1rem)"
    }
  },

  "layout-inline": {
    id: "layout-inline", 
    descripcion: "Disposición horizontal con flexbox",
    tokens: {
      "--display": "flex",
      "--flex-direction": "row",
      "--align-items": "center",
      "--gap": "var(--space-sm, 0.5rem)"
    }
  },

  "layout-grid": {
    id: "layout-grid",
    descripcion: "Grid responsive adaptativo",
    tokens: {
      "--display": "grid",
      "--grid-template-columns": "var(--grid-cols, repeat(auto-fit, minmax(300px, 1fr)))",
      "--gap": "var(--space-lg, 1.5rem)"
    }
  },

  "layout-container": {
    id: "layout-container",
    descripcion: "Contenedor con max-width",
    tokens: {
      "--max-width": "var(--container-width, 1200px)",
      "--margin-left": "auto",
      "--margin-right": "auto",
      "--padding-left": "var(--space-md, 1rem)",
      "--padding-right": "var(--space-md, 1rem)"
    }
  },

  // Centering Groups
  "center-content": {
    id: "center-content",
    descripcion: "Centrado de contenido",
    tokens: {
      "--justify-content": "center",
      "--align-items": "center",
      "--text-align": "center"
    }
  },

  "center-horizontal": {
    id: "center-horizontal", 
    descripcion: "Centrado horizontal únicamente",
    tokens: {
      "--justify-content": "center",
      "--text-align": "center"
    }
  },

  // Interaction Groups
  "interactive-base": {
    id: "interactive-base",
    descripcion: "Base para elementos interactivos",
    tokens: {
      "--cursor": "pointer",
      "--transition": "all 0.2s ease",
      "--user-select": "none"
    }
  },

  "interactive-hover": {
    id: "interactive-hover",
    descripcion: "Estados de hover",
    tokens: {
      "--hover-transform": "translateY(-2px)",
      "--hover-shadow": "0 4px 12px rgba(0,0,0,0.15)"
    }
  },

  // Typography Groups
  "text-heading": {
    id: "text-heading",
    descripcion: "Estilos para encabezados",
    tokens: {
      "--font-weight": "700",
      "--line-height": "1.2",
      "--margin-bottom": "var(--space-md, 1rem)"
    }
  },

  "text-body": {
    id: "text-body",
    descripcion: "Texto de párrafo",
    tokens: {
      "--line-height": "1.6",
      "--margin-bottom": "var(--space-sm, 0.5rem)"
    }
  },

  // Visual Groups
  "visual-card": {
    id: "visual-card",
    descripcion: "Estilo de tarjeta",
    tokens: {
      "--background": "var(--color-surface, white)",
      "--border-radius": "var(--radius-md, 8px)",
      "--padding": "var(--space-lg, 1.5rem)"
    }
  },

  "visual-button": {
    id: "visual-button",
    descripcion: "Base visual para botones",
    tokens: {
      "--border": "none",
      "--border-radius": "var(--radius-sm, 4px)",
      "--padding": "var(--space-sm, 0.5rem) var(--space-md, 1rem)",
      "--font-weight": "600"
    }
  },

  "visual-shadow": {
    id: "visual-shadow",
    descripcion: "Sombras de elevación",
    tokens: {
      "--box-shadow": "0 2px 8px rgba(0,0,0,0.1)"
    }
  },

  "visual-elevated": {
    id: "visual-elevated",
    descripcion: "Elevación alta",
    tokens: {
      "--box-shadow": "0 8px 24px rgba(0,0,0,0.15)"
    }
  }
};

// ========================================
// ARQUETIPOS BASE POR DIMENSIÓN
// ========================================

export const ARQUETIPOS_BASE: Record<string, Arquetipo> = {

  // ESTRUCTURA (es)
  "es:Stack/Centered": {
    id: "es:Stack/Centered",
    dimension: "es",
    categoria: "Stack", 
    variant: "Centered",
    descripcion: "Disposición vertical centrada",
    grupos: ["layout-stack", "center-content"],
    tokens: {
      "--min-height": "100%"
    }
  },

  "es:Stack/Flow": {
    id: "es:Stack/Flow",
    dimension: "es",
    categoria: "Stack",
    variant: "Flow", 
    descripcion: "Disposición vertical fluida",
    grupos: ["layout-stack"],
    tokens: {}
  },

  "es:Inline/Flow": {
    id: "es:Inline/Flow",
    dimension: "es",
    categoria: "Inline",
    variant: "Flow",
    descripcion: "Disposición horizontal fluida",
    grupos: ["layout-inline"],
    tokens: {}
  },

  "es:Inline/Spaced": {
    id: "es:Inline/Spaced",
    dimension: "es", 
    categoria: "Inline",
    variant: "Spaced",
    descripcion: "Disposición horizontal con espaciado justificado",
    grupos: ["layout-inline"],
    tokens: {
      "--justify-content": "space-between"
    }
  },

  "es:Grid/Responsive": {
    id: "es:Grid/Responsive",
    dimension: "es",
    categoria: "Grid",
    variant: "Responsive",
    descripcion: "Grid adaptativo responsivo",
    grupos: ["layout-grid"],
    tokens: {}
  },

  "es:Container/Wide": {
    id: "es:Container/Wide",
    dimension: "es",
    categoria: "Container",
    variant: "Wide",
    descripcion: "Contenedor ancho",
    grupos: ["layout-container"],
    tokens: {
      "--container-width": "1200px"
    }
  },

  "es:Container/Narrow": {
    id: "es:Container/Narrow", 
    dimension: "es",
    categoria: "Container",
    variant: "Narrow",
    descripcion: "Contenedor estrecho",
    grupos: ["layout-container"],
    tokens: {
      "--container-width": "800px"
    }
  },

  // FUNCIÓN (fn)
  "fn:Hero/Presentation": {
    id: "fn:Hero/Presentation",
    dimension: "fn",
    categoria: "Hero",
    variant: "Presentation",
    descripcion: "Sección hero de presentación",
    grupos: ["text-heading"],
    tokens: {
      "--min-height": "60vh",
      "--padding": "var(--space-xl, 2rem)"
    }
  },

  "fn:Content/Section": {
    id: "fn:Content/Section",
    dimension: "fn",
    categoria: "Content", 
    variant: "Section",
    descripcion: "Sección de contenido",
    grupos: ["text-body"],
    tokens: {
      "--padding": "var(--space-lg, 1.5rem)"
    }
  },

  "fn:CTA/Primary": {
    id: "fn:CTA/Primary",
    dimension: "fn",
    categoria: "CTA",
    variant: "Primary",
    descripcion: "Call-to-action principal",
    grupos: ["interactive-base", "interactive-hover"],
    tokens: {}
  },

  "fn:CTA/Secondary": {
    id: "fn:CTA/Secondary", 
    dimension: "fn",
    categoria: "CTA",
    variant: "Secondary",
    descripcion: "Call-to-action secundario",
    grupos: ["interactive-base"],
    tokens: {}
  },

  "fn:Navigation/Main": {
    id: "fn:Navigation/Main",
    dimension: "fn",
    categoria: "Navigation",
    variant: "Main",
    descripcion: "Navegación principal",
    grupos: ["interactive-base"],
    tokens: {}
  },

  // FORMA (fo)
  "fo:Button/Primary": {
    id: "fo:Button/Primary",
    dimension: "fo",
    categoria: "Button",
    variant: "Primary", 
    descripcion: "Botón principal",
    grupos: ["visual-button"],
    tokens: {
      "--background": "var(--color-primary, #3b82f6)",
      "--color": "white"
    }
  },

  "fo:Button/Secondary": {
    id: "fo:Button/Secondary",
    dimension: "fo",
    categoria: "Button", 
    variant: "Secondary",
    descripcion: "Botón secundario",
    grupos: ["visual-button"],
    tokens: {
      "--background": "transparent",
      "--color": "var(--color-primary, #3b82f6)",
      "--border": "2px solid var(--color-primary, #3b82f6)"
    }
  },

  "fo:Card/Flat": {
    id: "fo:Card/Flat",
    dimension: "fo",
    categoria: "Card",
    variant: "Flat",
    descripcion: "Tarjeta plana",
    grupos: ["visual-card"],
    tokens: {}
  },

  "fo:Card/Elevated": {
    id: "fo:Card/Elevated",
    dimension: "fo", 
    categoria: "Card",
    variant: "Elevated",
    descripcion: "Tarjeta elevada",
    grupos: ["visual-card", "visual-elevated"],
    tokens: {}
  },

  "fo:Hero/Brand": {
    id: "fo:Hero/Brand",
    dimension: "fo",
    categoria: "Hero",
    variant: "Brand",
    descripcion: "Hero con branding",
    grupos: [],
    tokens: {
      "--background": "linear-gradient(135deg, var(--color-primary, #3b82f6), var(--color-secondary, #8b5cf6))",
      "--color": "white"
    }
  },

  "fo:Text/Heading": {
    id: "fo:Text/Heading",
    dimension: "fo",
    categoria: "Text",
    variant: "Heading",
    descripcion: "Estilo de encabezado",
    grupos: ["text-heading"],
    tokens: {}
  },

  "fo:Text/Body": {
    id: "fo:Text/Body",
    dimension: "fo",
    categoria: "Text", 
    variant: "Body",
    descripcion: "Estilo de texto de cuerpo",
    grupos: ["text-body"],
    tokens: {}
  }
};

// ========================================
// TEMA BASE
// ========================================

export const TEMA_BASE: Theme = {
  id: "aurora-theme",
  descripcion: "Tema base Aurora",
  tokens: {
    // Colores
    "--color-primary": "#3b82f6",
    "--color-secondary": "#8b5cf6", 
    "--color-accent": "#f59e0b",
    "--color-surface": "#ffffff",
    "--color-background": "#f8fafc",
    "--color-text": "#1f2937",
    "--color-text-muted": "#6b7280",
    
    // Espaciado
    "--space-xs": "0.25rem",
    "--space-sm": "0.5rem", 
    "--space-md": "1rem",
    "--space-lg": "1.5rem",
    "--space-xl": "2rem",
    "--space-2xl": "3rem",
    
    // Tipografía
    "--font-size-sm": "0.875rem",
    "--font-size-base": "1rem",
    "--font-size-lg": "1.125rem",
    "--font-size-xl": "1.25rem",
    "--font-size-2xl": "1.5rem",
    "--font-size-3xl": "1.875rem",
    
    // Bordes
    "--radius-sm": "0.25rem",
    "--radius-md": "0.5rem",
    "--radius-lg": "0.75rem",
    
    // Contenedores
    "--container-sm": "640px",
    "--container-md": "768px", 
    "--container-lg": "1024px",
    "--container-xl": "1280px"
  }
};

// ========================================
// REGISTROS BASE
// ========================================

export const REGISTRIES_BASE: Registries = {
  grupos: GRUPOS_BASE,
  arquetipos: ARQUETIPOS_BASE
};

// ========================================
// RESOLVER PRINCIPAL
// ========================================

/**
 * Resuelve un nodo aplicando precedencia determinística:
 * theme < es < fn < fo < nodo
 */
export function resolverNodo(
  nodo: Nodo,
  registries: Registries,
  theme: Theme,
  state?: any
): ResolucionNodo {
  
  const tokensFinales: Record<string, string> = {};
  const propsFinales: Record<string, any> = {};
  const classNames: string[] = [];
  const debug: ResolucionNodo['debug'] = {
    arquetiposAplicados: [],
    gruposAplicados: [],
    precedencia: []
  };

  // Función helper para aplicar tokens con precedencia
  function aplicarTokens(tokens: Record<string, string>, fuente: string) {
    Object.assign(tokensFinales, tokens);
    debug?.precedencia.push({ fuente, tokens: { ...tokens } });
  }

  // Función helper para aplicar props
  function aplicarProps(props: Record<string, any>) {
    Object.assign(propsFinales, props);
  }

  // 1. Aplicar theme (precedencia más baja)
  aplicarTokens(theme.tokens, `theme:${theme.id}`);

  // 2-8. Aplicar arquetipos en orden de precedencia
  const dimensiones: Array<{ key: keyof Nodo, dimension: Dimension }> = [
    { key: 'es', dimension: 'es' },
    { key: 'fn', dimension: 'fn' }, 
    { key: 'fo', dimension: 'fo' }
  ];

  dimensiones.forEach(({ key, dimension }) => {
    const arquetipoId = nodo[key];
    if (!arquetipoId) return;

    const arquetipo = registries.arquetipos[arquetipoId];
    if (!arquetipo) {
      console.warn(`Arquetipo no encontrado: ${arquetipoId}`);
      return;
    }

    debug?.arquetiposAplicados.push(arquetipoId);
    classNames.push(`${dimension}--${arquetipo.categoria.toLowerCase()}-${arquetipo.variant.toLowerCase()}`);

    // Aplicar grupos del arquetipo
    arquetipo.grupos.forEach(grupoId => {
      const grupo = registries.grupos[grupoId];
      if (grupo) {
        aplicarTokens(grupo.tokens, `grupo:${grupoId}`);
        if (grupo.props) aplicarProps(grupo.props);
        debug?.gruposAplicados.push(grupoId);
      }
    });

    // Aplicar tokens del arquetipo
    aplicarTokens(arquetipo.tokens, `arquetipo:${arquetipoId}`);
    if (arquetipo.props) aplicarProps(arquetipo.props);
  });

  // 9. Aplicar tokens del nodo (precedencia más alta)
  if (nodo.tokens) {
    aplicarTokens(nodo.tokens, 'nodo:tokens');
  }
  if (nodo.props) {
    aplicarProps(nodo.props);
  }

  // Resolver hijos recursivamente
  const hijosResueltos: ResolucionNodo[] = [];
  if (nodo.hijos) {
    nodo.hijos.forEach(hijo => {
      hijosResueltos.push(resolverNodo(hijo, registries, theme, state));
    });
  }

  return {
    className: classNames.join(' '),
    tokens: tokensFinales,
    props: propsFinales,
    hijos: hijosResueltos,
    debug
  };
}

// ========================================
// UTILIDADES DE CONVENIENCIA
// ========================================

/**
 * Crea un arquetipo dinámicamente
 */
export function crearArquetipo(
  dimension: Dimension,
  categoria: string,
  variant: string,
  config: Partial<Omit<Arquetipo, 'id' | 'dimension' | 'categoria' | 'variant'>>
): Arquetipo {
  return {
    id: `${dimension}:${categoria}/${variant}`,
    dimension,
    categoria,
    variant,
    descripcion: config.descripcion || `${categoria} ${variant}`,
    grupos: config.grupos || [],
    tokens: config.tokens || {},
    props: config.props,
    allowWith: config.allowWith,
    denyWith: config.denyWith
  };
}

/**
 * Valida compatibilidad entre arquetipos
 */
export function validarCompatibilidad(
  arquetipos: string[],
  registries: Registries
): { valido: boolean; errores: string[] } {
  const errores: string[] = [];
  
  // Verificar cardinalidad: máximo uno por dimensión
  const dimensionesUsadas = new Set<Dimension>();
  
  arquetipos.forEach(arquetipoId => {
    const arquetipo = registries.arquetipos[arquetipoId];
    if (!arquetipo) {
      errores.push(`Arquetipo no encontrado: ${arquetipoId}`);
      return;
    }
    
    if (dimensionesUsadas.has(arquetipo.dimension)) {
      errores.push(`Múltiples arquetipos para dimensión ${arquetipo.dimension}`);
    }
    dimensionesUsadas.add(arquetipo.dimension);
  });

  // Verificar allowWith/denyWith
  arquetipos.forEach(arquetipoId => {
    const arquetipo = registries.arquetipos[arquetipoId];
    if (!arquetipo) return;

    if (arquetipo.denyWith) {
      const conflictos = arquetipos.filter(id => 
        id !== arquetipoId && arquetipo.denyWith!.includes(id)
      );
      conflictos.forEach(conflicto => {
        errores.push(`Conflicto: ${arquetipoId} no compatible con ${conflicto}`);
      });
    }

    if (arquetipo.allowWith) {
      const noPermitidos = arquetipos.filter(id => 
        id !== arquetipoId && !arquetipo.allowWith!.includes(id)
      );
      noPermitidos.forEach(noPermitido => {
        errores.push(`Restricción: ${arquetipoId} solo permite ${arquetipo.allowWith!.join(', ')}`);
      });
    }
  });

  return {
    valido: errores.length === 0,
    errores
  };
}

/**
 * Simula la aplicación de precedencia paso a paso
 */
export function simularPrecedencia(
  nodo: Nodo,
  registries: Registries,
  theme: Theme
): Array<{ paso: number; fuente: string; tokens: Record<string, string>; acumulado: Record<string, string> }> {
  const pasos: Array<{
    paso: number;
    fuente: string; 
    tokens: Record<string, string>;
    acumulado: Record<string, string>;
  }> = [];
  
  let acumulado: Record<string, string> = {};

  function agregarPaso(fuente: string, tokens: Record<string, string>) {
    acumulado = { ...acumulado, ...tokens };
    pasos.push({
      paso: pasos.length + 1,
      fuente,
      tokens: { ...tokens },
      acumulado: { ...acumulado }
    });
  }

  // Simular la misma lógica que resolverNodo
  agregarPaso(`theme:${theme.id}`, theme.tokens);

  const dimensiones = ['es', 'fn', 'fo'] as const;
  dimensiones.forEach(dim => {
    const arquetipoId = nodo[dim];
    if (!arquetipoId) return;

    const arquetipo = registries.arquetipos[arquetipoId];
    if (!arquetipo) return;

    // Grupos del arquetipo
    arquetipo.grupos.forEach(grupoId => {
      const grupo = registries.grupos[grupoId];
      if (grupo) {
        agregarPaso(`grupo:${grupoId}`, grupo.tokens);
      }
    });

    // Tokens del arquetipo
    agregarPaso(`arquetipo:${arquetipoId}`, arquetipo.tokens);
  });

  // Tokens del nodo
  if (nodo.tokens) {
    agregarPaso('nodo:tokens', nodo.tokens);
  }

  return pasos;
}

// ========================================
// EJEMPLOS DE NODOS
// ========================================

export const EJEMPLO_HERO: Nodo = {
  es: "es:Stack/Centered",
  fn: "fn:Hero/Presentation",
  fo: "fo:Hero/Brand",
  tokens: {
    "--min-height": "80vh"
  },
  hijos: [
    {
      es: "es:Stack/Flow",
      fn: "fn:Content/Section", 
      fo: "fo:Text/Heading",
      tokens: {
        "--font-size": "3rem"
      }
    },
    {
      es: "es:Inline/Flow",
      fn: "fn:CTA/Primary",
      fo: "fo:Button/Primary"
    }
  ]
};

export const EJEMPLO_CARD: Nodo = {
  es: "es:Container/Narrow",
  fn: "fn:Content/Section",
  fo: "fo:Card/Elevated"
};

export const EJEMPLO_GRID: Nodo = {
  es: "es:Grid/Responsive",
  fn: "fn:Content/Section",
  fo: "fo:Card/Flat",
  tokens: {
    "--grid-cols": "repeat(auto-fit, minmax(250px, 1fr))"
  }
};

export default {
  // Tipos
  type: {} as {
    Dimension: Dimension;
    GrupoReglas: GrupoReglas;
    Arquetipo: Arquetipo;
    Nodo: Nodo;
    ResolucionNodo: ResolucionNodo;
    Theme: Theme;
    Registries: Registries;
  },
  
  // Funciones
  resolverNodo,
  crearArquetipo,
  validarCompatibilidad,
  simularPrecedencia,
  
  // Datos
  GRUPOS_BASE,
  ARQUETIPOS_BASE,
  TEMA_BASE,
  REGISTRIES_BASE,
  EJEMPLO_HERO,
  EJEMPLO_CARD,
  EJEMPLO_GRID
};
