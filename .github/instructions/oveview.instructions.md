---
description: Instrucciones generales para agentes en ConsciusCMS
applyTo: "**"
---

# Overview del proyecto

Este archivo define contexto general para los agentes que trabajan en este repositorio.

## Carpetas importantes

### Infrastructures

La carpeta [Infrastructures](Infrastructures) contiene la infraestructura en codigo como plantillas YAML para AWS CloudFormation.

Archivo principal:
- [Infrastructures/mainTemplate.yml](Infrastructures/mainTemplate.yml): plantilla central con la definicion de la infraestructura principal.

## Arquitectura base (AWS)

La aplicacion se organiza en los siguientes componentes:

1. CloudFront como capa de distribucion.
2. Un bucket S3 para hosting del frontend (sitio web): WebsiteS3Bucket
3. Un bucket S3 para gestinaro el CMS sitio web que opara App para gestionar el contenido:  CMS3Bucket
4. Un bucket para almacenar los archivos subidos por los usuarios: ContentS3Bucket
5. API Gateway para exponer los microservicios.
6. Funciones Lambda conectadas a API Gateway para procesar solicitudes.
7. DynamoDB como base de datos usada por las Lambdas para leer/escribir informacion.
8. Authenticacion y autorizacion gestionada por AWS Cognito.
  - Api gateay authorither para validar tokens JWT de Cognito.


Flujo general:
- Usuario -> CloudFront.
- CloudFront -> S3 (contenido estatico) o API Gateway (llamadas API).
- API Gateway -> Lambda -> DynamoDB -> respuesta al cliente.

Mecanismo de funcionamiento del CMS:
- El Usuario puede crear Schemas que determina los campos (componentes) de los contenidos de la aplicacion. 
- Los componentes pueden tener componete hijos. Por lo tanto la identificacion de un componet sabasa en su nombre y la jerarquia de componentes padres. Ademas los componetes tiene un CTYPE que determina el tipo de informacion que guardaya. Y por ultiomo tiene propiedades para del componete que determna com custumization del componete.

- El contenido se guarda en implementacion de los sechemas: Pages, Es decir se guarda los datos dentrod de instancias de los componetes de paginas.El campo templeste determina que schema utiliza la paigina. Y los valroes son objetos que guaradan todsl los datos de los componetes de la pagina.
- LOs ficheros se guarad en el bucket de contenido y se guarda la referencia en los campos de los componetes que guardan ficheros.

Arquitectura de las apliaciones React Backend - CMSInterface y Frontend - CMSApp:
- Apliacion typescript en React para el frontend y backend (API).
- Implementedo Redux como gestor de estado en el backend y frontend.
- Cada componetne fundamental de la arquitectura tiene su propia carpeta con su codigo, pruebas y estilos.
- existe un archivo tsx con el componete React. Ademeas existe un ficherslice como capar de redux ...slice.tsx y un tercero un fichero js de acceso a la API para cada componente ...service.tsx

Estrucutra: 
- Carepta: Nombre del compoente 
-   nomreComponente.tsx: Componente React
-   nombreComponente.slice.tsx: Slice de Redux para el componente
-   nombreComponente.service.tsx: Funciones de acceso a la API para el componente
-   nombreComponente.css: Estilos del componente




## Guia para agentes

- Antes de proponer cambios de infraestructura, revisar siempre [Infrastructures/mainTemplate.yml](Infrastructures/mainTemplate.yml).
- Mantener compatibilidad con CloudFormation y respetar la estructura YAML existente.
- Evitar cambios amplios sin justificar impacto en despliegue, costos y seguridad.
- Si una tarea afecta infraestructura y frontend/backend, documentar claramente el flujo end-to-end.

