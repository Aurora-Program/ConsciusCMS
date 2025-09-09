import React from 'react'
import DSLField from '../../cmscomponents/DSLField'
import composeClass, { Axes } from './composeClass'

type EFieldProps = Axes & {
  name: string
  slice?: string
  id?: string
  as?: keyof JSX.IntrinsicElements | React.ElementType
  fallback?: React.ReactNode
  html?: boolean
}

export default function EField({ name, slice, id, as, fallback, html, fn, es, fo, className }: EFieldProps) {
  const cls = composeClass({ fn, es, fo, className })
  return <DSLField field={name} slice={slice} id={id} as={as} fallback={fallback} html={html} className={cls} />
}
