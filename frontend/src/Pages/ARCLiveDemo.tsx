/**
 * ARC Live Demo
 * Página de demostración donde se aplican los arquetipos creados en el Rules Editor
 */

import { useState, useEffect } from 'react';
import { type CustomRule, type CustomArchetype } from './ARCRulesEditor';
import { type CSSVariable, VariablesEditor, generateCSSWithVariables, DEFAULT_VARIABLES } from '../components/VariablesSystem';

interface DemoElement {
  id: string;
  type: 'hero' | 'card' | 'button' | 'table' | 'form' | 'text';
  archetype: string;
  roles: {
    funcion?: string;
    estructura?: string;
    forma?: string;
  };
  content: {
    title?: string;
    subtitle?: string;
    text?: string;
    buttonText?: string;
  };
  position: { x: number; y: number };
}

// Elementos demo predeterminados
const DEFAULT_DEMO_ELEMENTS: DemoElement[] = [
  {
    id: 'hero-1',
    type: 'hero',
    archetype: 'CustomHero',
    roles: {
      estructura: 'hero-layout',
      forma: 'gradient-primary'
    },
    content: {
      title: 'Bienvenido al Demo ARC',
      subtitle: 'Experimenta con arquetipos personalizados',
      buttonText: 'Comenzar'
    },
    position: { x: 0, y: 0 }
  },
  {
    id: 'card-1',
    type: 'card',
    archetype: 'CustomCard',
    roles: {
      estructura: 'flex-center',
      forma: 'card-shadow'
    },
    content: {
      title: 'Tarjeta Demo',
      text: 'Esta tarjeta usa reglas personalizadas creadas en el Rules Editor'
    },
    position: { x: 0, y: 400 }
  },
  {
    id: 'button-1',
    type: 'button',
    archetype: 'CustomButton',
    roles: {
      funcion: 'hover-lift',
      forma: 'button-primary'
    },
    content: {
      buttonText: 'Botón Personalizado'
    },
    position: { x: 400, y: 500 }
  }
];

