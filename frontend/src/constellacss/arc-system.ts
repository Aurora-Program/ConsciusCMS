/**
 * Sistema ARC (Arquetipos, Roles y Composición) para ConstellaCSS
 * Implementación de arquitectura pura basada en funciones determinísticas
 * 
 * Inspirado en el modelo RBAC (Role-Based Access Control) aplicado a CSS
 * donde cada elemento tiene un arquetipo base y roles asignados
 */

// ========================================
// TIPOS BASE DEL SISTEMA ARC
// ========================================

export type ArquetipoID = 
  | 'Hero' 
  | 'Titulo' 
  | 'Seccion' 
  | 'CTA' 
  | 'Card' 
  | 'Boton' 
  | 'Texto' 
  | 'Lista' 
  | 'Imagen' 
  | 'Link';

export interface Rol {
  tipo: 'Funcion' | 'Estructura' | 'Forma';
  nombre: string;
  descripcion?: string;
  propiedades: Record<string, string>;
}

export interface AsignacionRoles {
  funcion?: string;    // Qué hace semánticamente
  estructura?: string; // Cómo se estructura visualmente
  forma?: string;      // Cómo se ve estéticamente
}

export interface Nodo {
  arquetipo: ArquetipoID;
  roles: AsignacionRoles;
}

export interface ResultadoResolver {
  className: string;
  style: Record<string, string>;
  metadata: {
    arquetipo: ArquetipoID;
    roles: AsignacionRoles;
    timestamp: number;
  };
}

// ========================================
// CATÁLOGO ARC - DEFINICIÓN DE TODOS LOS ROLES
// ========================================

export const CATALOGO_ARC = {
  // Roles de Función (Semántica)
  funcion: {
    // Para arquetipo Hero
    'Hero:Presentacion': {
      tipo: 'Funcion' as const,
      nombre: 'Hero:Presentacion',
      descripcion: 'Función de presentación principal',
      propiedades: { 'data-fn': 'hero-presentacion' }
    },
    'Hero:Secundario': {
      tipo: 'Funcion' as const,
      nombre: 'Hero:Secundario', 
      descripcion: 'Función de héroe secundario',
      propiedades: { 'data-fn': 'hero-secundario' }
    },
    
    // Para arquetipo Titulo
    'Titulo:Principal': {
      tipo: 'Funcion' as const,
      nombre: 'Titulo:Principal',
      descripcion: 'Título principal de la página',
      propiedades: { 'data-fn': 'titulo-principal' }
    },
    'Titulo:Seccion': {
      tipo: 'Funcion' as const,
      nombre: 'Titulo:Seccion',
      descripcion: 'Título de sección',
      propiedades: { 'data-fn': 'titulo-seccion' }
    },
    
    // Para arquetipo CTA
    'CTA:Primaria': {
      tipo: 'Funcion' as const,
      nombre: 'CTA:Primaria',
      descripcion: 'Llamada a acción principal',
      propiedades: { 'data-fn': 'cta-primaria' }
    },
    'CTA:Secundaria': {
      tipo: 'Funcion' as const,
      nombre: 'CTA:Secundaria',
      descripcion: 'Llamada a acción secundaria',
      propiedades: { 'data-fn': 'cta-secundaria' }
    },
    
    // Para arquetipo Seccion (agregado para evitar error)
    'Seccion:Contenido': {
      tipo: 'Funcion' as const,
      nombre: 'Seccion:Contenido',
      descripcion: 'Sección de contenido principal',
      propiedades: { 'data-fn': 'seccion-contenido' }
    },
    'Seccion:Apoyo': {
      tipo: 'Funcion' as const,
      nombre: 'Seccion:Apoyo',
      descripcion: 'Sección de apoyo o secundaria',
      propiedades: { 'data-fn': 'seccion-apoyo' }
    }
  },

  // Roles de Estructura (Layout)
  estructura: {
    'Estructura:StackCentered': {
      tipo: 'Estructura' as const,
      nombre: 'Estructura:StackCentered',
      descripcion: 'Stack vertical centrado',
      propiedades: { 'data-es': 'stack-centered' }
    },
    'Estructura:GridResponsive': {
      tipo: 'Estructura' as const,
      nombre: 'Estructura:GridResponsive',
      descripcion: 'Grid responsivo',
      propiedades: { 'data-es': 'grid-responsive' }
    },
    'Estructura:FlexRow': {
      tipo: 'Estructura' as const,
      nombre: 'Estructura:FlexRow',
      descripcion: 'Flex horizontal',
      propiedades: { 'data-es': 'flex-row' }
    },
    'Estructura:Container': {
      tipo: 'Estructura' as const,
      nombre: 'Estructura:Container',
      descripcion: 'Contenedor con padding',
      propiedades: { 'data-es': 'container' }
    },
    'Estructura:ButtonGroup': {
      tipo: 'Estructura' as const,
      nombre: 'Estructura:ButtonGroup',
      descripcion: 'Grupo de botones',
      propiedades: { 'data-es': 'button-group' }
    },
    'Estructura:Inline': {
      tipo: 'Estructura' as const,
      nombre: 'Estructura:Inline',
      descripcion: 'Elemento en línea',
      propiedades: { 'data-es': 'inline' }
    }
  },

  // Roles de Forma (Visual/Estética)
  forma: {
    'Forma:BrandPrimaryLg': {
      tipo: 'Forma' as const,
      nombre: 'Forma:BrandPrimaryLg',
      descripcion: 'Estilo de marca primario grande',
      propiedades: { 'data-fo': 'brand-primary-lg' }
    },
    'Forma:CardProfessional': {
      tipo: 'Forma' as const,
      nombre: 'Forma:CardProfessional',
      descripcion: 'Tarjeta estilo profesional',
      propiedades: { 'data-fo': 'card-professional' }
    },
    'Forma:HeadingBrand': {
      tipo: 'Forma' as const,
      nombre: 'Forma:HeadingBrand',
      descripcion: 'Heading con estilo de marca',
      propiedades: { 'data-fo': 'heading-brand' }
    },
    'Forma:BotonBrand': {
      tipo: 'Forma' as const,
      nombre: 'Forma:BotonBrand',
      descripcion: 'Botón con estilo de marca',
      propiedades: { 'data-fo': 'boton-brand' }
    },
    'Forma:BotonSecundario': {
      tipo: 'Forma' as const,
      nombre: 'Forma:BotonSecundario',
      descripcion: 'Botón secundario transparente',
      propiedades: { 'data-fo': 'boton-secundario' }
    },
    'Forma:SeccionLimpia': {
      tipo: 'Forma' as const,
      nombre: 'Forma:SeccionLimpia',
      descripcion: 'Sección con estilo limpio',
      propiedades: { 'data-fo': 'seccion-limpia' }
    }
  }
};

