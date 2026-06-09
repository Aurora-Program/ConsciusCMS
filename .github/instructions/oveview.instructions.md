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
2. Un bucket S3 para hosting del frontend (sitio web).
3. API Gateway para exponer los microservicios.
4. Funciones Lambda conectadas a API Gateway para procesar solicitudes.
5. DynamoDB como base de datos usada por las Lambdas para leer/escribir informacion.

Flujo general:
- Usuario -> CloudFront.
- CloudFront -> S3 (contenido estatico) o API Gateway (llamadas API).
- API Gateway -> Lambda -> DynamoDB -> respuesta al cliente.

## Guia para agentes

- Antes de proponer cambios de infraestructura, revisar siempre [Infrastructures/mainTemplate.yml](Infrastructures/mainTemplate.yml).
- Mantener compatibilidad con CloudFormation y respetar la estructura YAML existente.
- Evitar cambios amplios sin justificar impacto en despliegue, costos y seguridad.
- Si una tarea afecta infraestructura y frontend/backend, documentar claramente el flujo end-to-end.