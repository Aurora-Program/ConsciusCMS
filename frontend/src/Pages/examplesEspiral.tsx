import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { EPage, ESection, EComponente } from '../espiralml/components';
import { loadPages, selectPageAction } from './pageSlice';
import type { RootState, AppDispatch } from '../store';

/*
  Ejemplo de integración EspiralML:
  - Page fractal: PaginaEjemplo
  - Section list: ListaEjemplos
  - Cada item: TarjetaEjemplo (sección) + componentes atómicos para título y cuerpo
*/
export default function ExamplesEspiralPage() {
  const dispatch = useDispatch<AppDispatch>();
  const pages = useSelector((s: RootState) => s.pages.pages);

  useEffect(()=> { if(!pages || pages.length===0) { dispatch(loadPages()); } },[pages?.length]);

  // Filtramos algunas páginas para mostrar (por ejemplo primeras 6)
  const sample = pages.slice(0,6);

  return (
    <EPage fn={["Pagina","PaginaEjemplo"]} es={["container","stack"]} fo="standard">
      <ESection fn={["Seccion","HeroEjemplo"]} es={["stack","section-pad","text-center","items-center","justify-center"]} fo="hero">
        <EComponente as="h1" fn="TituloPagina" es="inline" fo={"title-highlight"}>Ejemplos EspiralML</EComponente>
        <EComponente as="p" fn="IntroPagina" es="inline" fo="muted">Render fractal de páginas almacenadas.</EComponente>
      </ESection>

      <ESection fn="ListaEjemplos" es={["stack","section-pad"]} fo="standard">
        <EComponente as="h2" fn="TituloLista" es="inline" fo="standard">Listado (primeras {sample.length})</EComponente>
        <ESection fn="GridEjemplos" as="div" es={"list-grid"}>
          {sample.map(p => {
            const titleValue = p.values?.find(v => /title|titulo/i.test(v.component || ''))?.value || p.Page;
            const descValue = p.values?.find(v => /desc|descripcion|summary/i.test(v.component || ''))?.value || p.Template;
            return (
              <ESection key={p.Page} fn={["TarjetaEjemplo","Card"]} as="article" es={["stack","p-md"]} fo={["card-elegant","rounded"]}>
                <EComponente as="h3" fn="TituloEjemplo" fo="acentuada">{String(titleValue)}</EComponente>
                <EComponente as="p" fn="DescripcionEjemplo" fo="standard">{String(descValue)}</EComponente>
                <EComponente as="a" mode="link" href={`/page/${encodeURIComponent(p.Page)}`} fn="LinkDetalle" es="inline" fo={["btn","btn-primary","rounded","p-sm"]}>Ver</EComponente>
              </ESection>
            );
          })}
        </ESection>
      </ESection>
    </EPage>
  );
}
