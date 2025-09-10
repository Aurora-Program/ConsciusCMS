import React from 'react'
import composeClass, { Axes } from './composeClass'

type Mode = 'text' | 'button' | 'link'

type EComponenteProps = Axes & {
  as?: keyof JSX.IntrinsicElements | React.ElementType
  mode?: Mode
  href?: string
  children?: React.ReactNode
  fallback?: React.ReactNode
  onClick?: React.MouseEventHandler<HTMLElement>
  title?: string
  type?: string
  disabled?: boolean
  target?: string
  rel?: string
}

export default function EComponente({ as, mode = 'text', href, fn = 'Componente', es, fo, className, children, fallback = null, onClick, ...rest }: EComponenteProps) {
  const Tag = (as || (mode === 'text' ? 'span' : 'a')) as React.ElementType
  const cls = composeClass({ fn, es, fo, className })
  if (mode === 'link' || mode === 'button') {
    return <Tag className={cls} href={href} onClick={onClick} {...rest}>{children ?? fallback}</Tag>
  }
  return <Tag className={cls} onClick={onClick} {...rest}>{children ?? fallback}</Tag>
}
