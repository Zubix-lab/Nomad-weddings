"use client";

import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  FileText,
  Flower2,
  Gift,
  Mail,
  MapPin,
  Martini,
  Music,
  Palette,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Utensils,
  Users,
  WalletCards
} from "lucide-react";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import {
  calendarItems,
  clients,
  documents,
  eventServices,
  events,
  leads as seedLeads,
  tasks,
  vendorPrices,
  vendors
} from "@/lib/seed";
import type { Lead, VendorMatch } from "@/lib/types";

type AgentResult =
  | { type: "reply"; data: { subject: string; body: string; priority: string; nextAction: string; approvalRequired: boolean } }
  | { type: "vendors"; data: { matches: VendorMatch[] } }
  | { type: "budget"; data: { lines: Array<{ category: string; vendor: string; estimatedCost: number; basis: string; status: string }>; subtotal: number; planningFee: number; contingency: number; estimatedTotal: number; note: string } }
  | { type: "runbook"; data: { warnings: string[]; timeline: Array<{ time: string; moment: string; owner: string; checks: string[] }> } };

const tabs = [
  { id: "dashboard", label: "Panel", icon: ClipboardList },
  { id: "leads", label: "Leads", icon: Users },
  { id: "events", label: "Bodas", icon: CalendarDays },
  { id: "vendors", label: "Proveedores", icon: Search },
  { id: "experience", label: "Experiencia", icon: Palette },
  { id: "simulator", label: "Simulador", icon: WalletCards },
  { id: "agent", label: "Agente", icon: Sparkles },
  { id: "governance", label: "RGPD", icon: ShieldCheck }
] as const;

type SimulatorTier = "economico" | "equilibrado" | "premium";

type SimulatorOption = {
  id: string;
  category: string;
  title: string;
  description: string;
  unit: "fixed" | "guest";
  ranges: Record<SimulatorTier, number>;
  defaultTier: SimulatorTier;
  recommended?: boolean;
  trend?: string;
};

const simulatorImages: Record<string, string> = {
  venue: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=900&q=80",
  catering: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=900&q=80",
  "open-bar": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=900&q=80",
  ceremony: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80",
  floral: "https://images.unsplash.com/photo-1487070183336-b863922373d4?auto=format&fit=crop&w=900&q=80",
  lighting: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?auto=format&fit=crop&w=900&q=80",
  signage: "https://images.unsplash.com/photo-1529634597503-139d3726fed5?auto=format&fit=crop&w=900&q=80",
  photo: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  video: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=900&q=80",
  "content-creator": "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
  "photo-booth": "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=80",
  "audio-guestbook": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
  "live-painter": "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&w=900&q=80",
  "candy-bar": "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?auto=format&fit=crop&w=900&q=80",
  "late-night": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=900&q=80",
  dj: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
  "live-music": "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80",
  "party-props": "https://images.unsplash.com/photo-1496843916299-590492c751f4?auto=format&fit=crop&w=900&q=80",
  transport: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80",
  beauty: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=80",
  "planner-fee": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80"
};

type LocationProfile = {
  id: string;
  label: string;
  description: string;
  venueRanges: Record<SimulatorTier, number>;
  cateringRanges: Record<SimulatorTier, number>;
  hotelNight: number;
  flightPerGuest: number;
  transferFixed: number;
};

const locationProfiles: LocationProfile[] = [
  {
    id: "pais-vasco",
    label: "Pais Vasco",
    description: "Bodegas, fincas verdes, restaurantes con producto local y logistica terrestre sencilla.",
    venueRanges: { economico: 3200, equilibrado: 6200, premium: 10500 },
    cateringRanges: { economico: 95, equilibrado: 138, premium: 195 },
    hotelNight: 145,
    flightPerGuest: 0,
    transferFixed: 1400
  },
  {
    id: "canarias",
    label: "Canarias",
    description: "Boda destino, fincas abiertas, clima amable y mayor peso de viaje/alojamiento.",
    venueRanges: { economico: 3600, equilibrado: 5800, premium: 9800 },
    cateringRanges: { economico: 88, equilibrado: 128, premium: 178 },
    hotelNight: 120,
    flightPerGuest: 190,
    transferFixed: 1700
  },
  {
    id: "norte",
    label: "Norte / costa",
    description: "Espacios con encanto, alta demanda en temporada y plan B meteorologico importante.",
    venueRanges: { economico: 4000, equilibrado: 7200, premium: 12500 },
    cateringRanges: { economico: 105, equilibrado: 150, premium: 215 },
    hotelNight: 160,
    flightPerGuest: 80,
    transferFixed: 1600
  },
  {
    id: "destino",
    label: "Boda destino fuera",
    description: "Mayor produccion, viaje, bloque hotelero y coordinacion de invitados.",
    venueRanges: { economico: 6000, equilibrado: 12000, premium: 24000 },
    cateringRanges: { economico: 120, equilibrado: 190, premium: 290 },
    hotelNight: 210,
    flightPerGuest: 260,
    transferFixed: 2600
  }
];

