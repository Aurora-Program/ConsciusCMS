/**
 * CSS Rules Presets
 * Templates predefinidos para reglas CSS comunes
 */

export interface RuleTemplate {
  id: string;
  name: string;
  description: string;
  category: 'forma' | 'estructura' | 'funcion';
  css: string;
  tags: string[];
}

export const CSS_RULE_TEMPLATES: RuleTemplate[] = [
  
  // === FORMA TEMPLATES ===
  {
    id: 'gradient-primary',
    name: 'Gradiente Primario',
    description: 'Gradiente azul moderno para botones y elementos destacados',
    category: 'forma',
    css: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
border: none;
border-radius: 8px;
padding: 12px 24px;
font-weight: 600;
text-align: center;`,
    tags: ['gradient', 'button', 'primary', 'modern']
  },
  
  {
    id: 'glass-morphism',
    name: 'Glass Morphism',
    description: 'Efecto de cristal con blur y transparencia',
    category: 'forma',
    css: `background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(10px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);`,
    tags: ['glass', 'modern', 'transparency', 'blur']
  },
  
  {
    id: 'neumorphism',
    name: 'Neumorphism',
    description: 'Estilo neumórfico con sombras internas y externas',
    category: 'forma',
    css: `background: #e0e5ec;
border-radius: 16px;
box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
border: none;
padding: 20px;`,
    tags: ['neumorphism', 'soft', 'shadows', 'modern']
  },
  
  {
    id: 'card-elevated',
    name: 'Card Elevada',
    description: 'Tarjeta con elevación y hover effect',
    category: 'forma',
    css: `background: white;
border-radius: 12px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
border: 1px solid rgba(0, 0, 0, 0.05);
padding: 24px;
transition: all 0.3s ease;`,
    tags: ['card', 'shadow', 'hover', 'clean']
  },
  
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    description: 'Efecto de brillo neón para elementos destacados',
    category: 'forma',
    css: `background: #000;
color: #00ff88;
border: 2px solid #00ff88;
border-radius: 8px;
padding: 12px 24px;
box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
text-shadow: 0 0 10px rgba(0, 255, 136, 0.8);`,
    tags: ['neon', 'glow', 'dark', 'futuristic']
  },

  // === ESTRUCTURA TEMPLATES ===
  {
    id: 'flex-center-both',
    name: 'Flex Center (Ambos Ejes)',
    description: 'Centrado perfecto en ambos ejes con flexbox',
    category: 'estructura',
    css: `display: flex;
align-items: center;
justify-content: center;
min-height: 100%;`,
    tags: ['flexbox', 'center', 'layout']
  },
  
  {
    id: 'grid-responsive',
    name: 'Grid Responsivo',
    description: 'Grid que se adapta automáticamente al contenido',
    category: 'estructura',
    css: `display: grid;
grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
gap: 24px;
padding: 24px;`,
    tags: ['grid', 'responsive', 'auto-fit']
  },
  
  {
    id: 'stack-vertical',
    name: 'Stack Vertical',
    description: 'Apilamiento vertical con espaciado consistente',
    category: 'estructura',
    css: `display: flex;
flex-direction: column;
gap: 16px;
align-items: stretch;`,
    tags: ['stack', 'vertical', 'spacing']
  },
  
  {
    id: 'hero-fullscreen',
    name: 'Hero Pantalla Completa',
    description: 'Layout para hero que ocupa toda la pantalla',
    category: 'estructura',
    css: `display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
min-height: 100vh;
text-align: center;
padding: 40px 20px;`,
    tags: ['hero', 'fullscreen', 'center']
  },
  
  {
    id: 'sidebar-layout',
    name: 'Layout con Sidebar',
    description: 'Layout de dos columnas con sidebar fijo',
    category: 'estructura',
    css: `display: grid;
grid-template-columns: 280px 1fr;
gap: 24px;
min-height: 100vh;`,
    tags: ['sidebar', 'layout', 'two-column']
  },

  // === FUNCIÓN TEMPLATES ===
  {
    id: 'hover-lift',
    name: 'Hover Lift',
    description: 'Efecto de elevación al hacer hover',
    category: 'funcion',
    css: `transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
cursor: pointer;
transform: translateY(0);`,
    tags: ['hover', 'animation', 'lift']
  },
  
  {
    id: 'click-feedback',
    name: 'Click Feedback',
    description: 'Feedback visual al hacer click',
    category: 'funcion',
    css: `transition: all 0.15s ease;
transform: scale(1);
user-select: none;`,
    tags: ['click', 'feedback', 'scale']
  },
  
  {
    id: 'loading-pulse',
    name: 'Loading Pulse',
    description: 'Animación de pulso para elementos loading',
    category: 'funcion',
    css: `animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
opacity: 0.7;`,
    tags: ['loading', 'pulse', 'animation']
  },
  
  {
    id: 'focus-ring',
    name: 'Focus Ring',
    description: 'Anillo de foco para accesibilidad',
    category: 'funcion',
    css: `outline: none;
transition: box-shadow 0.15s ease;
border-radius: 6px;`,
    tags: ['focus', 'accessibility', 'outline']
  },
  
  {
    id: 'parallax-scroll',
    name: 'Parallax Scroll',
    description: 'Efecto parallax para elementos de fondo',
    category: 'funcion',
    css: `position: relative;
transform-style: preserve-3d;
perspective: 1000px;`,
    tags: ['parallax', 'scroll', '3d']
  }
];

// Filtrar templates por categoría
export const getTemplatesByCategory = (category: 'forma' | 'estructura' | 'funcion') => {
  return CSS_RULE_TEMPLATES.filter(template => template.category === category);
};

// Buscar templates por tags
export const searchTemplates = (query: string) => {
  const searchLower = query.toLowerCase();
  return CSS_RULE_TEMPLATES.filter(template => 
    template.name.toLowerCase().includes(searchLower) ||
    template.description.toLowerCase().includes(searchLower) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchLower))
  );
};

// Componente selector de templates
interface TemplateSelector {
  onSelect: (template: RuleTemplate) => void;
  category?: 'forma' | 'estructura' | 'funcion';
  className?: string;
}

export function TemplateSelector({ onSelect, category, className = '' }: TemplateSelector) {
  
  const templates = category 
    ? getTemplatesByCategory(category)
    : CSS_RULE_TEMPLATES;

  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700 mb-3">
        Templates {category && `de ${category}`}
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          >
            <div className="font-medium text-sm text-gray-900 mb-1">
              {template.name}
            </div>
            <div className="text-xs text-gray-600 mb-2">
              {template.description}
            </div>
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <span 
                  key={tag}
                  className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
