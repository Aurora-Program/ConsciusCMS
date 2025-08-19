import { useState } from 'react';
import esTranslations from '../translations/es.json';

// Tipo para las traducciones
type Translations = typeof esTranslations;

// Hook personalizado para traducciones
export const useTranslation = () => {
  const [translations, setTranslations] = useState<Translations>(esTranslations);

  // Función para obtener una traducción por clave
  const t = (key: string): string => {
    console.log('Hook t() called with key:', key); // Debug log
    const keys = key.split('.');
    let value: any = translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.log('Key not found:', key, 'at level:', k); // Debug log
        return `[Missing translation: ${key}]`;
      }
    }

    const result = typeof value === 'string' ? value : `[Missing translation: ${key}]`;
    console.log('Hook t() result:', result); // Debug log
    return result;
  };

  return { t };
};

// Función auxiliar para obtener traducciones sin hook (para uso en componentes funcionales)
export const translate = (key: string): string => {
  console.log('Translate function called with key:', key); // Debug log
  console.log('Available translations:', esTranslations); // Debug log
  
  const keys = key.split('.');
  let value: any = esTranslations;

  for (const k of keys) {
    console.log('Checking key level:', k, 'in:', value); // Debug log
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.log('Key not found:', key, 'at level:', k); // Debug log
      return `[Missing translation: ${key}]`;
    }
  }

  const result = typeof value === 'string' ? value : `[Missing translation: ${key}]`;
  console.log('Translate function result:', result); // Debug log
  return result;
};

export default useTranslation;
