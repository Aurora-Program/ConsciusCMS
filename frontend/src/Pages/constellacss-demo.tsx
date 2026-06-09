import React from "react";

// Interfaces ConstellaCSS puras
type Dimension = 'es' | 'fn' | 'fo';

interface GrupoReglas {
  id: string;
  dimension: Dimension;
  clases: string[];
  tokens?: Record<string, string | number>;
}

interface Arquetipo {
  id: string;
  dimension: Dimension;
  grupos: string[];
  tokens?: Record<string, string | number>;
  allowWith?: string[];
  denyWith?: string[];
}

interface Nodo {
  id: string;
  es: string;
  fn: string;
  fo: string;
  tokens?: Record<string, string | number>;
  classNameExtra?: string;
  contenido?: { selector: string; map: (state: any) => any };
  hijos?: Nodo[];
}

interface Registries {
  grupos: Record<string, GrupoReglas>;
  arquetipos: Record<string, Arquetipo>;
}

interface Theme {
  tokens: Record<string, string | number>;
}

// Catálogo ConstellaCSS
const createRegistries = (): Registries => ({
  grupos: {
    'layout/stack':          { id:'layout/stack', dimension:'es', clases:['flex','flex-col','gap-4'] },
    'layout/grid':           { id:'layout/grid', dimension:'es', clases:['grid','gap-4'] },
    'layout/inline':         { id:'layout/inline', dimension:'es', clases:['flex','items-center','gap-2'] },
    'container/section':     { id:'container/section', dimension:'es', clases:['max-w-screen-xl','mx-auto','px-4'] },
    'container/card':        { id:'container/card', dimension:'es', clases:['p-4'] },
    'container/compact':     { id:'container/compact', dimension:'es', clases:['p-2'] },
    
    'interactive/clickable': { id:'interactive/clickable', dimension:'fn', clases:['cursor-pointer','transition','duration-200','hover:brightness-105','focus:outline-none','focus:ring-2','focus:ring-blue-300'] },
    'interactive/input':     { id:'interactive/input', dimension:'fn', clases:['transition','focus:ring-2','focus:ring-blue-500','focus:border-blue-500'] },
    'interactive/hover':     { id:'interactive/hover', dimension:'fn', clases:['hover:shadow-lg','hover:scale-105','transition-transform'] },
    
    'visual/filled-brand':   { id:'visual/filled-brand', dimension:'fo', clases:['bg-blue-600','text-white','rounded-lg','px-4','py-2','font-medium'] },
    'visual/outlined':       { id:'visual/outlined', dimension:'fo', clases:['border','border-gray-300','bg-white','text-gray-900','rounded-lg','px-4','py-2','hover:border-gray-400'] },
    'visual/card-surface':   { id:'visual/card-surface', dimension:'fo', clases:['bg-white','text-gray-900','shadow','shadow-black/10','rounded-xl','border','border-gray-200'] },
    'visual/text-primary':   { id:'visual/text-primary', dimension:'fo', clases:['text-gray-900','font-medium'] },
    'visual/gradient':       { id:'visual/gradient', dimension:'fo', clases:['bg-gradient-to-r','from-purple-600','to-blue-600','text-white','rounded-lg','px-6','py-3'] },
  },
  arquetipos: {
    'es:Section/Container':   { id:'es:Section/Container',   dimension:'es', grupos:['container/section'] },
    'es:Layout/Stacked':      { id:'es:Layout/Stacked',      dimension:'es', grupos:['layout/stack'] },
    'es:Layout/Grid':         { id:'es:Layout/Grid',         dimension:'es', grupos:['layout/grid'] },
    'es:Layout/Inline':       { id:'es:Layout/Inline',       dimension:'es', grupos:['layout/inline'] },
    'es:Container/Card':      { id:'es:Container/Card',      dimension:'es', grupos:['container/card'] },
    'es:Container/Compact':   { id:'es:Container/Compact',   dimension:'es', grupos:['container/compact'] },
    
    'fn:Interactive/CTA':     { id:'fn:Interactive/CTA',     dimension:'fn', grupos:['interactive/clickable'] },
    'fn:Interactive/Input':   { id:'fn:Interactive/Input',   dimension:'fn', grupos:['interactive/input'] },
    'fn:Interactive/Hover':   { id:'fn:Interactive/Hover',   dimension:'fn', grupos:['interactive/hover'] },
    
    'fo:Button/Primary':      { id:'fo:Button/Primary',      dimension:'fo', grupos:['visual/filled-brand'] },
    'fo:Button/Secondary':    { id:'fo:Button/Secondary',    dimension:'fo', grupos:['visual/outlined'] },
    'fo:Button/Gradient':     { id:'fo:Button/Gradient',     dimension:'fo', grupos:['visual/gradient'] },
    'fo:Card/Surface':        { id:'fo:Card/Surface',        dimension:'fo', grupos:['visual/card-surface'] },
    'fo:Text/Primary':        { id:'fo:Text/Primary',        dimension:'fo', grupos:['visual/text-primary'] },
  }
});