// ========================================
// COMPATIBILIDAD ARQUETIPO-ROL
// ========================================

const COMPATIBILIDAD_ARC: Record<ArquetipoID, {
  funciones: string[];
  estructuras: string[];
  formas: string[];
}> = {
  Hero: {
    funciones: ['Hero:Presentacion', 'Hero:Secundario'],
    estructuras: ['Estructura:StackCentered', 'Estructura:GridResponsive', 'Estructura:Container'],
    formas: ['Forma:BrandPrimaryLg', 'Forma:CardProfessional']
  },
  Titulo: {
    funciones: ['Titulo:Principal', 'Titulo:Seccion'],
    estructuras: ['Estructura:Inline', 'Estructura:Container'],
    formas: ['Forma:HeadingBrand', 'Forma:BrandPrimaryLg']
  },
  CTA: {
    funciones: ['CTA:Primaria', 'CTA:Secundaria'],
    estructuras: ['Estructura:ButtonGroup', 'Estructura:Inline'],
    formas: ['Forma:BotonBrand', 'Forma:BotonSecundario']
  },
  Seccion: {
    funciones: ['Seccion:Contenido', 'Seccion:Apoyo'],
    estructuras: ['Estructura:Container', 'Estructura:StackCentered', 'Estructura:GridResponsive'],
    formas: ['Forma:SeccionLimpia', 'Forma:CardProfessional']
  },
  Card: {
    funciones: ['Seccion:Contenido', 'Seccion:Apoyo'],
    estructuras: ['Estructura:Container', 'Estructura:StackCentered'],
    formas: ['Forma:CardProfessional', 'Forma:SeccionLimpia']
  },
  Boton: {
    funciones: ['CTA:Primaria', 'CTA:Secundaria'],
    estructuras: ['Estructura:ButtonGroup', 'Estructura:Inline'],
    formas: ['Forma:BotonBrand', 'Forma:BotonSecundario']
  },
  Texto: {
    funciones: ['Titulo:Seccion'],
    estructuras: ['Estructura:Inline', 'Estructura:Container'],
    formas: ['Forma:HeadingBrand']
  },
  Lista: {
    funciones: ['Seccion:Contenido'],
    estructuras: ['Estructura:StackCentered', 'Estructura:Container'],
    formas: ['Forma:SeccionLimpia']
  },
  Imagen: {
    funciones: ['Hero:Presentacion', 'Seccion:Apoyo'],
    estructuras: ['Estructura:Container', 'Estructura:Inline'],
    formas: ['Forma:BrandPrimaryLg', 'Forma:CardProfessional']
  },
  Link: {
    funciones: ['CTA:Secundaria'],
    estructuras: ['Estructura:Inline'],
    formas: ['Forma:BotonSecundario']
  }
};

// ========================================
// FUNCIONES PURAS DEL RESOLVER ARC
// ========================================

