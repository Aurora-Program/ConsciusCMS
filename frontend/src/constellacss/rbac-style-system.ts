/**
 * ARC System for EspiralML
 * Arquetipos, Roles y Composición - Sistema de estilos puros
 * 
 * PRINCIPIOS FUNDAMENTALES:
 * 1. Fractalidad: Contenido -> Sección -> Componente (infinitamente repetible)
 * 2. Composición sobre Herencia: fo + fn + es = Componente único
 * 3. Contratos Claros: API estandardizada para definir elementos visuales
 * 4. Cardinalidad Estricta: Un arquetipo por propiedad (fo, fn, es)
 * 5. Precedencia Determinística: es → fn → fo (estructura → función → forma)
 */

// ========================================
// TIPOS DEL SISTEMA ARC
// ========================================

export type Dimension = "Funcion" | "Estructura" | "Forma";

export type RolID = string; // ej: "Hero:Presentacion", "Estructura:StackCentered"

export type ArquetipoID = "Hero" | "Listado" | "Titulo" | "Boton" | "Card" | "CTA" | "Seccion";

export type Rol = {
  id: RolID;
  dimension: Dimension;
  arquetipo: ArquetipoID;
  clases: string[];
  tokens?: Record<string, string>;
  allowWith?: RolID[];
  denyWith?: RolID[];
  precedencia: number; // 1=Estructura, 2=Función, 3=Forma
};

export type AsignacionRoles = {
  funcion?: RolID;      // Un solo arquetipo función por componente
  estructura?: RolID;   // Un solo arquetipo estructura por componente  
  forma?: RolID;        // Un solo arquetipo forma por componente
};

export type Nodo = {
  arquetipo: ArquetipoID;
  roles: AsignacionRoles;
  children?: Nodo[];
};

export type ResultadoResolver = {
  className: string;
  tokens: Record<string, string>;
  style?: React.CSSProperties;
  metadata: {
    arquetipoBase: ArquetipoID;
    rolesAplicados: AsignacionRoles;
    ordenResolucion: string[];
    timestamp: number;
  };
};

// ========================================
// CATÁLOGO ARC - ARQUETIPOS Y ROLES
// ========================================

