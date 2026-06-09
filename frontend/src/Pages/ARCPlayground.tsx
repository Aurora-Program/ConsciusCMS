/**
 * ARC + ConstellaCSS Playground
 * Aplicación interactiva para demostrar el sistema ARC en tiempo real
 */

import { useState, useEffect } from 'react';
import { 
  debugNodo,
  resolveNodo,
  CATALOGO_ARC,
  type Nodo,
  type ArquetipoID
} from '../constellacss/arc-system';

// Importar la compatibilidad para obtener roles disponibles
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
import '../constellacss/arc-implementation.css';

// Tipos para el playground
interface PlaygroundState {
  nodo: Nodo;
  previewMode: 'live' | 'code' | 'debug';
  showInspector: boolean;
  selectedPreset?: string;
}

interface Preset {
  id: string;
  name: string;
  description: string;
  nodo: Nodo;
  content: {
    title: string;
    subtitle?: string;
    text?: string;
    buttonText?: string;
  };
}

// Presets predefinidos
const PRESETS: Preset[] = [
  {
    id: 'hero-brand',
    name: 'Hero Principal',
    description: 'Hero de presentación con branding',
    nodo: {
      arquetipo: 'Hero',
      roles: {
        funcion: 'Hero:Presentacion',
        estructura: 'Estructura:StackCentered',
        forma: 'Forma:BrandPrimaryLg'
      }
    },
    content: {
      title: 'Construye con ARC',
      subtitle: 'Sistema de diseño fractal y composable',
      buttonText: 'Empezar'
    }
  },
  {
    id: 'card-profesional',
    name: 'Card Profesional',
    description: 'Tarjeta de contenido profesional',
    nodo: {
      arquetipo: 'Card',
      roles: {
        funcion: 'Seccion:Contenido',
        estructura: 'Estructura:Container',
        forma: 'Forma:CardProfessional'
      }
    },
    content: {
      title: 'Fractalidad',
      text: 'Los componentes se pueden anidar infinitamente manteniendo consistencia.'
    }
  },
  {
    id: 'cta-primario',
    name: 'CTA Primario',
    description: 'Call-to-action principal con branding',
    nodo: {
      arquetipo: 'CTA',
      roles: {
        funcion: 'CTA:Primaria',
        estructura: 'Estructura:Inline',
        forma: 'Forma:BotonBrand'
      }
    },
    content: {
      title: 'CTA Primario',
      buttonText: 'Acción Principal'
    }
  },
  {
    id: 'card-apoyo',
    name: 'Card de Apoyo',
    description: 'Tarjeta secundaria con estilo limpio',
    nodo: {
      arquetipo: 'Card',
      roles: {
        funcion: 'Seccion:Apoyo',
        estructura: 'Estructura:StackCentered',
        forma: 'Forma:SeccionLimpia'
      }
    },
    content: {
      title: 'Composición',
      text: 'Reutilización de reglas a través de múltiples arquetipos.'
    }
  }
];

