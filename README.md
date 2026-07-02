# Nomad Weddings Ops Agent

App interna MVP para centralizar leads, parejas, bodas, proveedores, precios, calendario, documentos y acciones de agente con aprobacion humana.

## Arranque local

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

## Fotos reales de Google Places

Para que las fichas de proveedores muestren fotos y resenas reales de Google Maps, crea `.env.local` con una key de Google Maps Platform que tenga Places API habilitada:

```bash
GOOGLE_PLACES_API_KEY=tu_api_key
```

Tambien se acepta `GOOGLE_MAPS_API_KEY`. Cada proveedor puede guardar un `Google Place ID` para apuntar a la ficha exacta; si esta vacio, la app intenta encontrarla por nombre, region y coordenadas. Sin key, la demo sigue funcionando con las imagenes locales del seed.

## Que incluye

- Dashboard operativo con leads, bodas, servicios pendientes, coste estimado y agenda.
- CRM de leads con cualificacion automatica por zona, presupuesto, fecha, invitados y servicio.
- Ficha de boda con servicios, tareas, riesgos, documentos y presupuesto.
- Base de proveedores con precios historicos, capacidad, region, estilo y fiabilidad.
- Simulador comercial para demo con parejas: invitados, aportacion de la pareja, escenarios rapidos, extras de boda y barra inferior con total, coste por cubierto y regalo recomendado por invitado.
- Endpoints API del plan:
  - `POST /api/leads`
  - `POST /api/emails/import`
  - `GET /api/events/:id/brief`
  - `GET /api/google/places/vendor-media`
  - `GET /api/google/places/photo`
  - `POST /api/agent/draft-reply`
  - `POST /api/agent/vendor-match`
  - `POST /api/agent/budget-draft`
  - `POST /api/agent/runbook`
- Esquema PostgreSQL en `db/schema.sql`.

## Decision tecnica del MVP

Esta version corre con datos semilla en memoria para poder probarla sin instalar Postgres ni credenciales externas. El siguiente paso natural es conectar los tipos de `lib/types.ts` al esquema `db/schema.sql` mediante Prisma, Drizzle o un cliente SQL directo.

El agente actual es determinista y auditable: genera borradores y recomendaciones con reglas visibles. Para conectar IA generativa real, mantener el mismo contrato de endpoints y sustituir internamente las funciones de `lib/agent.ts`, siempre conservando el campo `approvalRequired`.

## Controles RGPD y negocio

- No se usan atributos sensibles para discriminar clientes.
- La cualificacion se basa en encaje operativo: zona, presupuesto, fecha, invitados y alcance.
- Los proveedores se valoran por categoria, region, capacidad, estilo, fiabilidad, respuesta, experiencia previa, calidad y compatibilidad con politica sin comisiones.
- Los roles previstos son admin, colaborador y solo lectura.
