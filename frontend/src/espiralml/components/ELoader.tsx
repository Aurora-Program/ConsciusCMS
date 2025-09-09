import React, { PropsWithChildren } from 'react'
import DSLLoader from '../../cmscomponents/DSLLoader'
import composeClass, { Axes } from './composeClass'

type ELoaderProps = PropsWithChildren<Axes & {
  action: string
  payload?: any
  as?: keyof JSX.IntrinsicElements | React.ElementType
  fallback?: React.ReactNode
  error?: React.ReactNode
}>

export default function ELoader({ action, payload, as = 'div', fallback, error, children, fn, es, fo, className }: ELoaderProps) {
  const cls = composeClass({ fn, es, fo, className })
  const Tag = as as React.ElementType
  return (
    <DSLLoader action={action} payload={payload} fallback={fallback} error={error}>
      <Tag className={cls}>{children}</Tag>
    </DSLLoader>
  )
}