export function ARCPlayground() {
  // Estado principal
  const [state, setState] = useState<PlaygroundState>({
    nodo: PRESETS[0].nodo,
    previewMode: 'live',
    showInspector: true,
    selectedPreset: PRESETS[0].id
  });

  const [selectedContent, setSelectedContent] = useState(PRESETS[0].content);
  const [resolucion, setResolucion] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Resolver nodo cada vez que cambie
  useEffect(() => {
    try {
      const resultado = resolveNodo(state.nodo);
      setResolucion(resultado);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setResolucion(null);
    }
  }, [state.nodo]);

  // Obtener roles disponibles para un arquetipo
  const getRolesDisponibles = (arquetipo: ArquetipoID) => {
    const compatibilidad = COMPATIBILIDAD_ARC[arquetipo];
    if (!compatibilidad) return { funciones: [], estructuras: [], formas: [] };
    return compatibilidad;
  };

  // Actualizar nodo
  const updateNodo = (updates: Partial<Nodo>) => {
    setState(prev => ({
      ...prev,
      nodo: { ...prev.nodo, ...updates },
      selectedPreset: undefined // Limpiar preset cuando se modifica manualmente
    }));
  };

  // Seleccionar preset
  const selectPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (preset) {
      setState(prev => ({
        ...prev,
        nodo: preset.nodo,
        selectedPreset: presetId
      }));
      setSelectedContent(preset.content);
    }
  };

  // Renderizar el componente preview
  const renderPreview = () => {
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-red-800 font-semibold mb-2">Error de Validación</h3>
          <p className="text-red-600">{error}</p>
        </div>
      );
    }

    if (!resolucion) {
      return (
        <div className="bg-gray-100 rounded-lg p-6 animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
      );
    }

    const { className, style } = resolucion;

    // Renderizar según el arquetipo
    switch (state.nodo.arquetipo) {
      case 'Hero':
        return (
          <section 
            className={className} 
            style={style}
            data-arquetipo="Hero"
          >
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                {selectedContent.title}
              </h1>
              {selectedContent.subtitle && (
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {selectedContent.subtitle}
                </p>
              )}
              {selectedContent.buttonText && (
                <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {selectedContent.buttonText}
                </button>
              )}
            </div>
          </section>
        );

      case 'Card':
        return (
          <article 
            className={className} 
            style={style}
            data-arquetipo="Card"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-900">
                {selectedContent.title}
              </h3>
              {selectedContent.text && (
                <p className="text-gray-600">
                  {selectedContent.text}
                </p>
              )}
            </div>
          </article>
        );

      case 'CTA':
        return (
          <button 
            className={className} 
            style={style}
            data-arquetipo="CTA"
          >
            {selectedContent.buttonText || 'Botón'}
          </button>
        );

      default:
        return (
          <div 
            className={className} 
            style={style}
            data-arquetipo={state.nodo.arquetipo}
          >
            <p>Componente {state.nodo.arquetipo}</p>
          </div>
        );
    }
  };

  const rolesDisponibles = getRolesDisponibles(state.nodo.arquetipo);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ARC + ConstellaCSS Playground
              </h1>
              <p className="text-gray-600">
                Experimenta con Arquetipos, Roles y Composición en tiempo real
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Modo de vista */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['live', 'code', 'debug'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setState(prev => ({ ...prev, previewMode: mode }))}
                    className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                      state.previewMode === mode
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {mode === 'live' ? 'Vista' : mode === 'code' ? 'Código' : 'Debug'}
                  </button>
                ))}
              </div>

              {/* Toggle Inspector */}
              <button
                onClick={() => setState(prev => ({ ...prev, showInspector: !prev.showInspector }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  state.showInspector
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Inspector
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className={`grid gap-6 ${state.showInspector ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
          
          {/* Panel de Control */}
          <div className="space-y-6">
            
            {/* Presets */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Presets
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => selectPreset(preset.id)}
                    className={`text-left p-3 rounded-lg border transition-colors ${
                      state.selectedPreset === preset.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">{preset.name}</div>
                    <div className="text-sm text-gray-600">{preset.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuración del Nodo */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Configuración
              </h3>
              
              <div className="space-y-4">
                
                {/* Arquetipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Arquetipo
                  </label>
                  <select
                    value={state.nodo.arquetipo}
                    onChange={(e) => updateNodo({ 
                      arquetipo: e.target.value as ArquetipoID,
                      roles: {} // Reset roles when changing archetype
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Object.keys(CATALOGO_ARC).map((arquetipo) => (
                      <option key={arquetipo} value={arquetipo}>
                        {arquetipo}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Función */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Función
                  </label>
                  <select
                    value={state.nodo.roles.funcion || ''}
                    onChange={(e) => updateNodo({ 
                      roles: { ...state.nodo.roles, funcion: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar función...</option>
                    {rolesDisponibles.funciones?.map((func: string) => (
                      <option key={func} value={func}>
                        {func}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estructura */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estructura
                  </label>
                  <select
                    value={state.nodo.roles.estructura || ''}
                    onChange={(e) => updateNodo({ 
                      roles: { ...state.nodo.roles, estructura: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar estructura...</option>
                    {rolesDisponibles.estructuras?.map((est: string) => (
                      <option key={est} value={est}>
                        {est}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Forma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Forma
                  </label>
                  <select
                    value={state.nodo.roles.forma || ''}
                    onChange={(e) => updateNodo({ 
                      roles: { ...state.nodo.roles, forma: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Seleccionar forma...</option>
                    {rolesDisponibles.formas?.map((forma: string) => (
                      <option key={forma} value={forma}>
                        {forma}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* Contenido */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">
                Contenido
              </h3>
              
              <div className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título
                  </label>
                  <input
                    type="text"
                    value={selectedContent.title}
                    onChange={(e) => setSelectedContent(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {state.nodo.arquetipo === 'Hero' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Subtítulo
                    </label>
                    <input
                      type="text"
                      value={selectedContent.subtitle || ''}
                      onChange={(e) => setSelectedContent(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {(state.nodo.arquetipo === 'Card') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto
                    </label>
                    <textarea
                      value={selectedContent.text || ''}
                      onChange={(e) => setSelectedContent(prev => ({ ...prev, text: e.target.value }))}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                {(state.nodo.arquetipo === 'Hero' || state.nodo.arquetipo === 'CTA') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto del Botón
                    </label>
                    <input
                      type="text"
                      value={selectedContent.buttonText || ''}
                      onChange={(e) => setSelectedContent(prev => ({ ...prev, buttonText: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

              </div>
            </div>

          </div>

          {/* Área de Preview */}
          <div className={`${state.showInspector ? 'lg:col-span-2' : 'col-span-1'}`}>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              
              {/* Toolbar del Preview */}
              <div className="bg-gray-50 border-b px-4 py-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">
                    Preview: {state.nodo.arquetipo}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {state.nodo.roles.funcion} • {state.nodo.roles.estructura} • {state.nodo.roles.forma}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido del Preview */}
              <div className="p-6">
                
                {state.previewMode === 'live' && (
                  <div className="min-h-[300px] flex items-center justify-center">
                    {renderPreview()}
                  </div>
                )}

                {state.previewMode === 'code' && resolucion && (
                  <div className="space-y-4">
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Nodo ARC</h4>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {JSON.stringify(state.nodo, null, 2)}
                      </pre>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">CSS Generado</h4>
                      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                        {`className: "${resolucion.className}"\n\nstyle: ${JSON.stringify(resolucion.style, null, 2)}`}
                      </pre>
                    </div>

                  </div>
                )}

                {state.previewMode === 'debug' && (
                  <div className="space-y-4">
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Información del Sistema</h4>
                      <div className="bg-gray-100 p-4 rounded text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <strong>Arquetipo:</strong> {state.nodo.arquetipo}
                          </div>
                          <div>
                            <strong>Roles válidos:</strong> {Object.keys(rolesDisponibles).join(', ')}
                          </div>
                          <div>
                            <strong>Error:</strong> {error ? 'Sí' : 'No'}
                          </div>
                          <div>
                            <strong>Timestamp:</strong> {resolucion?.metadata?.timestamp || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          console.group('🎯 ARC Debug - Nodo Actual');
                          debugNodo(state.nodo);
                          console.log('Resolución completa:', resolucion);
                          console.groupEnd();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Debug en Consola
                      </button>
                    </div>

                  </div>
                )}

              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default ARCPlayground;
