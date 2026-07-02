import { calendarItems, eventServices, events, leads, tasks, vendorPrices, vendors } from "./seed";
import type { CalendarItem, Event, Lead, LeadPriority, VendorMatch } from "./types";

const SOON_DAYS = 120;

export function scoreLead(input: Pick<Lead, "budget" | "guests" | "eventDate" | "location" | "requestedService">): {
  priority: LeadPriority;
  score: number;
  reasons: string[];
  nextAction: string;
} {
  const reasons: string[] = [];
  let score = 0;
  const daysToEvent = daysUntil(input.eventDate);

  if (/pais vasco|gipuzkoa|guipuzcoa|alava|bizkaia|canarias|las palmas|gran canaria/i.test(input.location)) {
    score += 25;
    reasons.push("Zona alineada con la operativa principal.");
  }
  if (input.budget >= 30000) {
    score += 25;
    reasons.push("Presupuesto suficiente para organizacion integral con margen de maniobra.");
  } else if (input.budget >= 18000) {
    score += 15;
    reasons.push("Presupuesto viable con alcance acotado.");
  }
  if (/integral|organizacion|proveedores/i.test(input.requestedService)) {
    score += 25;
    reasons.push("Servicio de alto valor y mayor ahorro operativo para Nomad.");
  } else if (/coordinacion|dia b/i.test(input.requestedService)) {
    score += 15;
    reasons.push("Encaja con coordinacion, pero con menor profundidad comercial.");
  }
  if (input.guests >= 80 && input.guests <= 180) {
    score += 15;
    reasons.push("Tamano de boda dentro del rango operativo mas comodo.");
  } else if (input.guests > 200) {
    score += 5;
    reasons.push("Evento grande: requiere revisar complejidad logistica.");
  }
  if (daysToEvent <= SOON_DAYS) {
    score += 10;
    reasons.push("Fecha cercana: conviene responder y filtrar rapido.");
  }

  const priority: LeadPriority = score >= 70 ? "alta" : score >= 45 ? "media" : "baja";
  const nextAction =
    priority === "alta"
      ? "Preparar respuesta personalizada y proponer reunion esta semana."
      : priority === "media"
      ? "Enviar email de encaje y pedir dos datos clave antes de presupuestar."
      : "Responder con disponibilidad limitada y validar presupuesto/alcance.";

  return { priority, score, reasons, nextAction };
}

export function draftReplyForLead(leadId: string) {
  const lead = leads.find((item) => item.id === leadId) ?? leads[0];
  const score = scoreLead(lead);

  return {
    leadId: lead.id,
    subject: `Gracias por escribirnos, ${lead.coupleName}`,
    body: [
      `Hola ${lead.coupleName},`,
      "",
      "Gracias por contarnos un poco sobre vuestra boda. Por lo que nos decís, vemos encaje para ayudaros con una propuesta cuidada y sin perder vuestra esencia.",
      `Tenemos apuntado: fecha ${formatDate(lead.eventDate)}, ${lead.guests} invitados, zona ${lead.location} y servicio de ${lead.requestedService.toLowerCase()}.`,
      "",
      "Antes de prepararos una propuesta cerrada, os sugerimos una llamada breve para entender estilo, prioridades y nivel de acompañamiento que necesitais.",
      "",
      "Si os encaja, os proponemos dos huecos y despues os enviamos un resumen con alcance, proximos pasos y presupuesto.",
      "",
      "Un abrazo,",
      "Soraya y Aritz"
    ].join("\n"),
    priority: score.priority,
    nextAction: score.nextAction,
    approvalRequired: true
  };
}