function validarCompatibilidad(arquetipo: ArquetipoID, roles: AsignacionRoles): void {
  const compatibles = COMPATIBILIDAD_ARC[arquetipo];
  
  if (roles.funcion && !compatibles.funciones.includes(roles.funcion)) {
    throw new Error(`Rol ${roles.funcion} no aplica a arquetipo ${arquetipo}. Roles válidos: ${compatibles.funciones.join(', ')}`);
  }
  
  if (roles.estructura && !compatibles.estructuras.includes(roles.estructura)) {
    throw new Error(`Rol ${roles.estructura} no aplica a arquetipo ${arquetipo}. Roles válidos: ${compatibles.estructuras.join(', ')}`);
  }
  
  if (roles.forma && !compatibles.formas.includes(roles.forma)) {
    throw new Error(`Rol ${roles.forma} no aplica a arquetipo ${arquetipo}. Roles válidos: ${compatibles.formas.join(', ')}`);
  }
}

function generarClassName(arquetipo: ArquetipoID, roles: AsignacionRoles): string {
  const clases: string[] = [`arc-${arquetipo.toLowerCase()}`];
  
  if (roles.funcion) {
    const funcionKey = roles.funcion.replace(':', '_').toLowerCase();
    clases.push(`fn--${funcionKey}`);
  }
  
  if (roles.estructura) {
    const estructuraKey = roles.estructura.replace(':', '_').toLowerCase();
    clases.push(`es--${estructuraKey}`);
  }
  
  if (roles.forma) {
    const formaKey = roles.forma.replace(':', '_').toLowerCase();
    clases.push(`fo--${formaKey}`);
  }
  
  return clases.join(' ');
}

function generarEstilosInline(roles: AsignacionRoles): Record<string, string> {
  const estilos: Record<string, string> = {};
  
  // Aplicar propiedades de los roles como CSS custom properties
  Object.values(roles).forEach(rolNombre => {
    if (!rolNombre) return;
    
    // Buscar el rol en el catálogo
    const rol = Object.values(CATALOGO_ARC.funcion)
      .concat(Object.values(CATALOGO_ARC.estructura))
      .concat(Object.values(CATALOGO_ARC.forma))
      .find(r => r.nombre === rolNombre);
      
    if (rol) {
      Object.entries(rol.propiedades).forEach(([prop, valor]) => {
        estilos[`--arc-${prop}`] = valor;
      });
    }
  });
  
  return estilos;
}

// ========================================
// RESOLVER PRINCIPAL - FUNCIÓN PURA
// ========================================

export function resolveNodo(nodo: Nodo): ResultadoResolver {
  // Validación de compatibilidad
  validarCompatibilidad(nodo.arquetipo, nodo.roles);
  
  // Generación determinística de clases
  const className = generarClassName(nodo.arquetipo, nodo.roles);
  
  // Generación de estilos inline
  const style = generarEstilosInline(nodo.roles);
  
  return {
    className,
    style,
    metadata: {
      arquetipo: nodo.arquetipo,
      roles: nodo.roles,
      timestamp: Date.now()
    }
  };
}

// ========================================
// COMPOSICIONES ARC PREDEFINIDAS
// ========================================

export const COMPOSICIONES_ARC = {
  HeroProfessional: {
    arquetipo: 'Hero' as ArquetipoID,
    roles: {
      funcion: 'Hero:Presentacion',
      estructura: 'Estructura:StackCentered',
      forma: 'Forma:BrandPrimaryLg'
    }
  },
  TituloPrincipal: {
    arquetipo: 'Titulo' as ArquetipoID,
    roles: {
      funcion: 'Titulo:Principal',
      estructura: 'Estructura:Inline',
      forma: 'Forma:HeadingBrand'
    }
  },
  CTAPrimaria: {
    arquetipo: 'CTA' as ArquetipoID,
    roles: {
      funcion: 'CTA:Primaria',
      estructura: 'Estructura:ButtonGroup',
      forma: 'Forma:BotonBrand'
    }
  },
  SeccionContenido: {
    arquetipo: 'Seccion' as ArquetipoID,
    roles: {
      funcion: 'Seccion:Contenido',
      estructura: 'Estructura:Container',
      forma: 'Forma:SeccionLimpia'
    }
  }
} as const;

// ========================================
// UTILIDADES PARA DESARROLLO
// ========================================

export function debugNodo(nodo: Nodo): void {
  console.group(`🔍 ARC Debug: ${nodo.arquetipo}`);
  console.log('Roles asignados:', nodo.roles);
  
  try {
    const resultado = resolveNodo(nodo);
    console.log('✅ Resolución exitosa:');
    console.log('  - className:', resultado.className);
    console.log('  - style:', resultado.style);
  } catch (error) {
    console.error('❌ Error en resolución:', error);
  }
  
  console.groupEnd();
}

export function listarRolesCompatibles(arquetipo: ArquetipoID) {
  return COMPATIBILIDAD_ARC[arquetipo];
}