export function ARCLiveDemo() {
  
  const [demoElements, setDemoElements] = useState<DemoElement[]>(DEFAULT_DEMO_ELEMENTS);
  const [customRules, setCustomRules] = useState<CustomRule[]>([]);
  const [customArchetypes, setCustomArchetypes] = useState<CustomArchetype[]>([]);
  const [variables, setVariables] = useState<CSSVariable[]>(DEFAULT_VARIABLES);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'demo' | 'variables' | 'code'>('demo');

  // Cargar datos del Rules Editor desde localStorage
  useEffect(() => {
    const savedRules = localStorage.getItem('arc-custom-rules');
    const savedArchetypes = localStorage.getItem('arc-custom-archetypes');
    
    if (savedRules) {
      try {
        setCustomRules(JSON.parse(savedRules));
      } catch (error) {
        console.error('Error loading custom rules:', error);
      }
    }
    
    if (savedArchetypes) {
      try {
        setCustomArchetypes(JSON.parse(savedArchetypes));
      } catch (error) {
        console.error('Error loading custom archetypes:', error);
      }
    }
  }, []);

  // Aplicar estilos de un elemento
  const getElementStyles = (element: DemoElement): React.CSSProperties => {
    let combinedStyles: React.CSSProperties = {};
    
    // Aplicar reglas según los roles asignados
    Object.values(element.roles).forEach((roleId) => {
      if (roleId) {
        const rule = customRules.find(r => r.id === roleId);
        if (rule) {
          combinedStyles = { ...combinedStyles, ...rule.cssProperties };
        }
      }
    });

    return combinedStyles;
  };

  // Obtener clases CSS de un elemento
  const getElementClasses = (element: DemoElement): string => {
    let classes: string[] = [];
    
    Object.values(element.roles).forEach((roleId) => {
      if (roleId) {
        const rule = customRules.find(r => r.id === roleId);
        if (rule?.className) {
          classes.push(rule.className);
        }
      }
    });

    return classes.join(' ');
  };

  // Renderizar un elemento demo
  const renderDemoElement = (element: DemoElement) => {
    const styles = getElementStyles(element);
    const classes = getElementClasses(element);
    const isSelected = selectedElement === element.id;

    const baseClasses = `
      relative transition-all duration-300 cursor-pointer
      ${classes}
      ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
    `;

    const commonProps = {
      className: baseClasses,
      style: {
        ...styles,
        position: 'absolute' as const,
        left: element.position.x,
        top: element.position.y,
      },
      onClick: () => setSelectedElement(element.id)
    };

    switch (element.type) {
      case 'hero':
        return (
          <div key={element.id} {...commonProps} style={{
            ...commonProps.style,
            width: '100%',
            minHeight: '300px'
          }}>
            <div className="text-center p-8">
              <h1 className="text-4xl font-bold mb-4">{element.content.title}</h1>
              <p className="text-xl mb-6">{element.content.subtitle}</p>
              <button className="px-6 py-3 rounded-lg font-semibold">
                {element.content.buttonText}
              </button>
            </div>
          </div>
        );

      case 'card':
        return (
          <div key={element.id} {...commonProps} style={{
            ...commonProps.style,
            width: '300px',
            minHeight: '200px'
          }}>
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{element.content.title}</h3>
              <p className="text-gray-600">{element.content.text}</p>
            </div>
          </div>
        );

      case 'button':
        return (
          <button key={element.id} {...commonProps} style={{
            ...commonProps.style,
            padding: '12px 24px'
          }}>
            {element.content.buttonText}
          </button>
        );

      case 'table':
        return (
          <div key={element.id} {...commonProps} style={{
            ...commonProps.style,
            width: '600px'
          }}>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="p-3 text-left">Columna 1</th>
                  <th className="p-3 text-left">Columna 2</th>
                  <th className="p-3 text-left">Columna 3</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">Dato 1</td>
                  <td className="p-3">Dato 2</td>
                  <td className="p-3">Dato 3</td>
                </tr>
                <tr>
                  <td className="p-3">Dato 4</td>
                  <td className="p-3">Dato 5</td>
                  <td className="p-3">Dato 6</td>
                </tr>
              </tbody>
            </table>
          </div>
        );

      case 'form':
        return (
          <div key={element.id} {...commonProps} style={{
            ...commonProps.style,
            width: '400px'
          }}>
            <form className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre</label>
                <input type="text" className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" className="w-full p-2 border rounded" />
              </div>
              <button type="submit" className="w-full p-2 rounded">
                Enviar
              </button>
            </form>
          </div>
        );

      default:
        return (
          <div key={element.id} {...commonProps}>
            <p>{element.content.text || 'Elemento demo'}</p>
          </div>
        );
    }
  };

  // Agregar nuevo elemento
  const addElement = (type: DemoElement['type']) => {
    const newElement: DemoElement = {
      id: `${type}-${Date.now()}`,
      type,
      archetype: customArchetypes[0]?.id || 'default',
      roles: {},
      content: {
        title: `Nuevo ${type}`,
        text: 'Contenido de ejemplo',
        buttonText: 'Click'
      },
      position: { x: 100, y: 100 }
    };

    setDemoElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  // Generar CSS completo
  const generateCompleteCSS = (): string => {
    const variablesCSS = generateCSSWithVariables(variables);
    
    const rulesCSS = customRules.map(rule => {
      const cssText = Object.entries(rule.cssProperties)
        .map(([prop, value]) => {
          const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
          return `  ${kebabProp}: ${value};`;
        })
        .join('\n');

      return `.${rule.id} {\n${cssText}\n}`;
    }).join('\n\n');

    return `${variablesCSS}\n\n/* Custom Rules */\n${rulesCSS}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Variables CSS aplicadas */}
      <style dangerouslySetInnerHTML={{ 
        __html: generateCSSWithVariables(variables) 
      }} />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ARC Live Demo
              </h1>
              <p className="text-gray-600">
                Visualiza y testa tus arquetipos personalizados en tiempo real
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="/rules-editor"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ← Volver al Editor
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {(['demo', 'variables', 'code'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'demo' ? 'Demo Interactivo' : 
               tab === 'variables' ? 'Variables CSS' : 
               'Código Generado'}
            </button>
          ))}
        </div>

        {/* Tab: Demo Interactivo */}
        {activeTab === 'demo' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Panel de elementos */}
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Agregar Elementos</h3>
              
              <div className="space-y-2">
                {(['hero', 'card', 'button', 'table', 'form'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => addElement(type)}
                    className="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors capitalize"
                  >
                    + {type}
                  </button>
                ))}
              </div>

              {/* Info de arquetipos disponibles */}
              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-2">
                  Arquetipos Disponibles ({customArchetypes.length})
                </h4>
                <div className="space-y-1">
                  {customArchetypes.map((archetype) => (
                    <div key={archetype.id} className="text-sm bg-blue-50 text-blue-800 px-2 py-1 rounded">
                      {archetype.name}
                    </div>
                  ))}
                </div>
                
                {customArchetypes.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Ve al Rules Editor para crear arquetipos
                  </p>
                )}
              </div>

              {/* Info de reglas disponibles */}
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Reglas Disponibles ({customRules.length})
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {customRules.map((rule) => (
                    <div key={rule.id} className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {rule.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Área de demo */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow relative min-h-[600px] overflow-hidden">
                
                {/* Elementos demo */}
                <div className="relative w-full h-full">
                  {demoElements.map(renderDemoElement)}
                </div>

                {/* Grid de ayuda */}
                <div 
                  className="absolute inset-0 pointer-events-none opacity-10"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                      linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                    `,
                    backgroundSize: '20px 20px'
                  }}
                />
              </div>

              {/* Info del elemento seleccionado */}
              {selectedElement && (() => {
                const element = demoElements.find(e => e.id === selectedElement);
                if (!element) return null;

                return (
                  <div className="mt-4 bg-white rounded-lg shadow p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Elemento Seleccionado: {element.type} ({element.id})
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Arquetipo</h4>
                        <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {element.archetype}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Roles Aplicados</h4>
                        <div className="space-y-1">
                          {Object.entries(element.roles).map(([roleType, roleId]) => (
                            roleId ? (
                              <div key={roleType} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                {roleType}: {roleId}
                              </div>
                            ) : null
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Estilos Aplicados</h4>
                        <div className="text-xs bg-gray-100 p-2 rounded font-mono max-h-20 overflow-y-auto">
                          {JSON.stringify(getElementStyles(element), null, 2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

          </div>
        )}

        {/* Tab: Variables */}
        {activeTab === 'variables' && (
          <div className="bg-white rounded-lg shadow p-6">
            <VariablesEditor
              variables={variables}
              onVariablesChange={setVariables}
            />
          </div>
        )}

        {/* Tab: Código */}
        {activeTab === 'code' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              CSS Generado
            </h3>
            
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
              <pre className="text-sm overflow-auto max-h-96">
                {generateCompleteCSS()}
              </pre>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => navigator.clipboard.writeText(generateCompleteCSS())}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                📋 Copiar CSS
              </button>
              
              <button
                onClick={() => {
                  const blob = new Blob([generateCompleteCSS()], { type: 'text/css' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = url;
                  link.download = 'arc-styles.css';
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                📁 Descargar CSS
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ARCLiveDemo;
