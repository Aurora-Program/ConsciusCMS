import React from 'react';
import composeClass, { Axes } from './composeClass';
import { useT } from '../i18n';

interface ETextoProps extends Axes {
  as?: keyof JSX.IntrinsicElements | React.ElementType;
  k: string; // translation key
  fallback?: string;
  html?: boolean; // allow innerHTML (for rich content)
  style?: React.CSSProperties;
  [key: string]: any; // allow other HTML attributes
}

export default function ETexto({ as = 'span', k, fallback, fn = 'Texto', es, fo, className, html = false, style, ...rest }: ETextoProps) {
  const { t } = useT();
  const Tag = as as React.ElementType;
  const cls = composeClass({ fn, es, fo, className });
  const value = t(k, fallback);
  if (html) {
    return <Tag className={cls} style={style} {...rest} dangerouslySetInnerHTML={{ __html: value }} />;
  }
  return <Tag className={cls} style={style} {...rest}>{value}</Tag>;
}