export const CATALOGO_ARC: Record<RolID, Rol> = {
  // ==========================================
  // ROLES DE FUNCIÓN (Semántica/UX)
  // ==========================================
  
  "Hero:Presentacion": {
    id: "Hero:Presentacion",
    dimension: "Funcion",
    arquetipo: "Hero",
    precedencia: 2, // Función se aplica después de estructura
    clases: ["fn--Hero", "fn--HeroPresentacion", "fn--Landmark"],
    tokens: {
      "--semantic-role": "hero-presentation",
      "--aria-level": "1"
    },
    allowWith: ["Estructura:StackCentered", "Forma:BrandPrimaryLg"]
  },

  "Seccion:Contenido": {
    id: "Seccion:Contenido",
    dimension: "Funcion",
    arquetipo: "Seccion",
    precedencia: 2,
    clases: ["fn--Seccion", "fn--SeccionContenido", "fn--ContentArea"],
    tokens: {
      "--semantic-role": "content-section",
      "--section-type": "content"
    }
  },

  "Seccion:Destacada": {
    id: "Seccion:Destacada",
    dimension: "Funcion",
    arquetipo: "Seccion",
    precedencia: 2,
    clases: ["fn--Seccion", "fn--SeccionDestacada", "fn--Featured"],
    tokens: {
      "--semantic-role": "featured-section",
      "--section-importance": "high"
    }
  },

  "Titulo:Principal": {
    id: "Titulo:Principal",
    dimension: "Funcion", 
    arquetipo: "Titulo",
    precedencia: 2,
    clases: ["fn--Titulo", "fn--TituloPrincipal", "fn--Heading"],
    tokens: {
      "--semantic-role": "main-heading",
      "--heading-level": "1"
    }
  },

  "Titulo:Seccion": {
    id: "Titulo:Seccion",
    dimension: "Funcion",
    arquetipo: "Titulo",
    precedencia: 2,
    clases: ["fn--Titulo", "fn--TituloSeccion", "fn--Heading"],
    tokens: {
      "--semantic-role": "section-heading",
      "--heading-level": "2"
    }
  },

  "CTA:Primaria": {
    id: "CTA:Primaria",
    dimension: "Funcion",
    arquetipo: "CTA",
    precedencia: 2,
    clases: ["fn--CTA", "fn--CTAPrimaria", "fn--Interactive"],
    tokens: {
      "--semantic-role": "primary-action",
      "--interaction-priority": "high"
    }
  },

  "CTA:Secundaria": {
    id: "CTA:Secundaria", 
    dimension: "Funcion",
    arquetipo: "CTA",
    precedencia: 2,
    clases: ["fn--CTA", "fn--CTASecundaria", "fn--Interactive"],
    tokens: {
      "--semantic-role": "secondary-action",
      "--interaction-priority": "medium"
    }
  },

  // ==========================================
  // ROLES DE ESTRUCTURA (Layout/Objects)
  // ==========================================

  "Estructura:StackCentered": {
    id: "Estructura:StackCentered",
    dimension: "Estructura",
    arquetipo: "Hero",
    precedencia: 1, // Estructura se aplica primero (esqueleto)
    clases: ["es--container", "es--stack", "es--center"],
    tokens: {
      "--layout-type": "stack",
      "--alignment": "center",
      "--spacing": "var(--space-lg)"
    }
  },

  "Estructura:GridResponsive": {
    id: "Estructura:GridResponsive", 
    dimension: "Estructura",
    arquetipo: "Seccion",
    precedencia: 1,
    clases: ["es--container", "es--grid", "es--responsive"],
    tokens: {
      "--layout-type": "grid",
      "--grid-columns": "repeat(auto-fit, minmax(300px, 1fr))",
      "--grid-gap": "var(--space-xl)"
    }
  },

  "Estructura:Container": {
    id: "Estructura:Container",
    dimension: "Estructura",
    arquetipo: "Seccion",
    precedencia: 1,
    clases: ["es--container", "es--wrapper"],
    tokens: {
      "--layout-type": "container",
      "--max-width": "1200px",
      "--padding": "var(--space-lg)"
    }
  },

  "Estructura:Inline": {
    id: "Estructura:Inline",
    dimension: "Estructura", 
    arquetipo: "Titulo",
    precedencia: 1,
    clases: ["es--inline", "es--flow"],
    tokens: {
      "--layout-type": "inline",
      "--flow-space": "var(--space-sm)"
    }
  },

  "Estructura:ButtonGroup": {
    id: "Estructura:ButtonGroup",
    dimension: "Estructura",
    arquetipo: "CTA",
    precedencia: 1,
    clases: ["es--buttongroup", "es--flex", "es--gap"],
    tokens: {
      "--layout-type": "flex",
      "--flex-direction": "row",
      "--gap": "var(--space-md)"
    }
  },

  // ==========================================
  // ROLES DE FORMA (Skin/Tokens)
  // ==========================================

  "Forma:BrandPrimaryLg": {
    id: "Forma:BrandPrimaryLg",
    dimension: "Forma",
    arquetipo: "Hero",
    precedencia: 3, // Forma se aplica al final (la piel tiene última palabra)
    clases: ["fo--brand", "fo--primary", "fo--large", "fo--RichBgHero"],
    tokens: {
      "--brand-accent": "var(--color-corp-primary)",
      "--text-color": "white",
      "--background": "var(--gradient-corp-primary)",
      "--size-scale": "1.5",
      "--padding": "var(--space-2xl)"
    }
  },

  "Forma:HeadingBrand": {
    id: "Forma:HeadingBrand",
    dimension: "Forma",
    arquetipo: "Titulo",
    precedencia: 3,
    clases: ["fo--heading", "fo--brand", "fo--gradient-text"],
    tokens: {
      "--font-family": "var(--font-corp-display)",
      "--font-weight": "700",
      "--font-size": "clamp(2.5rem, 5vw, 4rem)",
      "--text-gradient": "var(--gradient-corp-secondary)",
      "--line-height": "1.1"
    }
  },

  "Forma:BotonBrand": {
    id: "Forma:BotonBrand", 
    dimension: "Forma",
    arquetipo: "CTA",
    precedencia: 3,
    clases: ["fo--button", "fo--brand", "fo--interactive"],
    tokens: {
      "--button-bg": "var(--color-corp-primary)",
      "--button-color": "white", 
      "--button-padding": "var(--space-md) var(--space-xl)",
      "--button-radius": "var(--radius-corp-md)",
      "--button-shadow": "var(--shadow-corp-md)",
      "--button-hover-transform": "translateY(-2px)"
    }
  },

  "Forma:BotonSecundario": {
    id: "Forma:BotonSecundario",
    dimension: "Forma", 
    arquetipo: "CTA",
    precedencia: 3,
    clases: ["fo--button", "fo--secondary", "fo--outline"],
    tokens: {
      "--button-bg": "transparent",
      "--button-color": "var(--color-corp-primary)",
      "--button-border": "2px solid var(--color-corp-primary)",
      "--button-padding": "var(--space-md) var(--space-xl)",
      "--button-radius": "var(--radius-corp-md)"
    }
  },

  "Forma:CardProfessional": {
    id: "Forma:CardProfessional",
    dimension: "Forma",
    arquetipo: "Card",
    precedencia: 3,
    clases: ["fo--card", "fo--professional", "fo--shadow"],
    tokens: {
      "--card-bg": "var(--color-corp-white)",
      "--card-padding": "var(--space-xl)",
      "--card-radius": "var(--radius-corp-lg)",
      "--card-shadow": "var(--shadow-corp-lg)",
      "--card-border": "1px solid rgba(255,255,255,0.2)"
    }
  },

  "Forma:SeccionLimpia": {
    id: "Forma:SeccionLimpia",
    dimension: "Forma",
    arquetipo: "Seccion",
    precedencia: 3,
    clases: ["fo--clean", "fo--minimal"],
    tokens: {
      "--section-bg": "transparent",
      "--section-padding": "var(--space-xl) 0",
      "--section-border": "none"
    }
  },

  "Forma:SeccionDestacada": {
    id: "Forma:SeccionDestacada", 
    dimension: "Forma",
    arquetipo: "Seccion",
    precedencia: 3,
    clases: ["fo--featured", "fo--highlighted", "fo--shadow"],
    tokens: {
      "--section-bg": "var(--color-corp-light-gray)",
      "--section-padding": "var(--space-2xl) 0",
      "--section-border": "1px solid rgba(0,0,0,0.1)"
    }
  }
};

