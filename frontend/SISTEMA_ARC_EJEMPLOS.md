# 🎯 Sistema ARC - Guía Completa con Ejemplos

## ¿Qué es el Sistema ARC?

ARC (Arquetipos, Roles y Composición) es un sistema de organización CSS que separa la responsabilidad del styling en tres dimensiones:

- **🔴 FO (Forma)**: Apariencia visual
- **🔵 FN (Función)**: Comportamiento e interactividad  
- **🟢 ES (Estructura)**: Layout y posicionamiento

## 📋 Flujo de Trabajo

1. **Crear Reglas CSS** → Fragmentos específicos por tipo
2. **Agrupar en Arquetipos** → Colecciones de reglas relacionadas
3. **Aplicar con Etiquetas** → Combinación final fo+fn+es
4. **Ver Preview** → Resultado visual en tiempo real

---

## 🔴 FO (Forma) - Ejemplos de Reglas

### Botón Redondeado
```css
.elemento {
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}
```

### Tarjeta Moderna
```css
.elemento {
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid #f0f0f0;
  overflow: hidden;
}
```

### Input Elegante
```css
.elemento {
  border-radius: 6px;
  border: 2px solid #e2e8f0;
  padding: 0.75rem;
  font-size: 0.875rem;
  transition: border-color 0.2s ease;
  background: #fafafa;
}
```

---

## 🔵 FN (Función) - Ejemplos de Reglas

### Botón Primario
```css
.elemento {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
}

.elemento:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.elemento:active {
  transform: translateY(0px);
}
```

### Input Interactivo
```css
.elemento:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.elemento:hover {
  border-color: #cbd5e0;
}
```

### Link Animado
```css
.elemento {
  color: #667eea;
  text-decoration: none;
  position: relative;
  cursor: pointer;
}

.elemento:after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: #667eea;
  transition: width 0.3s ease;
}

.elemento:hover:after {
  width: 100%;
}
```

---

## 🟢 ES (Estructura) - Ejemplos de Reglas

### Flex Centrado
```css
.elemento {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  min-height: 44px;
}
```

### Grid Responsivo
```css
.elemento {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
}
```

### Sidebar Layout
```css
.elemento {
  display: flex;
  width: 100%;
  min-height: 100vh;
}

.elemento > :first-child {
  flex: 0 0 250px;
}

.elemento > :last-child {
  flex: 1;
}
```

---

## 🏗️ Ejemplos de Arquetipos Completos

### Arquetipo: "Botón Moderno"
- **Tipo**: FO (Forma)
- **Reglas incluidas**:
  - Botón Redondeado
  - Sombra Suave
  - Transiciones

### Arquetipo: "Botón Interactivo"
- **Tipo**: FN (Función)  
- **Reglas incluidas**:
  - Hover Effects
  - Active States
  - Cursor Pointer

### Arquetipo: "Centrado Flex"
- **Tipo**: ES (Estructura)
- **Reglas incluidas**:
  - Display Flex
  - Align Center
  - Justify Center

---

## 🏷️ Ejemplos de Etiquetas Completas

### Botón Principal
```html
<button data-arc="componente" data-fo="moderno" data-fn="primario" data-es="centrado">
  Botón Principal
</button>
```

### Tarjeta de Producto
```html
<div data-arc="componente" data-fo="tarjeta-moderna" data-fn="interactiva" data-es="grid-item">
  <h3>Producto</h3>
  <p>Descripción del producto</p>
</div>
```

### Sección Hero
```html
<section data-arc="section" data-fo="hero-gradient" data-fn="parallax" data-es="full-height">
  <h1>Título Principal</h1>
  <p>Subtítulo</p>
</section>
```

---

## 🎨 CSS Generado Final

Al combinar un botón con:
- **FO**: "moderno" 
- **FN**: "primario"
- **ES**: "centrado"

El CSS final sería:

```css
[data-fo="moderno"] {
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: all 0.2s ease;
}

[data-fn="primario"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  cursor: pointer;
}

[data-fn="primario"]:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

[data-es="centrado"] {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
```

---

## 📝 Mejores Prácticas

### ✅ Hacer
- Mantener fragmentos pequeños y específicos
- Usar nombres descriptivos para arquetipos
- Separar claramente forma, función y estructura
- Incluir fallbacks para navegadores antiguos
- Documentar el propósito de cada regla

### ❌ Evitar
- Mezclar responsabilidades en un fragmento
- Nombres genéricos como "regla1", "estilo2"
- Fragmentos demasiado largos o complejos
- Especificidad excesiva en los selectores
- Dependencias entre diferentes tipos (fo/fn/es)

---

## 🚀 Flujo de Desarrollo Recomendado

1. **Análisis**: Identifica qué necesitas (forma, función, estructura)
2. **Crear Reglas**: Escribe fragmentos CSS específicos
3. **Testear**: Prueba cada fragmento individualmente  
4. **Agrupar**: Crea arquetipos con reglas relacionadas
5. **Combinar**: Aplica arquetipos con etiquetas
6. **Iterar**: Refina basado en el resultado visual

¡Con este sistema tendrás CSS modular, reutilizable y fácil de mantener! 🎉
