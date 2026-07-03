import type {
  CalendarItem,
  Client,
  Event,
  EventService,
  ParejaProfile,
  WorkspaceBlock,
  WorkspacePage
} from "@/lib/types";

const DEMO_TODAY = new Date("2026-07-03T00:00:00");

export type WeddingProjectContactInput = {
  name?: string;
  role?: string;
  phone?: string;
  email?: string;
  preferences?: string;
};

export type WeddingProjectInput = {
  clientId?: string;
  coupleName: string;
  eventName?: string;
  date: string;
  location: string;
  region: string;
  guests: number;
  budget: number;
  style: string;
  preferences?: string;
  dietaryNeeds?: string;
  riskNotes?: string;
  accommodationNeeds?: string;
  rgpdConsent?: boolean;
  clientNotes?: string;
  contactOne: WeddingProjectContactInput;
  contactTwo: WeddingProjectContactInput;
};

type WeddingProjectActions = {
  addClient: (client: Omit<Client, "id"> & { id?: string }) => string;
  addEvent: (event: Omit<Event, "id"> & { id?: string }) => string;
  addParejaProfile: (profile: Omit<ParejaProfile, "id"> & { id?: string }) => string;
  addEventService: (service: Omit<EventService, "id"> & { id?: string }) => string;
  addWorkspacePage: (page: Omit<WorkspacePage, "id"> & { id?: string }) => string;
  addWorkspaceBlock: (block: Omit<WorkspaceBlock, "id"> & { id?: string }) => string;
  addCalendarItem: (item: Omit<CalendarItem, "id"> & { id?: string }) => string;
};

export type CreatedWeddingProject = {
  clientId: string;
  eventId: string;
  pageIds: {
    kickoff: string;
    vendors: string;
    finance: string;
    production: string;
  };
};

export function splitCommaList(value = ""): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function operationalDate(weddingDate: string, daysBeforeWedding: number, fallbackDaysFromToday: number): string {
  const base = weddingDate ? new Date(`${weddingDate}T00:00:00`) : new Date(DEMO_TODAY);
  base.setDate(base.getDate() + (weddingDate ? -daysBeforeWedding : fallbackDaysFromToday));
  return formatDate(base);
}

function calendarRange(date: string, hour: string): { startsAt: string; endsAt: string } {
  return {
    startsAt: `${date}T${hour}:00`,
    endsAt: `${date}T${hour}:45`,
  };
}

function profileRole(role?: string): ParejaProfile["rol"] {
  if (role === "novio" || role === "novia" || role === "otro") return role;
  return "otro";
}