// ========================================
// RESOLVER ARC PURO CON PRECEDENCIA DETERMINÍSTICA
// ========================================

export function resolveNodo(nodo: Nodo, catalogo: Record<RolID, Rol> = CATALOGO_ARC): ResultadoResolver {
  const rolesActivos = [
    nodo.roles.estructura,  // Precedencia 1: Esqueleto (layout, dimensiones)
    nodo.roles.funcion,     // Precedencia 2: Sistema nervioso (interacciones)
    nodo.roles.forma        // Precedencia 3: Piel (estética final)
  ].filter(Boolean);

  const roles = rolesActivos.map(id => {
    const rol = catalogo[id!];
    if (!rol) throw new Error(`Rol no encontrado: ${id}`);
    return rol;
  });

  // Validación: todos los roles deben ser compatibles con el arquetipo
  roles.forEach(rol => {
    if (rol.arquetipo !== nodo.arquetipo) {
      throw new Error(`Rol ${rol.id} no aplica a arquetipo ${nodo.arquetipo}`);
    }
  });

  // Validación: detectar conflictos explícitos
  roles.forEach(rol => {
    if (rol.denyWith) {
      const conflictos = roles.filter(r => rol.denyWith!.includes(r.id));
      if (conflictos.length > 0) {
        throw new Error(`Conflicto detectado: ${rol.id} no compatible con ${conflictos.map(c => c.id).join(', ')}`);
      }
    }
  });

  // Ordenar roles por precedencia: 1 (estructura) → 2 (función) → 3 (forma)
  const rolesOrdenados = roles.sort((a, b) => a.precedencia - b.precedencia);
  
  // Resolver salida determinística respetando precedencia
  const clases = rolesOrdenados.flatMap(rol => rol.clases);
  const className = [...new Set(clases)].join(" ").trim();
  
  // Combinar tokens respetando precedencia (los últimos sobrescriben)
  const tokens = Object.assign({}, ...rolesOrdenados.map(rol => rol.tokens ?? {}));

  // Convertir tokens a CSS custom properties para style
  const style: React.CSSProperties = {};
  Object.entries(tokens).forEach(([key, value]) => {
    if (key.startsWith('--')) {
      (style as any)[key] = value;
    }
  });

  return {
    className,
    tokens, 
    style,
    metadata: {
      arquetipoBase: nodo.arquetipo,
      rolesAplicados: nodo.roles,
      ordenResolucion: rolesOrdenados.map(r => `${r.dimension}:${r.id} (prec:${r.precedencia})`),
      timestamp: Date.now()
    }
  };
}

// ========================================
// HELPERS Y UTILIDADES DEL SISTEMA ARC
// ========================================

export function getRolesPorDimension(dimension: Dimension, arquetipo?: ArquetipoID): Rol[] {
  return Object.values(CATALOGO_ARC).filter(rol => 
    rol.dimension === dimension && 
    (!arquetipo || rol.arquetipo === arquetipo)
  );
}

