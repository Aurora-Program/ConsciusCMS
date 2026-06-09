# 🎨 Área de Renderizado de Etiquetas ARC

## ✅ **¿Qué es el Área de Renderizado?**

Es una sección interactiva en el **Preview** donde puedes ver tus etiquetas ARC renderizadas como elementos HTML reales con estilos aplicados en tiempo real.

---

## 🔧 **Características Implementadas:**

### **📱 Vista Interactiva**
- **Elementos renderizados** con HTML real usando `dangerouslySetInnerHTML`
- **Estilos CSS aplicados** dinámicamente basados en arquetipos
- **Efectos hover** cuando las etiquetas tienen función (FN) asignada
- **Grid responsivo** que se adapta al contenido

### **🎛️ Controles de Usuario**
- **Botón mostrar/ocultar** para el área de renderizado
- **Botón de edición** (✏️) que aparece al hacer hover
- **Indicadores visuales** de tipo y configuración ARC

### **📊 Información Contextual**
- **Numeración** de etiquetas (#1, #2, etc.)
- **Tipo de elemento** (contenido/section/componente)
- **Configuración ARC** con colores por tipo:
  - 🔴 **fo:nombre** (forma en rojo)
  - 🔵 **fn:nombre** (función en azul)  
  - 🟢 **es:nombre** (estructura en verde)
- **Contador de reglas CSS** aplicadas

---

## 🎨 **Estilos Aplicados Automáticamente:**

### **FO (Forma) - Si tiene arquetipo de forma:**
```css
border-radius: 8px;
padding: 0.75rem 1.5rem;
box-shadow: 0 2px 8px rgba(0,0,0,0.1);
transition: all 0.2s ease;
font-weight: 500;
```

### **FN (Función) - Si tiene arquetipo de función:**
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: white;
border: none;
cursor: pointer;
```

**+ Efectos Hover:**
```css
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(0,0,0,0.15);
```

### **ES (Estructura) - Si tiene arquetipo de estructura:**
```css
display: flex;
align-items: center;
justify-content: center;
gap: 0.5rem;
min-height: 44px;
```

---

## 🚀 **Cómo usar el Área de Renderizado:**

### **1. Crear Etiquetas**
- Ve a la pestaña **"Etiquetas"**
- Crea nuevas etiquetas con arquetipos FO/FN/ES
- Define el contenido HTML (ej: `<button>Mi Botón</button>`)

### **2. Ver en Preview**  
- Ve a la pestaña **"Preview"**
- El área de renderizado aparecerá automáticamente
- Cada etiqueta se muestra como un elemento visual

### **3. Interactuar**
- **Hover** sobre elementos con función para ver efectos
- **Click en ✏️** para editar etiquetas
- **Mostrar/Ocultar** el área según necesites

### **4. Inspeccionar**
- Ve los **atributos data-arc** aplicados
- Cuenta las **reglas CSS activas**
- Identifica la **configuración ARC** de cada elemento

---

## 💡 **Ejemplos de Renderizado:**

### **Botón Completo (fo + fn + es):**
```html
<!-- Etiqueta configurada -->
<button data-arc="componente" data-fo="moderno" data-fn="primario" data-es="centrado">
  Mi Botón ARC
</button>
```

**Se renderiza como:**
- 🔴 **Forma**: Redondeado, con sombra, transiciones
- 🔵 **Función**: Gradiente azul/morado, cursor pointer, hover effects
- 🟢 **Estructura**: Flex centrado con gap

### **Texto Simple (solo fo):**
```html
<!-- Solo forma aplicada -->
<span data-arc="contenido" data-fo="elegante" data-fn="" data-es="">
  Texto con estilo
</span>
```

**Se renderiza como:**
- 🔴 **Solo forma**: Padding, sombra sutil
- Sin función ni estructura

---

## 🔍 **Información Técnica:**

### **Función `getEtiquetaStyles()`**
Combina automáticamente los estilos CSS basados en los arquetipos asignados:

```typescript
const getEtiquetaStyles = (etiqueta: Etiqueta): React.CSSProperties => {
  // Busca arquetipos por nombre y tipo
  const foArquetipo = arquetipos.find(a => a.nombre === etiqueta.fo && a.tipo === 'fo');
  const fnArquetipo = arquetipos.find(a => a.nombre === etiqueta.fn && a.tipo === 'fn');  
  const esArquetipo = arquetipos.find(a => a.nombre === etiqueta.es && a.tipo === 'es');
  
  // Aplica estilos base según arquetipos encontrados
  // Devuelve objeto de estilos React
}
```

### **Renderizado con `dangerouslySetInnerHTML`**
Permite insertar HTML real desde el contenido de la etiqueta:
```jsx
<div
  dangerouslySetInnerHTML={{ __html: etiqueta.contenido }}
  style={getEtiquetaStyles(etiqueta)}
  // + event handlers para interactividad
/>
```

---

## 🎯 **Beneficios del Sistema:**

✅ **Vista previa en tiempo real** de elementos styled
✅ **Interactividad completa** con hover/focus/active  
✅ **Debugging visual** de configuraciones ARC
✅ **Experiencia WYSIWYG** (What You See Is What You Get)
✅ **Testing inmediato** de combinaciones fo+fn+es

¡Con esta área de renderizado puedes ver exactamente cómo se comportarán tus elementos ARC en una página web real! 🎉
