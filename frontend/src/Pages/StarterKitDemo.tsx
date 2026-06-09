/**
 * EspiralML React Component
 * Renderiza nodos usando el sistema EspiralML + ConstellaCSS
 */

import React from 'react';
import { 
  resolverNodo, 
  type Nodo, 
  type Registries, 
  type Theme, 
  type ResolucionNodo,
  REGISTRIES_BASE,
  TEMA_BASE,
  EJEMPLO_HERO
} from './espiral-starter';

// ========================================
// COMPONENTE REACT PARA RENDERIZAR NODOS
// ========================================

interface EspiralNodeProps {
  nodo: Nodo;
  registries?: Registries;
  theme?: Theme;
  state?: any;
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

export function EspiralNode({ 
  nodo, 
  registries = REGISTRIES_BASE,
  theme = TEMA_BASE,
  state,
  as: Component = 'div',
  children 
}: EspiralNodeProps) {
  
  // Resolver el nodo usando el sistema EspiralML
  const resolucion = resolverNodo(nodo, registries, theme, state);
  
  // Convertir tokens a CSS custom properties
  const style: React.CSSProperties = {};
  Object.entries(resolucion.tokens).forEach(([key, value]) => {
    if (key.startsWith('--')) {
      (style as any)[key] = value;
    }
  });

  return (
    <Component
      className={resolucion.className}
      style={style}
      {...resolucion.props}
    >
      {/* Renderizar hijos recursivamente */}
      {resolucion.hijos.map((hijo, index) => (
        <EspiralNodeRecursivo 
          key={index} 
          resolucion={hijo}
          registries={registries}
          theme={theme}
          state={state}
        />
      ))}
      
      {/* Children manuales tienen prioridad */}
      {children}
    </Component>
  );
}

// Componente interno para renderizar hijos resueltos
function EspiralNodeRecursivo({ 
  resolucion, 
  registries, 
  theme, 
  state 
}: {
  resolucion: ResolucionNodo;
  registries: Registries;
  theme: Theme; 
  state?: any;
}) {
  const style: React.CSSProperties = {};
  Object.entries(resolucion.tokens).forEach(([key, value]) => {
    if (key.startsWith('--')) {
      (style as any)[key] = value;
    }
  });

  return (
    <div
      className={resolucion.className}
      style={style}
      {...resolucion.props}
    >
      {resolucion.hijos.map((hijo, index) => (
        <EspiralNodeRecursivo
          key={index}
          resolucion={hijo}
          registries={registries}
          theme={theme}
          state={state}
        />
      ))}
    </div>
  );
}

// ========================================
// COMPONENTES ESPECÍFICOS DE ALTO NIVEL
// ========================================

export function EspiralHero({ state, children, ...props }: { 
  state?: any; 
  children?: React.ReactNode;
  className?: string;
}) {
  const heroNodo: Nodo = {
    es: "es:Stack/Centered",
    fn: "fn:Hero/Presentation",
    fo: "fo:Hero/Brand",
    tokens: {
      "--min-height": "60vh",
      "--text-align": "center"
    }
  };

  return (
    <EspiralNode 
      nodo={heroNodo} 
      state={state} 
      as="section"
      {...props}
    >
      {children}
    </EspiralNode>
  );
}

export function EspiralButton({ 
  variant = "primary", 
  onClick, 
  children, 
  ...props 
}: {
  variant?: "primary" | "secondary";
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const buttonNodo: Nodo = {
    es: "es:Inline/Flow",
    fn: "fn:CTA/Primary",
    fo: variant === "primary" ? "fo:Button/Primary" : "fo:Button/Secondary",
    tokens: {
      "--cursor": "pointer"
    }
  };

  return (
    <EspiralNode 
      nodo={buttonNodo} 
      as="button"
      {...props}
    >
      <span onClick={onClick}>{children}</span>
    </EspiralNode>
  );
}

export function EspiralCard({ 
  elevated = false, 
  children, 
  ...props 
}: {
  elevated?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const cardNodo: Nodo = {
    es: "es:Container/Wide",
    fn: "fn:Content/Section", 
    fo: elevated ? "fo:Card/Elevated" : "fo:Card/Flat"
  };

  return (
    <EspiralNode 
      nodo={cardNodo} 
      as="article"
      {...props}
    >
      {children}
    </EspiralNode>
  );
}

export function EspiralGrid({ children, ...props }: {
  children: React.ReactNode;
  className?: string;
}) {
  const gridNodo: Nodo = {
    es: "es:Grid/Responsive",
    fn: "fn:Content/Section",
    fo: "fo:Card/Flat",
    tokens: {
      "--grid-cols": "repeat(auto-fit, minmax(300px, 1fr))"
    }
  };

  return (
    <EspiralNode 
      nodo={gridNodo}
      {...props}
    >
      {children}
    </EspiralNode>
  );
}

// ========================================
// PÁGINA DE DEMOSTRACIÓN DEL STARTER KIT
// ========================================

export function StarterKitDemo() {
  const [debugMode, setDebugMode] = React.useState(false);
  
  const exampleState = {
    hero: {
      title: "EspiralML + ConstellaCSS",
      subtitle: "Sistema de diseño fractal y composable",
      ctaText: "Explorar Sistema"
    },
    features: [
      {
        title: "Fractalidad",
        description: "Contenido → Sección → Componente infinitamente repetible",
        icon: "🌀"
      },
      {
        title: "Composición Pura", 
        description: "es + fn + fo = Componente determinista",
        icon: "🧩"
      },
      {
        title: "Precedencia Clara",
        description: "theme < es < fn < fo < nodo (siempre predecible)",
        icon: "🎯"
      }
    ]
  };

  return (
    <div className={debugMode ? "debug-mode" : ""}>
      
      {/* Debug Toggle */}
      <div style={{ 
        position: 'fixed', 
        top: '20px', 
        right: '20px', 
        zIndex: 1000,
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '10px',
        borderRadius: '8px'
      }}>
        <label>
          <input 
            type="checkbox" 
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
          />
          Debug EspiralML
        </label>
      </div>

      {/* Hero usando sistema completo */}
      <EspiralHero state={exampleState}>
        <h1 style={{ 
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: '700',
          marginBottom: '1rem',
          color: 'white'
        }}>
          {exampleState.hero.title}
        </h1>
        
        <p style={{
          fontSize: '1.25rem',
          marginBottom: '2rem',
          color: 'rgba(255,255,255,0.9)',
          maxWidth: '600px'
        }}>
          {exampleState.hero.subtitle}
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <EspiralButton 
            variant="primary"
            onClick={() => console.log('CTA Primary clicked')}
          >
            {exampleState.hero.ctaText}
          </EspiralButton>
          
          <EspiralButton 
            variant="secondary"
            onClick={() => console.log('CTA Secondary clicked')}
          >
            Ver Documentación
          </EspiralButton>
        </div>
      </EspiralHero>

      {/* Grid de features usando nodos puros */}
      <section style={{ padding: '4rem 2rem', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '3rem',
            color: '#1a202c'
          }}>
            Principios del Sistema
          </h2>

          <EspiralGrid>
            {exampleState.features.map((feature, index) => (
              <EspiralCard key={index} elevated={true}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.5rem',
                    fontWeight: '600', 
                    marginBottom: '1rem',
                    color: '#2d3748'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    color: '#4a5568',
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </div>
              </EspiralCard>
            ))}
          </EspiralGrid>
        </div>
      </section>

      {/* Demostración de precedencia */}
      <section style={{ padding: '4rem 2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          <h2 style={{ 
            textAlign: 'center',
            fontSize: '2.5rem', 
            fontWeight: '700',
            marginBottom: '2rem',
            color: '#1a202c'
          }}>
            Precedencia Determinística
          </h2>
          
          <EspiralCard>
            <div style={{ fontFamily: 'Monaco, monospace', fontSize: '1.1rem' }}>
              <div style={{ marginBottom: '1rem', color: '#2d3748' }}>
                <strong>Orden de aplicación de tokens:</strong>
              </div>
              
              <div style={{ lineHeight: '1.8', color: '#4a5568' }}>
                <div>1. <span style={{ color: '#9ca3af' }}>theme.tokens</span> (base global)</div>
                <div>2. <span style={{ color: '#6b7280' }}>es.grupos.tokens</span> (estructura)</div>
                <div>3. <span style={{ color: '#6b7280' }}>es.tokens</span> (arquetipo estructura)</div>
                <div>4. <span style={{ color: '#4b5563' }}>fn.grupos.tokens</span> (función)</div>
                <div>5. <span style={{ color: '#4b5563' }}>fn.tokens</span> (arquetipo función)</div>
                <div>6. <span style={{ color: '#374151' }}>fo.grupos.tokens</span> (forma)</div>
                <div>7. <span style={{ color: '#374151' }}>fo.tokens</span> (arquetipo forma)</div>
                <div>8. <span style={{ color: '#1f2937', fontWeight: 'bold' }}>nodo.tokens</span> (override local)</div>
              </div>
              
              <div style={{ marginTop: '2rem', padding: '1rem', background: '#f3f4f6', borderRadius: '0.5rem' }}>
                <strong>Resultado:</strong> Los tokens posteriores sobrescriben a los anteriores,
                garantizando precedencia predecible y capacidad de override granular.
              </div>
            </div>
          </EspiralCard>
        </div>
      </section>

      {/* Ejemplo de nodo raw usando EJEMPLO_HERO */}
      <section style={{ padding: '4rem 2rem', background: '#1a202c' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          
          <h2 style={{ 
            fontSize: '2.5rem',
            fontWeight: '700', 
            marginBottom: '2rem',
            color: 'white'
          }}>
            Ejemplo de Nodo Puro
          </h2>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '0.5rem',
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <pre style={{ 
              color: '#d1d5db',
              fontSize: '0.9rem',
              lineHeight: '1.6',
              margin: 0,
              whiteSpace: 'pre-wrap'
            }}>
{`const NODO_EJEMPLO = {
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
      fo: "fo:Text/Heading"
    },
    {
      es: "es:Inline/Flow",
      fn: "fn:CTA/Primary", 
      fo: "fo:Button/Primary"
    }
  ]
};`}
            </pre>
          </div>

          <EspiralButton 
            onClick={() => {
              console.log('Nodo ejemplo:', EJEMPLO_HERO);
              console.log('Registries:', REGISTRIES_BASE);
            }}
          >
            Ver en Consola
          </EspiralButton>
        </div>
      </section>
    </div>
  );
}

export default StarterKitDemo;
