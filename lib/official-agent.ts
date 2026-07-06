import { readApiCollection } from "@/lib/api-firestore";
import { categoriasCompatibles, normalizeCategoriaId } from "@/lib/categorias";
import { scoreLead } from "@/lib/lead-scoring";
import type { CalendarItem, Event, EventService, Lead, Task, Vendor, VendorMatch, VendorPrice } from "@/lib/types";

export async function getOfficialEventBrief(eventId: string) {
  const [events, eventServices, tasks, calendarItems] = await Promise.all([
    readApiCollection<Event>("events"),
    readApiCollection<EventService>("eventServices"),
    readApiCollection<Task>("tasks"),
    readApiCollection<CalendarItem>("calendarItems")
  ]);
  const event = events.find((item) => item.id === eventId);
  if (!event) return null;

  const services = eventServices.filter((service) => service.eventId === event.id);
  const openTasks = tasks.filter((task) => task.eventId === event.id && task.status !== "hecha");
  const upcoming = calendarItems.filter((item) => item.eventId === event.id).sort(byDate);
  const alerts = [
    ...services.filter((service) => !service.vendorId).map((service) => `Servicio pendiente de proveedor: ${service.category}`),
    ...openTasks.filter((task) => new Date(task.dueDate) < startOfDay(new Date())).map((task) => `Tarea vencida: ${task.title}`)
  ];

  return {
    event,
    services,
    openTasks,
    upcoming,
    alerts,
    summary: `${event.name}: ${event.guests} invitados en ${event.location}. Fase ${event.phase}.`
  };
}

export async function getOfficialVendorMatches(eventId: string, category: string): Promise<VendorMatch[] | null> {
  const [events, vendors, vendorPrices] = await Promise.all([
    readApiCollection<Event>("events"),
    readApiCollection<Vendor>("vendors"),
    readApiCollection<VendorPrice>("vendorPrices")
  ]);
  const event = events.find((item) => item.id === eventId);
  if (!event) return null;

  const compatibleCategories = categoriasCompatibles(category).map(normalizeCategoriaId);

  return vendors
    .filter((vendor) => compatibleCategories.includes(normalizeCategoriaId(vendor.category)))
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
      if (vendor.previousExperience > 0) score += Math.min(10, vendor.previousExperience * 2);
      if (vendor.commissionFree) score += 5;
      if (price && average(price.minPrice, price.maxPrice) <= event.totalBudget * 0.3) score += 5;

      return { vendor, price, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export async function getOfficialBudgetDraft(eventId: string) {
  const [events, eventServices, vendors, vendorPrices] = await Promise.all([
    readApiCollection<Event>("events"),
    readApiCollection<EventService>("eventServices"),
    readApiCollection<Vendor>("vendors"),
    readApiCollection<VendorPrice>("vendorPrices")
  ]);
  const event = events.find((item) => item.id === eventId);
  if (!event) return null;

  const lines = eventServices
    .filter((service) => service.eventId === event.id)
    .map((service) => {
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
    approvalRequired: true
  };
}

export async function getOfficialRunbook(eventId: string) {
  const [events, eventServices] = await Promise.all([
    readApiCollection<Event>("events"),
    readApiCollection<EventService>("eventServices")
  ]);
  const event = events.find((item) => item.id === eventId);
  if (!event) return null;
  const missingServices = eventServices.filter((service) => service.eventId === event.id && !service.vendorId);

  return {
    eventId,
    eventName: event.name,
    approvalRequired: true,
    warnings: [
      ...event.risks,
      ...missingServices.map((service) => `Servicio sin proveedor asignado: ${service.category}`)
    ],
    timeline: []
  };
}

export async function getOfficialLeadReply(leadId: string) {
  const leads = await readApiCollection<Lead>("leads");
  const lead = leads.find((item) => item.id === leadId);
  if (!lead) return null;
  const score = scoreLead(lead);

  return {
    leadId: lead.id,
    subject: `Gracias por escribirnos, ${lead.coupleName}`,
    body: [
      `Hola ${lead.coupleName},`,
      "",
      "Gracias por contarnos un poco sobre vuestra boda. Vemos encaje para revisar vuestro caso con detalle.",
      `Tenemos apuntado: fecha ${formatDate(lead.eventDate)}, ${lead.guests} invitados, zona ${lead.location} y servicio de ${lead.requestedService.toLowerCase()}.`,
      "",
      "Os proponemos una llamada breve para entender estilo, prioridades y alcance antes de presupuestar.",
      "",
      "Un abrazo,"
    ].join("\n"),
    priority: score.priority,
    nextAction: score.nextAction,
    approvalRequired: true
  };
}

function average(min: number, max: number) {
  return Math.round((min + max) / 2);
}

function byDate(a: CalendarItem, b: CalendarItem) {
  return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(date));
}
