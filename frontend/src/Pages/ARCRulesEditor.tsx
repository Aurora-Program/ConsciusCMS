/**
 * ARC Rules Editor
 * Editor avanzado para definir reglas CSS y asignarlas a arquetipos
 */

import { useState } from 'react';
import { 
  type Nodo,
  type ArquetipoID
} from '../constellacss/arc-system';
import '../constellacss/arc-implementation.css';
import CSSHighlighter from '../components/CSSHighlighter';
import { TemplateSelector, type RuleTemplate, CSS_RULE_TEMPLATES } from '../components/CSSRuleTemplates';
import { ImportExportPanel, type ARCConfiguration } from '../components/ConfigurationManager';
import { VariablesEditor, type CSSVariable, DEFAULT_VARIABLES } from '../components/VariablesSystem';

// Tipos para el editor
export interface CustomRule {
  id: string;
  name: string;
  description: string;
  cssProperties: Record<string, string>;
  className?: string;
  category: 'funcion' | 'estructura' | 'forma';
}

export interface CustomArchetype {
  id: string;
  name: string;
  description: string;
  availableRoles: {
    funciones: string[];
    estructuras: string[];
    formas: string[];
  };
}

interface EditorState {
  customRules: CustomRule[];
  customArchetypes: CustomArchetype[];
  selectedRule: CustomRule | null;
  selectedArchetype: CustomArchetype | null;
  activeTab: 'rules' | 'archetypes' | 'preview' | 'config' | 'variables';
  previewNodo: Nodo;
  variables: CSSVariable[];
}

// Reglas base predeterminadas (incluye templates populares)
const BASE_RULES: CustomRule[] = [
  {
    id: 'flex-center',
    name: 'Flex Center',
    description: 'Centrado con flexbox',
    cssProperties: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    category: 'estructura'
  },
  {
    id: 'card-shadow',
    name: 'Card Shadow',
    description: 'Sombra para tarjetas',
    cssProperties: {
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px',
      backgroundColor: 'white'
    },
    category: 'forma'
  },
  {
    id: 'button-primary',
    name: 'Primary Button',
    description: 'Estilo de botón primario',
    cssProperties: {
      backgroundColor: '#3b82f6',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '6px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600'
    },
    category: 'forma'
  },
  {
    id: 'hero-layout',
    name: 'Hero Layout',
    description: 'Layout para secciones hero',
    cssProperties: {
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      textAlign: 'center'
    },
    category: 'estructura'
  },
  {
    id: 'cta-action',
    name: 'CTA Action',
    description: 'Comportamiento de call-to-action',
    cssProperties: {
      transition: 'all 0.2s ease',
      transform: 'scale(1)'
    },
    className: 'hover:scale-105 active:scale-95',
    category: 'funcion'
  },
  // Nuevos templates populares
  {
    id: 'gradient-primary',
    name: 'Gradiente Primario',
    description: 'Gradiente azul moderno para botones',
    cssProperties: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      fontWeight: '600',
      textAlign: 'center'
    },
    category: 'forma'
  },
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    description: 'Efecto de cristal con blur y transparencia',
    cssProperties: {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
    },
    category: 'forma'
  },
  {
    id: 'hover-lift',
    name: 'Hover Lift',
    description: 'Efecto de elevación al hacer hover',
    cssProperties: {
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      transform: 'translateY(0)'
    },
    className: 'hover:-translate-y-1 hover:shadow-lg',
    category: 'funcion'
  }
];

// Arquetipos base predeterminados
const BASE_ARCHETYPES: CustomArchetype[] = [
  {
    id: 'CustomHero',
    name: 'Hero Personalizado',
    description: 'Hero con reglas personalizables',
    availableRoles: {
      funciones: ['cta-action'],
      estructuras: ['flex-center', 'hero-layout'],
      formas: ['card-shadow']
    }
  },
  {
    id: 'CustomCard',
    name: 'Card Personalizada',
    description: 'Tarjeta con estilos personalizables',
    availableRoles: {
      funciones: [],
      estructuras: ['flex-center'],
      formas: ['card-shadow']
    }
  },
  {
    id: 'CustomButton',
    name: 'Botón Personalizado',
    description: 'Botón con estilos personalizables',
    availableRoles: {
      funciones: ['cta-action'],
      estructuras: ['flex-center'],
      formas: ['button-primary']
    }
  }
];

