/**
 * Página de Demostración Simple del Sistema ARC
 * Muestra ejemplos básicos del sistema usando HTML nativo
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
        estructura: 'Estructura:StackCentered',
        forma: 'Forma:BrandPrimaryLg'
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

  // Ejemplos de nodos para demostración
  const ejemploHero: Nodo = {
    arquetipo: 'Hero',
    roles: {
      funcion: 'Hero:Presentacion',
      estructura: 'Estructura:StackCentered',
      forma: 'Forma:BrandPrimaryLg'
    }
  };

  const ejemploCard: Nodo = {
    arquetipo: 'Card',
    roles: {
      funcion: 'Seccion:Contenido',
      estructura: 'Estructura:Container',
      forma: 'Forma:CardProfessional'
    }
  };

  const ejemploCTA: Nodo = {
    arquetipo: 'CTA',
    roles: {
      funcion: 'CTA:Primaria',
      estructura: 'Estructura:Inline',
      forma: 'Forma:BotonBrand'
    }
  };

  // Función para renderizar un nodo con el sistema ARC
  const renderNodoARC = (nodo: Nodo, children?: React.ReactNode) => {
    const resultado = resolveNodo(nodo);
    return (
      <div 
        className={resultado.className} 
        style={resultado.style}
        data-arquetipo={nodo.arquetipo}
        data-debug={debugMode ? JSON.stringify(nodo.roles) : undefined}
      >
        {children}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Control de Debug */}
      <div className="fixed top-4 right-4 z-50 bg-white shadow-lg rounded-lg p-4">
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={debugMode}
            onChange={(e) => setDebugMode(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm font-medium">Debug Mode</span>
        </label>
        <div className="mt-2 text-xs text-gray-600">
          Muestra data-attributes en elementos
        </div>
      </div>

      {/* Hero usando sistema ARC */}
      {renderNodoARC(ejemploHero, 
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sistema ARC
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Arquetipos, Roles y Composición para ConstellaCSS
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            {renderNodoARC(ejemploCTA,
              <button 
                className="px-6 py-3 text-white font-semibold rounded-lg"
                onClick={() => {
                  console.log('Debug Hero:', ejemploHero);
                  debugNodo(ejemploHero);
                }}
              >
                Debug Hero
              </button>
            )}
            {renderNodoARC({...ejemploCTA, roles: {...ejemploCTA.roles, forma: 'Forma:BotonSecundario'}},
              <button 
                className="px-6 py-3 text-white font-semibold rounded-lg border-2 border-white"
                onClick={() => simularPrecedencia(ejemploHero)}
              >
                Simular Precedencia
              </button>
            )}
          </div>
        </div>
      )}

      {/* Sección de Ejemplos */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ejemplos del Sistema
          </h2>
          <p className="text-lg text-gray-600">
            Cada elemento usa el patrón Arquetipo + Roles (Función + Estructura + Forma)
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Card Ejemplo 1 */}
          {renderNodoARC(ejemploCard,
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Fractalidad
              </h3>
              <p className="text-gray-600 mb-4">
                Los nodos se pueden componer infinitamente: Contenido → Sección → Componente
              </p>
              <div className="text-sm text-gray-500">
                <div><strong>Arquetipo:</strong> Card</div>
                <div><strong>Función:</strong> Contenido</div>
                <div><strong>Estructura:</strong> Container</div>
                <div><strong>Forma:</strong> CardProfessional</div>
              </div>
            </div>
          )}

          {/* Card Ejemplo 2 */}
          {renderNodoARC({...ejemploCard, roles: {...ejemploCard.roles, forma: 'Forma:SeccionLimpia'}},
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Precedencia
              </h3>
              <p className="text-gray-600 mb-4">
                Los roles se aplican en orden determinístico para garantizar consistencia
              </p>
              <div className="text-sm text-gray-500">
                <div><strong>Arquetipo:</strong> Card</div>
                <div><strong>Función:</strong> Contenido</div>
                <div><strong>Estructura:</strong> Container</div>
                <div><strong>Forma:</strong> SeccionLimpia</div>
              </div>
            </div>
          )}

          {/* Card Ejemplo 3 */}
          {renderNodoARC({...ejemploCard, roles: {...ejemploCard.roles, funcion: 'Seccion:Apoyo'}},
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                Composición
              </h3>
              <p className="text-gray-600 mb-4">
                Reutilización de reglas a través de múltiples arquetipos y contextos
              </p>
              <div className="text-sm text-gray-500">
                <div><strong>Arquetipo:</strong> Card</div>
                <div><strong>Función:</strong> Apoyo</div>
                <div><strong>Estructura:</strong> Container</div>
                <div><strong>Forma:</strong> CardProfessional</div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Sección de Información del Sistema */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Información del Sistema
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {Object.keys(CATALOGO_ARC).length}
              </div>
              <div className="text-sm text-gray-600">
                Arquetipos Disponibles
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {Object.keys(COMPOSICIONES_ARC).length}
              </div>
              <div className="text-sm text-gray-600">
                Composiciones Base
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                3
              </div>
              <div className="text-sm text-gray-600">
                Dimensiones (Función, Estructura, Forma)
              </div>
            </div>

          </div>

          <div className="mt-12 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Convención de Naming
            </h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div><code className="bg-gray-200 px-2 py-1 rounded">arquetipo</code>: Hero, Card, CTA, Seccion, etc.</div>
              <div><code className="bg-gray-200 px-2 py-1 rounded">funcion</code>: Qué hace semánticamente (Hero:Presentacion, Card:Informativa)</div>
              <div><code className="bg-gray-200 px-2 py-1 rounded">estructura</code>: Cómo se estructura (Centrado, Container, Inline)</div>
              <div><code className="bg-gray-200 px-2 py-1 rounded">forma</code>: Cómo se ve (HeroBrand, CardElevada, BotonPrimario)</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => {
                console.group('🔍 Sistema ARC - Debug Completo');
                console.log('CATALOGO_ARC:', CATALOGO_ARC);
                console.log('COMPOSICIONES_ARC:', COMPOSICIONES_ARC);
                
                console.log('\n--- Ejemplos de Nodos ---');
                debugNodo(ejemploHero);
                debugNodo(ejemploCard);
                debugNodo(ejemploCTA);
                
                console.groupEnd();
              }}
            >
              Ver Debug Completo en Consola
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default DemostracionARC;