export function getArquetiposDisponibles(): ArquetipoID[] {
  return [...new Set(Object.values(CATALOGO_ARC).map(rol => rol.arquetipo))];
}

export function validarCombinacion(roles: AsignacionRoles, arquetipo: ArquetipoID): boolean {
  try {
    resolveNodo({ arquetipo, roles });
    return true;
  } catch {
    return false;
  }
}

/**
 * Función pura para simular conflictos de precedencia
 * Útil para entender cómo los roles se sobrescriben
 */
export function simularPrecedencia(roles: AsignacionRoles, arquetipo: ArquetipoID): {
  paso: string;
  tokens: Record<string, string>;
  clases: string[];
}[] {
  const nodo: Nodo = { arquetipo, roles };
  const rolesActivos = [roles.estructura, roles.funcion, roles.forma].filter(Boolean);
  
  const pasos: Array<{ paso: string; tokens: Record<string, string>; clases: string[] }> = [];
  let tokensAcumulados: Record<string, string> = {};
  let clasesAcumuladas: string[] = [];

  rolesActivos.forEach(rolID => {
    const rol = CATALOGO_ARC[rolID!];
    if (rol) {
      tokensAcumulados = { ...tokensAcumulados, ...rol.tokens };
      clasesAcumuladas = [...clasesAcumuladas, ...rol.clases];
      
      pasos.push({
        paso: `${rol.dimension} (${rol.id}) - Precedencia ${rol.precedencia}`,
        tokens: { ...tokensAcumulados },
        clases: [...new Set(clasesAcumuladas)]
      });
    }
  });

  return pasos;
}

/**
 * Generador de nuevos arquetipos a partir de reglas existentes
 * Demuestra la "libertad creativa" del sistema
 */
export function crearArquetipo(
  id: RolID,
  dimension: Dimension,
  arquetipo: ArquetipoID,
  baseRoles: RolID[] = []
): Rol {
  // Combinar tokens de roles base
  const tokensBase = baseRoles.reduce((acc, rolID) => {
    const rol = CATALOGO_ARC[rolID];
    return rol ? { ...acc, ...rol.tokens } : acc;
  }, {});
  
  // Combinar clases de roles base
  const clasesBase = baseRoles.reduce((acc: string[], rolID) => {
    const rol = CATALOGO_ARC[rolID];
    return rol ? [...acc, ...rol.clases] : acc;
  }, []);

  const precedencia = dimension === "Estructura" ? 1 : dimension === "Funcion" ? 2 : 3;

  return {
    id,
    dimension,
    arquetipo,
    precedencia,
    clases: [...new Set(clasesBase)],
    tokens: tokensBase
  };
}

/**
 * Debug avanzado para analizar resolución de nodo
 */
export function debugNodoDetallado(nodo: Nodo): void {
  console.group(`🎯 ARC Debug Detallado: ${nodo.arquetipo}`);
  
  console.log('📋 Roles asignados:', nodo.roles);
  
  // Mostrar simulación de precedencia
  console.log('🔄 Simulación de precedencia:');
  const pasos = simularPrecedencia(nodo.roles, nodo.arquetipo);
  pasos.forEach((paso, index) => {
    console.log(`  ${index + 1}. ${paso.paso}`);
    console.log(`     Tokens activos:`, Object.keys(paso.tokens).length);
    console.log(`     Clases acumuladas:`, paso.clases.join(' '));
  });
  
  // Resolver final
  try {
    const resultado = resolveNodo(nodo);
    console.log('✅ Resolución final exitosa:');
    console.log('  - className:', resultado.className);
    console.log('  - tokens count:', Object.keys(resultado.tokens).length);
    console.log('  - orden aplicado:', resultado.metadata.ordenResolucion);
  } catch (error) {
    console.error('❌ Error en resolución:', error);
  }
  
  console.groupEnd();
}

// ========================================
// COMPOSICIONES ARC PREDEFINIDAS
// Demuestran el equilibrio "Estandarización + Libertad"
// ========================================

/**
 * COMPOSICIONES ARC: Los "bloques de LEGO" del sistema
 * 
 * Estas composiciones demuestran cómo el sistema permite:
 * 1. Estandarización: Combinaciones probadas y coherentes
 * 2. Libertad: Infinitas combinaciones posibles
 * 3. Reutilización: Una regla aplicada a múltiples arquetipos
 */