const createTheme = (): Theme => ({
  tokens: {
    '--brand-600': '#2563eb',
    '--brand-300': '#93c5fd',
    '--on-brand': '#ffffff',
    '--surface': '#ffffff',
    '--on-surface': '#111827',
  }
});

// Utility functions
const classes = (...chunks: Array<string | string[] | undefined>): string => {
  const flat = chunks.flatMap(c => Array.isArray(c) ? c : c ? [c] : []);
  return Array.from(new Set(flat)).join(' ');
};

// Resolver ConstellaCSS
const resolverNodo = (node: Nodo, registries: Registries, theme: Theme, state?: any) => {
  const es = registries.arquetipos[node.es];
  const fn = registries.arquetipos[node.fn];
  const fo = registries.arquetipos[node.fo];

  if (!es || !fn || !fo) {
    console.warn('Arquetipos no encontrados:', { es: node.es, fn: node.fn, fo: node.fo });
    return { className: '', tokens: {}, props: {}, hijos: [] };
  }

  const G = (ids: string[]) => ids.map(id => registries.grupos[id]).filter(Boolean);

  const gES = G(es.grupos);
  const gFN = G(fn.grupos);
  const gFO = G(fo.grupos);

  const className = classes(
    ...gES.map(g => g.clases),
    ...gFN.map(g => g.clases),
    ...gFO.map(g => g.clases),
    node.classNameExtra
  );

  const tokens = Object.assign(
    {},
    theme.tokens,
    ...gES.map(g => g.tokens || {}),
    es.tokens || {},
    ...gFN.map(g => g.tokens || {}),
    fn.tokens || {},
    ...gFO.map(g => g.tokens || {}),
    fo.tokens || {},
    node.tokens || {}
  );

  const props = node.contenido ? node.contenido.map(state) : {};
  const hijos = (node.hijos || []).map(h => resolverNodo(h, registries, theme, state));
  
  return { className, tokens, props, hijos };
};