export function ARCRulesEditor() {
  
  const [state, setState] = useState<EditorState>({
    customRules: BASE_RULES,
    customArchetypes: BASE_ARCHETYPES,
    selectedRule: null,
    selectedArchetype: null,
    activeTab: 'rules',
    previewNodo: {
      arquetipo: 'Hero' as ArquetipoID,
      roles: {}
    },
    variables: DEFAULT_VARIABLES
  });

  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleDescription, setNewRuleDescription] = useState('');
  const [newRuleCategory, setNewRuleCategory] = useState<'funcion' | 'estructura' | 'forma'>('forma');
  const [cssInput, setCssInput] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  // Importar configuración
  const handleImportConfiguration = (config: ARCConfiguration) => {
    setState(prev => ({
      ...prev,
      customRules: config.customRules,
      customArchetypes: config.customArchetypes,
      selectedRule: null,
      selectedArchetype: null
    }));
  };

  // Cargar template
  const loadTemplate = (template: RuleTemplate) => {
    setNewRuleName(template.name);
    setNewRuleDescription(template.description);
    setNewRuleCategory(template.category);
    setCssInput(template.css);
    setShowTemplates(false);
  };

  // Crear nueva regla
  const createRule = () => {
    if (!newRuleName.trim()) return;

    const newRule: CustomRule = {
      id: newRuleName.toLowerCase().replace(/\s+/g, '-'),
      name: newRuleName,
      description: newRuleDescription || `Regla personalizada: ${newRuleName}`,
      cssProperties: parseCssInput(cssInput),
      category: newRuleCategory
    };

    const updatedRules = [...state.customRules, newRule];
    setState(prev => ({
      ...prev,
      customRules: updatedRules,
      selectedRule: newRule
    }));

    // Guardar en localStorage
    localStorage.setItem('arc-custom-rules', JSON.stringify(updatedRules));

    // Limpiar formulario
    setNewRuleName('');
    setNewRuleDescription('');
    setCssInput('');
  };

  // Parsear input CSS
  const parseCssInput = (input: string): Record<string, string> => {
    const properties: Record<string, string> = {};
    
    // Parsear CSS simple: "property: value;"
    const lines = input.split('\n');
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && trimmed.includes(':')) {
        const [property, ...valueParts] = trimmed.split(':');
        const value = valueParts.join(':').replace(';', '').trim();
        if (property && value) {
          // Convertir kebab-case a camelCase para React
          const camelProperty = property.trim().replace(/-([a-z])/g, (g) => g[1].toUpperCase());
          properties[camelProperty] = value;
        }
      }
    });

    return properties;
  };

  // Generar CSS desde propiedades
  const generateCssText = (properties: Record<string, string>): string => {
    return Object.entries(properties)
      .map(([prop, value]) => {
        // Convertir camelCase a kebab-case
        const kebabProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${kebabProp}: ${value};`;
      })
      .join('\n');
  };

  // Actualizar regla
  const updateRule = (ruleId: string, updates: Partial<CustomRule>) => {
    setState(prev => ({
      ...prev,
      customRules: prev.customRules.map(rule => 
        rule.id === ruleId ? { ...rule, ...updates } : rule
      ),
      selectedRule: prev.selectedRule?.id === ruleId 
        ? { ...prev.selectedRule, ...updates } 
        : prev.selectedRule
    }));
  };

  // Eliminar regla
  const deleteRule = (ruleId: string) => {
    setState(prev => ({
      ...prev,
      customRules: prev.customRules.filter(rule => rule.id !== ruleId),
      selectedRule: prev.selectedRule?.id === ruleId ? null : prev.selectedRule
    }));
  };

  // Crear nuevo arquetipo
  const createArchetype = () => {
    const newArchetype: CustomArchetype = {
      id: `Custom${Date.now()}`,
      name: 'Nuevo Arquetipo',
      description: 'Arquetipo personalizado',
      availableRoles: {
        funciones: [],
        estructuras: [],
        formas: []
      }
    };

    const updatedArchetypes = [...state.customArchetypes, newArchetype];
    setState(prev => ({
      ...prev,
      customArchetypes: updatedArchetypes,
      selectedArchetype: newArchetype
    }));

    // Guardar en localStorage
    localStorage.setItem('arc-custom-archetypes', JSON.stringify(updatedArchetypes));
  };

  // Asignar regla a arquetipo
  const assignRuleToArchetype = (archetypeId: string, ruleId: string, category: 'funciones' | 'estructuras' | 'formas') => {
    setState(prev => ({
      ...prev,
      customArchetypes: prev.customArchetypes.map(archetype => 
        archetype.id === archetypeId 
          ? {
              ...archetype,
              availableRoles: {
                ...archetype.availableRoles,
                [category]: [...archetype.availableRoles[category], ruleId]
              }
            }
          : archetype
      )
    }));
  };

  // Renderizar preview con reglas personalizadas
  const renderCustomPreview = () => {
    const selectedArchetype = state.customArchetypes.find(a => a.id === state.previewNodo.arquetipo);
    if (!selectedArchetype) return null;

    // Aplicar reglas personalizadas
    let combinedStyles: Record<string, string> = {};
    let combinedClasses: string[] = [];
    let appliedRules: string[] = [];

    // Aplicar reglas según los roles asignados
    Object.entries(state.previewNodo.roles).forEach(([, roleId]) => {
      if (roleId) {
        const rule = state.customRules.find(r => r.id === roleId);
        if (rule) {
          combinedStyles = { ...combinedStyles, ...rule.cssProperties };
          appliedRules.push(rule.name);
          if (rule.className) {
            combinedClasses.push(rule.className);
          }
        }
      }
    });

    return (
      <div className="space-y-4">
        
        {/* Preview visual */}
        <div 
          className={`min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center transition-all duration-300 ${combinedClasses.join(' ')}`}
          style={combinedStyles}
        >
          <div className="text-center p-6">
            <h3 className="text-xl font-semibold mb-2">
              {selectedArchetype.name}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedArchetype.description}
            </p>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              style={combinedStyles}
            >
              Ejemplo de Botón
            </button>
          </div>
        </div>

        {/* Info de reglas aplicadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Reglas activas */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Reglas Aplicadas</h4>
            {appliedRules.length > 0 ? (
              <div className="space-y-1">
                {appliedRules.map((ruleName, index) => (
                  <div key={index} className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    ✓ {ruleName}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay reglas aplicadas</p>
            )}
          </div>

          {/* Configuración actual */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Configuración</h4>
            <div className="text-sm space-y-1">
              <div><span className="font-medium">Arquetipo:</span> {selectedArchetype.name}</div>
              <div><span className="font-medium">Función:</span> {state.previewNodo.roles.funcion || 'Ninguna'}</div>
              <div><span className="font-medium">Estructura:</span> {state.previewNodo.roles.estructura || 'Ninguna'}</div>
              <div><span className="font-medium">Forma:</span> {state.previewNodo.roles.forma || 'Ninguna'}</div>
            </div>
          </div>

        </div>

        {/* CSS generado */}
        {Object.keys(combinedStyles).length > 0 && (
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
            <h4 className="font-medium mb-2 text-gray-300">CSS Generado</h4>
            <pre className="text-sm overflow-auto">
              {generateCssText(combinedStyles)}
            </pre>
          </div>
        )}

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                ARC Rules Editor
              </h1>
              <p className="text-gray-600">
                Define reglas CSS personalizadas y asígnalas a arquetipos
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href="/live-demo"
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                🚀 Ver Demo Live
              </a>
              
              <button
                onClick={() => {
                  console.group('🎨 ARC Rules Editor - Estado Actual');
                  console.log('Custom Rules:', state.customRules);
                  console.log('Custom Archetypes:', state.customArchetypes);
                  console.log('Variables:', state.variables);
                  console.log('Preview Nodo:', state.previewNodo);
                  console.groupEnd();
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Debug Estado
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {(['rules', 'archetypes', 'preview', 'variables', 'config'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setState(prev => ({ ...prev, activeTab: tab }))}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                state.activeTab === tab
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab === 'rules' ? 'Reglas CSS' : 
               tab === 'archetypes' ? 'Arquetipos' : 
               tab === 'preview' ? 'Preview' : 
               tab === 'variables' ? 'Variables' :
               'Configuración'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Panel Principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Tab: Reglas CSS */}
            {state.activeTab === 'rules' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Reglas CSS Personalizadas
                  </h3>
                  <span className="text-sm text-gray-500">
                    {state.customRules.length} reglas
                  </span>
                </div>

                {/* Crear nueva regla */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Crear Nueva Regla</h4>
                    <button
                      onClick={() => setShowTemplates(!showTemplates)}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {showTemplates ? 'Ocultar' : '📋 Templates'}
                    </button>
                  </div>

                  {/* Templates selector */}
                  {showTemplates && (
                    <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
                      <TemplateSelector 
                        onSelect={loadTemplate}
                        category={newRuleCategory}
                      />
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        value={newRuleName}
                        onChange={(e) => setNewRuleName(e.target.value)}
                        placeholder="Ej: Button Gradient"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Categoría
                      </label>
                      <select
                        value={newRuleCategory}
                        onChange={(e) => setNewRuleCategory(e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="forma">Forma (Apariencia)</option>
                        <option value="estructura">Estructura (Layout)</option>
                        <option value="funcion">Función (Comportamiento)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={newRuleDescription}
                      onChange={(e) => setNewRuleDescription(e.target.value)}
                      placeholder="Breve descripción de la regla"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSS Properties
                    </label>
                    <CSSHighlighter
                      value={cssInput}
                      onChange={setCssInput}
                      placeholder={`background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
border-radius: 8px;
padding: 12px 24px;
color: white;`}
                      rows={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Escribe CSS en formato estándar. Se convertirá automáticamente para React.
                    </p>
                  </div>

                  <button
                    onClick={createRule}
                    disabled={!newRuleName.trim()}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Crear Regla
                  </button>
                </div>

                {/* Lista de reglas */}
                <div className="space-y-3">
                  {state.customRules.map((rule) => (
                    <div 
                      key={rule.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        state.selectedRule?.id === rule.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setState(prev => ({ ...prev, selectedRule: rule }))}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-gray-900">{rule.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              rule.category === 'forma' ? 'bg-purple-100 text-purple-800' :
                              rule.category === 'estructura' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rule.category}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{rule.description}</p>
                          <div className="text-xs text-gray-500 mt-2">
                            {Object.keys(rule.cssProperties).length} propiedades CSS
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteRule(rule.id);
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab: Arquetipos */}
            {state.activeTab === 'archetypes' && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Arquetipos Personalizados
                  </h3>
                  <button
                    onClick={createArchetype}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    + Nuevo Arquetipo
                  </button>
                </div>

                <div className="space-y-4">
                  {state.customArchetypes.map((archetype) => (
                    <div key={archetype.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-medium text-gray-900">{archetype.name}</h4>
                          <p className="text-sm text-gray-600">{archetype.description}</p>
                        </div>
                        <button
                          onClick={() => setState(prev => ({ ...prev, selectedArchetype: archetype }))}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Editar
                        </button>
                      </div>

                      {/* Roles asignados */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        
                        {(['funciones', 'estructuras', 'formas'] as const).map((category) => (
                          <div key={category}>
                            <h5 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                              {category}
                            </h5>
                            <div className="space-y-1">
                              {archetype.availableRoles[category].map((roleId) => {
                                const rule = state.customRules.find(r => r.id === roleId);
                                return rule ? (
                                  <div key={roleId} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                    {rule.name}
                                  </div>
                                ) : null;
                              })}
                            </div>
                            
                            {/* Dropdown para agregar reglas */}
                            <select
                              onChange={(e) => {
                                if (e.target.value) {
                                  assignRuleToArchetype(archetype.id, e.target.value, category);
                                  e.target.value = '';
                                }
                              }}
                              className="w-full mt-2 text-xs px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value="">+ Agregar regla</option>
                              {state.customRules
                                .filter(rule => {
                                  const categoryMap = {
                                    funciones: 'funcion',
                                    estructuras: 'estructura', 
                                    formas: 'forma'
                                  };
                                  return rule.category === categoryMap[category] && 
                                         !archetype.availableRoles[category].includes(rule.id);
                                })
                                .map(rule => (
                                  <option key={rule.id} value={rule.id}>
                                    {rule.name}
                                  </option>
                                ))
                              }
                            </select>
                          </div>
                        ))}

                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab: Preview */}
            {state.activeTab === 'preview' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Preview Interactivo
                </h3>

                {/* Configuración del preview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Arquetipo
                    </label>
                    <select
                      value={state.previewNodo.arquetipo}
                      onChange={(e) => setState(prev => ({
                        ...prev,
                        previewNodo: {
                          ...prev.previewNodo,
                          arquetipo: e.target.value as ArquetipoID,
                          roles: {} // Reset roles
                        }
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {state.customArchetypes.map(archetype => (
                        <option key={archetype.id} value={archetype.id}>
                          {archetype.name}
                        </option>
                      ))}
                    </select>
                  </div>

                </div>

                {/* Configuración de roles */}
                {(() => {
                  const selectedArchetype = state.customArchetypes.find(a => a.id === state.previewNodo.arquetipo);
                  if (!selectedArchetype) return null;

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      
                      {(['funciones', 'estructuras', 'formas'] as const).map((category) => (
                        <div key={category}>
                          <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                            {category.slice(0, -1)} {/* Remove 's' */}
                          </label>
                          <select
                            value={state.previewNodo.roles[category.slice(0, -1) as keyof typeof state.previewNodo.roles] || ''}
                            onChange={(e) => setState(prev => ({
                              ...prev,
                              previewNodo: {
                                ...prev.previewNodo,
                                roles: {
                                  ...prev.previewNodo.roles,
                                  [category.slice(0, -1)]: e.target.value
                                }
                              }
                            }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">Seleccionar...</option>
                            {selectedArchetype.availableRoles[category].map(roleId => {
                              const rule = state.customRules.find(r => r.id === roleId);
                              return rule ? (
                                <option key={roleId} value={roleId}>
                                  {rule.name}
                                </option>
                              ) : null;
                            })}
                          </select>
                        </div>
                      ))}

                    </div>
                  );
                })()}

                {/* Preview visual */}
                <div className="border rounded-lg p-6 bg-gray-50">
                  {renderCustomPreview()}
                </div>

              </div>
            )}

            {/* Tab: Variables */}
            {state.activeTab === 'variables' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Sistema de Variables CSS
                </h3>

                <VariablesEditor
                  variables={state.variables}
                  onVariablesChange={(variables) => setState(prev => ({ ...prev, variables }))}
                />

              </div>
            )}

            {/* Tab: Configuración */}
            {state.activeTab === 'config' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Gestión de Configuración
                </h3>

                <ImportExportPanel
                  customRules={state.customRules}
                  customArchetypes={state.customArchetypes}
                  onImport={handleImportConfiguration}
                />

              </div>
            )}

          </div>

          {/* Panel Lateral - Detalles */}
          <div className="space-y-6">
            
            {/* Regla seleccionada */}
            {state.selectedRule && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detalles de Regla
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      value={state.selectedRule.name}
                      onChange={(e) => updateRule(state.selectedRule!.id, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CSS Properties
                    </label>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                      {generateCssText(state.selectedRule.cssProperties)}
                    </pre>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      React Style Object
                    </label>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-48">
                      {JSON.stringify(state.selectedRule.cssProperties, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* Estadísticas */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Estadísticas
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Reglas:</span>
                  <span className="font-medium">{state.customRules.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Arquetipos:</span>
                  <span className="font-medium">{state.customArchetypes.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Reglas de Forma:</span>
                  <span className="font-medium">
                    {state.customRules.filter(r => r.category === 'forma').length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Reglas de Estructura:</span>
                  <span className="font-medium">
                    {state.customRules.filter(r => r.category === 'estructura').length}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Reglas de Función:</span>
                  <span className="font-medium">
                    {state.customRules.filter(r => r.category === 'funcion').length}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}

export default ARCRulesEditor;
