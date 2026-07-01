export interface EmailTemplate {
  id: string;
  nombre: string;
  asunto: string;
  cuerpo: string;
  variables: string[];
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: "temp-info-inicial",
    nombre: "Solicitud de información inicial",
    asunto: "Solicitud de información - Nomad Weddings",
    cuerpo: `Hola {{nombre_proveedor}},

Espero que estés muy bien.

Te escribo desde Nomad Weddings. Estamos organizando una boda para la pareja {{nombre_pareja}} y nos gustaría conocer un poco más sobre vuestros servicios. La boda está planificada para el {{fecha_boda}} en la zona de {{ubicacion_boda}} con aproximadamente {{num_invitados}} invitados.

¿Nos podrías enviar vuestro dossier de servicios, tarifas actualizadas y condiciones generales de contratación?

Muchas gracias de antemano por tu tiempo.

Un saludo,
{{nombre_planner}}
Nomad Weddings`,
    variables: ["nombre_proveedor", "nombre_pareja", "fecha_boda", "ubicacion_boda", "num_invitados", "nombre_planner"]
  },
  {
    id: "temp-presupuesto-detallado",
    nombre: "Solicitud de presupuesto detallado",
    asunto: "Solicitud de presupuesto detallado para {{nombre_pareja}} - {{fecha_boda}}",
    cuerpo: `Hola {{nombre_proveedor}},

Espero que estés teniendo una buena semana.

En relación a la boda de {{nombre_pareja}} para el próximo {{fecha_boda}} en {{ubicacion_boda}}, nos gustaría solicitarte un presupuesto formal y detallado para los siguientes servicios de interés:

{{servicios_interes}}

Los novios tienen una previsión de {{num_invitados}} invitados. ¿Podrías indicarnos también las condiciones de pago, el depósito necesario para la reserva de fecha y vuestra política de cancelación?

Quedamos a la espera de tu respuesta para poder presentárselo a la pareja.

Un saludo cordial,
{{nombre_planner}}
Nomad Weddings`,
    variables: ["nombre_proveedor", "nombre_pareja", "fecha_boda", "ubicacion_boda", "servicios_interes", "num_invitados", "nombre_planner"]
  },
  {
    id: "temp-confirmacion-reserva",
    nombre: "Confirmación de reserva",
    asunto: "Confirmación de reserva de fecha - Boda {{nombre_pareja}} - {{fecha_boda}}",
    cuerpo: `Hola {{nombre_proveedor}},

¡Buenas noticias! La pareja {{nombre_pareja}} ha aprobado vuestro presupuesto para su boda el {{fecha_boda}} en {{ubicacion_boda}}.

Queremos proceder con la reserva formal de la fecha. Por favor, indícanos los siguientes pasos:
1. Contrato de servicios para revisión y firma de los novios.
2. Datos para el pago de la señal o depósito de reserva.
3. Plazos para los siguientes pagos.

Estamos muy contentos de contar con vosotros para este gran día. En las próximas semanas os enviaremos un borrador del cronograma (runbook) para ir coordinando el montaje.

Un abrazo,
{{nombre_planner}}
Nomad Weddings`,
    variables: ["nombre_proveedor", "nombre_pareja", "fecha_boda", "ubicacion_boda", "nombre_planner"]
  },
  {
    id: "temp-seguimiento",
    nombre: "Recordatorio / Seguimiento",
    asunto: "Seguimiento - Boda {{nombre_pareja}} - {{fecha_boda}}",
    cuerpo: `Hola {{nombre_proveedor}},

Espero que todo vaya muy bien.

Te escribo para hacer seguimiento sobre la boda de {{nombre_pareja}} del próximo {{fecha_boda}}. Nos quedamos pendientes de recibir:

- [ ] Confirmación de disponibilidad / tarifas.
- [ ] Contrato firmado.
- [ ] Información sobre el equipo técnico.

Agradeceríamos que nos lo pudieras enviar lo antes posible para poder avanzar con la planificación de la boda.

Cualquier duda o comentario, quedo a tu entera disposición.

Un saludo,
{{nombre_planner}}
Nomad Weddings`,
    variables: ["nombre_proveedor", "nombre_pareja", "fecha_boda", "nombre_planner"]
  },
  {
    id: "temp-disponibilidad",
    nombre: "Solicitud de disponibilidad de fecha",
    asunto: "Consulta de disponibilidad para el {{fecha_boda}} - Nomad Weddings",
    cuerpo: `Hola {{nombre_proveedor}},

Espero que estés muy bien.

Te escribo para consultar vuestra disponibilidad para la fecha {{fecha_boda}} para una boda que estamos organizando en {{ubicacion_boda}}.

La pareja se llama {{nombre_pareja}} y están muy interesados en vuestro trabajo, especialmente en vuestra categoría de {{servicios_interes}}.

¿Tenéis la fecha libre actualmente? En caso afirmativo, agradeceríamos que nos lo confirmaras para poder agendar una breve llamada o enviar los detalles para un presupuesto.

Muchas gracias por tu atención.

Un saludo,
{{nombre_planner}}
Nomad Weddings`,
    variables: ["nombre_proveedor", "fecha_boda", "ubicacion_boda", "nombre_pareja", "servicios_interes", "nombre_planner"]
  }
];