export function matchVendors(eventId: string, category: string): VendorMatch[] {
  const event = events.find((item) => item.id === eventId) ?? events[0];
  return vendors
    .filter((vendor) => vendor.category === category)
    .map((vendor) => {
      const price = vendorPrices.find((item) => item.vendorId === vendor.id);
      const reasons: string[] = [];
      let score = 0;

      if (vendor.region === event.region) {
        score += 25;
        reasons.push("Misma region que el evento.");
      }
      if (vendor.capacity >= event.guests) {
        score += 20;
        reasons.push("Capacidad suficiente para el numero de invitados.");
      }
      const styleHits = vendor.styleTags.filter((tag) => event.style.toLowerCase().includes(tag.toLowerCase())).length;
      if (styleHits > 0) {
        score += Math.min(20, styleHits * 8);
        reasons.push("Estilo compatible con el concepto de la boda.");
      }
      score += vendor.reliability * 2;
      score += vendor.qualityScore * 2;
      score += Math.max(0, 10 - Math.floor(vendor.responseTimeHours / 6));
      if (vendor.previousExperience > 0) {
        score += Math.min(10, vendor.previousExperience * 2);
        reasons.push("Existe experiencia previa con Nomad.");
      }
      if (vendor.commissionFree) {
        score += 5;
        reasons.push("Compatible con politica sin comisiones.");
      }
      if (price && average(price.minPrice, price.maxPrice) <= event.totalBudget * 0.3) {
        score += 5;
        reasons.push("Precio historico razonable para el presupuesto total.");
      }

      return { vendor, price, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export function budgetDraft(eventId: string) {
  const event = events.find((item) => item.id === eventId) ?? events[0];
  const services = eventServices.filter((service) => service.eventId === event.id);
  const lines = services.map((service) => {
    const vendor = service.vendorId ? vendors.find((item) => item.id === service.vendorId) : undefined;
    const price = vendor ? vendorPrices.find((item) => item.vendorId === vendor.id) : undefined;
    const estimatedCost = service.estimatedCost || (price ? average(price.minPrice, price.maxPrice) : 0);
    return {
      category: service.category,
      vendor: vendor?.name ?? "Proveedor pendiente",
      status: service.status,
      estimatedCost,
      basis: price?.historical ? "historico proveedor" : "estimacion interna"
    };
  });
  const subtotal = lines.reduce((sum, line) => sum + line.estimatedCost, 0);
  const planningFee = event.totalBudget >= 30000 ? 3200 : 2200;
  const contingency = Math.round(subtotal * 0.08);

  return {
    eventId,
    eventName: event.name,
    currency: "EUR",
    lines,
    subtotal,
    planningFee,
    contingency,
    estimatedTotal: subtotal + planningFee + contingency,
    approvalRequired: true,
    note: "Borrador interno: revisar condiciones reales de cada proveedor antes de compartir."
  };
}

export function eventBrief(eventId: string) {
  const event = events.find((item) => item.id === eventId) ?? events[0];
  const services = eventServices.filter((service) => service.eventId === event.id);
  const openTasks = tasks.filter((task) => task.eventId === event.id && task.status !== "hecha");
  const upcoming = calendarItems.filter((item) => item.eventId === event.id).sort(byDate);
  const alerts = getAlerts(event, upcoming);

  return {
    event,
    services,
    openTasks,
    upcoming,
    alerts,
    summary: `${event.name}: ${event.guests} invitados en ${event.location}. Fase ${event.phase}. Riesgos principales: ${event.risks.join(", ")}.`
  };
}

export function runbook(eventId: string) {
  const event = events.find((item) => item.id === eventId) ?? events[0];
  const services = eventServices.filter((service) => service.eventId === event.id);
  const missingServices = services.filter((service) => !service.vendorId);

  return {
    eventId,
    eventName: event.name,
    approvalRequired: true,
    warnings: [
      ...event.risks,
      ...missingServices.map((service) => `Servicio sin proveedor asignado: ${service.category}`)
    ],
    timeline: [
      { time: "09:00", moment: "Llegada equipo Nomad y apertura montaje", owner: "Aritz", checks: ["Accesos", "electricidad", "plan B"] },
      { time: "10:30", moment: "Montaje decoracion y mobiliario", owner: "Aritz", checks: ["Altar", "mesas", "rincones"] },
      { time: "13:00", moment: "Revision catering y dietas", owner: "Soraya", checks: event.dietaryNeeds },
      { time: "16:30", moment: "Recepcion invitados", owner: "Soraya", checks: ["senaletica", "musica ambiente", "agua"] },
      { time: "17:00", moment: "Ceremonia", owner: "Soraya", checks: ["guion", "votos", "microfonos"] },
      { time: "18:00", moment: "Coctel", owner: "Nomad", checks: ["bebidas", "fotos", "control tiempos"] },
      { time: "20:30", moment: "Banquete", owner: "Soraya", checks: ["entrada pareja", "dietas", "discursos"] },
      { time: "23:30", moment: "Baile y fiesta", owner: "Aritz", checks: ["sonido", "iluminacion", "barra libre"] },
      { time: "02:00", moment: "Cierre y desmontaje", owner: "Aritz", checks: ["transporte", "objetos personales", "proveedores"] }
    ]
  };
}

export function detectCalendarConflicts(items: CalendarItem[] = calendarItems) {
  return items.flatMap((item, index) => {
    return items.slice(index + 1).flatMap((other) => {
      const sameOwner = item.owner === other.owner || item.owner === "Nomad" || other.owner === "Nomad";
      const overlaps = new Date(item.startsAt) < new Date(other.endsAt) && new Date(other.startsAt) < new Date(item.endsAt);
      return sameOwner && overlaps
        ? [{ first: item.title, second: other.title, owner: item.owner === "Nomad" ? other.owner : item.owner }]
        : [];
    });
  });
}

function getAlerts(event: Event, upcoming: CalendarItem[]) {
  const missing = eventServices.filter((service) => service.eventId === event.id && !service.vendorId);
  const today = startOfDay(new Date());
  const overdue = tasks.filter((task) => task.eventId === event.id && task.status !== "hecha" && new Date(task.dueDate) < today);
  const conflicts = detectCalendarConflicts(upcoming);
  return [
    ...missing.map((service) => `Servicio pendiente de proveedor: ${service.category}`),
    ...overdue.map((task) => `Tarea vencida: ${task.title}`),
    ...conflicts.map((conflict) => `Conflicto de calendario: ${conflict.first} / ${conflict.second}`)
  ];
}

function average(min: number, max: number) {
  return Math.round((min + max) / 2);
}

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - startOfDay(new Date()).getTime()) / 86_400_000);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function byDate(a: CalendarItem, b: CalendarItem) {
  return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));
}
