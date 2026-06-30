import type {
  CalendarItem,
  Client,
  Communication,
  DocumentRecord,
  Event,
  EventService,
  Lead,
  Task,
  Vendor,
  VendorPrice
} from "./types";

export const leads: Lead[] = [
  {
    id: "lead-001",
    source: "web",
    coupleName: "Marta & Iker",
    phone: "+34 600 111 222",
    email: "marta.iker@example.com",
    eventDate: "2027-06-12",
    location: "Getaria, Gipuzkoa",
    budget: 42000,
    guests: 145,
    requestedService: "Organizacion integral",
    status: "meeting",
    priority: "alta",
    summary: "Boda rústica cerca del mar, con ceremonia simbólica y prioridad en proveedores locales.",
    nextAction: "Enviar propuesta de alcance y agendar reunion de concepto.",
    createdAt: "2026-06-24",
    consent: true
  },
  {
    id: "lead-002",
    source: "email",
    coupleName: "Laura & Raul",
    phone: "+34 611 333 444",
    email: "laura.raul@example.com",
    eventDate: "2026-10-03",
    location: "Las Palmas de Gran Canaria",
    budget: 18000,
    guests: 80,
    requestedService: "Coordinacion del dia B",
    status: "proposal",
    priority: "media",
    summary: "Tienen finca reservada y necesitan ordenar proveedores y timeline final.",
    nextAction: "Mandar presupuesto de coordinacion integral.",
    createdAt: "2026-06-19",
    consent: true
  },
  {
    id: "lead-003",
    source: "manual",
    coupleName: "Nerea & Pablo",
    phone: "+34 622 555 666",
    email: "nerea.pablo@example.com",
    eventDate: "2027-09-18",
    location: "Alava",
    budget: 26000,
    guests: 210,
    requestedService: "Busqueda de finca y proveedores",
    status: "qualified",
    priority: "media",
    summary: "Evento grande con mucha logistica familiar y necesidad de transporte.",
    nextAction: "Preparar shortlist de fincas con capacidad superior a 200.",
    createdAt: "2026-06-27",
    consent: true
  }
];

export const clients: Client[] = [
  {
    id: "client-001",
    coupleName: "Irene & Ruben",
    contacts: [
      { name: "Irene", role: "novia", phone: "+34 633 111 111", email: "irene@example.com" },
      { name: "Ruben", role: "novio", phone: "+34 633 222 222", email: "ruben@example.com" }
    ],
    preferences: ["bodega", "comedor calido", "ceremonia emotiva", "musica en directo"],
    notes: "Prefieren pocas reuniones, resumen por email y decisiones cerradas por bloques.",
    rgpdConsent: true
  },
  {
    id: "client-002",
    coupleName: "Andrea & Oier",
    contacts: [
      { name: "Andrea", role: "novia", phone: "+34 644 111 111", email: "andrea@example.com" },
      { name: "Oier", role: "novio", phone: "+34 644 222 222", email: "oier@example.com" }
    ],
    preferences: ["finca privada", "decoracion natural", "catering informal", "fiesta larga"],
    notes: "Necesitan control de pagos porque varios familiares participan en proveedores concretos.",
    rgpdConsent: true
  }
];

export const events: Event[] = [
  {
    id: "event-001",
    clientId: "client-001",
    name: "Boda I&R",
    date: "2026-09-05",
    location: "Bodega en Rioja Alavesa",
    region: "Pais Vasco",
    guests: 132,
    style: "Rustico elegante, exterior y comedor calido",
    totalBudget: 36500,
    phase: "produccion",
    risks: ["Confirmar plan B lluvia", "Pendiente menu infantil", "Transporte nocturno sin cerrar"],
    dietaryNeeds: ["8 vegetarianos", "3 celiacos", "1 alergia frutos secos"],
    accommodationNeeds: "Bloque de 24 habitaciones reservado hasta el 15/07.",
    paymentStatus: "50% servicio Nomad cobrado; segundo pago programado una semana antes."
  },
  {
    id: "event-002",
    clientId: "client-002",
    name: "Boda A&O",
    date: "2027-04-24",
    location: "Finca privada en Gran Canaria",
    region: "Canarias",
    guests: 96,
    style: "Desenfadado, naturaleza, mesas largas y fiesta exterior",
    totalBudget: 28500,
    phase: "proveedores",
    risks: ["Licencia musica pendiente", "Generador electrico por validar"],
    dietaryNeeds: ["6 vegetarianos", "2 veganos"],
    accommodationNeeds: "Invitados de peninsula; buscar dos hoteles cercanos.",
    paymentStatus: "Contrato firmado; primer pago recibido."
  }
];

