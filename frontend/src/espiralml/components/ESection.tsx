import React, { PropsWithChildren } from 'react'
import composeClass, { Axes } from './composeClass'

type ESectionProps = PropsWithChildren<Axes & {
  as?: keyof JSX.IntrinsicElements | React.ElementType
}>

export default function ESection({ as = 'section', fn = 'Seccion', es = 'stack', fo = 'standard', className, children }: ESectionProps) {
  const Tag = as as React.ElementType
  const cls = composeClass({ fn, es, fo, className })
  return <Tag className={cls}>{children}</Tag>
}