export const COMPOSICIONES_ARC = {
  // Composición Heroica Profesional
  // es:StackCentered (esqueleto) + fn:Hero (función) + fo:BrandPrimary (piel)
  HeroProfessional: {
    arquetipo: "Hero" as ArquetipoID,
    roles: {
      estructura: "Estructura:StackCentered",  // Precedencia 1: Layout base
      funcion: "Hero:Presentacion",            // Precedencia 2: Semántica
      forma: "Forma:BrandPrimaryLg"            // Precedencia 3: Estética final
    }
  },

  // Composición de Título Principal
  // Demuestra reutilización: Estructura:Inline usado en múltiples arquetipos
  TituloPrincipal: {
    arquetipo: "Titulo" as ArquetipoID,
    roles: {
      estructura: "Estructura:Inline",         // Reutilizable entre arquetipos
      funcion: "Titulo:Principal",             // Específico del arquetipo
      forma: "Forma:HeadingBrand"              // Sobrescribe estilos anteriores
    }
  },

  // Composición de CTA Primaria
  // Ejemplo de cardinalidad estricta: solo un rol por dimensión
  CTAPrimaria: {
    arquetipo: "CTA" as ArquetipoID,
    roles: {
      estructura: "Estructura:ButtonGroup",   // NO puede tener 2 estructuras
      funcion: "CTA:Primaria",                 // NO puede tener 2 funciones
      forma: "Forma:BotonBrand"                // NO puede tener 2 formas
    }
  },

  // Ejemplo de nueva composición con roles existentes
  // Demuestra "libertad creativa" sin romper reglas
  SeccionElegante: {
    arquetipo: "Seccion" as ArquetipoID,
    roles: {
      estructura: "Estructura:Container",      // Reutiliza estructura existente
      funcion: "Seccion:Destacada",           // Reutiliza función existente  
      forma: "Forma:SeccionDestacada"         // Reutiliza forma existente
    }
  }
} as const;

// ========================================
// DEMOSTRACIÓN DEL SISTEMA ARC COMPLETO
// ========================================

/**
 * Función de demostración que ejemplifica todos los principios del sistema ARC
 * Útil para entender cómo funciona la "Estandarización + Libertad"
 */
export function demostracionSistemaARC(): void {
  console.group('🎨 DEMOSTRACIÓN SISTEMA ARC - Arquetipos, Roles y Composición');
  
  console.log('📚 PRINCIPIOS FUNDAMENTALES:');
  console.log('  1. Fractalidad: Contenido → Sección → Componente');
  console.log('  2. Composición sobre Herencia: fo + fn + es = Componente único');
  console.log('  3. Contratos Claros: API estandarizada (fo, fn, es)');
  console.log('  4. Cardinalidad Estricta: Un arquetipo por propiedad');
  console.log('  5. Precedencia Determinística: es → fn → fo');
  
  console.log('\n🔄 EJEMPLO DE PRECEDENCIA:');
  const nodoEjemplo: Nodo = {
    arquetipo: "Hero",
    roles: {
      estructura: "Estructura:StackCentered",  // Prec. 1: Define layout
      funcion: "Hero:Presentacion",            // Prec. 2: Define interacción  
      forma: "Forma:BrandPrimaryLg"            // Prec. 3: Define estética final
    }
  };
  
  const pasos = simularPrecedencia(nodoEjemplo.roles, nodoEjemplo.arquetipo);
  pasos.forEach((paso, i) => {
    console.log(`  ${i + 1}. ${paso.paso}`);
    console.log(`     → ${paso.clases.slice(0, 3).join(', ')}... (${paso.clases.length} clases)`);
  });
  
  console.log('\n✅ VENTAJAS DEMOSTRADAS:');
  console.log('  • Predictibilidad: Mismo input → mismo output');
  console.log('  • Reutilización: Reglas compartidas entre arquetipos');
  console.log('  • Escalabilidad: Nuevos arquetipos = nuevas combinaciones');
  console.log('  • IA-Friendly: Sistema formal para agentes automáticos');
  
  console.log('\n🧮 MÉTRICAS DEL CATÁLOGO:');
  const estructuras = getRolesPorDimension("Estructura").length;
  const funciones = getRolesPorDimension("Funcion").length; 
  const formas = getRolesPorDimension("Forma").length;
  const arquetipos = getArquetiposDisponibles().length;
  
  console.log(`  • ${estructuras} roles de Estructura`);
  console.log(`  • ${funciones} roles de Función`);
  console.log(`  • ${formas} roles de Forma`);
  console.log(`  • ${arquetipos} arquetipos base`);
  console.log(`  • ${estructuras * funciones * formas} combinaciones teóricas`);
  
  console.groupEnd();
}
