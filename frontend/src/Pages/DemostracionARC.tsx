/**
 * Página de Demostración Simplificada del Sistema ARC
 * Muestra ejemplos básicos del sistema con funciones disponibles
 */

import React, { useState } from 'react';
import { 
  debugNodo,
  resolveNodo,
  CATALOGO_ARC,
  COMPOSICIONES_ARC,
  type Nodo
} from '../constellacss/arc-system';
import '../constellacss/arc-implementation.css';

export function DemostracionARC() {
  const [debugMode, setDebugMode] = useState(false);

  // Función de demostración del sistema ARC
  const demostracionSistemaARC = () => {
    console.group('🎯 Sistema ARC - Demostración');
    console.log('Catálogo disponible:', Object.keys(CATALOGO_ARC));
    console.log('Composiciones disponibles:', Object.keys(COMPOSICIONES_ARC));
    
    // Ejemplo de nodo Hero
    const nodoHero: Nodo = {
      arquetipo: 'Hero',
      roles: {
        funcion: 'Hero:Presentacion',
        estructura: 'Estructura:Centrado',
        forma: 'Forma:HeroBrand'
      }
    };
    
    console.log('Ejemplo Hero:', nodoHero);
    debugNodo(nodoHero);
    console.groupEnd();
  };

  // Función para simular precedencia
  const simularPrecedencia = (nodo: Nodo) => {
    console.group('📊 Simulación de Precedencia');
    console.log('Nodo:', nodo);
    const resultado = resolveNodo(nodo);
    console.log('Resultado:', resultado);
    console.groupEnd();
    return resultado;
  };

  // Ejecutar demostración en consola
  React.useEffect(() => {
    demostracionSistemaARC();
  }, []);

  return (
    <div className={debugMode ? "arc-debug" : ""} style={{ position: 'relative' }}>
      
      {/* Control de Debug */}
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
          Debug ARC
        </label>
      </div>

      {/* SECCIÓN 1: HERO - Demostrando Precedencia Determinística */}
      <EspiralHero
        roles={{
          estructura: "Estructura:StackCentered",  // Prec. 1: Esqueleto
          funcion: "Hero:Presentacion",            // Prec. 2: Sistema nervioso  
          forma: "Forma:BrandPrimaryLg"            // Prec. 3: Piel (gana)
        }}
      >
        <EspiralTitulo
          roles={{
            estructura: "Estructura:Inline",
            funcion: "Titulo:Principal", 
            forma: "Forma:HeadingBrand"
          }}
        >
          Sistema ARC en Acción
        </EspiralTitulo>
        
        <p style={{ 
          color: 'rgba(255,255,255,0.9)', 
          fontSize: '1.25rem', 
          maxWidth: '600px',
          textAlign: 'center',
          lineHeight: '1.6'
        }}>
          <strong>Arquetipos, Roles y Composición</strong><br/>
          Demostración de precedencia determinística:<br/>
          <code>es (estructura) → fn (función) → fo (forma)</code>
        </p>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <EspiralCTA
            roles={{
              estructura: "Estructura:ButtonGroup",
              funcion: "CTA:Primaria",
              forma: "Forma:BotonBrand"
            }}
            onClick={() => debugNodoDetallado({
              arquetipo: "Hero",
              roles: {
                estructura: "Estructura:StackCentered",
                funcion: "Hero:Presentacion", 
                forma: "Forma:BrandPrimaryLg"
              }
            })}
          >
            🔍 Debug Hero
          </EspiralCTA>
          
          <EspiralCTA
            roles={{
              estructura: "Estructura:ButtonGroup",
              funcion: "CTA:Secundaria", 
              forma: "Forma:BotonSecundario"
            }}
            onClick={() => console.log('Precedencia:', simularPrecedencia({
              estructura: "Estructura:StackCentered",
              funcion: "Hero:Presentacion",
              forma: "Forma:BrandPrimaryLg"
            }, "Hero"))}
          >
            📊 Ver Precedencia
          </EspiralCTA>
        </div>
      </EspiralHero>

      {/* SECCIÓN 2: Demostración de Reutilización */}
      <section style={{ padding: '4rem 0', background: '#f8fafc' }}>
        <EspiralSeccion
          roles={{
            estructura: "Estructura:Container",
            funcion: "Seccion:Contenido",
            forma: "Forma:SeccionLimpia"
          }}
          style={{ background: 'transparent' }}
        >
          <EspiralTitulo
            roles={{
              estructura: "Estructura:Inline", // ← MISMA regla reutilizada
              funcion: "Titulo:Seccion",
              forma: "Forma:HeadingBrand"
            }}
            style={{ textAlign: 'center', marginBottom: '3rem', color: '#1a202c' }}
          >
            Principio: Una Regla, Múltiples Arquetipos
          </EspiralTitulo>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            
            {/* Ejemplo 1: Estructura:Container en Seccion */}
            <EspiralCard
              roles={{
                estructura: "Estructura:Container", // ← Reutilizada
                funcion: "Seccion:Contenido",
                forma: "Forma:CardProfessional"
              }}
            >
              <h3 style={{ color: '#2d3748', margin: '0 0 1rem 0' }}>
                Estructura:Container
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                La regla <code>Estructura:Container</code> define:
                <br/>• max-width: 1200px
                <br/>• margin: 0 auto  
                <br/>• padding lateral
              </p>
              <p style={{ color: '#2b6cb0', fontWeight: '600', marginTop: '1rem' }}>
                ✨ Reutilizada en: Seccion, Hero, Card
              </p>
            </EspiralCard>

            {/* Ejemplo 2: Forma:HeadingBrand en Titulo */}
            <EspiralCard
              roles={{
                estructura: "Estructura:Container", // ← MISMA regla
                funcion: "Seccion:Contenido", 
                forma: "Forma:CardProfessional"
              }}
            >
              <h3 style={{ color: '#2d3748', margin: '0 0 1rem 0' }}>
                Forma:HeadingBrand  
              </h3>
              <p style={{ color: '#4a5568', lineHeight: '1.6' }}>
                La regla <code>Forma:HeadingBrand</code> define:
                <br/>• Gradient text
                <br/>• Font display
                <br/>• Responsive sizing
              </p>
              <p style={{ color: '#2b6cb0', fontWeight: '600', marginTop: '1rem' }}>
                ✨ Reutilizada en: Titulo:Principal, Titulo:Seccion
              </p>
            </EspiralCard>
          </div>
          
          <div style={{ 
            background: '#e6fffa', 
            border: '2px solid #38b2ac',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center'
          }}>
            <h4 style={{ color: '#234e52', marginTop: '0' }}>
              🎯 Cardinalidad Estricta = Predictibilidad
            </h4>
            <p style={{ color: '#2c7a7b', margin: '0', fontSize: '1.1rem' }}>
              <strong>Un solo arquetipo por propiedad:</strong><br/>
              ❌ No: <code>fo="BotonRojo" fo="BotonAzul"</code><br/>
              ✅ Sí: <code>fo="BotonRojo"</code> (una elección clara)
            </p>
          </div>
        </EspiralSeccion>
      </section>

      {/* SECCIÓN 3: Composiciones Predefinidas vs. Libertad Creativa */}
      <section style={{ padding: '4rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <EspiralTitulo
            roles={{
              estructura: "Estructura:Inline",
              funcion: "Titulo:Seccion", 
              forma: "Forma:HeadingBrand"
            }}
            style={{ textAlign: 'center', marginBottom: '3rem', color: '#1a202c' }}
          >
            Estandarización + Libertad
          </EspiralTitulo>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '3rem'
          }}>
            
            {/* Estandarización */}
            <div>
              <h3 style={{ color: '#2b6cb0', marginBottom: '2rem' }}>
                🛤️ Las Vías del Tren (Estandarización)
              </h3>
              
              <EspiralComposicion composicion="HeroProfessional">
                <h4 style={{ color: 'white', margin: '0 0 1rem 0' }}>
                  Composición Predefinida
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0', fontSize: '0.95rem' }}>
                  <code>composicion="HeroProfessional"</code><br/>
                  ✅ Garantiza coherencia visual<br/>
                  ✅ Probado y optimizado<br/>
                  ✅ IA-friendly
                </p>
              </EspiralComposicion>
            </div>

            {/* Libertad */}
            <div>
              <h3 style={{ color: '#9f2b2b', marginBottom: '2rem' }}>
                🧱 Bloques de LEGO (Libertad)
              </h3>
              
              <EspiralCard
                roles={{
                  estructura: "Estructura:Container",  // Combino libremente
                  funcion: "Seccion:Destacada",       // diferentes arquetipos
                  forma: "Forma:CardProfessional"     // = nuevo resultado
                }}
                style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}
              >
                <h4 style={{ color: 'white', margin: '0 0 1rem 0' }}>
                  Composición Libre
                </h4>
                <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0', fontSize: '0.95rem' }}>
                  Combino manualmente:<br/>
                  • <code>es:Container</code><br/>
                  • <code>fn:Destacada</code><br/>
                  • <code>fo:Professional</code><br/>
                  = Infinitas posibilidades
                </p>
              </EspiralCard>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN 4: Fractalidad en Acción */}
      <section style={{ padding: '4rem 0', background: '#1a202c', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 2rem', textAlign: 'center' }}>
          <EspiralTitulo
            roles={{
              estructura: "Estructura:Inline",
              funcion: "Titulo:Seccion",
              forma: "Forma:HeadingBrand"
            }}
            style={{ color: 'white', marginBottom: '2rem' }}
          >
            Patrón Fractal: Contenido → Sección → Componente
          </EspiralTitulo>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h4 style={{ color: '#fbb6ce', marginTop: '0' }}>🌀 Estructura Infinitamente Repetible</h4>
            <div style={{ fontFamily: 'monospace', fontSize: '1.1rem', lineHeight: '1.8' }}>
              <div>📄 <strong>Contenido</strong> (página completa)</div>
              <div style={{ marginLeft: '20px' }}>
                ├─ 📦 <strong>Sección</strong> (hero)
                <div style={{ marginLeft: '20px' }}>
                  ├─ 🧩 <strong>Componente</strong> (título)
                  <br/>└─ 🧩 <strong>Componente</strong> (CTA)
                </div>
              </div>
              <div style={{ marginLeft: '20px' }}>
                └─ 📦 <strong>Sección</strong> (contenido)
                <div style={{ marginLeft: '20px' }}>
                  ├─ 🧩 <strong>Componente</strong> (card)
                  <br/>└─ 🧩 <strong>Componente</strong> (card)
                </div>
              </div>
            </div>
          </div>
          
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)' }}>
            Una IA aprende <strong>un solo patrón</strong> y puede construir cualquier interfaz,
            desde un widget hasta una aplicación completa.
          </p>
        </div>
      </section>

      {/* SECCIÓN 5: Métricas del Sistema */}
      <section style={{ padding: '4rem 0', background: '#f7fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
          <EspiralTitulo
            roles={{
              estructura: "Estructura:Inline",
              funcion: "Titulo:Seccion",
              forma: "Forma:HeadingBrand"
            }}
            style={{ textAlign: 'center', marginBottom: '3rem', color: '#1a202c' }}
          >
            Métricas del Sistema ARC
          </EspiralTitulo>

          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { 
                metric: getRolesPorDimension("Estructura").length.toString(), 
                label: 'Roles de Estructura', 
                icon: '🏗️',
                desc: 'Esqueletos reutilizables'
              },
              { 
                metric: getRolesPorDimension("Funcion").length.toString(), 
                label: 'Roles de Función', 
                icon: '⚡',
                desc: 'Comportamientos semánticos'
              },
              { 
                metric: getRolesPorDimension("Forma").length.toString(), 
                label: 'Roles de Forma', 
                icon: '🎨',
                desc: 'Pieles estéticas'
              },
              { 
                metric: '∞', 
                label: 'Combinaciones Posibles', 
                icon: '🔄',
                desc: 'Libertad creativa infinita'
              }
            ].map((item, index) => (
              <EspiralCard
                key={index}
                roles={{
                  estructura: "Estructura:Container",
                  funcion: "Seccion:Contenido",
                  forma: "Forma:CardProfessional"
                }}
                style={{ textAlign: 'center' }}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
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
                <div style={{ color: '#4a5568', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {item.label}
                </div>
                <div style={{ color: '#718096', fontSize: '0.9rem' }}>
                  {item.desc}
                </div>
              </EspiralCard>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default DemostracionARC;
