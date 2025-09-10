import { useEffect } from 'react';
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
  const pages = useSelector((s: RootState) => (s as any).pages.pages || []);

  useEffect(() => { dispatch(loadPages()); }, [dispatch]);

  const exampleItems = pages.filter((p: any) => p.Template === 'examples');

  return (
    <EPage fn={["Pagina","Ejemplos"]} es={["container","stack"]} fo="standard">
      <ESection fn={["Seccion","ListadoEjemplos"]} es={["stack","section-pad"]} fo="standard">
        <EComponente as="h1" fn="TituloPagina" es="inline" fo={["title-highlight"]}>Ejemplos (Template: examples)</EComponente>
        <ESection fn="Lista" as="div" es={["list-grid"]} fo="standard">
          {exampleItems.map((item: any) => (
            <ESection key={item.Page} fn={["Item","Card"]} as="article" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
              <EComponente as="h3" fn="TituloItem" fo="acentuada">{item.Page}</EComponente>
              <EComponente as="p" fn="Meta" fo="muted">Actualizado: {item.updateTime?.substring(0,16)}</EComponente>
              {/* Lazy load full page details on click (optional) */}
              <EComponente as="button" fn="AccionVer" fo={["btn","btn-primary","rounded"]}
                onClick={() => dispatch(selectPageAction(item.Page))}>Ver Detalle</EComponente>
            </ESection>
          ))}
        </ESection>
      </ESection>
    </EPage>
  );
}
