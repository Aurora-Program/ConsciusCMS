/**
 * EspiralML - Componentes con Sistema ARC
 * Arquetipos, Roles y Composición - Implementación pura
 */

import React from 'react';
import { 
  resolveNodo, 
  type ArquetipoID, 
  type AsignacionRoles, 
  type Nodo,
  COMPOSICIONES_ARC 
} from './arc-system';

// ========================================
// TIPOS PARA COMPONENTES ESPIRALML
// ========================================

interface EspiralBaseProps {
  arquetipo: ArquetipoID;
  roles?: AsignacionRoles;
  dato?: string;
  className?: string;
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

interface EspiralComposicionProps {
  composicion: keyof typeof COMPOSICIONES_ARC;
  dato?: string;
  className?: string;
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

// ========================================
// COMPONENTE BASE ESPIRALML CON ARC
// ========================================

function EspiralBase({ 
  arquetipo, 
  roles = {}, 
  dato, 
  className = "", 
  children, 
  as: Component = "div",
  ...props 
}: EspiralBaseProps & Record<string, any>) {
  
  const nodo: Nodo = { arquetipo, roles };
  const resultado = resolveNodo(nodo);
  
  const finalClassName = `${resultado.className} ${className}`.trim();
  
  // Combinar estilos del resolver con estilos adicionales
  const finalStyle = {
    ...resultado.style,
    ...props.style
  };

  return (
    <Component 
      className={finalClassName}
      style={finalStyle}
      data-arquetipo={arquetipo}
      data-roles={JSON.stringify(roles)}
      data-arc-system="active"
      {...props}
    >
      {children}
    </Component>
  );
}

// ========================================
// COMPONENTES ESPIRALML ESPECIALIZADOS
// ========================================

export function EspiralSeccion(props: EspiralBaseProps) {
  return <EspiralBase {...props} arquetipo="Seccion" as="section" />;
}

export function EspiralHero(props: Omit<EspiralBaseProps, 'arquetipo'>) {
  return <EspiralBase {...props} arquetipo="Hero" as="section" />;
}

export function EspiralTitulo(props: Omit<EspiralBaseProps, 'arquetipo'>) {
  const roles = props.roles || {};
  const nivel = roles.funcion?.includes('Principal') ? 1 : 2;
  const HeadingTag = `h${nivel}` as keyof JSX.IntrinsicElements;
  
  return <EspiralBase {...props} arquetipo="Titulo" as={HeadingTag} />;
}

export function EspiralCTA(props: Omit<EspiralBaseProps, 'arquetipo'>) {
  return <EspiralBase {...props} arquetipo="CTA" as="button" />;
}

export function EspiralCard(props: Omit<EspiralBaseProps, 'arquetipo'>) {
  return <EspiralBase {...props} arquetipo="Card" as="article" />;
}

export function EspiralBoton(props: Omit<EspiralBaseProps, 'arquetipo'>) {
  return <EspiralBase {...props} arquetipo="Boton" as="button" />;
}

// ========================================
// COMPONENTE DE COMPOSICIÓN ARC
// ========================================

export function EspiralComposicion({ 
  composicion, 
  dato, 
  className = "", 
  children, 
  as,
  ...props 
}: EspiralComposicionProps & Record<string, any>) {
  
  const config = COMPOSICIONES_ARC[composicion];
  if (!config) {
    throw new Error(`Composición ARC no encontrada: ${composicion}`);
  }
  
  return (
    <EspiralBase
      {...props}
      arquetipo={config.arquetipo}
      roles={config.roles}
      dato={dato}
      className={className}
      as={as}
    >
      {children}
    </EspiralBase>
  );
}

// ========================================
// HOOKS PARA TRABAJAR CON ARC
// ========================================

export function useEspiralResolver(arquetipo: ArquetipoID, roles: AsignacionRoles) {
  return React.useMemo(() => {
    const nodo: Nodo = { arquetipo, roles };
    return resolveNodo(nodo);
  }, [arquetipo, JSON.stringify(roles)]);
}

export function useRolesDisponibles(arquetipo: ArquetipoID) {
  return React.useMemo(() => {
    // Retorna roles disponibles para el arquetipo
    return {
      funcion: [`${arquetipo}:Presentacion`, `${arquetipo}:Secundario`],
      estructura: ['Estructura:StackCentered', 'Estructura:GridResponsive'],
      forma: ['Forma:BrandPrimaryLg', 'Forma:CardProfessional']
    };
  }, [arquetipo]);
}

// ========================================
// COMPONENTE DE EJEMPLO: PORTADA CON ARC
// ========================================

export function PortadaSeccion() {
  return (
    <EspiralHero
      roles={{
        funcion: "Hero:Presentacion",
        estructura: "Estructura:StackCentered", 
        forma: "Forma:BrandPrimaryLg"
      }}
    >
      <EspiralTitulo
        roles={{
          funcion: "Titulo:Principal",
          estructura: "Estructura:Inline",
          forma: "Forma:HeadingBrand"
        }}
      >
        Sistema ARC en Acción
      </EspiralTitulo>
      
      <EspiralTitulo
        roles={{
          funcion: "Titulo:Seccion", 
          estructura: "Estructura:Inline",
          forma: "Forma:HeadingBrand"
        }}
      >
        Arquetipos, Roles y Composición para estilos puros
      </EspiralTitulo>
      
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
        <EspiralCTA
          roles={{
            funcion: "CTA:Primaria",
            estructura: "Estructura:ButtonGroup", 
            forma: "Forma:BotonBrand"
          }}
        >
          Explorar ARC
        </EspiralCTA>
        
        <EspiralCTA
          roles={{
            funcion: "CTA:Secundaria",
            estructura: "Estructura:ButtonGroup",
            forma: "Forma:BotonSecundario"
          }}
        >
          Documentación
        </EspiralCTA>
      </div>
    </EspiralHero>
  );
}

// ========================================
// EJEMPLO CON COMPOSICIONES ARC
// ========================================

export function PortadaConComposiciones() {
  return (
    <EspiralComposicion composicion="HeroProfessional">
      <EspiralComposicion composicion="TituloPrincipal">
        Sistema ARC - Revolucionario
      </EspiralComposicion>
      
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: 'var(--space-xl)' }}>
        Arquetipos, Roles y Composición para el futuro del CSS
      </p>
      
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <EspiralComposicion composicion="CTAPrimaria">
          Empezar con ARC
        </EspiralComposicion>
        
        <EspiralCTA
          roles={{
            funcion: "CTA:Secundaria",
            estructura: "Estructura:ButtonGroup",
            forma: "Forma:BotonSecundario"
          }}
        >
          Ver Demo
        </EspiralCTA>
      </div>
    </EspiralComposicion>
  );
}
