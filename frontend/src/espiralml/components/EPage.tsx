import React, { PropsWithChildren } from 'react'
import composeClass, { Axes } from './composeClass'

type EPageProps = PropsWithChildren<Axes & {
  as?: keyof JSX.IntrinsicElements | React.ElementType
  // Reserved for future data loading: action/payload
  action?: string
  payload?: any
  fallback?: React.ReactNode
}>

export default function EPage({ as = 'section', fn = 'Pagina', es = ['container', 'stack'], fo = 'standard', className, children }: EPageProps) {
  const Tag = as as React.ElementType
  const cls = composeClass({ fn, es, fo, className })
  return <Tag className={cls}>{children}</Tag>
}
