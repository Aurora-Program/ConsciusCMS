import React from 'react'
import composeClass, { Axes } from './composeClass'

type Mode = 'text' | 'button' | 'link'

type EComponenteProps = Axes & {
  as?: keyof JSX.IntrinsicElements | React.ElementType
  mode?: Mode
  href?: string
  children?: React.ReactNode
  fallback?: React.ReactNode
}

export default function EComponente({ as, mode = 'text', href, fn = 'Componente', es, fo, className, children, fallback = null }: EComponenteProps) {
  const Tag = (as || (mode === 'text' ? 'span' : 'a')) as React.ElementType
  const cls = composeClass({ fn, es, fo, className })
  if (mode === 'link' || mode === 'button') {
    return <Tag className={cls} href={href}>{children ?? fallback}</Tag>
  }
  return <Tag className={cls}>{children ?? fallback}</Tag>
}
