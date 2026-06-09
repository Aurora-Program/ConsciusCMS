import { useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EPage, ESection, EComponente } from '../espiralml/components';
import { loadPages, selectPageAction } from './pageSlice';
import type { RootState, AppDispatch } from '../store';

/*
  ExampleListPage
  - Demuestra integración EspiralML:
    * EPage: carga contexto global de páginas
    * ESection: lista fractal de items (cards)
    * EComponente: render atómico de título / subtítulo / contenido
  - Fuente de datos: Redux state pages.pages (ya cargado por loadPages())
  - Cada item: Template === 'examples' (según payload proporcionado)
*/

export default function ExampleListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { pages, selectedPage } = useSelector((s: any) => s.pages || { pages: [], selectedPage: {} });

  // Carga inicial
  useEffect(() => { dispatch(loadPages()); }, [dispatch]);

  // Normaliza plantillas con posible typo 'exmaples'
  const exampleItems = useMemo(() =>
    (pages || []).filter((p: any) => {
      const t = (p.Template || '').toLowerCase();
      return t === 'examples' || t === 'exmaples';
    }), [pages]);

  const hasSelection = selectedPage && selectedPage.Page;
  const values = (selectedPage?.values || []) as any[];

  return (
    <EPage fn={["Pagina","Ejemplos"]} es={["container","stack"]} fo="standard">
      <ESection fn={["Seccion","ListadoEjemplos"]} es={["stack","section-pad"]} fo="standard">
        <EComponente as="h1" fn="TituloPagina" es="inline" fo={["title-highlight"]}>Ejemplos (examples / exmaples)</EComponente>

        {/* Estado vacío */}
        {exampleItems.length === 0 && (
          <EComponente as="p" fn="Aviso" fo="muted">No hay páginas con Template 'examples'. Verifica API / variables de entorno.</EComponente>
        )}

        <ESection fn="Layout" as="div" es={["stack"]} fo="standard" className="examples-layout" >
          <ESection fn="Lista" as="div" es={["list-grid"]} fo="standard">
            {exampleItems.map((item: any) => (
              <ESection key={item.Page} fn={["Item","Card"]} as="article" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
                <EComponente as="h3" fn="TituloItem" fo="acentuada">{item.Page}</EComponente>
                <EComponente as="p" fn="Meta" fo="muted">{item.updateTime ? new Date(item.updateTime).toLocaleString() : 'Sin fecha'}</EComponente>
                <EComponente as="button" fn="AccionVer" fo={["btn","btn-primary","rounded"]}
                  onClick={() => dispatch(selectPageAction(item.Page))}>Ver Detalle</EComponente>
              </ESection>
            ))}
          </ESection>

          {/* Panel detalle */}
          {hasSelection && (
            <ESection fn={["Detalle","Card"]} as="aside" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
              <EComponente as="h2" fn="TituloDetalle" fo="acentuada">{selectedPage.Page}</EComponente>
              <EComponente as="p" fn="MetaDetalle" fo="muted">Template: {selectedPage.Template}</EComponente>
              {values.map((v: any) => (
                <ESection key={v.name} fn={["Campo","Block"]} es="stack" fo="standard">
                  <EComponente as="h4" fn="CampoNombre" fo="muted">{v.name}</EComponente>
                  <EComponente as="div" fn="CampoValor" fo="standard">{v?.value?.text || v?.value?.value || JSON.stringify(v.value)}</EComponente>
                </ESection>
              ))}
            </ESection>
          )}
        </ESection>
      </ESection>
    </EPage>
  );
}