// Demo ConstellaCSS Puro
export default function ConstellaCSSDemo() {
  const [registries] = React.useState<Registries>(createRegistries());
  const [theme] = React.useState<Theme>(createTheme());
  
  const [nodos, setNodos] = React.useState<Nodo[]>([
    {
      id: 'cta_primary',
      es: 'es:Layout/Inline',
      fn: 'fn:Interactive/CTA',
      fo: 'fo:Button/Primary',
      contenido: { selector: 'ui', map: () => ({ label: 'Acción Primaria' }) }
    },
    {
      id: 'cta_gradient',
      es: 'es:Layout/Inline',
      fn: 'fn:Interactive/Hover',
      fo: 'fo:Button/Gradient',
      contenido: { selector: 'ui', map: () => ({ label: 'Botón Gradiente' }) },
      classNameExtra: 'min-w-40 justify-center'
    },
    {
      id: 'card_interactive',
      es: 'es:Container/Card',
      fn: 'fn:Interactive/Hover',
      fo: 'fo:Card/Surface',
      contenido: { selector: 'ui', map: () => ({ label: 'Tarjeta Interactiva' }) },
      classNameExtra: 'min-w-64 min-h-32 flex items-center justify-center'
    }
  ]);

  const [newNodo, setNewNodo] = React.useState<Partial<Nodo>>({
    es: '',
    fn: '',
    fo: '',
    contenido: { selector: 'ui', map: () => ({ label: 'Nuevo Elemento' }) },
    classNameExtra: ''
  });

  const addNodo = () => {
    if (!newNodo.es || !newNodo.fn || !newNodo.fo) {
      alert('Selecciona arquetipos para ES, FN y FO');
      return;
    }

    const nodoData: Nodo = {
      id: `nodo_${Date.now()}`,
      es: newNodo.es!,
      fn: newNodo.fn!,
      fo: newNodo.fo!,
      contenido: newNodo.contenido,
      classNameExtra: newNodo.classNameExtra
    };

    setNodos([...nodos, nodoData]);
    
    setNewNodo({
      es: '',
      fn: '',
      fo: '',
      contenido: { selector: 'ui', map: () => ({ label: 'Nuevo Elemento' }) },
      classNameExtra: ''
    });
  };

  const deleteNodo = (id: string) => {
    setNodos(nodos.filter(n => n.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ⚡ ConstellaCSS Demo - Modelo Puro
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Demostración del sistema ConstellaCSS con arquitectura pura: <strong>ES → FN → FO</strong> precedencia determinista, 
            grupos de clases utilitarias y tokens CSS.
          </p>
        </div>

        {/* Arquitectura Visual */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🏗️ Arquitectura ConstellaCSS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-blue-600 mb-2">📐 ES (Estructura)</h3>
              <p className="text-sm text-gray-600 mb-3">Layout, contenedores, grid, flexbox</p>
              <div className="text-xs space-y-1">
                {Object.entries(registries.arquetipos)
                  .filter(([_, a]) => a.dimension === 'es')
                  .slice(0, 3)
                  .map(([id, _]) => (
                    <div key={id} className="bg-blue-50 px-2 py-1 rounded">{id}</div>
                  ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-green-600 mb-2">⚙️ FN (Función)</h3>
              <p className="text-sm text-gray-600 mb-3">Interactividad, estados, comportamiento</p>
              <div className="text-xs space-y-1">
                {Object.entries(registries.arquetipos)
                  .filter(([_, a]) => a.dimension === 'fn')
                  .slice(0, 3)
                  .map(([id, _]) => (
                    <div key={id} className="bg-green-50 px-2 py-1 rounded">{id}</div>
                  ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-purple-600 mb-2">🎨 FO (Forma)</h3>
              <p className="text-sm text-gray-600 mb-3">Apariencia visual, colores, tipografía</p>
              <div className="text-xs space-y-1">
                {Object.entries(registries.arquetipos)
                  .filter(([_, a]) => a.dimension === 'fo')
                  .slice(0, 3)
                  .map(([id, _]) => (
                    <div key={id} className="bg-purple-50 px-2 py-1 rounded">{id}</div>
                  ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulario de Creación */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">➕ Crear Nodo ConstellaCSS</h2>
            
            <div className="space-y-4">
              {/* Arquetipo ES */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📐 Estructura (ES)
                </label>
                <select
                  value={newNodo.es}
                  onChange={(e) => setNewNodo({...newNodo, es: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {Object.entries(registries.arquetipos)
                    .filter(([_, arquetipo]) => arquetipo.dimension === 'es')
                    .map(([id, arquetipo]) => (
                      <option key={id} value={id}>{arquetipo.id}</option>
                    ))}
                </select>
              </div>

              {/* Arquetipo FN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚙️ Función (FN)
                </label>
                <select
                  value={newNodo.fn}
                  onChange={(e) => setNewNodo({...newNodo, fn: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {Object.entries(registries.arquetipos)
                    .filter(([_, arquetipo]) => arquetipo.dimension === 'fn')
                    .map(([id, arquetipo]) => (
                      <option key={id} value={id}>{arquetipo.id}</option>
                    ))}
                </select>
              </div>

              {/* Arquetipo FO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🎨 Forma (FO)
                </label>
                <select
                  value={newNodo.fo}
                  onChange={(e) => setNewNodo({...newNodo, fo: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Seleccionar...</option>
                  {Object.entries(registries.arquetipos)
                    .filter(([_, arquetipo]) => arquetipo.dimension === 'fo')
                    .map(([id, arquetipo]) => (
                      <option key={id} value={id}>{arquetipo.id}</option>
                    ))}
                </select>
              </div>

              {/* Clases extra */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ✨ Clases Extra (Tailwind)
                </label>
                <input
                  type="text"
                  value={newNodo.classNameExtra || ''}
                  onChange={(e) => setNewNodo({...newNodo, classNameExtra: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="min-w-40 justify-center shadow-lg"
                />
              </div>

              <button
                onClick={addNodo}
                disabled={!newNodo.es || !newNodo.fn || !newNodo.fo}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ⚡ Crear Nodo
              </button>
            </div>
          </div>

          {/* Vista Previa */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4">👁️ Vista Previa - Nodos Activos</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {nodos.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">⚡</div>
                  <p>No hay nodos creados</p>
                </div>
              ) : (
                nodos.map((nodo) => {
                  const resolved = resolverNodo(nodo, registries, theme, {});
                  return (
                    <div key={nodo.id} className="border border-gray-100 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-xs space-y-1">
                          <div className="text-blue-600">📐 {nodo.es}</div>
                          <div className="text-green-600">⚙️ {nodo.fn}</div>
                          <div className="text-purple-600">🎨 {nodo.fo}</div>
                        </div>
                        <button
                          onClick={() => deleteNodo(nodo.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Elemento Renderizado */}
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <button 
                          className={resolved.className}
                          style={resolved.tokens as React.CSSProperties}
                        >
                          {resolved.props.label}
                        </button>
                      </div>

                      {/* Clases Generadas */}
                      <details className="mt-2">
                        <summary className="text-xs text-gray-500 cursor-pointer">
                          🔍 Clases CSS generadas
                        </summary>
                        <pre className="text-xs bg-gray-900 text-green-300 p-2 rounded mt-1 overflow-x-auto">
{resolved.className}
                        </pre>
                      </details>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            🔧 <strong>ConstellaCSS</strong> - Modelo puro basado en precedencia determinista y grupos de utilidades CSS
          </p>
        </div>
      </div>
    </div>
  );
}
