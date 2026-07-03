export type LeadStatus = "new" | "qualified" | "meeting" | "proposal" | "won" | "lost";
export type LeadPriority = "alta" | "media" | "baja";
export type EventPhase = "descubrimiento" | "diseno" | "proveedores" | "produccion" | "semana-boda";
export type ServiceStatus = "pendiente" | "propuesto" | "reservado" | "contratado";
export type TaskStatus = "pendiente" | "en-curso" | "bloqueada" | "hecha";
export type CalendarKind = "reunion" | "visita-tecnica" | "pago" | "deadline" | "dia-b";
export type UserRole = "admin" | "colaborador" | "lectura";
export type VendorStatus = "draft" | "reviewed" | "verified" | "outdated";
export type VendorAvailabilityType = "local" | "se-desplaza" | "remoto";
export type VendorPriceConfidence = "alta" | "media" | "baja";
export type WorkspaceBlockType = "task" | "note" | "payment" | "milestone" | "vendor";
export type WorkspacePaymentStatus = "pendiente" | "programado" | "pagado" | "vencido";
export type NotificationStatus = "active" | "snoozed" | "dismissed";
export type NotificationSourceType = "workspace" | "calendar";

export interface VendorPackage {
  name: "basico" | "estandar" | "premium" | string;
  priceFrom?: number;
  description?: string;
}

export interface Lead {
  id: string;
  source: "web" | "email" | "manual";
  coupleName: string;
  phone: string;
  email: string;
  eventDate: string;
  location: string;
  budget: number;
  guests: number;
  requestedService: string;
  status: LeadStatus;
  priority: LeadPriority;
  summary: string;
  nextAction: string;
  createdAt: string;
  consent: boolean;
}

export interface Client {
  id: string;
  coupleName: string;
  contacts: Array<{ name: string; role: string; phone: string; email: string }>;
  preferences: string[];
  notes: string;
  rgpdConsent: boolean;
}

export interface Event {
  id: string;
  clientId: string;
  name: string;
  date: string;
  location: string;
  region: string;
  guests: number;
  style: string;
  totalBudget: number;
  phase: EventPhase;
  risks: string[];
  dietaryNeeds: string[];
  accommodationNeeds: string;
  paymentStatus: string;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  region: string;
  province?: string;
  city?: string;
  serviceArea?: string;
  phone: string;
  email: string;
  website: string;
  contactUrl?: string;
  sourceUrl?: string;
  instagramUrl?: string;
  googleMapsUrl?: string;
  capacity: number;
  styleTags: string[];
  languages?: string[];
  availabilityType?: VendorAvailabilityType;
  packages?: VendorPackage[];
  priceFrom?: number;
  priceRange?: string;
  priceConfidence?: VendorPriceConfidence;
  reliability: number;
  responseTimeHours: number;
  previousExperience: number;
  qualityScore: number;
  commissionFree: boolean;
  notes: string;
  reviewsSummary?: string;
  notesInternal?: string;
  status?: VendorStatus;
  lastCheckedAt?: string;
  lat?: number;
  lng?: number;
  googlePlaceId?: string;
  images?: string[];
}

export interface VendorPrice {
  id: string;
  vendorId: string;
  serviceName: string;
  season: "baja" | "media" | "alta";
  region: string;
  minPrice: number;
  maxPrice: number;
  conditions: string;
  historical: boolean;
}

export interface EventService {
  id: string;
  eventId: string;
  category: string;
  vendorId?: string;
  estimatedCost: number;
  margin: number;
  status: ServiceStatus;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  owner: string;
  dueDate: string;
  dependency?: string;
  status: TaskStatus;
}

export interface WorkspacePage {
  id: string;
  eventId: string;
  title: string;
  icon: string;
  description: string;
  order: number;
}

export interface WorkspaceBlock {
  id: string;
  pageId: string;
  eventId: string;
  type: WorkspaceBlockType;
  title: string;
  body?: string;
  owner?: string;
  dueDate?: string;
  reminderDate?: string;
  priority?: "alta" | "media" | "baja";
  status?: TaskStatus | WorkspacePaymentStatus | ServiceStatus;
  amount?: number;
  vendorId?: string;
  linkedServiceId?: string;
  createdAt: string;
}

export interface CalendarItem {
  id: string;
  eventId?: string;
  title: string;
  kind: CalendarKind;
  startsAt: string;
  endsAt: string;
  owner: string;
}

export interface NotificationRecord {
  id: string;
  eventId: string;
  sourceId: string;
  sourceType: NotificationSourceType;
  status: NotificationStatus;
  snoozedUntil?: string;
  dismissedAt?: string;
  updatedAt: string;
}

export interface DocumentRecord {
  id: string;
  eventId: string;
  type: "contrato" | "presupuesto" | "factura" | "brief" | "guion" | "email";
  title: string;
  status: "borrador" | "pendiente-firma" | "aprobado" | "archivado";
  updatedAt: string;
}

export interface Communication {
  id: string;
  eventId?: string;
  leadId?: string;
  channel: "email" | "nota-llamada" | "resumen-reunion";
  subject: string;
  body: string;
  summary: string;
  createdAt: string;
}

export interface ParejaProfile {
  id: string;
  eventId: string;
  nombre: string;
  rol: "novio" | "novia" | "otro";
  edad?: number;
  profesion?: string;
  gustos?: string;
  alergias?: string;
  talla?: string;
  foto?: string;
  contacto: {
    telefono: string;
    email: string;
  };
  notas?: string;
}

export interface Reunion {
  id: string;
  eventId: string;
  fecha: string;
  tipo: "presencial" | "online" | "llamada";
  asistentes: string[];
  notas: string;
  transcripcion?: string;
  acuerdos: string[];
  createdAt: string;
}

export interface ChecklistItemRecord {
  id: string;
  eventId: string;
  templateItemId?: string;
  titulo: string;
  descripcion?: string;
  categoria: string;
  completada: boolean;
  fechaLimite?: string;
  responsable?: string;
  prioridad: "alta" | "media" | "baja";
}

export interface EmailRecord {
  id: string;
  vendorId: string;
  eventId?: string;
  templateId: string;
  subject: string;
  body: string;
  sentAt?: string;
  status: "borrador" | "enviado";
}

export interface VendorMatch {
  vendor: Vendor;
  price?: VendorPrice;
  score: number;
  reasons: string[];
}