export const vendors: Vendor[] = [
  {
    id: "vendor-001",
    name: "Bodega Lur",
    category: "localizacion",
    region: "Pais Vasco",
    phone: "+34 945 000 111",
    email: "eventos@bodegalur.example",
    website: "https://bodegalur.example",
    capacity: 180,
    styleTags: ["bodega", "rustico", "exterior", "comedor calido"],
    reliability: 9,
    responseTimeHours: 12,
    previousExperience: 4,
    qualityScore: 9,
    commissionFree: true,
    notes: "Muy buen plan B de lluvia y equipo tecnico propio."
  },
  {
    id: "vendor-002",
    name: "Finca Tamaragua",
    category: "localizacion",
    region: "Canarias",
    phone: "+34 928 000 222",
    email: "hola@fincatamaragua.example",
    website: "https://fincatamaragua.example",
    capacity: 140,
    styleTags: ["finca", "naturaleza", "mesas largas", "exterior"],
    reliability: 8,
    responseTimeHours: 18,
    previousExperience: 2,
    qualityScore: 8,
    commissionFree: true,
    notes: "Necesita proveedor externo de sonido y generador."
  },
  {
    id: "vendor-003",
    name: "Catering Basa",
    category: "restauracion",
    region: "Pais Vasco",
    phone: "+34 943 000 333",
    email: "info@cateringbasa.example",
    website: "https://cateringbasa.example",
    capacity: 240,
    styleTags: ["local", "producto", "menu infantil", "vegetariano"],
    reliability: 9,
    responseTimeHours: 10,
    previousExperience: 6,
    qualityScore: 9,
    commissionFree: true,
    notes: "Muy buenos con alergias; conviene cerrar degustacion con 3 meses."
  },
  {
    id: "vendor-004",
    name: "Floristeria Bruma",
    category: "decoracion",
    region: "Pais Vasco",
    phone: "+34 943 000 444",
    email: "bodas@bruma.example",
    website: "https://bruma.example",
    capacity: 220,
    styleTags: ["flor silvestre", "natural", "altar", "mesas"],
    reliability: 8,
    responseTimeHours: 24,
    previousExperience: 5,
    qualityScore: 9,
    commissionFree: true,
    notes: "Encaja muy bien con bodegas y exteriores."
  },
  {
    id: "vendor-005",
    name: "Sonido Norte",
    category: "musica",
    region: "Pais Vasco",
    phone: "+34 944 000 555",
    email: "booking@sonidonorte.example",
    website: "https://sonidonorte.example",
    capacity: 300,
    styleTags: ["dj", "directo", "iluminacion", "barra libre"],
    reliability: 7,
    responseTimeHours: 36,
    previousExperience: 3,
    qualityScore: 8,
    commissionFree: true,
    notes: "Pedir siempre rider y horarios de desmontaje."
  },
  {
    id: "vendor-006",
    name: "Luz de Arena",
    category: "fotografia-video",
    region: "Canarias",
    phone: "+34 928 000 666",
    email: "hola@luzdearena.example",
    website: "https://luzdearena.example",
    capacity: 160,
    styleTags: ["documental", "playa", "luz natural", "dron"],
    reliability: 9,
    responseTimeHours: 8,
    previousExperience: 4,
    qualityScore: 9,
    commissionFree: true,
    notes: "Buen trato con parejas que no quieren posados largos."
  },
  {
    id: "vendor-007",
    name: "Guaguas Atlante",
    category: "transporte",
    region: "Canarias",
    phone: "+34 928 000 777",
    email: "reservas@atlante.example",
    website: "https://atlante.example",
    capacity: 220,
    styleTags: ["autobus", "nocturno", "hoteles", "aeropuerto"],
    reliability: 8,
    responseTimeHours: 16,
    previousExperience: 2,
    qualityScore: 8,
    commissionFree: true,
    notes: "Confirmar rutas y hora extra si hay fiesta larga."
  }
];

export const vendorPrices: VendorPrice[] = [
  { id: "price-001", vendorId: "vendor-001", serviceName: "Alquiler bodega completa", season: "alta", region: "Pais Vasco", minPrice: 5800, maxPrice: 7800, conditions: "Incluye mobiliario basico y coordinador de espacio.", historical: true },
  { id: "price-002", vendorId: "vendor-002", serviceName: "Finca dia completo", season: "media", region: "Canarias", minPrice: 3600, maxPrice: 5200, conditions: "No incluye sonido ni generador.", historical: true },
  { id: "price-003", vendorId: "vendor-003", serviceName: "Menu boda producto local", season: "alta", region: "Pais Vasco", minPrice: 118, maxPrice: 148, conditions: "Precio por invitado; incluye degustacion para dos.", historical: true },
  { id: "price-004", vendorId: "vendor-004", serviceName: "Decoracion floral integral", season: "alta", region: "Pais Vasco", minPrice: 2400, maxPrice: 4300, conditions: "Altar, centros, prendidos y montaje.", historical: true },
  { id: "price-005", vendorId: "vendor-005", serviceName: "DJ, sonido e iluminacion", season: "alta", region: "Pais Vasco", minPrice: 1600, maxPrice: 2800, conditions: "Hasta 6 horas de fiesta.", historical: true },
  { id: "price-006", vendorId: "vendor-006", serviceName: "Fotografia y video documental", season: "media", region: "Canarias", minPrice: 2600, maxPrice: 3900, conditions: "Incluye trailer y entrega digital.", historical: true },
  { id: "price-007", vendorId: "vendor-007", serviceName: "Transporte invitados nocturno", season: "media", region: "Canarias", minPrice: 700, maxPrice: 1500, conditions: "Dos rutas y una vuelta nocturna.", historical: true }
];