const simulatorOptions: SimulatorOption[] = [
  {
    id: "venue",
    category: "Espacio y banquete",
    title: "Espacio / finca / restaurante",
    description: "Lugar con capacidad, exclusividad, plan B y coordinación básica del espacio.",
    unit: "fixed",
    ranges: { economico: 3500, equilibrado: 6500, premium: 11000 },
    defaultTier: "equilibrado",
    recommended: true
  },
  {
    id: "catering",
    category: "Espacio y banquete",
    title: "Menú y bebida por invitado",
    description: "Cóctel, menú, bodega, barra inicial, pruebas y adaptación de dietas.",
    unit: "guest",
    ranges: { economico: 95, equilibrado: 135, premium: 190 },
    defaultTier: "equilibrado",
    recommended: true
  },
  {
    id: "open-bar",
    category: "Espacio y banquete",
    title: "Barra libre",
    description: "Servicio por horas, primeras marcas, personal, hielo y reposición.",
    unit: "guest",
    ranges: { economico: 18, equilibrado: 30, premium: 48 },
    defaultTier: "equilibrado",
    recommended: true
  },
  {
    id: "ceremony",
    category: "Ceremonia y protocolo",
    title: "Ceremonia simbólica",
    description: "Guion, oficiante, sonido de ceremonia y coordinación de entradas.",
    unit: "fixed",
    ranges: { economico: 450, equilibrado: 850, premium: 1500 },
    defaultTier: "equilibrado"
  },
  {
    id: "floral",
    category: "Diseño y decoración",
    title: "Decoración floral integral",
    description: "Altar, centros, seating, rincones, prendidos y montaje/desmontaje.",
    unit: "fixed",
    ranges: { economico: 1800, equilibrado: 3500, premium: 7000 },
    defaultTier: "equilibrado",
    recommended: true
  },
  {
    id: "lighting",
    category: "Diseño y decoración",
    title: "Iluminación ambiental",
    description: "Guirnaldas, uplighting, iluminación de cena y pista para atmósfera inmersiva.",
    unit: "fixed",
    ranges: { economico: 900, equilibrado: 1900, premium: 4200 },
    defaultTier: "equilibrado",
    trend: "La iluminación escénica y los ambientes inmersivos siguen creciendo en 2026."
  },
  {
    id: "signage",
    category: "Diseño y decoración",
    title: "Papelería, señalética y seating",
    description: "Invitaciones, minutas, welcome sign, seating plan, números de mesa y vinilos.",
    unit: "fixed",
    ranges: { economico: 450, equilibrado: 950, premium: 2200 },
    defaultTier: "equilibrado"
  },
  {
    id: "photo",
    category: "Imagen y recuerdo",
    title: "Fotografía profesional",
    description: "Cobertura completa, edición, galería online, preboda opcional y álbum.",
    unit: "fixed",
    ranges: { economico: 1400, equilibrado: 2600, premium: 4800 },
    defaultTier: "equilibrado",
    recommended: true
  },
  {
    id: "video",
    category: "Imagen y recuerdo",
    title: "Vídeo de boda",
    description: "Trailer, película resumen, audio de votos y edición documental.",
    unit: "fixed",
    ranges: { economico: 1200, equilibrado: 2400, premium: 4500 },
    defaultTier: "equilibrado"
  },
  {
    id: "content-creator",
    category: "Imagen y recuerdo",
    title: "Wedding content creator",
    description: "Contenido vertical, clips rápidos, stories, backstage y entrega en 24/48h.",
    unit: "fixed",
    ranges: { economico: 500, equilibrado: 950, premium: 1800 },
    defaultTier: "equilibrado",
    trend: "Proveedor cada vez más pedido para contenido inmediato y natural."
  },
  {
    id: "photo-booth",
    category: "Experiencias invitado",
    title: "Photocall / photo booth editorial",
    description: "Cabina, fondo cuidado, atrezzo elegante, impresión y galería digital.",
    unit: "fixed",
    ranges: { economico: 450, equilibrado: 850, premium: 1800 },
    defaultTier: "equilibrado",
    trend: "Las activaciones fotográficas siguen fuertes, ahora con estética más editorial."
  },
  {
    id: "audio-guestbook",
    category: "Experiencias invitado",
    title: "Audio guestbook o video guestbook",
    description: "Teléfono vintage, cabina de mensajes, recopilación de audios o vídeo-recuerdos.",
    unit: "fixed",
    ranges: { economico: 250, equilibrado: 500, premium: 950 },
    defaultTier: "equilibrado",
    trend: "La tecnología nostálgica vuelve: mensajes de voz, vídeo y recuerdos analógicos."
  },
  {
    id: "live-painter",
    category: "Experiencias invitado",
    title: "Live painter / ilustrador en directo",
    description: "Pintura de escena, retratos rápidos de invitados o ilustraciones de recuerdo.",
    unit: "fixed",
    ranges: { economico: 850, equilibrado: 1800, premium: 4500 },
    defaultTier: "equilibrado",
    trend: "Experiencia premium y recuerdo físico de alto valor emocional."
  },
  {
    id: "candy-bar",
    category: "Experiencias invitado",
    title: "Candy bar / mesa dulce",
    description: "Chuches, repostería, galletas personalizadas, fruta, montaje y reposición.",
    unit: "guest",
    ranges: { economico: 5, equilibrado: 9, premium: 16 },
    defaultTier: "equilibrado"
  },
  {
    id: "late-night",
    category: "Experiencias invitado",
    title: "Recena / late-night snack",
    description: "Mini burgers, pizzas, churros, bocatas, tacos o snack caliente durante la fiesta.",
    unit: "guest",
    ranges: { economico: 7, equilibrado: 13, premium: 24 },
    defaultTier: "equilibrado"
  },
  {
    id: "dj",
    category: "Música y fiesta",
    title: "DJ + sonido de fiesta",
    description: "DJ, equipo, montaje, microfonía, coordinación de momentos y hasta 5-6 horas.",
    unit: "fixed",
    ranges: { economico: 900, equilibrado: 1700, premium: 3500 },
    defaultTier: "equilibrado",
    recommended: true
  },
  {
    id: "live-music",
    category: "Música y fiesta",
    title: "Música en directo",
    description: "Grupo, saxofonista, cuerda, gospel, cóctel acústico o banda de fiesta.",
    unit: "fixed",
    ranges: { economico: 650, equilibrado: 1600, premium: 5000 },
    defaultTier: "equilibrado"
  },
  {
    id: "party-props",
    category: "Música y fiesta",
    title: "Atrezzo y juguetes de fiesta",
    description: "Gafas, pulseras LED, sombreros, confeti, bengalas frías y kits de pista.",
    unit: "guest",
    ranges: { economico: 3, equilibrado: 7, premium: 14 },
    defaultTier: "equilibrado"
  },
  {
    id: "transport",
    category: "Logística",
    title: "Transporte invitados",
    description: "Autobuses, lanzaderas nocturnas, rutas hotel-finca y coordinación de salidas.",
    unit: "fixed",
    ranges: { economico: 700, equilibrado: 1500, premium: 3200 },
    defaultTier: "equilibrado"
  },
  {
    id: "beauty",
    category: "Equipo personal",
    title: "Peluquería y maquillaje",
    description: "Novia, prueba, retoques, familiares y desplazamiento.",
    unit: "fixed",
    ranges: { economico: 450, equilibrado: 950, premium: 2200 },
    defaultTier: "equilibrado"
  },
  {
    id: "planner-fee",
    category: "Coordinación Nomad",
    title: "Wedding planner / coordinación",
    description: "Diseño, proveedores, calendario, control presupuestario y coordinación del día B.",
    unit: "fixed",
    ranges: { economico: 1800, equilibrado: 3500, premium: 6500 },
    defaultTier: "equilibrado",
    recommended: true
  }
];

