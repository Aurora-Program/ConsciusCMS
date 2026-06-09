/**
 * CSS Syntax Highlighter
 * Simple syntax highlighting for CSS input
 */

import { useEffect, useRef } from 'react';

interface CSSHighlighterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function CSSHighlighter({ 
  value, 
  onChange, 
  placeholder = '', 
  rows = 6,
  className = ''
}: CSSHighlighterProps) {
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Aplicar syntax highlighting
  const highlightCSS = (css: string): string => {
    return css
      // Propiedades CSS
      .replace(/([a-zA-Z-]+)(\s*:)/g, '<span class="css-property">$1</span>$2')
      // Valores
      .replace(/(:\s*)([^;]+)(;?)/g, '$1<span class="css-value">$2</span>$3')
      // Comentarios
      .replace(/(\/\*.*?\*\/)/g, '<span class="css-comment">$1</span>')
      // Números con unidades
      .replace(/(\d+(?:\.\d+)?)(px|em|rem|%|vh|vw|deg)/g, '<span class="css-unit">$1$2</span>')
      // Colores hex
      .replace(/(#[0-9a-fA-F]{3,6})/g, '<span class="css-color">$1</span>')
      // Funciones CSS
      .replace(/(rgba?|hsla?|linear-gradient|radial-gradient|calc|var)\(/g, '<span class="css-function">$1</span>(');
  };

  // Sincronizar scroll
  const handleScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop;
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft;
    }
  };

  useEffect(() => {
    if (highlightRef.current) {
      highlightRef.current.innerHTML = highlightCSS(value);
    }
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      
      {/* Estilos CSS para syntax highlighting */}
      <style>{`
        .css-highlighter {
          position: relative;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .css-highlighter textarea {
          position: relative;
          z-index: 2;
          background: transparent;
          color: transparent;
          caret-color: #374151;
          resize: vertical;
        }
        
        .css-highlighter .highlight-layer {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          z-index: 1;
          padding: 12px;
          border: 1px solid transparent;
          white-space: pre-wrap;
          word-wrap: break-word;
          overflow: hidden;
          background: white;
          color: #374151;
        }
        
        .css-property { color: #3b82f6; font-weight: 600; }
        .css-value { color: #059669; }
        .css-comment { color: #6b7280; font-style: italic; }
        .css-unit { color: #dc2626; font-weight: 500; }
        .css-color { color: #7c3aed; }
        .css-function { color: #ea580c; font-weight: 500; }
      `}</style>

      <div className="css-highlighter">
        {/* Capa de highlighting */}
        <div 
          ref={highlightRef}
          className="highlight-layer"
          style={{ 
            minHeight: `${rows * 1.5}em`,
            fontSize: '14px'
          }}
        />
        
        {/* Textarea transparente */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={handleScroll}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm resize-vertical"
          style={{
            minHeight: `${rows * 1.5}em`,
            fontSize: '14px',
            lineHeight: '1.5',
            backgroundColor: 'transparent'
          }}
        />
      </div>
    </div>
  );
}

export default CSSHighlighter;