export const eventServices: EventService[] = [
  { id: "service-001", eventId: "event-001", category: "localizacion", vendorId: "vendor-001", estimatedCost: 6800, margin: 0, status: "contratado" },
  { id: "service-002", eventId: "event-001", category: "restauracion", vendorId: "vendor-003", estimatedCost: 17820, margin: 0, status: "reservado" },
  { id: "service-003", eventId: "event-001", category: "decoracion", vendorId: "vendor-004", estimatedCost: 3300, margin: 0, status: "propuesto" },
  { id: "service-004", eventId: "event-001", category: "transporte", estimatedCost: 1200, margin: 0, status: "pendiente" },
  { id: "service-005", eventId: "event-002", category: "localizacion", vendorId: "vendor-002", estimatedCost: 4400, margin: 0, status: "reservado" },
  { id: "service-006", eventId: "event-002", category: "fotografia-video", vendorId: "vendor-006", estimatedCost: 3200, margin: 0, status: "propuesto" },
  { id: "service-007", eventId: "event-002", category: "musica", estimatedCost: 1800, margin: 0, status: "pendiente" }
];

export const tasks: Task[] = [
  { id: "task-001", eventId: "event-001", title: "Cerrar menu infantil y alergias", owner: "Soraya", dueDate: "2026-07-10", status: "en-curso" },
  { id: "task-002", eventId: "event-001", title: "Validar plan B de lluvia con bodega", owner: "Aritz", dueDate: "2026-07-02", status: "pendiente" },
  { id: "task-003", eventId: "event-001", title: "Solicitar presupuesto transporte nocturno", owner: "Soraya", dueDate: "2026-07-01", status: "pendiente" },
  { id: "task-004", eventId: "event-002", title: "Comprobar licencia de musica exterior", owner: "Aritz", dueDate: "2026-08-20", status: "bloqueada" },
  { id: "task-005", eventId: "event-002", title: "Shortlist de hoteles para invitados", owner: "Soraya", dueDate: "2026-08-05", status: "pendiente" }
];

export const calendarItems: CalendarItem[] = [
  { id: "cal-001", eventId: "event-001", title: "Visita tecnica Bodega Lur", kind: "visita-tecnica", startsAt: "2026-07-08T10:00:00", endsAt: "2026-07-08T12:00:00", owner: "Aritz" },
  { id: "cal-002", eventId: "event-001", title: "Deadline runbook proveedores", kind: "deadline", startsAt: "2026-08-28T09:00:00", endsAt: "2026-08-28T10:00:00", owner: "Soraya" },
  { id: "cal-003", eventId: "event-001", title: "Boda I&R", kind: "dia-b", startsAt: "2026-09-05T09:00:00", endsAt: "2026-09-06T02:00:00", owner: "Nomad" },
  { id: "cal-004", eventId: "event-002", title: "Reunion concepto A&O", kind: "reunion", startsAt: "2026-07-16T17:30:00", endsAt: "2026-07-16T18:30:00", owner: "Soraya" },
  { id: "cal-005", title: "Seguimiento pipeline leads", kind: "reunion", startsAt: "2026-07-01T09:30:00", endsAt: "2026-07-01T10:00:00", owner: "Soraya" }
];

export const documents: DocumentRecord[] = [
  { id: "doc-001", eventId: "event-001", type: "contrato", title: "Contrato Nomad - I&R", status: "aprobado", updatedAt: "2026-05-18" },
  { id: "doc-002", eventId: "event-001", type: "brief", title: "Brief decoracion y ceremonia", status: "borrador", updatedAt: "2026-06-28" },
  { id: "doc-003", eventId: "event-002", type: "presupuesto", title: "Presupuesto base A&O", status: "aprobado", updatedAt: "2026-06-10" }
];

export const communications: Communication[] = [
  {
    id: "comm-001",
    eventId: "event-001",
    channel: "resumen-reunion",
    subject: "Reunion proveedores I&R",
    body: "Se revisan menu, decoracion y transporte. Queda pendiente el plan B de lluvia.",
    summary: "Pendientes: plan B lluvia, menu infantil y transporte nocturno.",
    createdAt: "2026-06-25"
  }
];
