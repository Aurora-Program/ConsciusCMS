/**
 * Variables System for ARC Rules Editor
 * Sistema de variables CSS para crear layouts complejos
 */

import { useState } from 'react';

export interface CSSVariable {
  id: string;
  name: string;
  value: string;
  description: string;
  category: 'colors' | 'spacing' | 'typography' | 'layout' | 'effects';
  type: 'color' | 'size' | 'number' | 'text' | 'boolean';
}

export interface VariableSet {
  id: string;
  name: string;
  description: string;
  variables: CSSVariable[];
}

// Variables predefinidas
export const DEFAULT_VARIABLES: CSSVariable[] = [
  // Colors
  {
    id: 'primary-color',
    name: '--color-primary',
    value: '#3b82f6',
    description: 'Color primario del sistema',
    category: 'colors',
    type: 'color'
  },
  {
    id: 'secondary-color',
    name: '--color-secondary',
    value: '#64748b',
    description: 'Color secundario',
    category: 'colors',
    type: 'color'
  },
  {
    id: 'background-color',
    name: '--color-background',
    value: '#ffffff',
    description: 'Color de fondo',
    category: 'colors',
    type: 'color'
  },
  
  // Spacing
  {
    id: 'spacing-xs',
    name: '--spacing-xs',
    value: '4px',
    description: 'Espaciado extra pequeño',
    category: 'spacing',
    type: 'size'
  },
  {
    id: 'spacing-sm',
    name: '--spacing-sm',
    value: '8px',
    description: 'Espaciado pequeño',
    category: 'spacing',
    type: 'size'
  },
  {
    id: 'spacing-md',
    name: '--spacing-md',
    value: '16px',
    description: 'Espaciado medio',
    category: 'spacing',
    type: 'size'
  },
  {
    id: 'spacing-lg',
    name: '--spacing-lg',
    value: '24px',
    description: 'Espaciado grande',
    category: 'spacing',
    type: 'size'
  },
  {
    id: 'spacing-xl',
    name: '--spacing-xl',
    value: '32px',
    description: 'Espaciado extra grande',
    category: 'spacing',
    type: 'size'
  },

  // Typography
  {
    id: 'font-family',
    name: '--font-family',
    value: 'Inter, system-ui, sans-serif',
    description: 'Familia de fuentes',
    category: 'typography',
    type: 'text'
  },
  {
    id: 'font-size-sm',
    name: '--font-size-sm',
    value: '14px',
    description: 'Tamaño de fuente pequeño',
    category: 'typography',
    type: 'size'
  },
  {
    id: 'font-size-base',
    name: '--font-size-base',
    value: '16px',
    description: 'Tamaño de fuente base',
    category: 'typography',
    type: 'size'
  },
  {
    id: 'font-size-lg',
    name: '--font-size-lg',
    value: '18px',
    description: 'Tamaño de fuente grande',
    category: 'typography',
    type: 'size'
  },

  // Layout
  {
    id: 'container-max-width',
    name: '--container-max-width',
    value: '1200px',
    description: 'Ancho máximo del contenedor',
    category: 'layout',
    type: 'size'
  },
  {
    id: 'grid-columns',
    name: '--grid-columns',
    value: '12',
    description: 'Número de columnas en grid',
    category: 'layout',
    type: 'number'
  },
  {
    id: 'border-radius',
    name: '--border-radius',
    value: '8px',
    description: 'Radio de borde estándar',
    category: 'layout',
    type: 'size'
  },

  // Effects
  {
    id: 'shadow-sm',
    name: '--shadow-sm',
    value: '0 1px 2px rgba(0, 0, 0, 0.05)',
    description: 'Sombra pequeña',
    category: 'effects',
    type: 'text'
  },
  {
    id: 'shadow-md',
    name: '--shadow-md',
    value: '0 4px 6px rgba(0, 0, 0, 0.1)',
    description: 'Sombra media',
    category: 'effects',
    type: 'text'
  },
  {
    id: 'transition-base',
    name: '--transition-base',
    value: 'all 0.3s ease',
    description: 'Transición estándar',
    category: 'effects',
    type: 'text'
  }
];

