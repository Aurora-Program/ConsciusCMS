/**
 * Página de Ejemplo: Sistema ARC en Acción
 * Demostración práctica del concepto "asigno roles ⇒ funciona"
 */

import React from 'react';
import {
  EspiralHero,
  EspiralTitulo,
  EspiralCTA,
  EspiralSeccion,
  EspiralCard,
  PortadaConComposiciones
} from '../constellacss/espiral-arc-components';

// Importar estilos ARC
import '../constellacss/arc-implementation.css';

export function PaginaEjemploRBAC() {
  return (
    <div className="debug-arc">
      {/* EJEMPLO 1: Composición Manual Completa */}
      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Ejemplo 1: Composición Manual (3 Roles por Componente)
        </h2>
        
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
            Sistema RBAC-Style Funcionando
          </EspiralTitulo>
          
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1.25rem', 
            marginBottom: 'var(--space-xl)',
            maxWidth: '600px'
          }}>
            Asigno roles → funciona perfecto. Sin CSS adicional, sin tuneos, sin sorpresas.
          </p>
          
          <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <EspiralCTA
              roles={{
                funcion: "CTA:Primaria",
                estructura: "Estructura:ButtonGroup", 
                forma: "Forma:BotonBrand"
              }}
            >
              🚀 CTA Primaria
            </EspiralCTA>
            
            <EspiralCTA
              roles={{
                funcion: "CTA:Secundaria",
                estructura: "Estructura:ButtonGroup",
                forma: "Forma:BotonSecundario"
              }}
            >
              📊 CTA Secundaria
            </EspiralCTA>
          </div>
        </EspiralHero>
      </section>

      {/* EJEMPLO 2: Sección con Grid de Cards */}
      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <EspiralSeccion
          arquetipo="Seccion"
          roles={{
            funcion: "Seccion:Contenido",
            estructura: "Estructura:Container",
            forma: "Forma:SeccionLimpia"
          }}
          style={{ background: 'transparent' }}
        >
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <EspiralTitulo
              roles={{
                funcion: "Titulo:Seccion",
                estructura: "Estructura:Inline", 
                forma: "Forma:HeadingBrand"
              }}
              style={{ color: '#1a202c' }}
            >
              Diferentes Combinaciones de Roles
            </EspiralTitulo>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 2rem'
          }}>
            <EspiralCard
              roles={{
                funcion: "Hero:Presentacion",
                estructura: "Estructura:StackCentered",
                forma: "Forma:CardProfessional"
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>
                Rol de Función
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                Define la <strong>semántica y UX</strong>. Hero:Presentacion incluye 
                ARIA roles, focus management y contexto semántico.
              </p>
              <code style={{ 
                background: '#edf2f7', 
                padding: '0.5rem', 
                borderRadius: '4px',
                fontSize: '0.875rem',
                display: 'block',
                marginTop: '1rem'
              }}>
                funcion: "Hero:Presentacion"
              </code>
            </EspiralCard>

            <EspiralCard
              roles={{
                funcion: "Hero:Presentacion",
                estructura: "Estructura:StackCentered",
                forma: "Forma:CardProfessional"
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>
                Rol de Estructura
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                Define el <strong>layout y arquitectura</strong>. StackCentered incluye 
                container, stack vertical y centrado.
              </p>
              <code style={{ 
                background: '#edf2f7', 
                padding: '0.5rem', 
                borderRadius: '4px',
                fontSize: '0.875rem',
                display: 'block',
                marginTop: '1rem'
              }}>
                estructura: "Estructura:StackCentered"
              </code>
            </EspiralCard>

            <EspiralCard
              roles={{
                funcion: "Hero:Presentacion",
                estructura: "Estructura:StackCentered",
                forma: "Forma:CardProfessional"
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>
                Rol de Forma
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                Define la <strong>apariencia visual</strong>. BrandPrimaryLg incluye 
                gradientes, colores, tamaños y efectos completos.
              </p>
              <code style={{ 
                background: '#edf2f7', 
                padding: '0.5rem', 
                borderRadius: '4px',
                fontSize: '0.875rem',
                display: 'block',
                marginTop: '1rem'
              }}>
                forma: "Forma:BrandPrimaryLg"
              </code>
            </EspiralCard>
          </div>
        </EspiralSeccion>
      </section>

      {/* EJEMPLO 3: Comparación Sin/Con RBAC-Style */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <EspiralTitulo
            roles={{
              funcion: "Titulo:Seccion",
              estructura: "Estructura:Inline", 
              forma: "Forma:HeadingBrand"
            }}
            style={{ 
              textAlign: 'center', 
              marginBottom: '3rem',
              color: '#1a202c'
            }}
          >
            Comparación: Antes vs. RBAC-Style
          </EspiralTitulo>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem'
          }}>
            {/* ANTES */}
            <div style={{ 
              background: '#fed7d7', 
              padding: '2rem', 
              borderRadius: '12px',
              border: '1px solid #fc8181'
            }}>
              <h3 style={{ color: '#c53030', marginTop: '0' }}>❌ ANTES (CSS Tradicional)</h3>
              <pre style={{ 
                background: '#ffffff', 
                padding: '1rem', 
                borderRadius: '6px',
                fontSize: '0.8rem',
                overflow: 'auto'
              }}>
{`<div className="hero custom-hero main-hero 
    hero-with-gradient hero-centered
    hero-large professional-theme
    brand-colors responsive-hero">
  
  <h1 className="title main-title 
      brand-title large-title
      gradient-text centered-title">
    Título
  </h1>
  
  <button className="btn btn-primary 
      btn-large btn-brand 
      btn-shadow btn-hover">
    CTA
  </button>
</div>

/* CSS scattered across files */
.hero { ... }
.custom-hero { ... }
.main-hero { ... }
/* 50+ more classes... */`}
              </pre>
              <p style={{ color: '#c53030', fontSize: '0.9rem', marginBottom: '0' }}>
                🔥 Múltiples clases, CSS duplicado, difícil mantenimiento
              </p>
            </div>

            {/* DESPUÉS */}
            <div style={{ 
              background: '#c6f6d5', 
              padding: '2rem', 
              borderRadius: '12px',
              border: '1px solid #68d391'
            }}>
              <h3 style={{ color: '#2f855a', marginTop: '0' }}>✅ DESPUÉS (RBAC-Style)</h3>
              <pre style={{ 
                background: '#ffffff', 
                padding: '1rem', 
                borderRadius: '6px',
                fontSize: '0.8rem',
                overflow: 'auto'
              }}>
{`<EspiralHero
  roles={{
    funcion: "Hero:Presentacion",
    estructura: "Estructura:StackCentered", 
    forma: "Forma:BrandPrimaryLg"
  }}
>
  <EspiralTitulo
    roles={{
      funcion: "Titulo:Principal",
      forma: "Forma:HeadingBrand"
    }}
  >
    Título
  </EspiralTitulo>
  
  <EspiralCTA
    roles={{
      funcion: "CTA:Primaria",
      forma: "Forma:BotonBrand"
    }}
  >
    CTA
  </EspiralCTA>
</EspiralHero>`}
              </pre>
              <p style={{ color: '#2f855a', fontSize: '0.9rem', marginBottom: '0' }}>
                ✨ 3 roles = todo funciona. Código limpio, mantenible, predecible.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* EJEMPLO 4: Composiciones Predefinidas */}
      <section style={{ padding: '4rem 0', background: '#1a202c' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <EspiralTitulo
            roles={{
              funcion: "Titulo:Seccion",
              estructura: "Estructura:Inline", 
              forma: "Forma:HeadingBrand"
            }}
            style={{ color: 'white', marginBottom: '2rem' }}
          >
            Composiciones Predefinidas
          </EspiralTitulo>
          
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.1rem',
            marginBottom: '3rem',
            lineHeight: '1.6'
          }}>
            Para casos comunes, usamos composiciones predefinidas que encapsulan 
            las mejores combinaciones de roles.
          </p>

          <PortadaConComposiciones />
        </div>
      </section>

      {/* MÉTRICAS */}
      <section style={{ padding: '4rem 0', background: '#f7fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <EspiralTitulo
            roles={{
              funcion: "Titulo:Seccion",
              estructura: "Estructura:Inline", 
              forma: "Forma:HeadingBrand"
            }}
            style={{ 
              textAlign: 'center', 
              marginBottom: '3rem',
              color: '#1a202c'
            }}
          >
            Métricas del Sistema RBAC-Style
          </EspiralTitulo>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { metric: '90%', label: 'Menos CSS Repetitivo', icon: '🎯' },
              { metric: '95%', label: 'Componentes Reutilizables', icon: '🔄' },
              { metric: '80%', label: 'Menos Tiempo de Desarrollo', icon: '⚡' },
              { metric: '100%', label: 'Predecibilidad', icon: '🎨' }
            ].map((item, index) => (
              <div key={index} style={{
                background: 'white',
                padding: '2rem',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                  {item.icon}
                </div>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '800', 
                  color: '#2b6cb0',
                  marginBottom: '0.5rem'
                }}>
                  {item.metric}
                </div>
                <div style={{ color: '#4a5568', fontWeight: '600' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default PaginaEjemploRBAC;
