/**
 * EspiralML - Componentes con Sistema RBAC-Style
 * Implementación pura de roles de estilos
 */

import React from 'react';
import { 
  resolveNodo, 
  type ArquetipoID, 
  type AsignacionRoles, 
  type Nodo,
  COMPOSICIONES_COMUNES 
} from './rbac-style-system';

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
  composicion: keyof typeof COMPOSICIONES_COMUNES;
  dato?: string;
  className?: string;
  children?: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
  style?: React.CSSProperties;
}

// ========================================
// COMPONENTE BASE ESPIRALML
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
// COMPONENTE DE COMPOSICIÓN RÁPIDA
// ========================================

export function EspiralComposicion({ 
  composicion, 
  dato, 
  className = "", 
  children, 
  as,
  ...props 
}: EspiralComposicionProps & Record<string, any>) {
  
  const config = COMPOSICIONES_COMUNES[composicion];
  if (!config) {
    throw new Error(`Composición no encontrada: ${composicion}`);
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
// HOOKS PARA TRABAJAR CON RBAC-STYLE
// ========================================

export function useEspiralResolver(arquetipo: ArquetipoID, roles: AsignacionRoles) {
  return React.useMemo(() => {
    const nodo: Nodo = { arquetipo, roles };
    return resolveNodo(nodo);
  }, [arquetipo, JSON.stringify(roles)]);
}

export function useRolesDisponibles(arquetipo: ArquetipoID) {
  return React.useMemo(() => {
    // Aquí podrías implementar lógica para obtener roles disponibles
    // por ahora retornamos algunos ejemplos
    return {
      funcion: [`${arquetipo}:Presentacion`, `${arquetipo}:Secundario`],
      estructura: ['Estructura:StackCentered', 'Estructura:GridResponsive'],
      forma: ['Forma:BrandPrimaryLg', 'Forma:CardProfessional']
    };
  }, [arquetipo]);
}

// ========================================
// COMPONENTE DE EJEMPLO: PORTADA COMPLETA
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
        Professional CMS Solutions
      </EspiralTitulo>
      
      <EspiralTitulo
        roles={{
          funcion: "Titulo:Seccion", 
          estructura: "Estructura:Inline",
          forma: "Forma:HeadingBrand"
        }}
      >
        Enterprise-grade content management for modern teams
      </EspiralTitulo>
      
      <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-xl)' }}>
        <EspiralCTA
          roles={{
            funcion: "CTA:Primaria",
            estructura: "Estructura:ButtonGroup", 
            forma: "Forma:BotonBrand"
          }}
        >
          Start Free Trial
        </EspiralCTA>
        
        <EspiralCTA
          roles={{
            funcion: "CTA:Secundaria",
            estructura: "Estructura:ButtonGroup",
            forma: "Forma:BotonSecundario"
          }}
        >
          Schedule Demo
        </EspiralCTA>
      </div>
    </EspiralHero>
  );
}

// ========================================
// EJEMPLO CON COMPOSICIONES PREDEFINIDAS
// ========================================

export function PortadaConComposiciones() {
  return (
    <EspiralComposicion composicion="HeroProfessional">
      <EspiralComposicion composicion="TituloPrincipal">
        Professional CMS Solutions
      </EspiralComposicion>
      
      <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem', marginBottom: 'var(--space-xl)' }}>
        Enterprise-grade content management for modern teams
      </p>
      
      <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
        <EspiralComposicion composicion="CTAPrimaria">
          Start Free Trial
        </EspiralComposicion>
        
        <EspiralCTA
          roles={{
            funcion: "CTA:Secundaria",
            estructura: "Estructura:ButtonGroup",
            forma: "Forma:BotonSecundario"
          }}
        >
          Schedule Demo
        </EspiralCTA>
      </div>
    </EspiralComposicion>
  );
}