// Variable sets predefinidos
export const VARIABLE_SETS: VariableSet[] = [
  {
    id: 'table-variables',
    name: 'Variables para Tablas',
    description: 'Variables específicas para crear tablas responsivas',
    variables: [
      {
        id: 'table-border',
        name: '--table-border',
        value: '1px solid #e5e7eb',
        description: 'Borde de tabla',
        category: 'layout',
        type: 'text'
      },
      {
        id: 'table-padding',
        name: '--table-padding',
        value: '12px 16px',
        description: 'Padding de celdas',
        category: 'spacing',
        type: 'text'
      },
      {
        id: 'table-header-bg',
        name: '--table-header-bg',
        value: '#f9fafb',
        description: 'Fondo del header',
        category: 'colors',
        type: 'color'
      },
      {
        id: 'table-stripe-bg',
        name: '--table-stripe-bg',
        value: '#f8fafc',
        description: 'Fondo de filas alternas',
        category: 'colors',
        type: 'color'
      }
    ]
  },
  
  {
    id: 'form-variables',
    name: 'Variables para Formularios',
    description: 'Variables para crear formularios consistentes',
    variables: [
      {
        id: 'input-border',
        name: '--input-border',
        value: '1px solid #d1d5db',
        description: 'Borde de inputs',
        category: 'layout',
        type: 'text'
      },
      {
        id: 'input-focus-border',
        name: '--input-focus-border',
        value: '2px solid #3b82f6',
        description: 'Borde en focus',
        category: 'layout',
        type: 'text'
      },
      {
        id: 'input-padding',
        name: '--input-padding',
        value: '8px 12px',
        description: 'Padding de inputs',
        category: 'spacing',
        type: 'text'
      },
      {
        id: 'label-font-weight',
        name: '--label-font-weight',
        value: '500',
        description: 'Peso de labels',
        category: 'typography',
        type: 'number'
      }
    ]
  },

  {
    id: 'card-variables',
    name: 'Variables para Cards',
    description: 'Variables para sistema de tarjetas',
    variables: [
      {
        id: 'card-padding',
        name: '--card-padding',
        value: '24px',
        description: 'Padding interno',
        category: 'spacing',
        type: 'size'
      },
      {
        id: 'card-border-radius',
        name: '--card-border-radius',
        value: '12px',
        description: 'Radio de bordes',
        category: 'layout',
        type: 'size'
      },
      {
        id: 'card-shadow',
        name: '--card-shadow',
        value: '0 4px 6px rgba(0, 0, 0, 0.07)',
        description: 'Sombra de card',
        category: 'effects',
        type: 'text'
      }
    ]
  }
];

// Generador de CSS con variables
export const generateCSSWithVariables = (variables: CSSVariable[]): string => {
  const cssVariables = variables
    .map(variable => `  ${variable.name}: ${variable.value};`)
    .join('\n');

  return `:root {
${cssVariables}
}`;
};

// Hook para gestionar variables
export const useVariables = (initialVariables: CSSVariable[] = DEFAULT_VARIABLES) => {
  const [variables, setVariables] = useState<CSSVariable[]>(initialVariables);

  const addVariable = (variable: CSSVariable) => {
    setVariables(prev => [...prev, variable]);
  };

  const updateVariable = (id: string, updates: Partial<CSSVariable>) => {
    setVariables(prev => 
      prev.map(variable => 
        variable.id === id ? { ...variable, ...updates } : variable
      )
    );
  };

  const removeVariable = (id: string) => {
    setVariables(prev => prev.filter(variable => variable.id !== id));
  };

  const addVariableSet = (variableSet: VariableSet) => {
    setVariables(prev => [...prev, ...variableSet.variables]);
  };

  const getVariablesByCategory = (category: CSSVariable['category']) => {
    return variables.filter(variable => variable.category === category);
  };

  return {
    variables,
    addVariable,
    updateVariable,
    removeVariable,
    addVariableSet,
    getVariablesByCategory,
    generateCSS: () => generateCSSWithVariables(variables)
  };
};

// Componente editor de variables
interface VariablesEditorProps {
  variables: CSSVariable[];
  onVariablesChange: (variables: CSSVariable[]) => void;
  className?: string;
}