type TabId = (typeof tabs)[number]["id"];

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [activeEventId, setActiveEventId] = useState(events[0].id);
  const [activeLeadId, setActiveLeadId] = useState(seedLeads[0].id);
  const [matchCategory, setMatchCategory] = useState("localizacion");
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const [isWorking, setIsWorking] = useState(false);

  const activeEvent = events.find((event) => event.id === activeEventId) ?? events[0];
  const activeEventTasks = tasks.filter((task) => task.eventId === activeEvent.id);
  const activeEventServices = eventServices.filter((service) => service.eventId === activeEvent.id);
  const activeDocuments = documents.filter((document) => document.eventId === activeEvent.id);
  const openTasks = tasks.filter((task) => task.status !== "hecha");
  const missingServices = eventServices.filter((service) => !service.vendorId);
  const totalVendorSpend = eventServices.reduce((sum, service) => sum + service.estimatedCost, 0);

  const upcomingCalendar = useMemo(
    () => [...calendarItems].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()).slice(0, 6),
    []
  );

  async function createLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      source: "web",
      coupleName: String(form.get("coupleName")),
      phone: String(form.get("phone")),
      email: String(form.get("email")),
      eventDate: String(form.get("eventDate")),
      location: String(form.get("location")),
      budget: Number(form.get("budget")),
      guests: Number(form.get("guests")),
      requestedService: String(form.get("requestedService")),
      consent: Boolean(form.get("consent"))
    };

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const json = await response.json();
    if (response.ok) {
      setLeads((current) => [json.lead, ...current]);
      setActiveLeadId(json.lead.id);
      event.currentTarget.reset();
    }
  }

  async function runAgent(action: "reply" | "vendors" | "budget" | "runbook") {
    setIsWorking(true);
    const endpoint =
      action === "reply"
        ? "/api/agent/draft-reply"
        : action === "vendors"
        ? "/api/agent/vendor-match"
        : action === "budget"
        ? "/api/agent/budget-draft"
        : "/api/agent/runbook";
    const body =
      action === "reply"
        ? { leadId: activeLeadId }
        : action === "vendors"
        ? { eventId: activeEventId, category: matchCategory }
        : { eventId: activeEventId };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    setAgentResult({ type: action, data } as AgentResult);
    setIsWorking(false);
    setActiveTab("agent");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">NW</div>
          <div>
            <p className="eyebrow">Nomad Weddings</p>
            <h1>Ops Agent</h1>
          </div>
        </div>
        <nav className="nav-list" aria-label="Secciones">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} className={activeTab === tab.id ? "nav-item active" : "nav-item"} onClick={() => setActiveTab(tab.id)} title={tab.label}>
                <Icon size={18} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <p className="eyebrow">Modo agente</p>
          <strong>Borradores con aprobacion</strong>
          <span>Emails, presupuestos y runbooks quedan pendientes de revision humana.</span>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">Operacion interna</p>
            <h2>{tabTitle(activeTab)}</h2>
          </div>
          <div className="topbar-actions">
            <select value={activeEventId} onChange={(event) => setActiveEventId(event.target.value)} aria-label="Evento activo">
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
            <button className="icon-button" title="Exportar briefing" onClick={() => window.print()}>
              <Download size={18} />
            </button>
          </div>
        </header>

        {activeTab === "dashboard" && (
          <div className="screen-grid">
            <Metric label="Leads abiertos" value={leads.filter((lead) => !["won", "lost"].includes(lead.status)).length} detail="Pipeline web, email y manual" icon={<Users size={18} />} />
            <Metric label="Bodas activas" value={events.length} detail={`${openTasks.length} tareas abiertas`} icon={<CalendarDays size={18} />} />
            <Metric label="Servicios sin proveedor" value={missingServices.length} detail="Necesitan shortlist" icon={<AlertTriangle size={18} />} />
            <Metric label="Coste proveedor estimado" value={currency(totalVendorSpend)} detail="Historico + estimacion" icon={<WalletCards size={18} />} />

            <section className="panel wide">
              <PanelHeader title="Agenda y deadlines" action={<CalendarDays size={18} />} />
              <div className="timeline-list">
                {upcomingCalendar.map((item) => (
                  <div key={item.id} className="timeline-row">
                    <span className={`status-dot ${item.kind}`} />
                    <div>
                      <strong>{item.title}</strong>
                      <p>{dateTime(item.startsAt)} · {item.owner}</p>
                    </div>
                    <span className="pill">{item.kind}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel">
              <PanelHeader title="Alertas operativas" action={<AlertTriangle size={18} />} />
              <div className="alert-list">
                {missingServices.map((service) => (
                  <p key={service.id}>Asignar proveedor para {service.category} en {events.find((event) => event.id === service.eventId)?.name}.</p>
                ))}
                {tasks.filter((task) => task.status === "bloqueada").map((task) => (
                  <p key={task.id}>Bloqueada: {task.title}.</p>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "leads" && (
          <div className="split-layout">
            <section className="panel">
              <PanelHeader title="Nuevo lead" action={<Plus size={18} />} />
              <form className="lead-form" onSubmit={createLead}>
                <input name="coupleName" placeholder="Pareja" required />
                <input name="phone" placeholder="Telefono" required />
                <input name="email" placeholder="Email" type="email" required />
                <input name="eventDate" type="date" required />
                <input name="location" placeholder="Ubicacion" required />
                <input name="budget" placeholder="Presupuesto" type="number" required />
                <input name="guests" placeholder="Invitados" type="number" required />
                <select name="requestedService" defaultValue="Organizacion integral">
                  <option>Organizacion integral</option>
                  <option>Coordinacion del dia B</option>
                  <option>Busqueda de finca y proveedores</option>
                  <option>Ceremonia simbolica</option>
                </select>
                <label className="check-row">
                  <input name="consent" type="checkbox" required />
                  Consentimiento RGPD registrado
                </label>
                <button className="primary-button" type="submit">
                  <Plus size={18} />
                  Crear lead
                </button>
              </form>
            </section>

            <section className="panel wide">
              <PanelHeader title="Pipeline comercial" action={<Mail size={18} />} />
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Pareja</th>
                      <th>Fecha</th>
                      <th>Zona</th>
                      <th>Presupuesto</th>
                      <th>Estado</th>
                      <th>Prioridad</th>
                      <th>Accion</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.coupleName}</td>
                        <td>{shortDate(lead.eventDate)}</td>
                        <td>{lead.location}</td>
                        <td>{currency(lead.budget)}</td>
                        <td><span className="pill">{lead.status}</span></td>
                        <td><span className={`priority ${lead.priority}`}>{lead.priority}</span></td>
                        <td>
                          <button className="mini-button" onClick={() => { setActiveLeadId(lead.id); runAgent("reply"); }} title="Redactar respuesta">
                            <Mail size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}

        {activeTab === "events" && (
          <div className="screen-grid">
            <section className="panel wide">
              <PanelHeader title={activeEvent.name} action={<CalendarDays size={18} />} />
              <div className="event-brief">
                <div>
                  <p className="eyebrow">Ficha completa</p>
                  <h3>{activeEvent.location}</h3>
                  <p>{activeEvent.style}</p>
                </div>
                <dl>
                  <div><dt>Fecha</dt><dd>{shortDate(activeEvent.date)}</dd></div>
                  <div><dt>Invitados</dt><dd>{activeEvent.guests}</dd></div>
                  <div><dt>Presupuesto</dt><dd>{currency(activeEvent.totalBudget)}</dd></div>
                  <div><dt>Fase</dt><dd>{activeEvent.phase}</dd></div>
                </dl>
              </div>
            </section>

            <section className="panel">
              <PanelHeader title="Riesgos" action={<AlertTriangle size={18} />} />
              <div className="tag-cloud">
                {activeEvent.risks.map((risk) => <span key={risk}>{risk}</span>)}
              </div>
            </section>

            <section className="panel wide">
              <PanelHeader title="Servicios del evento" action={<WalletCards size={18} />} />
              <div className="service-grid">
                {activeEventServices.map((service) => {
                  const vendor = service.vendorId ? vendors.find((item) => item.id === service.vendorId) : undefined;
                  return (
                    <div key={service.id} className="service-row">
                      <div>
                        <strong>{service.category}</strong>
                        <p>{vendor?.name ?? "Proveedor pendiente"}</p>
                      </div>
                      <span>{currency(service.estimatedCost)}</span>
                      <span className="pill">{service.status}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="panel">
              <PanelHeader title="Tareas y documentos" action={<FileText size={18} />} />
              <div className="compact-list">
                {activeEventTasks.map((task) => (
                  <p key={task.id}><strong>{task.owner}</strong> · {task.title} · {shortDate(task.dueDate)}</p>
                ))}
                {activeDocuments.map((document) => (
                  <p key={document.id}><strong>{document.type}</strong> · {document.title} · {document.status}</p>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "vendors" && (
          <section className="panel full">
            <PanelHeader title="Base de proveedores y precios" action={<Search size={18} />} />
            <div className="vendor-toolbar">
              <select value={matchCategory} onChange={(event) => setMatchCategory(event.target.value)} aria-label="Categoria proveedor">
                {[...new Set(vendors.map((vendor) => vendor.category))].map((category) => <option key={category}>{category}</option>)}
              </select>
              <button className="primary-button" onClick={() => runAgent("vendors")}>
                <Sparkles size={18} />
                Recomendar para {activeEvent.name}
              </button>
            </div>
            <div className="vendor-grid">
              {vendors.map((vendor) => {
                const price = vendorPrices.find((item) => item.vendorId === vendor.id);
                return (
                  <article key={vendor.id} className="vendor-card">
                    <div>
                      <p className="eyebrow">{vendor.category} · {vendor.region}</p>
                      <h3>{vendor.name}</h3>
                      <p>{vendor.notes}</p>
                    </div>
                    <div className="vendor-stats">
                      <span>Cap. {vendor.capacity}</span>
                      <span>Cal. {vendor.qualityScore}/10</span>
                      <span>{price ? `${currency(price.minPrice)}-${currency(price.maxPrice)}` : "Sin precio"}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {activeTab === "experience" && (
          <ExperienceConfigurator activeEventId={activeEventId} onVendorMatch={() => runAgent("vendors")} />
        )}

        {activeTab === "simulator" && (
          <BudgetSimulator />
        )}

        {activeTab === "agent" && (
          <div className="split-layout">
            <section className="panel">
              <PanelHeader title="Acciones del agente" action={<Sparkles size={18} />} />
              <div className="agent-controls">
                <label>
                  Lead
                  <select value={activeLeadId} onChange={(event) => setActiveLeadId(event.target.value)}>
                    {leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.coupleName}</option>)}
                  </select>
                </label>
                <label>
                  Evento
                  <select value={activeEventId} onChange={(event) => setActiveEventId(event.target.value)}>
                    {events.map((event) => <option key={event.id} value={event.id}>{event.name}</option>)}
                  </select>
                </label>
                <label>
                  Categoria
                  <select value={matchCategory} onChange={(event) => setMatchCategory(event.target.value)}>
                    {[...new Set(vendors.map((vendor) => vendor.category))].map((category) => <option key={category}>{category}</option>)}
                  </select>
                </label>
                <button className="primary-button" disabled={isWorking} onClick={() => runAgent("reply")}>
                  <Mail size={18} />
                  Borrador email
                </button>
                <button className="secondary-button" disabled={isWorking} onClick={() => runAgent("vendors")}>
                  <Search size={18} />
                  Ranking proveedores
                </button>
                <button className="secondary-button" disabled={isWorking} onClick={() => runAgent("budget")}>
                  <WalletCards size={18} />
                  Presupuesto
                </button>
                <button className="secondary-button" disabled={isWorking} onClick={() => runAgent("runbook")}>
                  <ClipboardList size={18} />
                  Runbook dia B
                </button>
              </div>
            </section>

            <section className="panel wide">
              <PanelHeader title="Salida pendiente de aprobacion" action={<CheckCircle2 size={18} />} />
              <AgentOutput result={agentResult} />
            </section>
          </div>
        )}

        {activeTab === "governance" && (
          <div className="screen-grid">
            <section className="panel wide">
              <PanelHeader title="Permisos y datos sensibles" action={<ShieldCheck size={18} />} />
              <div className="permission-grid">
                <Permission role="Admin" access="Acceso completo a clientes, eventos, proveedores, documentos, pagos y auditoria." />
                <Permission role="Colaborador" access="Solo bodas y tareas asignadas; sin exportacion masiva ni datos financieros completos." />
                <Permission role="Solo lectura" access="Consulta controlada de proveedores, calendario y documentos aprobados." />
              </div>
            </section>
            <section className="panel">
              <PanelHeader title="Controles RGPD" action={<ShieldCheck size={18} />} />
              <div className="compact-list">
                <p>Consentimiento explicito en leads y clientes.</p>
                <p>Exportacion y eliminacion de datos por pareja.</p>
                <p>Auditoria de cambios en presupuesto, proveedor y documentos.</p>
                <p>Segmentacion sin atributos protegidos ni criterios sensibles.</p>
              </div>
            </section>
            <section className="panel wide">
              <PanelHeader title="Clientes registrados" action={<Users size={18} />} />
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr><th>Pareja</th><th>Preferencias</th><th>Consentimiento</th><th>Notas</th></tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id}>
                        <td>{client.coupleName}</td>
                        <td>{client.preferences.join(", ")}</td>
                        <td>{client.rgpdConsent ? "Registrado" : "Pendiente"}</td>
                        <td>{client.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: ReactNode }) {
  return (
    <section className="metric">
      <div className="metric-icon">{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </section>
  );
}

function PanelHeader({ title, action }: { title: string; action: ReactNode }) {
  return (
    <div className="panel-header">
      <h3>{title}</h3>
      <div className="panel-action">{action}</div>
    </div>
  );
}

function AgentOutput({ result }: { result: AgentResult | null }) {
  if (!result) {
    return <div className="empty-state">Selecciona una accion para generar un borrador operativo.</div>;
  }

  if (result.type === "reply") {
    return (
      <div className="agent-output">
        <span className="priority alta">requiere aprobacion</span>
        <h3>{result.data.subject}</h3>
        <pre>{result.data.body}</pre>
        <p><strong>Siguiente accion:</strong> {result.data.nextAction}</p>
      </div>
    );
  }

  if (result.type === "vendors") {
    return (
      <div className="match-list">
        {result.data.matches.map((match) => (
          <div key={match.vendor.id} className="match-row">
            <strong>{match.vendor.name}</strong>
            <span>{match.score} pts</span>
            <p>{match.reasons.join(" ")}</p>
          </div>
        ))}
      </div>
    );
  }

  if (result.type === "budget") {
    return (
      <div className="budget-output">
        {result.data.lines.map((line) => (
          <div key={`${line.category}-${line.vendor}`} className="service-row">
            <div><strong>{line.category}</strong><p>{line.vendor} · {line.basis}</p></div>
            <span>{currency(line.estimatedCost)}</span>
            <span className="pill">{line.status}</span>
          </div>
        ))}
        <div className="budget-total">
          <span>Total estimado</span>
          <strong>{currency(result.data.estimatedTotal)}</strong>
        </div>
        <p>{result.data.note}</p>
      </div>
    );
  }

  return (
    <div className="runbook-output">
      {result.data.warnings.map((warning) => <p key={warning} className="warning-line">{warning}</p>)}
      {result.data.timeline.map((item) => (
        <div key={`${item.time}-${item.moment}`} className="timeline-row">
          <span className="time-badge">{item.time}</span>
          <div>
            <strong>{item.moment}</strong>
            <p>{item.owner} · {item.checks.join(", ")}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Permission({ role, access }: { role: string; access: string }) {
  return (
    <div className="permission">
      <strong>{role}</strong>
      <p>{access}</p>
    </div>
  );
}

function ExperienceConfigurator({ activeEventId, onVendorMatch }: { activeEventId: string; onVendorMatch: () => void }) {
  const event = events.find((item) => item.id === activeEventId) ?? events[0];
  const venues = vendors.filter((vendor) => vendor.category === "localizacion");
  const caterers = vendors.filter((vendor) => vendor.category === "restauracion");
  const decor = vendors.filter((vendor) => vendor.category === "decoracion");

  return (
    <div className="experience-layout">
      <section className="experience-main">
        <div className="stepper" aria-label="Configurador de experiencia">
          <span className="step active">1</span>
          <span className="step-line active" />
          <span className="step">2</span>
          <span className="step-line" />
          <span className="step">3</span>
        </div>
        <div className="editorial-header">
          <p className="eyebrow">Configurador interno</p>
          <h3>Construir una experiencia coherente para {event.name}</h3>
          <p>Combina localizacion, restauracion y ambientacion usando precios historicos y datos operativos antes de preparar la propuesta final.</p>
        </div>

        <div className="experience-grid">
          {venues.map((vendor, index) => <ExperienceCard key={vendor.id} vendorId={vendor.id} tone={index === 0 ? "navy" : "apricot"} icon={<MapPin size={18} />} />)}
          {caterers.map((vendor) => <ExperienceCard key={vendor.id} vendorId={vendor.id} tone="white" icon={<Utensils size={18} />} />)}
          {decor.map((vendor) => <ExperienceCard key={vendor.id} vendorId={vendor.id} tone="slate" icon={<Palette size={18} />} />)}
        </div>
      </section>

      <aside className="experience-summary">
        <p className="eyebrow">Propuesta viva</p>
        <h3>{event.location}</h3>
        <div className="summary-stat"><span>Invitados</span><strong>{event.guests}</strong></div>
        <div className="summary-stat"><span>Presupuesto</span><strong>{currency(event.totalBudget)}</strong></div>
        <div className="summary-stat"><span>Estilo</span><strong>{event.style}</strong></div>
        <button className="primary-button" onClick={onVendorMatch}>
          <Sparkles size={18} />
          Pedir ranking al agente
        </button>
        <p className="summary-note">El configurador no sustituye la revision humana: sirve para preparar una propuesta visual, presupuestaria y logistica en una sola vista.</p>
      </aside>
    </div>
  );
}

function ExperienceCard({ vendorId, tone, icon }: { vendorId: string; tone: "navy" | "apricot" | "white" | "slate"; icon: ReactNode }) {
  const vendor = vendors.find((item) => item.id === vendorId)!;
  const price = vendorPrices.find((item) => item.vendorId === vendor.id);

  return (
    <article className="experience-card">
      <div className={`experience-visual ${tone}`}>
        <div>{icon}</div>
        <span>{vendor.region}</span>
      </div>
      <div className="experience-copy">
        <div>
          <p className="eyebrow">{vendor.category}</p>
          <h4>{vendor.name}</h4>
          <p>{vendor.notes}</p>
        </div>
        <div className="experience-meta">
          <span>Cap. {vendor.capacity}</span>
          <span>{price ? `${currency(price.minPrice)}-${currency(price.maxPrice)}` : "Sin precio"}</span>
        </div>
      </div>
    </article>
  );
}

function BudgetSimulator() {
  const [guestInput, setGuestInput] = useState("");
  const [locationId, setLocationId] = useState("");
  const [guestOrigin, setGuestOrigin] = useState<"local" | "mixed" | "destination">("mixed");
  const [needsHotel, setNeedsHotel] = useState(false);
  const [hotelNights, setHotelNights] = useState(2);
  const [needsFlights, setNeedsFlights] = useState(false);
  const [flyingGuestsPercent, setFlyingGuestsPercent] = useState(35);
  const [needsTransfers, setNeedsTransfers] = useState(true);
  const [coupleContribution, setCoupleContribution] = useState(0);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [priceOverrides, setPriceOverrides] = useState<Record<string, number>>({});
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    () => new Set(simulatorOptions.filter((option) => option.recommended).map((option) => option.id))
  );
  const [tiers, setTiers] = useState<Record<string, SimulatorTier>>(
    () => Object.fromEntries(simulatorOptions.map((option) => [option.id, option.defaultTier])) as Record<string, SimulatorTier>
  );

  const guestCount = Number(guestInput) || 0;
  const locationProfile = locationProfiles.find((location) => location.id === locationId);
  const activeLocation = locationProfile ?? locationProfiles[0];
  const estimateReady = guestCount > 0 && Boolean(locationProfile);
  const selectedOptions = simulatorOptions.filter((option) => selectedIds.has(option.id));
  const total = estimateReady ? selectedOptions.reduce((sum, option) => sum + simulatorOptionConfiguredTotal(option, priceOverrides[option.id], tiers[option.id], guestCount, activeLocation), 0) : 0;
  const travelTotal = estimateReady ? travelEstimate(guestCount, activeLocation, guestOrigin, needsHotel, hotelNights, needsFlights, flyingGuestsPercent, needsTransfers) : 0;
  const grandTotal = total + travelTotal;
  const perGuest = guestCount > 0 ? total / guestCount : 0;
  const guestGiftTarget = guestCount > 0 ? Math.max(0, (grandTotal - coupleContribution) / guestCount) : 0;
  const lowEstimate = estimateReady ? selectedOptions.reduce((sum, option) => sum + contextualSimulatorOptionCost(option, "economico", guestCount, activeLocation), 0) + travelEstimate(guestCount, activeLocation, guestOrigin, needsHotel, hotelNights, needsFlights, flyingGuestsPercent, needsTransfers, "economico") : 0;
  const highEstimate = estimateReady ? selectedOptions.reduce((sum, option) => sum + contextualSimulatorOptionCost(option, "premium", guestCount, activeLocation), 0) + travelEstimate(guestCount, activeLocation, guestOrigin, needsHotel, hotelNights, needsFlights, flyingGuestsPercent, needsTransfers, "premium") : 0;
  const categories = [...new Set(simulatorOptions.map((option) => option.category))];
  const activeCategory = categories[Math.min(activeBlockIndex, categories.length - 1)];
  const activeCategoryOptions = simulatorOptions.filter((option) => option.category === activeCategory);
  const contributionMax = Math.max(10000, Math.ceil(grandTotal / 1000) * 1000);

  function toggleOption(optionId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(optionId)) {
        next.delete(optionId);
      } else {
        next.add(optionId);
      }
      return next;
    });
  }

  function setTier(optionId: string, tier: SimulatorTier) {
    setTiers((current) => ({ ...current, [optionId]: tier }));
  }

  function setOptionPrice(optionId: string, value: number) {
    setPriceOverrides((current) => ({ ...current, [optionId]: value }));
  }

  function applyPreset(preset: "esencial" | "equilibrado" | "experiencia") {
    const presetIds =
      preset === "esencial"
        ? ["venue", "catering", "open-bar", "photo", "dj", "planner-fee"]
        : preset === "equilibrado"
        ? ["venue", "catering", "open-bar", "ceremony", "floral", "lighting", "signage", "photo", "video", "photo-booth", "dj", "transport", "beauty", "planner-fee"]
        : simulatorOptions.map((option) => option.id);
    setSelectedIds(new Set(presetIds));
    setTiers(
      Object.fromEntries(
        simulatorOptions.map((option) => [option.id, preset === "esencial" ? "economico" : preset === "experiencia" ? "premium" : option.defaultTier])
      ) as Record<string, SimulatorTier>
    );
  }

  return (
    <div className={estimateReady ? "simulator-shell ready" : "simulator-shell"}>
      <section className="simulator-intro">
        <div>
          <p className="eyebrow">Modo test Nomad</p>
          <h3>Primero entendemos la boda. Despues hablamos de numeros.</h3>
          <p>
            Empezamos por lo que importa: cuantos sois, donde lo celebrais y que logistica necesitan vuestros invitados.
            Despues abrimos el baremo con calma.
          </p>
        </div>
        <div className="simulator-test-card">
          <label>
            Numero aproximado de invitados
            <input value={guestInput} min={20} max={400} placeholder="Ej. 150" type="number" onChange={(event) => setGuestInput(event.target.value)} />
          </label>
          <label>
            Lugar de la boda
            <select value={locationId} onChange={(event) => setLocationId(event.target.value)}>
              <option value="">Elegir destino</option>
              {locationProfiles.map((location) => <option key={location.id} value={location.id}>{location.label}</option>)}
            </select>
          </label>
          <div className="question-group">
            <span>De donde vienen los invitados</span>
            <div className="choice-grid">
              <button className={guestOrigin === "local" ? "choice active" : "choice"} onClick={() => setGuestOrigin("local")} type="button">Mayoria local</button>
              <button className={guestOrigin === "mixed" ? "choice active" : "choice"} onClick={() => setGuestOrigin("mixed")} type="button">Mezcla</button>
              <button className={guestOrigin === "destination" ? "choice active" : "choice"} onClick={() => setGuestOrigin("destination")} type="button">Boda destino</button>
            </div>
          </div>
          <div className="travel-grid">
            <label className="check-row"><input checked={needsHotel} type="checkbox" onChange={(event) => setNeedsHotel(event.target.checked)} /> Hoteles o bloque de habitaciones</label>
            <label className="check-row"><input checked={needsFlights} type="checkbox" onChange={(event) => setNeedsFlights(event.target.checked)} /> Aviones / invitados de fuera</label>
            <label className="check-row"><input checked={needsTransfers} type="checkbox" onChange={(event) => setNeedsTransfers(event.target.checked)} /> Transporte y lanzaderas</label>
          </div>
          {needsHotel && (
            <label>
              Noches de hotel estimadas
              <input value={hotelNights} min={1} max={5} type="number" onChange={(event) => setHotelNights(Number(event.target.value) || 1)} />
            </label>
          )}
          {needsFlights && (
            <label>
              Invitados que vuelan: {flyingGuestsPercent}%
              <input value={flyingGuestsPercent} min={5} max={100} type="range" onChange={(event) => setFlyingGuestsPercent(Number(event.target.value))} />
            </label>
          )}
        </div>
      </section>

      {!estimateReady && (
        <section className="quiet-state">
          <p className="eyebrow">Todavia sin presupuesto</p>
          <h3>Introduce invitados y destino para abrir el baremo.</h3>
          <p>Asi evitamos enseñar una cifra demasiado pronto y mantenemos la conversacion natural.</p>
        </section>
      )}

      {estimateReady && (
        <>
      <section className="preset-row" aria-label="Escenarios rapidos">
        <button className="secondary-button" onClick={() => applyPreset("esencial")}>Base cuidada</button>
        <button className="primary-button" onClick={() => applyPreset("equilibrado")}>Equilibrio Nomad</button>
        <button className="secondary-button" onClick={() => applyPreset("experiencia")}>Experiencia completa</button>
      </section>

      <section className="location-band">
        <div>
          <p className="eyebrow">Baremo del destino</p>
          <h3>{activeLocation.label}</h3>
          <p>{activeLocation.description}</p>
        </div>
        <div className="location-range">
          <span>Espacio</span>
          <strong>{currency(activeLocation.venueRanges.economico)} - {currency(activeLocation.venueRanges.premium)}</strong>
          <span>Menu por invitado</span>
          <strong>{currency(activeLocation.cateringRanges.economico)} - {currency(activeLocation.cateringRanges.premium)}</strong>
        </div>
      </section>

      <div className="simulator-layout">
        <section className="simulator-catalog flow-catalog">
          <nav className="block-stepper" aria-label="Bloques del simulador">
            {categories.map((category, index) => (
              <button
                key={category}
                className={activeBlockIndex === index ? "block-step active" : "block-step"}
                onClick={() => setActiveBlockIndex(index)}
                type="button"
              >
                <span>{index + 1}</span>
                {category}
              </button>
            ))}
          </nav>
          <div className="simulator-category">
            <div className="simulator-category-header">
              <div className="panel-action">{(() => {
                const Icon = simulatorCategoryIcon(activeCategory);
                return <Icon size={18} />;
              })()}</div>
              <div>
                <p className="eyebrow">Bloque {activeBlockIndex + 1} de {categories.length}</p>
                <h3>{activeCategory}</h3>
              </div>
            </div>
            <div className="simulator-option-grid">
              {activeCategoryOptions.map((option) => {
                const selected = selectedIds.has(option.id);
                const minValue = simulatorOptionUnitValue(option, "economico", activeLocation);
                const maxValue = simulatorOptionUnitValue(option, "premium", activeLocation);
                const defaultValue = simulatorOptionUnitValue(option, tiers[option.id], activeLocation);
                const configuredValue = priceOverrides[option.id] ?? defaultValue;
                const cost = simulatorOptionTotalFromValue(option, configuredValue, guestCount);
                return (
                  <article key={option.id} className={selected ? "simulator-option selected" : "simulator-option"}>
                    <img className="option-image" src={simulatorImages[option.id]} alt="" />
                    <div className="simulator-option-body">
                      <div className="simulator-option-top">
                        <label className="toggle-card">
                          <input checked={selected} type="checkbox" onChange={() => toggleOption(option.id)} />
                          <span>{selected ? "Incluido" : "Añadir modulo"}</span>
                        </label>
                        {option.trend && <span className="trend-chip">Tendencia</span>}
                      </div>
                      <h4>{option.title}</h4>
                      <p>{option.description}</p>
                      {option.trend && <p className="trend-note">{option.trend}</p>}
                      <div className="price-designer">
                        <div className="range-row">
                          <span>{currency(minValue)}{option.unit === "guest" ? " / invitado" : ""}</span>
                          <span>{currency(maxValue)}{option.unit === "guest" ? " / invitado" : ""}</span>
                        </div>
                        <input
                          aria-label={`Precio para ${option.title}`}
                          disabled={!selected}
                          max={maxValue}
                          min={minValue}
                          step={option.unit === "guest" ? 1 : 50}
                          type="range"
                          value={configuredValue}
                          onChange={(event) => setOptionPrice(option.id, Number(event.target.value))}
                        />
                        <label className="manual-price">
                          {option.unit === "guest" ? "Precio por invitado" : "Precio del modulo"}
                          <input
                            disabled={!selected}
                            max={maxValue}
                            min={minValue}
                            step={option.unit === "guest" ? 1 : 50}
                            type="number"
                            value={configuredValue}
                            onChange={(event) => setOptionPrice(option.id, Number(event.target.value) || minValue)}
                          />
                        </label>
                      </div>
                      <div className="option-price-row">
                        <span>{option.unit === "guest" ? "total segun invitados" : "total modulo"}</span>
                        <strong>{selected ? currency(cost) : "No incluido"}</strong>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="block-actions">
              <button className="secondary-button" disabled={activeBlockIndex === 0} onClick={() => setActiveBlockIndex((current) => Math.max(0, current - 1))} type="button">Anterior</button>
              <button className="primary-button" disabled={activeBlockIndex === categories.length - 1} onClick={() => setActiveBlockIndex((current) => Math.min(categories.length - 1, current + 1))} type="button">Siguiente bloque</button>
            </div>
          </div>
        </section>

        <section className="simulator-catalog legacy-catalog">
          {categories.map((category) => {
            const Icon = simulatorCategoryIcon(category);
            return (
              <div key={category} className="simulator-category">
                <div className="simulator-category-header">
                  <div className="panel-action"><Icon size={18} /></div>
                  <div>
                    <p className="eyebrow">Bloque de presupuesto</p>
                    <h3>{category}</h3>
                  </div>
                </div>
                <div className="simulator-option-grid">
                  {simulatorOptions.filter((option) => option.category === category).map((option) => {
                    const selected = selectedIds.has(option.id);
                    const tier = tiers[option.id];
                    const cost = contextualSimulatorOptionCost(option, tier, guestCount, activeLocation);
                    return (
                      <article key={option.id} className={selected ? "simulator-option selected" : "simulator-option"}>
                        <div className="simulator-option-top">
                          <label className="toggle-card">
                            <input checked={selected} type="checkbox" onChange={() => toggleOption(option.id)} />
                            <span>{selected ? "Incluido" : "Añadir"}</span>
                          </label>
                          {option.trend && <span className="trend-chip">Tendencia</span>}
                        </div>
                        <h4>{option.title}</h4>
                        <p>{option.description}</p>
                        {option.trend && <p className="trend-note">{option.trend}</p>}
                        <div className="tier-control" role="group" aria-label={`Nivel para ${option.title}`}>
                          {(["economico", "equilibrado", "premium"] as SimulatorTier[]).map((tierOption) => (
                            <button
                              key={tierOption}
                              className={tier === tierOption ? "tier-button active" : "tier-button"}
                              onClick={() => setTier(option.id, tierOption)}
                              type="button"
                            >
                              {tierLabel(tierOption)}
                            </button>
                          ))}
                        </div>
                        <div className="option-price-row">
                          <span>{option.unit === "guest" ? "por invitado" : "precio bloque"}</span>
                          <strong>{currency(cost)}</strong>
                        </div>
                        <div className="range-row">
                          <span>{currency(contextualSimulatorOptionCost(option, "economico", guestCount, activeLocation))}</span>
                          <span>{currency(contextualSimulatorOptionCost(option, "premium", guestCount, activeLocation))}</span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </section>

        <aside className="simulator-summary">
          <p className="eyebrow">Resumen para enseñar</p>
          <h3>{guestCount} invitados en {activeLocation.label}</h3>
          <div className="summary-stat"><span>Boda seleccionada</span><strong>{currency(total)}</strong></div>
          <div className="summary-stat"><span>Viaje / hoteles / traslados</span><strong>{currency(travelTotal)}</strong></div>
          <div className="summary-stat"><span>Precio de cubierto</span><strong>{currency(perGuest)}</strong></div>
          <div className="summary-stat"><span>Baremo actual</span><strong>{currency(lowEstimate)} - {currency(highEstimate)}</strong></div>
          <p className="summary-note">
            Úsalo como conversación, no como presupuesto cerrado. Los importes se reemplazarán por tarifas reales de proveedores.
          </p>
        </aside>
      </div>

      <div className="simulator-bottom-bar">
        <div>
          <span>Total estimado</span>
          <strong>{currency(grandTotal)}</strong>
        </div>
        <div>
          <span>Precio cubierto</span>
          <strong>{currency(perGuest)}</strong>
        </div>
        <div className="contribution-control">
          <span>Aportacion pareja: {currency(coupleContribution)}</span>
          <input value={coupleContribution} min={0} max={contributionMax} step={250} type="range" onChange={(event) => setCoupleContribution(Number(event.target.value))} />
          <strong>{currency(guestGiftTarget)} / invitado</strong>
        </div>
        <div className="bottom-bar-note">
          <span>Baremo</span>
          <strong>{currency(lowEstimate)} - {currency(highEstimate)}</strong>
        </div>
      </div>
        </>
      )}
    </div>
  );
}

function tabTitle(tab: TabId) {
  const labels: Record<TabId, string> = {
    dashboard: "Panel operativo",
    leads: "CRM y cualificacion",
    events: "Ficha de boda",
    vendors: "Proveedores y precios",
    experience: "Configurador de experiencia",
    simulator: "Simulador de presupuesto",
    agent: "Asistente con aprobacion",
    governance: "Permisos y RGPD"
  };
  return labels[tab];
}

function currency(value: number) {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function shortDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

function dateTime(value: string) {
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}

function simulatorOptionCost(option: SimulatorOption, tier: SimulatorTier, guestCount: number) {
  const base = option.ranges[tier];
  return option.unit === "guest" ? base * guestCount : base;
}

function contextualSimulatorOptionCost(option: SimulatorOption, tier: SimulatorTier, guestCount: number, location: LocationProfile) {
  return simulatorOptionTotalFromValue(option, simulatorOptionUnitValue(option, tier, location), guestCount);
}

function simulatorOptionConfiguredTotal(option: SimulatorOption, overrideValue: number | undefined, tier: SimulatorTier, guestCount: number, location: LocationProfile) {
  const value = overrideValue ?? simulatorOptionUnitValue(option, tier, location);
  return simulatorOptionTotalFromValue(option, value, guestCount);
}

function simulatorOptionUnitValue(option: SimulatorOption, tier: SimulatorTier, location: LocationProfile) {
  if (option.id === "venue") {
    return location.venueRanges[tier];
  }
  if (option.id === "catering") {
    return location.cateringRanges[tier];
  }
  return option.ranges[tier];
}

function simulatorOptionTotalFromValue(option: SimulatorOption, value: number, guestCount: number) {
  return option.unit === "guest" ? value * guestCount : value;
}

function travelEstimate(
  guestCount: number,
  location: LocationProfile,
  guestOrigin: "local" | "mixed" | "destination",
  needsHotel: boolean,
  hotelNights: number,
  needsFlights: boolean,
  flyingGuestsPercent: number,
  needsTransfers: boolean,
  tier: SimulatorTier = "equilibrado"
) {
  const originShare = guestOrigin === "local" ? 0.15 : guestOrigin === "mixed" ? 0.45 : 0.75;
  const tierMultiplier = tier === "economico" ? 0.82 : tier === "premium" ? 1.28 : 1;
  const hotelGuests = Math.ceil(guestCount * originShare);
  const hotelRooms = Math.ceil(hotelGuests / 2);
  const hotelCost = needsHotel ? hotelRooms * hotelNights * location.hotelNight * tierMultiplier : 0;
  const flyingGuests = Math.ceil(guestCount * (flyingGuestsPercent / 100));
  const flightCost = needsFlights ? flyingGuests * location.flightPerGuest * tierMultiplier : 0;
  const transferCost = needsTransfers ? location.transferFixed * tierMultiplier : 0;
  return Math.round(hotelCost + flightCost + transferCost);
}

function tierLabel(tier: SimulatorTier) {
  const labels: Record<SimulatorTier, string> = {
    economico: "Básico",
    equilibrado: "Medio",
    premium: "Alto"
  };
  return labels[tier];
}

function simulatorCategoryIcon(category: string) {
  if (category.includes("banquete")) return Utensils;
  if (category.includes("Ceremonia")) return HeartIcon;
  if (category.includes("Diseño")) return Flower2;
  if (category.includes("Imagen")) return Palette;
  if (category.includes("Experiencias")) return Gift;
  if (category.includes("Música")) return Music;
  if (category.includes("Logística")) return MapPin;
  if (category.includes("Equipo")) return Users;
  if (category.includes("Coordinación")) return Store;
  return WalletCards;
}

function HeartIcon({ size }: { size: number }) {
  return <span style={{ display: "inline-flex", fontSize: size, lineHeight: 1 }}>♡</span>;
}
