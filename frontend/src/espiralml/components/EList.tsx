import React from 'react'
import DSLList from '../../cmscomponents/DSLList'
import composeClass, { Axes } from './composeClass'

type EListProps = Axes & {
  slice?: string
  template?: string | RegExp
  as?: keyof JSX.IntrinsicElements | React.ElementType
  empty?: React.ReactNode
  children: (item: any, idx: number) => React.ReactNode
}

export default function EList({ slice, template, as = 'div', empty, children, fn, es, fo, className }: EListProps) {
  const cls = composeClass({ fn, es, fo, className })
  const Tag = as as React.ElementType
  return (
    <DSLList slice={slice} template={template} empty={empty}>
      {(item, i) => <Tag className={cls} key={i}>{children(item, i)}</Tag>}
    </DSLList>
  )
}