export function VariablesEditor({ variables, onVariablesChange, className = '' }: VariablesEditorProps) {
  const [newVariable, setNewVariable] = useState<Partial<CSSVariable>>({
    category: 'colors',
    type: 'color'
  });

  const addVariable = () => {
    if (!newVariable.name || !newVariable.value) return;

    const variable: CSSVariable = {
      id: `var-${Date.now()}`,
      name: newVariable.name,
      value: newVariable.value,
      description: newVariable.description || '',
      category: newVariable.category!,
      type: newVariable.type!
    };

    onVariablesChange([...variables, variable]);
    setNewVariable({ category: 'colors', type: 'color' });
  };

  const updateVariable = (id: string, updates: Partial<CSSVariable>) => {
    onVariablesChange(
      variables.map(variable => 
        variable.id === id ? { ...variable, ...updates } : variable
      )
    );
  };

  const removeVariable = (id: string) => {
    onVariablesChange(variables.filter(variable => variable.id !== id));
  };

  const addVariableSet = (variableSet: VariableSet) => {
    onVariablesChange([...variables, ...variableSet.variables]);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* Variable Sets */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Sets de Variables Predefinidos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {VARIABLE_SETS.map((set) => (
            <button
              key={set.id}
              onClick={() => addVariableSet(set)}
              className="text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 transition-colors"
            >
              <div className="font-medium text-sm text-blue-900">{set.name}</div>
              <div className="text-xs text-blue-700 mt-1">{set.description}</div>
              <div className="text-xs text-blue-600 mt-1">
                {set.variables.length} variables
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Crear nueva variable */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-4">Crear Nueva Variable</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre CSS
            </label>
            <input
              type="text"
              value={newVariable.name || ''}
              onChange={(e) => setNewVariable(prev => ({ ...prev, name: e.target.value }))}
              placeholder="--mi-variable"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor
            </label>
            <input
              type="text"
              value={newVariable.value || ''}
              onChange={(e) => setNewVariable(prev => ({ ...prev, value: e.target.value }))}
              placeholder="16px, #ff0000, etc."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={newVariable.category || 'colors'}
              onChange={(e) => setNewVariable(prev => ({ ...prev, category: e.target.value as CSSVariable['category'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="colors">Colores</option>
              <option value="spacing">Espaciado</option>
              <option value="typography">Tipografía</option>
              <option value="layout">Layout</option>
              <option value="effects">Efectos</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={newVariable.type || 'color'}
              onChange={(e) => setNewVariable(prev => ({ ...prev, type: e.target.value as CSSVariable['type'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="color">Color</option>
              <option value="size">Tamaño</option>
              <option value="number">Número</option>
              <option value="text">Texto</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <input
            type="text"
            value={newVariable.description || ''}
            onChange={(e) => setNewVariable(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Descripción de la variable"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={addVariable}
          disabled={!newVariable.name || !newVariable.value}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Agregar Variable
        </button>
      </div>

      {/* Lista de variables */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Variables Activas ({variables.length})</h4>
        
        {/* Agrupadas por categoría */}
        {(['colors', 'spacing', 'typography', 'layout', 'effects'] as const).map((category) => {
          const categoryVariables = variables.filter(v => v.category === category);
          if (categoryVariables.length === 0) return null;

          const categoryNames = {
            colors: 'Colores',
            spacing: 'Espaciado', 
            typography: 'Tipografía',
            layout: 'Layout',
            effects: 'Efectos'
          };

          return (
            <div key={category} className="mb-4">
              <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                {categoryNames[category]} ({categoryVariables.length})
              </h5>
              <div className="space-y-2">
                {categoryVariables.map((variable) => (
                  <div key={variable.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono text-blue-600">{variable.name}</code>
                        <span className="text-gray-400">:</span>
                        <code className="text-sm font-mono text-green-600">{variable.value}</code>
                      </div>
                      {variable.description && (
                        <div className="text-xs text-gray-500 mt-1">{variable.description}</div>
                      )}
                    </div>
                    
                    {/* Preview */}
                    {variable.type === 'color' && (
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: variable.value }}
                      />
                    )}
                    
                    <button
                      onClick={() => removeVariable(variable.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CSS Output */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
        <h4 className="font-medium mb-2 text-gray-300">CSS Generado</h4>
        <pre className="text-sm overflow-auto">
          {generateCSSWithVariables(variables)}
        </pre>
      </div>

    </div>
  );
}

export default VariablesEditor;
