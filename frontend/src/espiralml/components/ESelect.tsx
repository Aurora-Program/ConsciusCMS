import React, { PropsWithChildren } from 'react'
import DSLSelect from '../../cmscomponents/DSLSelect'
import composeClass, { Axes } from './composeClass'

type ESelectProps = PropsWithChildren<Axes & {
  action?: string
  payload?: any
  as?: keyof JSX.IntrinsicElements | React.ElementType
  fallback?: React.ReactNode
}>

export default function ESelect({ action = 'pages/selectPage', payload, as = 'div', fallback, children, fn, es, fo, className }: ESelectProps) {
  const cls = composeClass({ fn, es, fo, className })
  const Tag = as as React.ElementType
  return (
    <DSLSelect action={action} payload={payload} fallback={fallback}>
      <Tag className={cls}>{children}</Tag>
    </DSLSelect>
  )
}
