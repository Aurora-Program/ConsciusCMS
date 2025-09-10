import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { EPage, ESection, EComponente } from '../espiralml/components'
import { loadPages, selectPageAction } from './pageSlice'
import type { RootState, AppDispatch } from '../store'

export default function LandingPage() {
  const dispatch = useDispatch<AppDispatch>()
  const allPages = useSelector((s: RootState) => (s as any).pages.pages || [])
  const selected = useSelector((s: RootState) => (s as any).pages.selectedPage || { values: [], Page: '', Template: '' })

  useEffect(() => { dispatch(loadPages()) }, [dispatch])

  const examplePages = useMemo(() => allPages.filter((p: any) => p.Template === 'exmaples'), [allPages])
  const selectedValues = Array.isArray(selected.values) ? selected.values : []

  return (
    <EPage fn={['Pagina','Landing']} es={['container','stack']} fo="standard">
      <ESection fn={['Seccion','Hero']} es={['stack','section-pad','text-center','items-center','justify-center']} fo="hero">
        <EComponente as="h1" fn="TituloPrincipal" es="inline" fo={['title-highlight']}>EspiralML + Datos Dinámicos</EComponente>
        <EComponente as="p" fn="Intro" es="inline" fo="muted">Render fractal combinando fn (función), es (estructura) y fo (forma).</EComponente>
        <ESection as="div" es={['row','justify-center','items-center']}>
          <EComponente as="a" mode="link" href="/examples" es={['inline','p-sm']} fo={['btn','btn-secondary','rounded']}>Listado /examples</EComponente>
          <EComponente as="a" mode="link" href="/design-system" es={['inline','p-sm']} fo={['btn','btn-outline','rounded']}>Design System</EComponente>
        </ESection>
      </ESection>

      <ESection fn={['Seccion','ListadoEjemplos']} es={['stack','section-pad']} fo="standard">
        <EComponente as="h2" fn="TituloSeccion" es="inline" fo="standard">Ejemplos (Template: exmaples)</EComponente>
        <ESection as="div" fn="Lista" es={['list-grid']} fo="standard">
          {examplePages.map((p: any) => (
            <ESection key={p.Page} fn={['Item','Card']} as="article" es={['stack','p-md']} fo={['card-elegant','rounded']}>
              <EComponente as="h3" fn="TituloItem" fo="acentuada">{p.Page}</EComponente>
              <EComponente as="p" fn="Meta" fo="muted">Actualizado: {p.updateTime?.substring(0,16)}</EComponente>
              <EComponente as="button" fn="AccionVer" fo={['btn','btn-primary','rounded']} onClick={() => dispatch(selectPageAction(p.Page))}>Ver</EComponente>
            </ESection>
          ))}
        </ESection>
      </ESection>

      {selected.Page && (
        <ESection fn={['Seccion','Detalle']} es={['stack','section-pad']} fo="standard">
          <EComponente as="h2" fn="TituloDetalle" fo="standard">Detalle: {selected.Page}</EComponente>
          <ESection as="div" fn="Campos" es={['stack','p-md']} fo={['card-elevated','rounded']}>
            {selectedValues.map((v: any) => {
              const baseName = (v.name || '').toString()
              if (v.component?.endsWith('/Title') && v.value?.text) {
                return <EComponente key={v.component} as="h3" fn="CampoTitulo" fo={['acentuada']}>{v.value.text}</EComponente>
              }
              if (v.component?.endsWith('/Subtitle') && v.value?.text) {
                return <EComponente key={v.component} as="h4" fn="CampoSubtitulo" fo={['muted']}>{v.value.text}</EComponente>
              }
              if (v.component?.endsWith('/Content') && v.value?.text) {
                return <EComponente key={v.component} as="div" fn="CampoContenido" fo={['prose']}><span dangerouslySetInnerHTML={{ __html: v.value.text }} /></EComponente>
              }
              return <EComponente key={v.component || baseName} as="div" fn="CampoGenerico" fo="standard">{JSON.stringify(v.value)}</EComponente>
            })}
          </ESection>
        </ESection>
      )}
    </EPage>
  )
}
