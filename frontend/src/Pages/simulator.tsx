
import React from "react";

// Estilos CSS personalizados para animaciones
const modalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes zoomIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }

  .animate-zoom-in {
    animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Mejora para backdrop-blur en navegadores que no lo soporten */
  .modal-backdrop {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
  
  /* Prevenir scroll cuando el modal está abierto */
  body.modal-open {
    overflow: hidden;
  }
`;

// Interfaces principales del sistema ARC (Modelo ConstellaCSS Puro)
type Dimension = 'es' | 'fn' | 'fo';

interface GrupoReglas {
  id: string;              // p.ej. "layout/stack" | "interactive/focus-ring" | "visual/outlined"
  dimension: Dimension;    // a qué dimensión pertenece
  clases: string[];        // utilidades CSS (Tailwind/cls) -> sin pseudo-capturas
  tokens?: Record<string, string | number>; // opcional
}

interface Arquetipo {
  id: string;               // "es:Layout/Stacked"
  dimension: Dimension;     // 'es' | 'fn' | 'fo'
  grupos: string[];         // IDs de GrupoReglas
  tokens?: Record<string, string | number>;
  allowWith?: string[];
  denyWith?: string[];
}

interface Nodo {
  id: string;
  es: string; // ArquetipoID (p.ej. "es:Layout/Stacked")
  fn: string; // "fn:Interactive/Clickable"
  fo: string; // "fo:Button/FilledBrand"
  tokens?: Record<string, string | number>;     // overrides locales
  classNameExtra?: string;                    // extras permitidos
  contenido?: { selector: string; map: (state: any) => any }; // EtiquetaContenido
  hijos?: Nodo[];
}

// Registros del sistema
interface Registries {
  grupos: Record<string, GrupoReglas>;
  arquetipos: Record<string, Arquetipo>;
}

interface Theme {
  tokens: Record<string, string | number>;
}

// Interfaces para el simulador (compatibilidad temporal)
interface Regla {
  id: string;
  tipo: string;
  nombre: string;
  fragment: string;
  createdAt: Date;
}

interface Etiqueta {
  id: string;
  tipo: 'contenido' | 'section' | 'componente';
  fo: string; // ID del arquetipo de forma
  fn: string; // ID del arquetipo de función
  es: string; // ID del arquetipo de estructura
  contenido: string;
  createdAt: Date;
}

// Componente Modal reutilizable
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

// Catálogo base ConstellaCSS
const createRegistries = (): Registries => ({
  grupos: {
    'layout/stack':          { id:'layout/stack', dimension:'es', clases:['flex','flex-col','gap-4'] },
    'layout/grid':           { id:'layout/grid', dimension:'es', clases:['grid','gap-4'] },
    'container/section':     { id:'container/section', dimension:'es', clases:['max-w-screen-xl','mx-auto','px-4'] },
    'container/card':        { id:'container/card', dimension:'es', clases:['p-4'] },
    'interactive/clickable': { id:'interactive/clickable', dimension:'fn', clases:['cursor-pointer','transition','duration-200','hover:brightness-105','focus:outline-none','focus:ring','focus:ring-blue-300'] },
    'interactive/input':     { id:'interactive/input', dimension:'fn', clases:['focus:ring-2','focus:ring-blue-500','focus:border-blue-500'] },
    'visual/filled-brand':   { id:'visual/filled-brand', dimension:'fo', clases:['bg-blue-600','text-white','rounded-lg','px-4','py-2'] },
    'visual/outlined':       { id:'visual/outlined', dimension:'fo', clases:['border','border-gray-300','bg-white','text-gray-900','rounded-lg','px-4','py-2'] },
    'visual/card-surface':   { id:'visual/card-surface', dimension:'fo', clases:['bg-white','text-gray-900','shadow','shadow-black/10','rounded-xl','border','border-gray-200'] },
    'visual/text-primary':   { id:'visual/text-primary', dimension:'fo', clases:['text-gray-900','font-medium'] },
  },
  arquetipos: {
    'es:Section/Container': { id:'es:Section/Container', dimension:'es', grupos:['container/section'] },
    'es:Layout/Stacked':    { id:'es:Layout/Stacked',    dimension:'es', grupos:['layout/stack'] },
    'es:Layout/Grid':       { id:'es:Layout/Grid',       dimension:'es', grupos:['layout/grid'] },
    'es:Container/Card':    { id:'es:Container/Card',    dimension:'es', grupos:['container/card'] },
    'fn:Interactive/CTA':   { id:'fn:Interactive/CTA',   dimension:'fn', grupos:['interactive/clickable'] },
    'fn:Interactive/Input': { id:'fn:Interactive/Input', dimension:'fn', grupos:['interactive/input'] },
    'fo:Button/Primary':    { id:'fo:Button/Primary',    dimension:'fo', grupos:['visual/filled-brand'] },
    'fo:Button/Secondary':  { id:'fo:Button/Secondary',  dimension:'fo', grupos:['visual/outlined'] },
    'fo:Card/Surface':      { id:'fo:Card/Surface',      dimension:'fo', grupos:['visual/card-surface'] },
    'fo:Text/Primary':      { id:'fo:Text/Primary',      dimension:'fo', grupos:['visual/text-primary'] },
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
  return Array.from(new Set(flat)).join(' '); // dedupe + orden
};

// Resolver ConstellaCSS puro
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
    ...gES.map(g => g.tokens),
    es.tokens,
    ...gFN.map(g => g.tokens),
    fn.tokens,
    ...gFO.map(g => g.tokens),
    fo.tokens,
    node.tokens
  );

  const props = node.contenido ? node.contenido.map(state) : {};
  const hijos = (node.hijos || []).map(h => resolverNodo(h, registries, theme, state));
  
  return { className, tokens, props, hijos };
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Efecto para manejar la tecla ESC
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.classList.add('modal-open');
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Agregar estilos CSS al documento
  React.useEffect(() => {
    if (!document.getElementById('modal-styles')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'modal-styles';
      styleSheet.textContent = modalStyles;
      document.head.appendChild(styleSheet);
    }
  }, []);

  if (!isOpen) return null;

  // Función para manejar click en el overlay
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 modal-backdrop flex items-center justify-center z-[9999] p-4 animate-fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{ zIndex: 9999 }}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-zoom-in border border-gray-200 relative">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0 z-10">
          <h3 id="modal-title" className="text-lg font-semibold text-gray-900 flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-2 transition-all duration-200 hover:scale-110 hover:rotate-90"
            aria-label="Cerrar modal"
            title="Presiona ESC para cerrar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)] bg-white relative">
          {children}
        </div>
      </div>
    </div>
  );
};

// Simulador de tecnológica ConstellaCSS - ARC - EspiralML

function Simulator() {
  const [activeTab, setActiveTab] = React.useState<'reglas' | 'arquetipos' | 'etiquetas' | 'nodos' | 'preview'>('reglas');
  const [showRenderArea, setShowRenderArea] = React.useState(true);
  
  // Registros ConstellaCSS
  const [registries, setRegistries] = React.useState<Registries>(createRegistries());
  const [theme, setTheme] = React.useState<Theme>(createTheme());
  
  // Estados para nodos ConstellaCSS
  const [nodos, setNodos] = React.useState<Nodo[]>([
    {
      id: 'ejemplo_button_primary',
      es: 'es:Layout/Stacked',
      fn: 'fn:Interactive/CTA',
      fo: 'fo:Button/Primary',
      contenido: { selector: 'ui', map: (state: any) => ({ label: 'Botón Primario' }) }
    },
    {
      id: 'ejemplo_button_secondary',
      es: 'es:Container/Card',
      fn: 'fn:Interactive/CTA',
      fo: 'fo:Button/Secondary',
      contenido: { selector: 'ui', map: (state: any) => ({ label: 'Botón Secundario' }) }
    },
    {
      id: 'ejemplo_card',
      es: 'es:Layout/Stacked',
      fn: 'fn:Interactive/Input',
      fo: 'fo:Card/Surface',
      contenido: { selector: 'ui', map: (state: any) => ({ label: 'Tarjeta Interactiva' }) },
      classNameExtra: 'min-w-48 min-h-24 justify-center items-center'
    }
  ]);
  const [newNodo, setNewNodo] = React.useState<Partial<Nodo>>({
    es: '',
    fn: '',
    fo: '',
    contenido: { selector: 'ui', map: (state: any) => ({ label: state?.ui?.cta ?? 'Botón' }) },
    classNameExtra: '',
    tokens: {}
  });
  
  // Estados del sistema anterior (compatibilidad temporal)
  const [reglas, setReglas] = React.useState<Regla[]>([]);
  const [arquetipos, setArquetipos] = React.useState<Arquetipo[]>([]);
  const [etiquetas, setEtiquetas] = React.useState<Etiqueta[]>([]);
  const [selectedRules, setSelectedRules] = React.useState<string[]>([]);
  const [newRule, setNewRule] = React.useState({
    nombre: 'Botón Redondeado', 
    tipo: 'fo', 
    fragment: `.elemento {\n  border-radius: 8px;\n  padding: 0.75rem 1.5rem;\n  font-weight: 500;\n  transition: all 0.2s ease;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n}`
  });
  const [newArchetype, setNewArchetype] = React.useState({
    nombre: 'Botón Moderno', 
    tipo: 'fo' as 'fo' | 'fn' | 'es', 
    reglas: [] as string[]
  });
  const [newEtiqueta, setNewEtiqueta] = React.useState({
    tipo: 'componente' as 'contenido' | 'section' | 'componente', 
    fo: '', 
    fn: '', 
    es: '', 
    contenido: '<button>Mi Botón ARC</button>'
  });
  
  // Estados para controlar los modales
  const [showRuleModal, setShowRuleModal] = React.useState(false);
  const [showArchetypeModal, setShowArchetypeModal] = React.useState(false);
  const [showEtiquetaModal, setShowEtiquetaModal] = React.useState(false);
  
  // Estados para el modo de edición
  const [editingRuleIndex, setEditingRuleIndex] = React.useState<number | null>(null);
  const [editingArchetypeIndex, setEditingArchetypeIndex] = React.useState<number | null>(null);
  const [editingEtiquetaIndex, setEditingEtiquetaIndex] = React.useState<number | null>(null);
  
  // Funciones para persistencia con localStorage
  const saveToLocalStorage = () => {
    try {
      const data = {
        reglas: reglas,
        arquetipos: arquetipos,
        etiquetas: etiquetas,
        nodos: nodos,
        timestamp: new Date().toISOString()
      };
      localStorage.setItem('arc-simulator-data', JSON.stringify(data));
      console.log('Datos guardados automáticamente');
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  };

  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('arc-simulator-data');
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Restaurar reglas
        if (data.reglas) {
          const reglasWithDates = data.reglas.map((regla: any) => ({
            ...regla,
            createdAt: new Date(regla.createdAt)
          }));
          setReglas(reglasWithDates);
        }
        
        // Restaurar arquetipos
        if (data.arquetipos) {
          const arquetiposWithDates = data.arquetipos.map((arquetipo: any) => ({
            ...arquetipo,
            createdAt: new Date(arquetipo.createdAt)
          }));
          setArquetipos(arquetiposWithDates);
        }
        
        // Restaurar nodos ConstellaCSS
        if (data.nodos) {
          setNodos(data.nodos);
        }
        
        // Restaurar etiquetas
        if (data.etiquetas) {
          const etiquetasWithDates = data.etiquetas.map((etiqueta: any) => ({
            ...etiqueta,
            createdAt: new Date(etiqueta.createdAt)
          }));
          setEtiquetas(etiquetasWithDates);
        }
        
        console.log('Datos cargados desde localStorage:', data.timestamp);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const clearAllData = () => {
    if (confirm('¿Estás seguro de que quieres borrar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('arc-simulator-data');
      setReglas([]);
      setArquetipos([]);
      setEtiquetas([]);
      setNodos([]);
      console.log('Todos los datos han sido eliminados');
    }
  };

  const exportData = () => {
    try {
      const data = {
        reglas: reglas,
        arquetipos: arquetipos,
        etiquetas: etiquetas,
        nodos: nodos,
        exportedAt: new Date().toISOString(),
        version: '2.0'
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `arc-simulator-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('Datos exportados exitosamente');
    } catch (error) {
      console.error('Error exportando datos:', error);
    }
  };

  // Función para convertir fragmento CSS a estilos React
  const parseCSS = (fragment: string): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    try {
      // Extraer las propiedades CSS del fragmento
      const cssProps = fragment.match(/([a-z-]+)\s*:\s*([^;]+);/gi);
      if (cssProps) {
        cssProps.forEach(prop => {
          const [property, value] = prop.split(':').map(s => s.trim());
          if (property && value) {
            // Convertir kebab-case a camelCase para React
            const camelCaseProperty = property.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            const cleanValue = value.replace(';', '').trim();
            
            // Aplicar el estilo
            (styles as any)[camelCaseProperty] = cleanValue;
          }
        });
      }
    } catch (error) {
      console.warn('Error parsing CSS:', error);
    }
    
    return styles;
  };

  // Función para validar CSS
  const validateCSS = (fragment: string): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (!fragment.trim()) {
      return { isValid: true, errors: [] };
    }
    
    try {
      // Validar sintaxis básica
      if (!fragment.includes(':')) {
        errors.push('CSS debe contener formato propiedad: valor');
      }
      
      // Verificar propiedades CSS
      const cssProps = fragment.match(/([a-z-]+)\s*:\s*([^;]+);/gi);
      if (cssProps) {
        cssProps.forEach(prop => {
          const [property] = prop.split(':').map(s => s.trim());
          const validProperties = [
            'color', 'background-color', 'font-size', 'padding', 'margin', 'border',
            'width', 'height', 'display', 'position', 'opacity', 'transform', 'text-align',
            'font-weight', 'border-radius', 'box-shadow', 'transition'
          ];
          
          if (property && !validProperties.some(valid => property.toLowerCase().includes(valid))) {
            errors.push(`Propiedad desconocida: ${property}`);
          }
        });
      }
    } catch (error) {
      errors.push('Error de sintaxis CSS');
    }
    
    return { isValid: errors.length === 0, errors };
  };

  // Función para obtener estilos CSS combinados de una etiqueta
  const getEtiquetaStyles = (etiqueta: Etiqueta): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    // Obtener arquetipos
    const foArquetipo = arquetipos.find(a => a.nombre === etiqueta.fo && a.tipo === 'fo');
    const fnArquetipo = arquetipos.find(a => a.nombre === etiqueta.fn && a.tipo === 'fn');  
    const esArquetipo = arquetipos.find(a => a.nombre === etiqueta.es && a.tipo === 'es');
    
    // Aplicar estilos de las reglas FO (Forma)
    if (foArquetipo?.reglas.length) {
      foArquetipo.reglas.forEach(reglaId => {
        const regla = reglas.find(r => r.id === reglaId);
        if (regla) {
          Object.assign(styles, parseCSS(regla.fragment));
        }
      });
    }
    
    // Aplicar estilos de las reglas FN (Función) - solo los no interactivos
    if (fnArquetipo?.reglas.length) {
      fnArquetipo.reglas.forEach(reglaId => {
        const regla = reglas.find(r => r.id === reglaId);
        if (regla) {
          // Filtrar solo las propiedades base, no los pseudo-selectores
          const baseCSS = regla.fragment.replace(/:hover[^}]*}/g, '').replace(/:active[^}]*}/g, '').replace(/:focus[^}]*}/g, '');
          Object.assign(styles, parseCSS(baseCSS));
        }
      });
    }
    
    // Aplicar estilos de las reglas ES (Estructura)
    if (esArquetipo?.reglas.length) {
      esArquetipo.reglas.forEach(reglaId => {
        const regla = reglas.find(r => r.id === reglaId);
        if (regla) {
          Object.assign(styles, parseCSS(regla.fragment));
        }
      });
    }
    
    return styles;
  };

  // Función para obtener estilos hover de las reglas FN
  const getHoverStyles = (etiqueta: Etiqueta): React.CSSProperties => {
    const styles: React.CSSProperties = {};
    
    const fnArquetipo = arquetipos.find(a => a.nombre === etiqueta.fn && a.tipo === 'fn');
    
    if (fnArquetipo?.reglas.length) {
      fnArquetipo.reglas.forEach(reglaId => {
        const regla = reglas.find(r => r.id === reglaId);
        if (regla) {
          // Extraer solo los estilos :hover
          const hoverMatch = regla.fragment.match(/:hover\s*{([^}]*)}/);
          if (hoverMatch) {
            Object.assign(styles, parseCSS(hoverMatch[1]));
          }
        }
      });
    }
    
    return styles;
  };

  // Cargar datos al montar el componente
  React.useEffect(() => {
    loadFromLocalStorage();
  }, []);

  // Guardar datos automáticamente cuando cambien
  React.useEffect(() => {
    if (reglas.length > 0 || arquetipos.length > 0 || etiquetas.length > 0 || nodos.length > 0) {
      saveToLocalStorage();
    }
  }, [reglas, arquetipos, etiquetas, nodos]);
  
  // Función para determinar si estamos en modo edición
  const isEditingRule = editingRuleIndex !== null;
  const isEditingArchetype = editingArchetypeIndex !== null;
  const isEditingEtiqueta = editingEtiquetaIndex !== null;

  // Funciones para gestionar reglas
  const editarRegla = (index: number) => {
    const regla = reglas[index];
    setNewRule({
      nombre: regla.nombre || `Regla ${index + 1}`,
      tipo: regla.tipo || 'fo',
      fragment: regla.fragment
    });
    setEditingRuleIndex(index);
    setShowRuleModal(true);
  };

  // Función para abrir modal de nueva regla
  const openNewRuleModal = () => {
    setNewRule({
      nombre: '',
      tipo: 'fo',
      fragment: '.mi-clase {\n  /* Tu CSS aquí */\n}'
    });
    setEditingRuleIndex(null);
    setShowRuleModal(true);
  };
  
  const eliminarRegla = (index: number) => {
    const nuevasReglas = reglas.filter((_, i) => i !== index);
    setReglas(nuevasReglas);
  };
  
  const addRegla = () => {
    if (!newRule.nombre.trim()) {
      alert('Por favor, ingresa un nombre para la regla');
      return;
    }
    
    if (!newRule.fragment.trim()) {
      alert('Por favor, ingresa el fragmento CSS para la regla');
      return;
    }

    if (isEditingRule && editingRuleIndex !== null) {
      // Modo edición: actualizar regla existente
      const updatedReglas = [...reglas];
      updatedReglas[editingRuleIndex] = {
        ...updatedReglas[editingRuleIndex],
        nombre: newRule.nombre,
        tipo: newRule.tipo || 'fo',
        fragment: newRule.fragment
      };
      setReglas(updatedReglas);
      alert(`Regla "${newRule.nombre}" actualizada exitosamente!`);
    } else {
      // Modo creación: agregar nueva regla
      const reglaData: Regla = {
        id: `rule_${Date.now()}`,
        nombre: newRule.nombre,
        tipo: newRule.tipo || 'fo',
        fragment: newRule.fragment,
        createdAt: new Date()
      };
      setReglas(prev => [...prev, reglaData]);
      alert(`Regla "${reglaData.nombre}" creada exitosamente!`);
    }
    
    // Limpiar formulario y cerrar modal
    setNewRule({
      nombre: '',
      tipo: 'fo',
      fragment: ''
    });
    setEditingRuleIndex(null);
    setShowRuleModal(false);
  };

  // Función para abrir modal de nuevo arquetipo
  const openNewArchetypeModal = () => {
    setNewArchetype({
      nombre: '',
      tipo: 'fo',
      reglas: []
    });
    setEditingArchetypeIndex(null);
    setShowArchetypeModal(true);
  };

  // Función para editar arquetipo
  const editarArquetipo = (index: number) => {
    const arquetipo = arquetipos[index];
    setNewArchetype({
      nombre: arquetipo.nombre,
      tipo: arquetipo.tipo,
      reglas: [...arquetipo.reglas]
    });
    setEditingArchetypeIndex(index);
    setShowArchetypeModal(true);
  };
  
  const addArquetipo = () => {
    if (!newArchetype.nombre.trim()) {
      alert('Por favor, ingresa un nombre para el arquetipo');
      return;
    }

    if (isEditingArchetype && editingArchetypeIndex !== null) {
      // Modo edición: actualizar arquetipo existente
      const updatedArquetipos = [...arquetipos];
      updatedArquetipos[editingArchetypeIndex] = {
        ...updatedArquetipos[editingArchetypeIndex],
        nombre: newArchetype.nombre,
        tipo: newArchetype.tipo,
        reglas: newArchetype.reglas
      };
      setArquetipos(updatedArquetipos);
      alert(`Arquetipo "${newArchetype.nombre}" actualizado exitosamente!`);
    } else {
      // Modo creación: agregar nuevo arquetipo
      const arquetipoData: Arquetipo = {
        id: `arquetipo_${Date.now()}`,
        nombre: newArchetype.nombre,
        tipo: newArchetype.tipo,
        reglas: newArchetype.reglas
      };
      setArquetipos(prev => [...prev, arquetipoData]);
      alert(`Arquetipo "${arquetipoData.nombre}" creado exitosamente!`);
    }
    
    // Limpiar formulario y cerrar modal
    setNewArchetype({
      nombre: '',
      tipo: 'fo',
      reglas: []
    });
    setEditingArchetypeIndex(null);
    setShowArchetypeModal(false);
  };

  // Función para cerrar modal de regla
  const closeRuleModal = () => {
    setShowRuleModal(false);
    setEditingRuleIndex(null);
    setNewRule({
      nombre: '',
      tipo: 'fo',
      fragment: '.mi-clase {\n  /* Tu CSS aquí */\n}'
    });
  };

  // Función para cerrar modal de arquetipo
  const closeArchetypeModal = () => {
    setShowArchetypeModal(false);
    setEditingArchetypeIndex(null);
    setNewArchetype({
      nombre: '',
      tipo: 'fo',
      reglas: []
    });
  };

  // Funciones para gestionar etiquetas
  const openNewEtiquetaModal = () => {
    setNewEtiqueta({
      tipo: 'contenido',
      fo: '',
      fn: '',
      es: '',
      contenido: ''
    });
    setEditingEtiquetaIndex(null);
    setShowEtiquetaModal(true);
  };

  const editarEtiqueta = (index: number) => {
    const etiqueta = etiquetas[index];
    setNewEtiqueta({
      tipo: etiqueta.tipo,
      fo: etiqueta.fo,
      fn: etiqueta.fn,
      es: etiqueta.es,
      contenido: etiqueta.contenido
    });
    setEditingEtiquetaIndex(index);
    setShowEtiquetaModal(true);
  };

  // Funciones para manejar nodos ConstellaCSS
  const addNodo = () => {
    if (!newNodo.es || !newNodo.fn || !newNodo.fo) {
      alert('Por favor, selecciona arquetipos para ES, FN y FO');
      return;
    }

    const nodoData: Nodo = {
      id: `nodo_${Date.now()}`,
      es: newNodo.es!,
      fn: newNodo.fn!,
      fo: newNodo.fo!,
      tokens: newNodo.tokens,
      classNameExtra: newNodo.classNameExtra,
      contenido: newNodo.contenido
    };

    setNodos([...nodos, nodoData]);
    
    // Reset form
    setNewNodo({
      es: '',
      fn: '',
      fo: '',
      contenido: { selector: 'ui', map: (state: any) => ({ label: state?.ui?.cta ?? 'Botón' }) },
      classNameExtra: '',
      tokens: {}
    });

    alert('Nodo ConstellaCSS creado exitosamente!');
    saveToLocalStorage();
  };

  const deleteNodo = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este nodo?')) {
      setNodos(nodos.filter(n => n.id !== id));
      saveToLocalStorage();
    }
  };

  const addEtiqueta = () => {
    if (!newEtiqueta.contenido.trim()) {
      alert('Por favor, ingresa contenido para la etiqueta');
      return;
    }

    if (isEditingEtiqueta && editingEtiquetaIndex !== null) {
      // Modo edición: actualizar etiqueta existente
      const updatedEtiquetas = [...etiquetas];
      updatedEtiquetas[editingEtiquetaIndex] = {
        ...updatedEtiquetas[editingEtiquetaIndex],
        tipo: newEtiqueta.tipo,
        fo: newEtiqueta.fo,
        fn: newEtiqueta.fn,
        es: newEtiqueta.es,
        contenido: newEtiqueta.contenido
      };
      setEtiquetas(updatedEtiquetas);
      alert(`Etiqueta actualizada exitosamente!`);
    } else {
      // Modo creación: agregar nueva etiqueta
      const etiquetaData: Etiqueta = {
        id: `etiqueta_${Date.now()}`,
        tipo: newEtiqueta.tipo,
        fo: newEtiqueta.fo,
        fn: newEtiqueta.fn,
        es: newEtiqueta.es,
        contenido: newEtiqueta.contenido,
        createdAt: new Date()
      };
      setEtiquetas(prev => [...prev, etiquetaData]);
      alert(`Etiqueta creada exitosamente!`);
    }
    
    // Limpiar formulario y cerrar modal
    setNewEtiqueta({
      tipo: 'contenido',
      fo: '',
      fn: '',
      es: '',
      contenido: ''
    });
    setEditingEtiquetaIndex(null);
    setShowEtiquetaModal(false);
  };

  const closeEtiquetaModal = () => {
    setShowEtiquetaModal(false);
    setEditingEtiquetaIndex(null);
    setNewEtiqueta({
      tipo: 'contenido',
      fo: '',
      fn: '',
      es: '',
      contenido: ''
    });
  };

  const eliminarEtiqueta = (index: number) => {
    const updatedEtiquetas = etiquetas.filter((_, i) => i !== index);
    setEtiquetas(updatedEtiquetas);
  };

  // Función para obtener arquetipos por tipo
  const getArquetiposByTipo = (tipo: 'fo' | 'fn' | 'es') => {
    return arquetipos.filter(arquetipo => arquetipo.tipo === tipo);
  };

  // Función para obtener reglas disponibles por tipo
  const getReglasByTipo = (tipo: 'fo' | 'fn' | 'es') => {
    return reglas.filter(regla => regla.tipo === tipo);
  };

  // Función para agregar/quitar regla del arquetipo
  const toggleReglaInArquetipo = (reglaId: string) => {
    const currentReglas = newArchetype.reglas;
    if (currentReglas.includes(reglaId)) {
      setNewArchetype({
        ...newArchetype,
        reglas: currentReglas.filter(id => id !== reglaId)
      });
    } else {
      setNewArchetype({
        ...newArchetype,
        reglas: [...currentReglas, reglaId]
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Simulador ConstellaCSS - ARC - EspiralML
              </h1>
              <p className="text-gray-600">
                Editor interactivo para reglas ARC, arquetipos y etiquetas con preview en tiempo real
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-sm text-gray-500 text-right">
                <div>Datos guardados automáticamente</div>
                <div className="text-xs">
                  {reglas.length} reglas • {arquetipos.length} arquetipos • {etiquetas.length} etiquetas
                </div>
              </div>
              <button
                onClick={exportData}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                💾 Exportar
              </button>
              <button
                onClick={clearAllData}
                className="bg-red-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
              >
                🗑️ Limpiar Todo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Panel de Métricas en Tiempo Real */}
      <div className="max-w-7xl mx-auto px-4 pb-6">
        <div className="bg-gray-800 text-white rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            📊 Métricas del Sistema ARC
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            {/* Reglas */}
            <div className="bg-red-700 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold">{reglas.length}</div>
              <div className="text-red-200 text-sm">Reglas CSS</div>
              <div className="text-xs text-red-300 mt-1">
                FO: {reglas.filter(r => r.tipo === 'fo').length} | 
                FN: {reglas.filter(r => r.tipo === 'fn').length} | 
                ES: {reglas.filter(r => r.tipo === 'es').length}
              </div>
            </div>
            
            {/* Arquetipos */}
            <div className="bg-blue-700 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold">{arquetipos.length}</div>
              <div className="text-blue-200 text-sm">Arquetipos</div>
              <div className="text-xs text-blue-300 mt-1">
                FO: {arquetipos.filter(a => a.tipo === 'fo').length} | 
                FN: {arquetipos.filter(a => a.tipo === 'fn').length} | 
                ES: {arquetipos.filter(a => a.tipo === 'es').length}
              </div>
            </div>
            
            {/* Etiquetas Clásicas */}
            <div className="bg-green-700 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold">{etiquetas.length}</div>
              <div className="text-green-200 text-sm">Etiquetas</div>
              <div className="text-xs text-green-300 mt-1">
                Sistema clásico
              </div>
            </div>

            {/* Nodos ConstellaCSS */}
            <div className="bg-purple-700 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold">{nodos.length}</div>
              <div className="text-purple-200 text-sm">Nodos CSS</div>
              <div className="text-xs text-purple-300 mt-1">
                ConstellaCSS puro
              </div>
            </div>
            
            {/* CSS Total */}
            <div className="bg-orange-700 bg-opacity-50 rounded-lg p-3">
              <div className="text-2xl font-bold">
                {reglas.reduce((total, regla) => total + (regla.fragment.match(/[a-z-]+\s*:/gi) || []).length, 0)}
              </div>
              <div className="text-orange-200 text-sm">Props CSS</div>
              <div className="text-xs text-orange-300 mt-1">
                Total propiedades
              </div>
            </div>
          </div>
          
          {/* Gráfico de uso */}
          <div className="mt-4 bg-gray-700 rounded-lg p-3">
            <h3 className="text-sm font-medium mb-2">📈 Distribución de Reglas por Tipo</h3>
            <div className="flex h-4 rounded-full overflow-hidden bg-gray-600">
              {reglas.length > 0 ? (
                <>
                  <div 
                    className="bg-red-500" 
                    style={{ width: `${(reglas.filter(r => r.tipo === 'fo').length / reglas.length) * 100}%` }}
                    title={`FO: ${reglas.filter(r => r.tipo === 'fo').length} reglas`}
                  />
                  <div 
                    className="bg-blue-500" 
                    style={{ width: `${(reglas.filter(r => r.tipo === 'fn').length / reglas.length) * 100}%` }}
                    title={`FN: ${reglas.filter(r => r.tipo === 'fn').length} reglas`}
                  />
                  <div 
                    className="bg-yellow-500" 
                    style={{ width: `${(reglas.filter(r => r.tipo === 'es').length / reglas.length) * 100}%` }}
                    title={`ES: ${reglas.filter(r => r.tipo === 'es').length} reglas`}
                  />
                </>
              ) : (
                <div className="w-full bg-gray-500 text-xs text-center leading-4 text-gray-300">
                  Sin datos
                </div>
              )}
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>🔴 FO ({reglas.filter(r => r.tipo === 'fo').length})</span>
              <span>🔵 FN ({reglas.filter(r => r.tipo === 'fn').length})</span>
              <span>🟡 ES ({reglas.filter(r => r.tipo === 'es').length})</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Explicación del Sistema ARC */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
            🎯 ¿Cómo funciona el Sistema ARC?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white rounded-lg p-3 border-l-4 border-red-400">
              <h3 className="font-semibold text-red-700 mb-1">🔴 FO (Forma)</h3>
              <p className="text-gray-600 text-xs mb-2">Apariencia visual del elemento</p>
              <code className="text-xs bg-gray-100 p-1 rounded block">border-radius, padding, colors, shadows</code>
            </div>
            <div className="bg-white rounded-lg p-3 border-l-4 border-blue-400">
              <h3 className="font-semibold text-blue-700 mb-1">🔵 FN (Función)</h3>
              <p className="text-gray-600 text-xs mb-2">Comportamiento e interactividad</p>
              <code className="text-xs bg-gray-100 p-1 rounded block">:hover, :active, cursor, transitions</code>
            </div>
            <div className="bg-white rounded-lg p-3 border-l-4 border-green-400">
              <h3 className="font-semibold text-green-700 mb-1">🟢 ES (Estructura)</h3>
              <p className="text-gray-600 text-xs mb-2">Layout y posicionamiento</p>
              <code className="text-xs bg-gray-100 p-1 rounded block">display, flex, grid, position</code>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-600 bg-white rounded p-2">
            <strong>💡 Flujo:</strong> Crea <strong>Reglas CSS</strong> → Agrúpalas en <strong>Arquetipos</strong> → Aplica con <strong>Etiquetas</strong> → Ve el resultado en <strong>Preview</strong>
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
          {[
            { id: 'reglas', label: '📝 Reglas', icon: '📝' },
            { id: 'arquetipos', label: '🏛️ Arquetipos', icon: '🏛️' },
            { id: 'etiquetas', label: '🏷️ Etiquetas', icon: '🏷️' },
            { id: 'nodos', label: '⚡ Nodos CSS', icon: '⚡' },
            { id: 'preview', label: '👁️ Preview', icon: '👁️' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 px-6 py-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label.replace(/^\S+ /, '')}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          
          {/* Tab: Reglas */}
          {activeTab === 'reglas' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Editor de Reglas ARC
                </h2>
                <span className="text-sm text-gray-500">
                  {reglas.length} reglas configuradas
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Lista de reglas */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Reglas Existentes</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {reglas.length > 0 ? (
                      reglas.map((regla, index) => (
                        <div key={regla.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-gray-900">{regla.nombre}</h4>
                                <span className={`inline-block px-2 py-1 text-xs rounded font-medium ${
                                  regla.tipo === 'fo' ? 'bg-red-100 text-red-700' :
                                  regla.tipo === 'fn' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {regla.tipo.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                CSS Fragment: {regla.fragment.substring(0, 50)}...
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Creada: {regla.createdAt.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => editarRegla(index)}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Editar
                              </button>
                              <button 
                                onClick={() => eliminarRegla(index)}
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No hay reglas configuradas</p>
                        <p className="text-sm">Agrega tu primera regla usando el editor</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Botón para crear nueva regla */}
                <div>
                  <div className="text-center p-8">
                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Crear Nueva Regla</h3>
                    <p className="text-gray-600 mb-6">Agrega reglas CSS con nombre y tipo específico</p>
                    <button
                      onClick={openNewRuleModal}
                      className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 mx-auto"
                    >
                      ➕ Nueva Regla
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab: Arquetipos */}
          {activeTab === 'arquetipos' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestión de Arquetipos (fn, es, fo)
                </h2>
                <span className="text-sm text-gray-500">
                  Sistema de arquetipos ARC
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Lista de arquetipos */}
                <div className="lg:col-span-2">

                </div>

                {/* Botón para crear nuevo arquetipo */}
                <div>
                  <div className="text-center p-8">
                    <div className="text-gray-400 text-6xl mb-4">🏗️</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Crear Nuevo Arquetipo</h3>
                    <p className="text-gray-600 mb-6">Combina reglas para crear arquetipos personalizados</p>
                    <button
                      onClick={openNewArchetypeModal}
                      className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2 mx-auto"
                    >
                      ➕ Nuevo Arquetipo
                    </button>
                  </div>
                </div>

                {/* Lista de Arquetipos Existentes */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Arquetipos Existentes</h3>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {arquetipos.length > 0 ? (
                      arquetipos.map((arquetipo, index) => (
                        <div key={arquetipo.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{arquetipo.nombre}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                Tipo: <span className="font-medium uppercase">{arquetipo.tipo}</span>
                              </p>
                              <p className="text-xs text-blue-600 mt-1">
                                {arquetipo.reglas.length} regla(s) asignada(s)
                              </p>
                              {arquetipo.reglas.length > 0 && (
                                <div className="mt-2">
                                  <p className="text-xs text-gray-500 mb-1">Reglas:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {arquetipo.reglas.map((reglaId) => {
                                      const regla = reglas.find(r => r.id === reglaId);
                                      return regla ? (
                                        <span
                                          key={reglaId}
                                          className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                                        >
                                          {regla.nombre}
                                        </span>
                                      ) : null;
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => editarArquetipo(index)}
                                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                              >
                                Editar
                              </button>
                              <button 
                                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-gray-400 text-4xl mb-2">🏗️</div>
                        <p className="text-gray-500">No hay arquetipos creados aún</p>
                        <p className="text-sm text-gray-400">Crea tu primer arquetipo arriba</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab: Etiquetas */}
          {activeTab === 'etiquetas' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Gestión de etiquetas ARC
                </h2>
                <button
                  onClick={openNewEtiquetaModal}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <span>+</span>
                  <span>Nueva Etiqueta</span>
                </button>
              </div>

              {/* Lista de Etiquetas */}
              <div className="space-y-4">
                {etiquetas.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay etiquetas</h3>
                    <p className="text-gray-500 mb-4">Crea tu primera etiqueta para comenzar a organizar tu contenido</p>
                    <button
                      onClick={openNewEtiquetaModal}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Crear primera etiqueta
                    </button>
                  </div>
                ) : (
                  etiquetas.map((etiqueta, index) => (
                    <div key={etiqueta.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              etiqueta.tipo === 'contenido' ? 'bg-blue-100 text-blue-800' :
                              etiqueta.tipo === 'section' ? 'bg-purple-100 text-purple-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {etiqueta.tipo}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-600">Forma:</span>
                              <div className="text-gray-900">{etiqueta.fo || 'Sin asignar'}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Función:</span>
                              <div className="text-gray-900">{etiqueta.fn || 'Sin asignar'}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-600">Estructura:</span>
                              <div className="text-gray-900">{etiqueta.es || 'Sin asignar'}</div>
                            </div>
                          </div>
                          
                          {etiqueta.contenido && (
                            <div className="mt-3">
                              <span className="font-medium text-gray-600">Contenido:</span>
                              <div className="text-gray-900 text-sm mt-1 p-2 bg-gray-50 rounded">{etiqueta.contenido}</div>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => editarEtiqueta(index)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Editar etiqueta"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => eliminarEtiqueta(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Eliminar etiqueta"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab: Preview */}
          {/* Tab Nodos ConstellaCSS */}
          {activeTab === 'nodos' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                  ⚡ Nodos ConstellaCSS
                </h3>
                <p className="text-sm text-gray-600">
                  Crea nodos usando el modelo ConstellaCSS puro: arquetipos predefinidos + precedencia determinista (ES &lt; FN &lt; FO).
                </p>
              </div>

              {/* Formulario para crear nodos */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="text-green-600 mr-2">+</span>
                  Crear Nodo ConstellaCSS
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  {/* Arquetipo ES */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estructura (ES)
                    </label>
                    <select
                      value={newNodo.es}
                      onChange={(e) => setNewNodo({...newNodo, es: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar ES...</option>
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
                      Función (FN)
                    </label>
                    <select
                      value={newNodo.fn}
                      onChange={(e) => setNewNodo({...newNodo, fn: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar FN...</option>
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
                      Forma (FO)
                    </label>
                    <select
                      value={newNodo.fo}
                      onChange={(e) => setNewNodo({...newNodo, fo: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar FO...</option>
                      {Object.entries(registries.arquetipos)
                        .filter(([_, arquetipo]) => arquetipo.dimension === 'fo')
                        .map(([id, arquetipo]) => (
                          <option key={id} value={id}>{arquetipo.id}</option>
                        ))}
                    </select>
                  </div>
                </div>

                {/* Clases extra */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clases Extra (opcional)
                  </label>
                  <input
                    type="text"
                    value={newNodo.classNameExtra || ''}
                    onChange={(e) => setNewNodo({...newNodo, classNameExtra: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="min-w-40 justify-center"
                  />
                </div>

                <button
                  onClick={addNodo}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  ⚡ Crear Nodo ConstellaCSS
                </button>
              </div>

              {/* Lista de nodos creados */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold flex items-center">
                  📋 Nodos ConstellaCSS ({nodos.length})
                </h4>
                
                {nodos.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-4xl mb-2">⚡</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay nodos creados</h3>
                    <p className="text-gray-500">Crea tu primer nodo ConstellaCSS seleccionando arquetipos ES, FN y FO.</p>
                  </div>
                ) : (
                  nodos.map((nodo) => (
                    <div key={nodo.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">Nodo: {nodo.id}</h5>
                        <button
                          onClick={() => deleteNodo(nodo.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          🗑️ Eliminar
                        </button>
                      </div>
                      
                      <div className="text-sm space-y-1 mb-3">
                        <div><strong className="text-blue-600">ES:</strong> {nodo.es}</div>
                        <div><strong className="text-green-600">FN:</strong> {nodo.fn}</div>
                        <div><strong className="text-purple-600">FO:</strong> {nodo.fo}</div>
                        {nodo.classNameExtra && (
                          <div><strong className="text-orange-600">Extra:</strong> {nodo.classNameExtra}</div>
                        )}
                      </div>

                      {/* Preview del nodo */}
                      <div className="bg-gray-50 rounded p-3">
                        <div className="text-xs text-gray-600 mb-2">Vista previa:</div>
                        {(() => {
                          const resolved = resolverNodo(nodo, registries, theme);
                          return (
                            <button 
                              className={resolved.className}
                              style={resolved.tokens as React.CSSProperties}
                            >
                              {resolved.props.label || 'Botón ConstellaCSS'}
                            </button>
                          );
                        })()}
                        
                        {/* Clases generadas */}
                        <details className="mt-2">
                          <summary className="text-xs text-gray-600 cursor-pointer">
                            🔍 Ver clases generadas
                          </summary>
                          <pre className="mt-1 text-xs bg-gray-800 text-gray-100 p-2 rounded overflow-x-auto">
                            className="{(() => {
                              const resolved = resolverNodo(nodo, registries, theme);
                              return resolved.className;
                            })()}"
                          </pre>
                        </details>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Tab Preview */}
          {activeTab === 'preview' && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Vista Previa en Tiempo Real
                </h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-500">
                    Visualización de elementos configurados
                  </span>
                  <button
                    onClick={openNewEtiquetaModal}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    + Nueva Etiqueta
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                
                {/* Preview principal */}
                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-80">
                  {etiquetas.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <h3 className="text-xl font-semibold mb-2">No hay etiquetas creadas</h3>
                      <p>Crea una etiqueta en la sección "Etiquetas" para verla aquí</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                        Etiquetas ARC Creadas ({etiquetas.length})
                      </h3>

                      {/* Área de renderizado ConstellaCSS - Nodos puros */}
                      {nodos.length > 0 && (
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6 mb-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold text-purple-800">⚡ Nodos ConstellaCSS - Modelo Puro</h4>
                            <div className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded">
                              Precedencia: ES → FN → FO
                            </div>
                          </div>
                          
                          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {nodos.map((nodo) => {
                              const resolved = resolverNodo(nodo, registries, theme, { ui: { cta: 'Acción' } });
                              return (
                                <div key={nodo.id} className="bg-white rounded-lg p-4 border border-purple-200">
                                  <div className="text-xs text-purple-600 mb-2 space-y-1">
                                    <div>📐 <strong>ES:</strong> {nodo.es.split(':')[1]}</div>
                                    <div>⚙️ <strong>FN:</strong> {nodo.fn.split(':')[1]}</div>
                                    <div>🎨 <strong>FO:</strong> {nodo.fo.split(':')[1]}</div>
                                  </div>
                                  
                                  <div className="bg-gray-50 rounded p-3 text-center">
                                    <button 
                                      className={resolved.className}
                                      style={resolved.tokens as React.CSSProperties}
                                      onMouseEnter={(e) => {
                                        // Los hover effects ya están en las clases CSS
                                        e.currentTarget.style.pointerEvents = 'auto';
                                      }}
                                    >
                                      {resolved.props.label || 'ConstellaCSS'}
                                    </button>
                                  </div>
                                  
                                  <details className="mt-2">
                                    <summary className="text-xs text-gray-500 cursor-pointer">
                                      🔍 Clases generadas
                                    </summary>
                                    <pre className="text-xs bg-gray-800 text-green-300 p-2 rounded mt-1 overflow-x-auto">
{resolved.className}
                                    </pre>
                                  </details>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Área de renderizado interactivo - Sistema clásico */}
                      {etiquetas.length > 0 && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-semibold text-gray-800">🎨 Etiquetas Clásicas - Sistema Anterior</h4>
                            <div className="flex items-center space-x-3">
                              <span className="text-sm text-gray-500">Elementos con estilos ARC aplicados</span>
                              <button
                                onClick={() => setShowRenderArea(!showRenderArea)}
                                className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded hover:bg-gray-200 transition-colors"
                              >
                                {showRenderArea ? '👁️ Ocultar' : '👁️ Mostrar'}
                              </button>
                            </div>
                          </div>
                          {showRenderArea && (
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[200px] grid gap-4 place-items-center" style={{
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'
                            }}>
                            {etiquetas.map((etiqueta, index) => (
                              <div
                                key={etiqueta.id}
                                className="rendered-element-container bg-white p-4 rounded-lg shadow-sm border border-gray-200 min-w-[180px] group hover:shadow-md transition-shadow"
                              >
                                <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                                  <span>#{index + 1} • {etiqueta.tipo}</span>
                                  <button
                                    onClick={() => editarEtiqueta(index)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
                                    title="Editar etiqueta"
                                  >
                                    ✏️
                                  </button>
                                </div>
                                <div
                                  dangerouslySetInnerHTML={{ __html: etiqueta.contenido }}
                                  data-arc={etiqueta.tipo}
                                  data-fo={etiqueta.fo}
                                  data-fn={etiqueta.fn}
                                  data-es={etiqueta.es}
                                  className="rendered-element"
                                  style={getEtiquetaStyles(etiqueta)}
                                  onMouseEnter={(e) => {
                                    // Aplicar estilos hover reales de las reglas FN
                                    if (etiqueta.fn) {
                                      const hoverStyles = getHoverStyles(etiqueta);
                                      Object.assign(e.currentTarget.style, hoverStyles);
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    // Restaurar estilos base
                                    if (etiqueta.fn) {
                                      const baseStyles = getEtiquetaStyles(etiqueta);
                                      Object.assign(e.currentTarget.style, baseStyles);
                                    }
                                  }}
                                />
                                <div className="text-xs text-gray-400 mt-2 space-y-1">
                                  <div className="flex justify-center text-center">
                                    {etiqueta.fo && <span className="text-red-600">fo:{etiqueta.fo}</span>}
                                    {etiqueta.fo && etiqueta.fn && <span className="mx-1">•</span>}
                                    {etiqueta.fn && <span className="text-blue-600">fn:{etiqueta.fn}</span>}
                                    {(etiqueta.fo || etiqueta.fn) && etiqueta.es && <span className="mx-1">•</span>}
                                    {etiqueta.es && <span className="text-green-600">es:{etiqueta.es}</span>}
                                  </div>
                                  {/* Indicador de reglas aplicadas */}
                                  <div className="text-center">
                                    {(() => {
                                      const foArquetipo = arquetipos.find(a => a.nombre === etiqueta.fo && a.tipo === 'fo');
                                      const fnArquetipo = arquetipos.find(a => a.nombre === etiqueta.fn && a.tipo === 'fn');  
                                      const esArquetipo = arquetipos.find(a => a.nombre === etiqueta.es && a.tipo === 'es');
                                      const totalReglas = (foArquetipo?.reglas.length || 0) + (fnArquetipo?.reglas.length || 0) + (esArquetipo?.reglas.length || 0);
                                      
                                      // Recopilar nombres de reglas aplicadas
                                      const reglasAplicadas: string[] = [];
                                      [foArquetipo, fnArquetipo, esArquetipo].forEach(arquetipo => {
                                        if (arquetipo?.reglas) {
                                          arquetipo.reglas.forEach(reglaId => {
                                            const regla = reglas.find(r => r.id === reglaId);
                                            if (regla) {
                                              reglasAplicadas.push(regla.nombre);
                                            }
                                          });
                                        }
                                      });
                                      
                                      return totalReglas > 0 ? (
                                        <div className="space-y-1">
                                          <span className="text-xs text-purple-600">
                                            {totalReglas} regla{totalReglas !== 1 ? 's' : ''} CSS
                                          </span>
                                          {reglasAplicadas.length > 0 && (
                                            <div className="text-xs text-gray-500">
                                              {reglasAplicadas.join(', ')}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <span className="text-xs text-gray-400">Sin reglas</span>
                                      );
                                    })()}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          )}
                        </div>
                      )}
                      
                      {etiquetas.map((etiqueta, index) => (
                        <div key={etiqueta.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                etiqueta.tipo === 'contenido' ? 'bg-blue-100 text-blue-800' :
                                etiqueta.tipo === 'section' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {etiqueta.tipo === 'contenido' ? '📄' : etiqueta.tipo === 'section' ? '📦' : '🧩'} {etiqueta.tipo}
                              </span>
                              <span className="text-sm text-gray-500">#{index + 1}</span>
                            </div>
                            <div className="text-xs text-gray-400">
                              {etiqueta.createdAt.toLocaleDateString()}
                            </div>
                          </div>
                          
                          {/* Configuración ARC */}
                          <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
                            <div className="bg-red-50 px-2 py-1 rounded">
                              <span className="font-medium text-red-700">fo:</span> {etiqueta.fo || 'Sin asignar'}
                            </div>
                            <div className="bg-blue-50 px-2 py-1 rounded">
                              <span className="font-medium text-blue-700">fn:</span> {etiqueta.fn || 'Sin asignar'}
                            </div>
                            <div className="bg-green-50 px-2 py-1 rounded">
                              <span className="font-medium text-green-700">es:</span> {etiqueta.es || 'Sin asignar'}
                            </div>
                          </div>
                          
                          {/* Contenido */}
                          <div className="bg-gray-50 p-3 rounded border-l-4 border-blue-400">
                            <div className="font-medium text-gray-700 mb-1">Contenido:</div>
                            <div className="text-gray-600">{etiqueta.contenido}</div>
                          </div>
                          
                          {/* Código HTML generado y renderizado */}
                          <div className="mt-3 space-y-3">
                            {/* Área de renderizado visual */}
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <h5 className="text-sm font-medium text-gray-700">🎨 Elemento Renderizado</h5>
                                <span className="text-xs text-gray-500">Vista previa real</span>
                              </div>
                              <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[80px] flex items-center justify-center">
                                <div
                                  dangerouslySetInnerHTML={{ __html: etiqueta.contenido }}
                                  data-arc={etiqueta.tipo}
                                  data-fo={etiqueta.fo}
                                  data-fn={etiqueta.fn}
                                  data-es={etiqueta.es}
                                  className="rendered-element"
                                  style={getEtiquetaStyles(etiqueta)}
                                  onMouseEnter={(e) => {
                                    // Aplicar estilos hover reales de las reglas FN
                                    if (etiqueta.fn) {
                                      const hoverStyles = getHoverStyles(etiqueta);
                                      Object.assign(e.currentTarget.style, hoverStyles);
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    // Restaurar estilos base
                                    if (etiqueta.fn) {
                                      const baseStyles = getEtiquetaStyles(etiqueta);
                                      Object.assign(e.currentTarget.style, baseStyles);
                                    }
                                  }}
                                />
                              </div>
                            </div>
                            
                            {/* Inspector CSS */}
                            <details className="mt-3">
                              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                                🔍 Inspeccionar CSS aplicado
                              </summary>
                              <div className="mt-2 bg-gray-900 text-gray-100 rounded p-3 text-xs font-mono max-h-40 overflow-y-auto">
                                <div className="text-yellow-300 mb-2">/* Estilos CSS aplicados desde las reglas ARC */</div>
                                {(() => {
                                  const appliedStyles = getEtiquetaStyles(etiqueta);
                                  return Object.entries(appliedStyles).length > 0 ? (
                                    <code>
                                      .elemento {'{'}
                                      <br />
                                      {Object.entries(appliedStyles).map(([prop, value]) => (
                                        <span key={prop}>
                                          &nbsp;&nbsp;{prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: {String(value)};
                                          <br />
                                        </span>
                                      ))}
                                      {'}'}
                                    </code>
                                  ) : (
                                    <code className="text-gray-400">/* No hay estilos CSS aplicados */</code>
                                  );
                                })()}
                              </div>
                            </details>
                            
                            {/* Código HTML */}
                            <details className="mt-3">
                              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                                📝 Ver código HTML generado
                              </summary>
                              <div className="mt-2 bg-gray-900 text-gray-100 rounded p-3 text-xs font-mono overflow-x-auto">
                                <code>{`<${etiqueta.tipo === 'contenido' ? 'div' : etiqueta.tipo === 'section' ? 'section' : 'div'} data-arc="${etiqueta.tipo}" data-fo="${etiqueta.fo}" data-fn="${etiqueta.fn}" data-es="${etiqueta.es}">
  ${etiqueta.contenido}
</${etiqueta.tipo === 'contenido' ? 'div' : etiqueta.tipo === 'section' ? 'section' : 'div'}>`}</code>
                              </div>
                            </details>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Información de configuración actual */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">📊 Estadísticas</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Reglas configuradas:</span>
                        <span className="font-medium">{reglas.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Arquetipos activos:</span>
                        <span className="font-medium">{arquetipos.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Etiquetas creadas:</span>
                        <span className="font-medium">{etiquetas.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-3">🎯 Sistema ARC Activo</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Reglas:</span> {reglas.length} configuradas</div>
                      <div><span className="font-medium">Arquetipos:</span> {arquetipos.length} activos</div>
                      <div><span className="font-medium">Etiquetas:</span> {etiquetas.length} creadas</div>
                      <div><span className="font-medium">Estado:</span> Sistema operativo</div>
                    </div>
                  </div>

                </div>

                {/* Código HTML generado */}
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
                  <h4 className="font-medium text-gray-300 mb-3">💻 Ejemplo de Código ARC</h4>
                  <pre className="text-sm overflow-x-auto">
                    <code>{`<!-- Ejemplo de elementos con sistema ARC -->
<h3 data-arc="contenido" data-fn="titulo" data-es="grande" data-fo="estandar">
  Título de ejemplo
</h3>

<!-- Botón con configuración ARC -->
<button data-arc="componente" data-fn="accion" data-es="primario" data-fo="redondeado">
  Botón de ejemplo
</button>

<!-- Section con sistema ARC -->
<section data-arc="section" data-fn="contenedor" data-es="grid" data-fo="moderno">
  Contenedor de ejemplo
</section>`}</code>
                  </pre>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
      
      {/* Modal para crear regla */}
      <Modal
        isOpen={showRuleModal}
        onClose={closeRuleModal}
        title={isEditingRule ? "Editar Regla" : "Crear Nueva Regla"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la Regla
            </label>
            <input
              type="text"
              value={newRule.nombre}
              onChange={(e) => setNewRule({...newRule, nombre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre descriptivo de la regla"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Regla
            </label>
            <select
              value={newRule.tipo}
              onChange={(e) => setNewRule({...newRule, tipo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="fo">FO (Forma)</option>
              <option value="fn">FN (Función)</option>
              <option value="es">ES (Estructura)</option>
            </select>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Fragmento CSS
              </label>
              <button
                type="button"
                onClick={() => {
                  const ejemplos = {
                    fo: `.elemento {\n  /* FORMA - Apariencia Visual */\n  border-radius: 8px;\n  padding: 0.75rem 1.5rem;\n  font-weight: 500;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n  transition: all 0.2s ease;\n}`,
                    fn: `.elemento {\n  /* FUNCIÓN - Comportamiento */\n  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n  color: white;\n  border: none;\n  cursor: pointer;\n}\n\n.elemento:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n}\n\n.elemento:active {\n  transform: translateY(0px);\n}`,
                    es: `.elemento {\n  /* ESTRUCTURA - Layout */\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  width: 100%;\n  min-height: 44px;\n}`
                  };
                  setNewRule({...newRule, fragment: ejemplos[newRule.tipo as keyof typeof ejemplos] || ejemplos.fo});
                }}
                className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
              >
                📝 Ejemplo {newRule.tipo.toUpperCase()}
              </button>
            </div>
            <textarea
              value={newRule.fragment}
              onChange={(e) => setNewRule({...newRule, fragment: e.target.value})}
              className="w-full h-64 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm bg-gray-50"
              placeholder="Escribe tu fragmento CSS aquí..."
            />
            
            {/* Validador CSS */}
            {newRule.fragment && (() => {
              const validation = validateCSS(newRule.fragment);
              return (
                <div className={`mt-2 p-2 rounded text-xs ${validation.isValid ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {validation.isValid ? (
                    <div className="flex items-center gap-1">
                      <span>✅</span>
                      <span>CSS válido</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center gap-1 mb-1">
                        <span>⚠️</span>
                        <span>Advertencias CSS:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1">
                        {validation.errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Ayuda contextual */}
          <div className="bg-gray-50 rounded-lg p-3 text-xs">
            <h4 className="font-semibold text-gray-700 mb-2">💡 Ejemplos de Fragmentos CSS por Tipo:</h4>
            <div className="space-y-2">
              <div>
                <strong className="text-red-600">FO (Forma):</strong> 
                <code className="ml-1 bg-white px-1 rounded">border-radius: 8px; padding: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1);</code>
              </div>
              <div>
                <strong className="text-blue-600">FN (Función):</strong> 
                <code className="ml-1 bg-white px-1 rounded">background: #007bff; cursor: pointer;</code> + <code className="bg-white px-1 rounded">:hover, :active</code>
              </div>
              <div>
                <strong className="text-green-600">ES (Estructura):</strong> 
                <code className="ml-1 bg-white px-1 rounded">display: flex; align-items: center; gap: 0.5rem;</code>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={closeRuleModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={addRegla}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {isEditingRule ? "💾 Actualizar Regla" : "➕ Crear Regla"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal para crear arquetipo */}
      <Modal
        isOpen={showArchetypeModal}
        onClose={closeArchetypeModal}
        title={isEditingArchetype ? "Editar Arquetipo" : "Crear Nuevo Arquetipo"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Arquetipo
            </label>
            <input
              type="text"
              value={newArchetype.nombre}
              onChange={(e) => setNewArchetype({...newArchetype, nombre: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nombre descriptivo del arquetipo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Arquetipo
            </label>
            <select
              value={newArchetype.tipo}
              onChange={(e) => setNewArchetype({...newArchetype, tipo: e.target.value as 'fo' | 'fn' | 'es', reglas: []})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="fo">FO (Forma)</option>
              <option value="fn">FN (Función)</option>
              <option value="es">ES (Estructura)</option>
            </select>
          </div>
          
          {/* Selección de Reglas Disponibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reglas Disponibles ({newArchetype.tipo})
            </label>
            <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
              {getReglasByTipo(newArchetype.tipo).length > 0 ? (
                getReglasByTipo(newArchetype.tipo).map((regla) => (
                  <div key={regla.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`modal-regla-${regla.id}`}
                      checked={newArchetype.reglas.includes(regla.id)}
                      onChange={() => toggleReglaInArquetipo(regla.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`modal-regla-${regla.id}`} className="flex-1 text-sm text-gray-700">
                      <span className="font-medium">{regla.nombre}</span>
                      <span className="text-gray-500 ml-2">({regla.tipo})</span>
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">
                  No hay reglas disponibles para el tipo "{newArchetype.tipo}". 
                  Crea reglas primero en la pestaña "Reglas".
                </p>
              )}
            </div>
            {newArchetype.reglas.length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {newArchetype.reglas.length} regla(s) seleccionada(s)
              </p>
            )}
          </div>
          
          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={closeArchetypeModal}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={addArquetipo}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              {isEditingArchetype ? "💾 Actualizar Arquetipo" : "➕ Crear Arquetipo"}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Etiqueta */}
      <Modal isOpen={showEtiquetaModal} onClose={closeEtiquetaModal} title={editingEtiquetaIndex !== null ? 'Editar Etiqueta' : 'Nueva Etiqueta'}>
        <div className="space-y-4">
          {/* Selector de Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de etiqueta
            </label>
            <select
              value={newEtiqueta.tipo}
              onChange={(e) => setNewEtiqueta({...newEtiqueta, tipo: e.target.value as 'contenido' | 'section' | 'componente'})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="contenido">Contenido</option>
              <option value="section">Section</option>
              <option value="componente">Componente</option>
            </select>
          </div>

          {/* Arquetipo de Forma */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquetipo de Forma (fo)
            </label>
            <select
              value={newEtiqueta.fo}
              onChange={(e) => setNewEtiqueta({...newEtiqueta, fo: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un arquetipo</option>
              {getArquetiposByTipo('fo').map(arquetipo => (
                <option key={arquetipo.id} value={arquetipo.nombre}>
                  {arquetipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Arquetipo de Función */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquetipo de Función (fn)
            </label>
            <select
              value={newEtiqueta.fn}
              onChange={(e) => setNewEtiqueta({...newEtiqueta, fn: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un arquetipo</option>
              {getArquetiposByTipo('fn').map(arquetipo => (
                <option key={arquetipo.id} value={arquetipo.nombre}>
                  {arquetipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Arquetipo de Estructura */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Arquetipo de Estructura (es)
            </label>
            <select
              value={newEtiqueta.es}
              onChange={(e) => setNewEtiqueta({...newEtiqueta, es: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecciona un arquetipo</option>
              {getArquetiposByTipo('es').map(arquetipo => (
                <option key={arquetipo.id} value={arquetipo.nombre}>
                  {arquetipo.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <textarea
              value={newEtiqueta.contenido}
              onChange={(e) => setNewEtiqueta({...newEtiqueta, contenido: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Contenido de la etiqueta"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={closeEtiquetaModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={addEtiqueta}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingEtiquetaIndex !== null ? 'Actualizar' : 'Crear'} Etiqueta
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}




export default Simulator;