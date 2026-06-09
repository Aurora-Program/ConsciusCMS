/**
 * Configuration Import/Export
 * Utilidades para guardar y cargar configuraciones de ARC Rules Editor
 */

import { type CustomRule, type CustomArchetype } from '../Pages/ARCRulesEditor';

export interface ARCConfiguration {
  version: string;
  timestamp: string;
  name: string;
  description: string;
  customRules: CustomRule[];
  customArchetypes: CustomArchetype[];
  metadata: {
    totalRules: number;
    totalArchetypes: number;
    categories: Record<string, number>;
  };
}

// Exportar configuración
export const exportConfiguration = (
  customRules: CustomRule[],
  customArchetypes: CustomArchetype[],
  name: string = 'ARC Configuration',
  description: string = 'Configuración personalizada de ARC'
): ARCConfiguration => {
  
  const categories = customRules.reduce((acc, rule) => {
    acc[rule.category] = (acc[rule.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    name,
    description,
    customRules,
    customArchetypes,
    metadata: {
      totalRules: customRules.length,
      totalArchetypes: customArchetypes.length,
      categories
    }
  };
};

// Importar configuración
export const importConfiguration = (configData: string): ARCConfiguration => {
  try {
    const config: ARCConfiguration = JSON.parse(configData);
    
    // Validar estructura
    if (!config.version || !config.customRules || !config.customArchetypes) {
      throw new Error('Formato de configuración inválido');
    }
    
    // Validar reglas
    config.customRules.forEach((rule, index) => {
      if (!rule.id || !rule.name || !rule.category || !rule.cssProperties) {
        throw new Error(`Regla inválida en posición ${index}`);
      }
    });
    
    // Validar arquetipos
    config.customArchetypes.forEach((archetype, index) => {
      if (!archetype.id || !archetype.name || !archetype.availableRoles) {
        throw new Error(`Arquetipo inválido en posición ${index}`);
      }
    });
    
    return config;
    
  } catch (error) {
    throw new Error(`Error al importar configuración: ${error.message}`);
  }
};

// Descargar configuración como archivo JSON
export const downloadConfiguration = (
  customRules: CustomRule[],
  customArchetypes: CustomArchetype[],
  fileName: string = 'arc-configuration.json'
) => {
  const config = exportConfiguration(customRules, customArchetypes);
  const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Copiar configuración al clipboard
export const copyConfigurationToClipboard = async (
  customRules: CustomRule[],
  customArchetypes: CustomArchetype[]
): Promise<boolean> => {
  try {
    const config = exportConfiguration(customRules, customArchetypes);
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2));
    return true;
  } catch (error) {
    console.error('Error copiando al clipboard:', error);
    return false;
  }
};

// Configuraciones predefinidas populares
export const PRESET_CONFIGURATIONS: ARCConfiguration[] = [
  {
    version: '1.0.0',
    timestamp: '2025-09-11T00:00:00.000Z',
    name: 'Modern Design System',
    description: 'Sistema de diseño moderno con glassmorphism y gradientes',
    customRules: [
      {
        id: 'glass-card',
        name: 'Glass Card',
        description: 'Tarjeta con efecto glass',
        cssProperties: {
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        },
        category: 'forma'
      },
      {
        id: 'gradient-hero',
        name: 'Gradient Hero',
        description: 'Fondo con gradiente para hero',
        cssProperties: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        },
        category: 'estructura'
      }
    ],
    customArchetypes: [
      {
        id: 'ModernCard',
        name: 'Modern Card',
        description: 'Tarjeta moderna con glass effect',
        availableRoles: {
          funciones: [],
          estructuras: [],
          formas: ['glass-card']
        }
      }
    ],
    metadata: {
      totalRules: 2,
      totalArchetypes: 1,
      categories: { forma: 1, estructura: 1 }
    }
  },
  
  {
    version: '1.0.0',
    timestamp: '2025-09-11T00:00:00.000Z',
    name: 'Minimalist UI',
    description: 'Interfaz minimalista con espacios amplios',
    customRules: [
      {
        id: 'minimal-button',
        name: 'Minimal Button',
        description: 'Botón minimalista',
        cssProperties: {
          background: 'transparent',
          border: '1px solid #e5e7eb',
          padding: '12px 24px',
          borderRadius: '4px',
          color: '#374151',
          transition: 'all 0.2s ease'
        },
        category: 'forma'
      },
      {
        id: 'wide-spacing',
        name: 'Wide Spacing',
        description: 'Espaciado amplio',
        cssProperties: {
          padding: '48px',
          margin: '24px 0'
        },
        category: 'estructura'
      }
    ],
    customArchetypes: [
      {
        id: 'MinimalButton',
        name: 'Minimal Button',
        description: 'Botón con estilo minimalista',
        availableRoles: {
          funciones: [],
          estructuras: ['wide-spacing'],
          formas: ['minimal-button']
        }
      }
    ],
    metadata: {
      totalRules: 2,
      totalArchetypes: 1,
      categories: { forma: 1, estructura: 1 }
    }
  }
];

// Componente para import/export
interface ImportExportPanelProps {
  customRules: CustomRule[];
  customArchetypes: CustomArchetype[];
  onImport: (config: ARCConfiguration) => void;
  className?: string;
}

export function ImportExportPanel({ 
  customRules, 
  customArchetypes, 
  onImport, 
  className = '' 
}: ImportExportPanelProps) {
  
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const config = importConfiguration(e.target?.result as string);
        onImport(config);
        alert('Configuración importada exitosamente');
      } catch (error) {
        alert(`Error importando: ${error.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleCopyToClipboard = async () => {
    const success = await copyConfigurationToClipboard(customRules, customArchetypes);
    if (success) {
      alert('Configuración copiada al clipboard');
    } else {
      alert('Error copiando al clipboard');
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      
      <h3 className="text-lg font-semibold text-gray-900">
        Exportar/Importar Configuración
      </h3>
      
      {/* Export buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => downloadConfiguration(customRules, customArchetypes)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          📁 Descargar JSON
        </button>
        
        <button
          onClick={handleCopyToClipboard}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          📋 Copiar al Clipboard
        </button>
      </div>
      
      {/* Import */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Importar desde archivo
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>
      
      {/* Presets */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Configuraciones Predefinidas</h4>
        <div className="space-y-2">
          {PRESET_CONFIGURATIONS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => onImport(preset)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="text-xs text-gray-600">{preset.description}</div>
              <div className="text-xs text-gray-500 mt-1">
                {preset.metadata.totalRules} reglas, {preset.metadata.totalArchetypes} arquetipos
              </div>
            </button>
          ))}
        </div>
      </div>
      
    </div>
  );
}