export function createWeddingProject(actions: WeddingProjectActions, input: WeddingProjectInput): CreatedWeddingProject {
  const coupleParts = input.coupleName.split("&").map((item) => item.trim()).filter(Boolean);
  const firstName = input.contactOne.name?.trim() || coupleParts[0] || "Persona 1";
  const secondName = input.contactTwo.name?.trim() || coupleParts[1] || "Persona 2";
  const preferences = splitCommaList(input.preferences);
  const dietaryNeeds = input.dietaryNeeds || "";
  const riskNotes = input.riskNotes || "";
  const estimatedBudget = Number(input.budget) || 0;

  const clientId = input.clientId || actions.addClient({
    coupleName: input.coupleName,
    contacts: [
      { name: firstName, role: input.contactOne.role || "novia", phone: input.contactOne.phone || "", email: input.contactOne.email || "" },
      { name: secondName, role: input.contactTwo.role || "novio", phone: input.contactTwo.phone || "", email: input.contactTwo.email || "" }
    ],
    preferences,
    notes: input.clientNotes || riskNotes || "Creado desde alta de boda",
    rgpdConsent: input.rgpdConsent ?? true
  });

  const eventId = actions.addEvent({
    clientId,
    name: input.eventName || `Boda de ${input.coupleName}`,
    date: input.date,
    location: input.location,
    region: input.region,
    guests: Number(input.guests) || 0,
    style: input.style,
    totalBudget: estimatedBudget,
    phase: "descubrimiento",
    risks: splitCommaList(riskNotes),
    dietaryNeeds: splitCommaList(dietaryNeeds),
    accommodationNeeds: input.accommodationNeeds || "",
    paymentStatus: "Pendiente primer pago"
  });

  const partnerOneNotes = [input.contactOne.preferences, dietaryNeeds ? `Alergias/dietas: ${dietaryNeeds}` : ""].filter(Boolean).join("\n");
  const partnerTwoNotes = [input.contactTwo.preferences, dietaryNeeds ? `Alergias/dietas: ${dietaryNeeds}` : ""].filter(Boolean).join("\n");

  actions.addParejaProfile({
    eventId,
    nombre: firstName,
    rol: profileRole(input.contactOne.role || "novia"),
    gustos: input.contactOne.preferences,
    alergias: dietaryNeeds,
    contacto: {
      telefono: input.contactOne.phone || "",
      email: input.contactOne.email || ""
    },
    notas: partnerOneNotes
  });

  actions.addParejaProfile({
    eventId,
    nombre: secondName,
    rol: profileRole(input.contactTwo.role || "novio"),
    gustos: input.contactTwo.preferences,
    alergias: dietaryNeeds,
    contacto: {
      telefono: input.contactTwo.phone || "",
      email: input.contactTwo.email || ""
    },
    notas: partnerTwoNotes
  });

  [
    { category: "espacio", ratio: 0.28 },
    { category: "catering", ratio: 0.34 },
    { category: "fotografia", ratio: 0.08 },
    { category: "musica", ratio: 0.07 },
    { category: "decoracion", ratio: 0.09 }
  ].forEach((service) => {
    actions.addEventService({
      eventId,
      category: service.category,
      estimatedCost: Math.max(800, Math.round(estimatedBudget * service.ratio)),
      margin: 0,
      status: "pendiente"
    });
  });

  const kickoffPageId = actions.addWorkspacePage({
    eventId,
    title: "Kickoff operativo",
    icon: "CalendarDays",
    description: "Briefing, alcance, decisiones iniciales y proximos pasos de la pareja.",
    order: 1
  });
  const vendorPageId = actions.addWorkspacePage({
    eventId,
    title: "Proveedores clave",
    icon: "Users",
    description: "Shortlist, reservas, contratos y responsables por categoria.",
    order: 2
  });
  const financePageId = actions.addWorkspacePage({
    eventId,
    title: "Finanzas y pagos",
    icon: "WalletCards",
    description: "Pagos programados, avisos financieros y compromisos por proveedor.",
    order: 3
  });
  const productionPageId = actions.addWorkspacePage({
    eventId,
    title: "Produccion final",
    icon: "ClipboardList",
    description: "Invitados, seating, runbook, plan B y semana de la boda.",
    order: 4
  });

  const now = new Date().toISOString();
  actions.addWorkspaceBlock({
    pageId: kickoffPageId,
    eventId,
    type: "milestone",
    title: "Briefing de pareja validado",
    body: `Confirmar estilo, presupuesto, prioridades y limites operativos para ${input.eventName || input.coupleName}.`,
    owner: "Nomad",
    dueDate: operationalDate(input.date, 240, 7),
    reminderDate: operationalDate(input.date, 247, 3),
    priority: "alta",
    status: "pendiente",
    createdAt: now
  });
  actions.addWorkspaceBlock({
    pageId: vendorPageId,
    eventId,
    type: "vendor",
    title: "Shortlist de espacio y catering",
    body: "Preparar 3 opciones por categoria, validar disponibilidad y condiciones de reserva.",
    owner: "Nomad",
    dueDate: operationalDate(input.date, 210, 14),
    reminderDate: operationalDate(input.date, 217, 10),
    priority: "alta",
    status: "pendiente",
    createdAt: now
  });
  actions.addWorkspaceBlock({
    pageId: vendorPageId,
    eventId,
    type: "vendor",
    title: "Fotografia, musica y decoracion",
    body: "Solicitar propuestas, revisar estilo y bloquear proveedores prioritarios.",
    owner: "Nomad",
    dueDate: operationalDate(input.date, 150, 21),
    reminderDate: operationalDate(input.date, 157, 17),
    priority: "media",
    status: "pendiente",
    createdAt: now
  });
  actions.addWorkspaceBlock({
    pageId: financePageId,
    eventId,
    type: "payment",
    title: "Reserva inicial Nomad",
    body: "Primer pago para activar planificacion, proveedores y agenda operativa.",
    owner: "Pareja",
    dueDate: operationalDate(input.date, 230, 10),
    reminderDate: operationalDate(input.date, 237, 6),
    priority: "alta",
    status: "programado",
    amount: Math.max(1200, Math.round(estimatedBudget * 0.12)),
    createdAt: now
  });
  actions.addWorkspaceBlock({
    pageId: financePageId,
    eventId,
    type: "payment",
    title: "Segundo pago de proveedores",
    body: "Bloquear pagos de espacio, catering y proveedores confirmados.",
    owner: "Nomad",
    dueDate: operationalDate(input.date, 45, 30),
    reminderDate: operationalDate(input.date, 52, 23),
    priority: "alta",
    status: "programado",
    amount: Math.max(3000, Math.round(estimatedBudget * 0.35)),
    createdAt: now
  });
  actions.addWorkspaceBlock({
    pageId: productionPageId,
    eventId,
    type: "task",
    title: "Primer seating y necesidades especiales",
    body: "Recoger alergias, movilidad, transporte y prioridades familiares antes de cerrar plano.",
    owner: "Pareja",
    dueDate: operationalDate(input.date, 60, 35),
    reminderDate: operationalDate(input.date, 67, 28),
    priority: "media",
    status: "pendiente",
    createdAt: now
  });
  actions.addWorkspaceBlock({
    pageId: productionPageId,
    eventId,
    type: "milestone",
    title: "Runbook de dia B aprobado",
    body: "Cerrar cronograma, responsables, telefonos, plan B y checklist de montaje.",
    owner: "Nomad",
    dueDate: operationalDate(input.date, 14, 45),
    reminderDate: operationalDate(input.date, 21, 38),
    priority: "alta",
    status: "pendiente",
    createdAt: now
  });

  const kickoffDate = operationalDate(input.date, 238, 5);
  const visitDate = operationalDate(input.date, 120, 20);
  const finalMeetingDate = operationalDate(input.date, 21, 40);
  actions.addCalendarItem({
    eventId,
    title: "Kickoff con pareja",
    kind: "reunion",
    ...calendarRange(kickoffDate, "10:00"),
    owner: "Nomad"
  });
  actions.addCalendarItem({
    eventId,
    title: "Visita tecnica espacio",
    kind: "visita-tecnica",
    ...calendarRange(visitDate, "11:00"),
    owner: "Nomad"
  });
  actions.addCalendarItem({
    eventId,
    title: "Reunion final de produccion",
    kind: "deadline",
    ...calendarRange(finalMeetingDate, "17:00"),
    owner: "Nomad"
  });

  return {
    clientId,
    eventId,
    pageIds: {
      kickoff: kickoffPageId,
      vendors: vendorPageId,
      finance: financePageId,
      production: productionPageId
    }
  };
}
