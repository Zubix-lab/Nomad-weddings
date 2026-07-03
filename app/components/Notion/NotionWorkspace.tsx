"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlarmClock,
  Bell,
  CalendarDays,
  CheckCircle2,
  Circle,
  ClipboardList,
  Columns3,
  CreditCard,
  Edit3,
  FileText,
  Heart,
  ListTodo,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
  X
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Event, WorkspaceBlock, WorkspaceBlockType, WorkspacePage } from "@/lib/types";

const TODAY = new Date("2026-07-03T00:00:00");

type BlockDraft = {
  type: WorkspaceBlockType;
  title: string;
  body: string;
  owner: string;
  dueDate: string;
  reminderDate: string;
  amount: string;
  priority: "alta" | "media" | "baja";
  vendorId: string;
};

type BlueprintBlock = Omit<BlockDraft, "vendorId" | "amount"> & {
  amount: number | "";
  status?: WorkspaceBlock["status"];
};

type BlueprintPage = {
  title: string;
  icon: string;
  description: string;
  blocks: BlueprintBlock[];
};

type ViewMode = "list" | "kanban" | "calendar";
type KanbanColumnId = "open" | "scheduled" | "blocked" | "done";

const blockLabels: Record<WorkspaceBlockType, string> = {
  task: "Tarea",
  note: "Nota",
  payment: "Pago",
  milestone: "Hito",
  vendor: "Proveedor"
};

const blockIcons: Record<WorkspaceBlockType, React.ReactNode> = {
  task: <ClipboardList size={15} />,
  note: <FileText size={15} />,
  payment: <CreditCard size={15} />,
  milestone: <AlarmClock size={15} />,
  vendor: <Users size={15} />
};

const pageIcons: Record<string, React.ReactNode> = {
  CalendarDays: <CalendarDays size={16} />,
  Users: <Users size={16} />,
  ClipboardList: <ClipboardList size={16} />,
  AlarmClock: <AlarmClock size={16} />,
  Heart: <Heart size={16} />
};

const viewModes: Array<{ id: ViewMode; label: string; icon: React.ReactNode }> = [
  { id: "list", label: "Lista", icon: <ListTodo size={15} /> },
  { id: "kanban", label: "Kanban", icon: <Columns3 size={15} /> },
  { id: "calendar", label: "Calendario", icon: <CalendarDays size={15} /> }
];

const kanbanColumns: Array<{ id: KanbanColumnId; title: string; description: string }> = [
  { id: "open", title: "Pendiente", description: "Sin fecha critica o por arrancar" },
  { id: "scheduled", title: "Con fecha", description: "Tiene vencimiento, aviso o pago" },
  { id: "blocked", title: "Bloqueado", description: "Necesita decision o proveedor" },
  { id: "done", title: "Cerrado", description: "Hecho, contratado o pagado" }
];

const roadmapBlueprint: BlueprintPage[] = [
  {
    title: "12-9 meses antes",
    icon: "CalendarDays",
    description: "Estrategia, presupuesto, fecha, lugar y proveedores criticos.",
    blocks: [
      {
        type: "milestone",
        title: "Concepto de boda y presupuesto base aprobados",
        body: "Definir tono, rango de invitados, presupuesto maximo y no negociables.",
        owner: "Planner",
        dueDate: "2026-07-18",
        reminderDate: "2026-07-11",
        amount: "",
        priority: "alta",
        status: "pendiente"
      },
      {
        type: "vendor",
        title: "Shortlist de espacios y restauracion",
        body: "Comparar 3-5 sedes reales, disponibilidad, capacidad, exclusividades y costes ocultos.",
        owner: "Nomad",
        dueDate: "2026-07-25",
        reminderDate: "2026-07-20",
        amount: "",
        priority: "alta",
        status: "pendiente"
      },
      {
        type: "payment",
        title: "Reserva inicial de espacio",
        body: "Bloquear fecha solo con condiciones de cancelacion revisadas.",
        owner: "Pareja",
        dueDate: "2026-08-02",
        reminderDate: "2026-07-28",
        amount: 2500,
        priority: "alta",
        status: "programado"
      }
    ]
  },
  {
    title: "9-6 meses antes",
    icon: "Users",
    description: "Contrataciones principales, invitados, viaje y comunicacion.",
    blocks: [
      {
        type: "task",
        title: "Cerrar fotografo, musica y decoracion",
        body: "Revisar contrato, entregables, horarios, dietas y condiciones de ampliacion.",
        owner: "Planner",
        dueDate: "2026-09-15",
        reminderDate: "2026-09-08",
        amount: "",
        priority: "alta",
        status: "pendiente"
      },
      {
        type: "note",
        title: "Preferencias de invitados y alojamiento",
        body: "Crear pagina viva con alergias, hoteles recomendados, transfers y contactos utiles.",
        owner: "Pareja",
        dueDate: "",
        reminderDate: "",
        amount: "",
        priority: "media"
      }
    ]
  },
  {
    title: "3-1 meses antes",
    icon: "ClipboardList",
    description: "Operativa fina: mesa, menus, pagos, pruebas y confirmaciones.",
    blocks: [
      {
        type: "task",
        title: "Seating plan con alergias y grupos sensibles",
        body: "Validar acompanantes, ninos, alergias, movilidad reducida y mesas conflictivas.",
        owner: "Planner",
        dueDate: "2026-11-08",
        reminderDate: "2026-11-01",
        amount: "",
        priority: "alta",
        status: "pendiente"
      },
      {
        type: "payment",
        title: "Segundo pago proveedores clave",
        body: "Programar pagos de venue, catering, fotografia y musica.",
        owner: "Nomad",
        dueDate: "2026-11-20",
        reminderDate: "2026-11-13",
        amount: 4200,
        priority: "alta",
        status: "programado"
      }
    ]
  },
  {
    title: "Semana de la boda",
    icon: "AlarmClock",
    description: "Runbook, confirmaciones, emergencias, materiales y pagos finales.",
    blocks: [
      {
        type: "task",
        title: "Cronograma final enviado a todos los proveedores",
        body: "Incluir accesos, responsable de llegada, telefonos, montaje, desmontaje y plan lluvia.",
        owner: "Coordinacion",
        dueDate: "2026-12-01",
        reminderDate: "2026-11-28",
        amount: "",
        priority: "alta",
        status: "pendiente"
      },
      {
        type: "payment",
        title: "Pagos finales y caja de incidencias",
        body: "Preparar justificantes, retenciones, propinas pactadas y margen de emergencia.",
        owner: "Nomad",
        dueDate: "2026-12-03",
        reminderDate: "2026-11-30",
        amount: 1800,
        priority: "media",
        status: "programado"
      }
    ]
  },
  {
    title: "Dia B",
    icon: "Heart",
    description: "Ejecucion minuto a minuto, checklists de equipo y cierre.",
    blocks: [
      {
        type: "milestone",
        title: "Checklist de ceremonia, banquete y fiesta completado",
        body: "Confirmar anillos, votos, sonido, seating, tiempos de cocina y salida de transporte.",
        owner: "Coordinacion",
        dueDate: "2026-12-05",
        reminderDate: "2026-12-05",
        amount: "",
        priority: "alta",
        status: "pendiente"
      }
    ]
  }
];

const emptyDraft: BlockDraft = {
  type: "task",
  title: "",
  body: "",
  owner: "Nomad",
  dueDate: "",
  reminderDate: "",
  amount: "",
  priority: "media",
  vendorId: ""
};

function currency(value?: number): string {
  if (!value) return "Sin importe";
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function parsePositiveNumber(value: string): number | null {
  const normalized = value.trim().replace(",", ".");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function formatDate(value?: string): string {
  if (!value) return "Sin fecha";
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function sortByDate(blocks: WorkspaceBlock[]): WorkspaceBlock[] {
  return [...blocks].sort((a, b) => {
    const aTime = a.dueDate ? new Date(`${a.dueDate}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
    const bTime = b.dueDate ? new Date(`${b.dueDate}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
    return aTime - bTime;
  });
}

function isDone(block: WorkspaceBlock): boolean {
  return ["hecha", "pagado", "contratado"].includes(String(block.status));
}

function dateDistance(value?: string): number {
  if (!value) return Number.MAX_SAFE_INTEGER;
  return Math.ceil((new Date(`${value}T00:00:00`).getTime() - TODAY.getTime()) / 86_400_000);
}

function kanbanColumnFor(block: WorkspaceBlock): KanbanColumnId {
  if (isDone(block)) return "done";
  if (block.status === "bloqueada") return "blocked";
  if (block.type === "payment" || block.dueDate || block.reminderDate) return "scheduled";
  return "open";
}

function dueTone(block: WorkspaceBlock): "late" | "soon" | "normal" {
  const distance = Math.min(dateDistance(block.reminderDate), dateDistance(block.dueDate));
  if (distance < 0) return "late";
  if (distance <= 14) return "soon";
  return "normal";
}

function draftFromBlock(block: WorkspaceBlock): BlockDraft {
  return {
    type: block.type,
    title: block.title,
    body: block.body || "",
    owner: block.owner || "Nomad",
    dueDate: block.dueDate || "",
    reminderDate: block.reminderDate || "",
    amount: block.amount ? String(block.amount) : "",
    priority: block.priority || "media",
    vendorId: block.vendorId || ""
  };
}

export function NotionWorkspace({
  activeEventId,
  events,
  focusPageId = "",
  focusBlockId = ""
}: {
  activeEventId: string;
  events: Event[];
  focusPageId?: string;
  focusBlockId?: string;
}) {
  const {
    workspacePages,
    workspaceBlocks,
    vendors,
    addWorkspacePage,
  updateWorkspacePage,
  deleteWorkspacePage,
  updateWorkspaceBlock,
    addWorkspaceBlock,
    deleteWorkspaceBlock
  } = useApp();

  const event = events.find((item) => item.id === activeEventId) || events[0];
  const eventId = event?.id || "";
  const pages = useMemo(
    () => workspacePages.filter((page) => page.eventId === eventId).sort((a, b) => a.order - b.order),
    [workspacePages, eventId]
  );

  const [activePageId, setActivePageId] = useState("");
  const selectedPage = pages.find((page) => page.id === activePageId) || pages[0];
  const selectedPageId = selectedPage?.id || "";
  const [draft, setDraft] = useState<BlockDraft>(emptyDraft);
  const [filterType, setFilterType] = useState<"all" | WorkspaceBlockType>("all");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingId, setEditingId] = useState("");
  const [editDraft, setEditDraft] = useState<BlockDraft>(emptyDraft);
  const [focusedBlockId, setFocusedBlockId] = useState("");
  const [newPageTitle, setNewPageTitle] = useState("");
  const [newPageDescription, setNewPageDescription] = useState("");
  const [editingPageId, setEditingPageId] = useState("");
  const [pageTitleDraft, setPageTitleDraft] = useState("");
  const [pageDescriptionDraft, setPageDescriptionDraft] = useState("");
  const [draftError, setDraftError] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    const pageId = focusPageId || workspaceBlocks.find((block) => block.id === focusBlockId)?.pageId || "";
    if (!pageId || !pages.some((page) => page.id === pageId)) return;
    setActivePageId(pageId);
    setFocusedBlockId(focusBlockId);
    setFilterType("all");
    setQuery("");
    setViewMode("list");
  }, [focusPageId, focusBlockId, pages, workspaceBlocks]);

  const blocksForEvent = useMemo(
    () => workspaceBlocks.filter((block) => block.eventId === eventId),
    [workspaceBlocks, eventId]
  );

  const blocksForPage = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return sortByDate(blocksForEvent).filter((block) => {
      const matchesPage = block.pageId === selectedPageId;
      const matchesType = filterType === "all" || block.type === filterType;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        block.title.toLowerCase().includes(normalizedQuery) ||
        (block.body || "").toLowerCase().includes(normalizedQuery) ||
        (block.owner || "").toLowerCase().includes(normalizedQuery);
      return matchesPage && matchesType && matchesQuery;
    });
  }, [blocksForEvent, selectedPageId, filterType, query]);

  const kanbanBlocks = useMemo(() => {
    return kanbanColumns.map((column) => ({
      ...column,
      blocks: blocksForPage.filter((block) => kanbanColumnFor(block) === column.id)
    }));
  }, [blocksForPage]);

  const calendarBlocks = useMemo(() => {
    return sortByDate(blocksForPage.filter((block) => block.dueDate || block.reminderDate));
  }, [blocksForPage]);

  const completion = useMemo(() => {
    const actionable = blocksForEvent.filter((block) => ["task", "milestone", "payment", "vendor"].includes(block.type));
    if (actionable.length === 0) return 0;
    const complete = actionable.filter(isDone).length;
    return Math.round((complete / actionable.length) * 100);
  }, [blocksForEvent]);

  const pendingPayments = blocksForEvent.filter((block) => block.type === "payment" && block.status !== "pagado");
  const openBlocks = blocksForEvent.filter((block) => ["task", "milestone", "vendor"].includes(block.type) && !isDone(block));
  const reminderBlocks = useMemo(() => {
    return sortByDate(
      blocksForEvent.filter((block) => {
        if (isDone(block)) return false;
        const distance = Math.min(dateDistance(block.reminderDate), dateDistance(block.dueDate));
        return distance <= 21;
      })
    ).slice(0, 5);
  }, [blocksForEvent]);

  const applyTemplate = () => {
    if (!eventId) return;
    const pageMap = new Map<string, WorkspacePage>(pages.map((page) => [page.title, page]));
    let order = pages.length;

    roadmapBlueprint.forEach((blueprint) => {
      let page = pageMap.get(blueprint.title);
      if (!page) {
        const id = addWorkspacePage({
          eventId,
          title: blueprint.title,
          icon: blueprint.icon,
          description: blueprint.description,
          order: order + 1
        });
        order += 1;
        page = { id, eventId, title: blueprint.title, icon: blueprint.icon, description: blueprint.description, order };
        pageMap.set(blueprint.title, page);
      } else if (page.description !== blueprint.description || page.icon !== blueprint.icon) {
        updateWorkspacePage({ ...page, icon: blueprint.icon, description: blueprint.description });
      }

      blueprint.blocks.forEach((block) => {
        const alreadyExists = blocksForEvent.some((existing) => existing.pageId === page?.id && existing.title === block.title);
        if (alreadyExists || !page) return;
        addWorkspaceBlock({
          pageId: page.id,
          eventId,
          type: block.type,
          title: block.title,
          body: block.body || undefined,
          owner: block.owner,
          dueDate: block.dueDate || undefined,
          reminderDate: block.reminderDate || undefined,
          amount: block.type === "payment" && block.amount !== "" ? Number(block.amount) : undefined,
          priority: block.priority,
          status: block.status,
          createdAt: new Date().toISOString().split("T")[0]
        });
      });
    });
  };

  const addPage = (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const title = newPageTitle.trim();
    if (!title || !eventId) return;
    const pageId = addWorkspacePage({
      eventId,
      title,
      icon: "ClipboardList",
      description: newPageDescription.trim() || "Pagina personalizada de trabajo.",
      order: pages.length + 1
    });
    setNewPageTitle("");
    setNewPageDescription("");
    setActivePageId(pageId);
  };

  const startPageEdit = (page: WorkspacePage) => {
    setEditingPageId(page.id);
    setPageTitleDraft(page.title);
    setPageDescriptionDraft(page.description);
  };

  const savePageEdit = (page: WorkspacePage) => {
    const title = pageTitleDraft.trim();
    if (!title) return;
    updateWorkspacePage({
      ...page,
      title,
      description: pageDescriptionDraft.trim() || page.description
    });
    setEditingPageId("");
  };

  const removePage = (page: WorkspacePage) => {
    blocksForEvent.filter((block) => block.pageId === page.id).forEach((block) => deleteWorkspaceBlock(block.id));
    deleteWorkspacePage(page.id);
    if (selectedPageId === page.id) setActivePageId("");
  };

  const addBlock = (eventSubmit: React.FormEvent) => {
    eventSubmit.preventDefault();
    if (!draft.title.trim() || !selectedPageId || !eventId) return;
    const parsedAmount = draft.type === "payment" ? parsePositiveNumber(draft.amount) : null;
    if (draft.type === "payment" && parsedAmount === null) {
      setDraftError("Introduce un importe mayor que 0 para crear el pago.");
      return;
    }

    addWorkspaceBlock({
      pageId: selectedPageId,
      eventId,
      type: draft.type,
      title: draft.title.trim(),
      body: draft.body.trim() || undefined,
      owner: draft.owner.trim() || "Nomad",
      dueDate: draft.dueDate || undefined,
      reminderDate: draft.reminderDate || undefined,
      amount: draft.type === "payment" && parsedAmount !== null ? parsedAmount : undefined,
      vendorId: draft.vendorId || undefined,
      status: draft.type === "payment" ? "programado" : draft.type === "note" ? undefined : "pendiente",
      priority: draft.priority,
      createdAt: new Date().toISOString().split("T")[0]
    });

    setDraft({ ...emptyDraft, type: draft.type, owner: draft.owner || "Nomad" });
    setDraftError("");
  };

  const toggleBlock = (block: WorkspaceBlock) => {
    if (block.type === "payment") {
      updateWorkspaceBlock({ ...block, status: block.status === "pagado" ? "programado" : "pagado" });
      return;
    }
    if (block.type === "vendor") {
      updateWorkspaceBlock({ ...block, status: block.status === "contratado" ? "pendiente" : "contratado" });
      return;
    }
    if (["task", "milestone"].includes(block.type)) {
      updateWorkspaceBlock({ ...block, status: block.status === "hecha" ? "pendiente" : "hecha" });
    }
  };

  const startEdit = (block: WorkspaceBlock) => {
    setEditingId(block.id);
    setEditDraft(draftFromBlock(block));
    setEditError("");
  };

  const saveEdit = (block: WorkspaceBlock) => {
    if (!editDraft.title.trim()) return;
    const parsedAmount = editDraft.type === "payment" ? parsePositiveNumber(editDraft.amount) : null;
    if (editDraft.type === "payment" && parsedAmount === null) {
      setEditError("Introduce un importe mayor que 0 para guardar el pago.");
      return;
    }
    updateWorkspaceBlock({
      ...block,
      type: editDraft.type,
      title: editDraft.title.trim(),
      body: editDraft.body.trim() || undefined,
      owner: editDraft.owner.trim() || "Nomad",
      dueDate: editDraft.dueDate || undefined,
      reminderDate: editDraft.reminderDate || undefined,
      amount: editDraft.type === "payment" && parsedAmount !== null ? parsedAmount : undefined,
      priority: editDraft.priority,
      vendorId: editDraft.vendorId || undefined
    });
    setEditingId("");
    setEditError("");
  };

  const updateDraft = (patch: Partial<BlockDraft>) => setDraft((current) => ({ ...current, ...patch }));
  const updateEditDraft = (patch: Partial<BlockDraft>) => setEditDraft((current) => ({ ...current, ...patch }));

  if (!event) {
    return <div className="empty-state">Crea una boda para empezar a construir su workspace.</div>;
  }

  if (pages.length === 0) {
    return (
      <section className="panel full" style={{ display: "grid", gap: "14px" }}>
        <p className="eyebrow">Workspace Notion-like</p>
        <h3 style={{ fontSize: "28px" }}>Todavía no hay roadmap para {event.name}</h3>
        <p style={{ color: "var(--slate-grey)", maxWidth: "680px", lineHeight: 1.55 }}>
          Genera una estructura base por fases para empezar a añadir tareas, pagos, notas, proveedores, alarmas e hitos vinculados a esta boda.
        </p>
        <button className="primary-button" onClick={applyTemplate} style={{ justifySelf: "start" }}>
          <Plus size={16} /> Generar roadmap operativo
        </button>
        <form className="notion-page-create empty-workspace-create" onSubmit={addPage}>
          <input value={newPageTitle} onChange={(eventInput) => setNewPageTitle(eventInput.target.value)} placeholder="Crear pagina personalizada" aria-label="Crear pagina personalizada" />
          <input value={newPageDescription} onChange={(eventInput) => setNewPageDescription(eventInput.target.value)} placeholder="Descripcion breve" aria-label="Descripcion de pagina personalizada" />
          <button className="secondary-button" type="submit"><Plus size={14} /> Crear pagina</button>
        </form>
      </section>
    );
  }

  return (
    <div className="notion-layout">
      <aside className="notion-pages panel">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Workspace</p>
            <h3>{event.name}</h3>
          </div>
          <strong style={{ color: "var(--primary)", fontSize: "22px" }}>{completion}%</strong>
        </div>

        <div className="notion-progress">
          <span style={{ width: `${completion}%` }} />
        </div>

        <button className="secondary-button" onClick={applyTemplate}>
          <Plus size={15} /> Añadir plantilla operativa
        </button>

        <form className="notion-page-create" onSubmit={addPage}>
          <input value={newPageTitle} onChange={(eventInput) => setNewPageTitle(eventInput.target.value)} placeholder="Nueva pagina" aria-label="Nueva pagina" />
          <input value={newPageDescription} onChange={(eventInput) => setNewPageDescription(eventInput.target.value)} placeholder="Descripcion breve" aria-label="Descripcion de pagina" />
          <button className="primary-button" type="submit"><Plus size={14} /> Crear</button>
        </form>

        <div style={{ display: "grid", gap: "8px" }}>
          {pages.map((page) => {
            const pageBlocks = blocksForEvent.filter((block) => block.pageId === page.id);
            const active = page.id === selectedPageId;
            const editingPage = editingPageId === page.id;
            return (
              <div key={page.id} className={active ? "notion-page-row active" : "notion-page-row"}>
                {editingPage ? (
                  <div className="notion-page-edit">
                    <input value={pageTitleDraft} onChange={(eventInput) => setPageTitleDraft(eventInput.target.value)} aria-label="Editar titulo de pagina" />
                    <textarea value={pageDescriptionDraft} onChange={(eventInput) => setPageDescriptionDraft(eventInput.target.value)} aria-label="Editar descripcion de pagina" />
                    <div className="notion-page-edit-actions">
                      <button className="primary-button" type="button" onClick={() => savePageEdit(page)}><Save size={14} /> Guardar</button>
                      <button className="secondary-button" type="button" onClick={() => setEditingPageId("")}><X size={14} /> Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button className="notion-page-button" onClick={() => setActivePageId(page.id)}>
                      <span>{pageIcons[page.icon] || <ClipboardList size={16} />}</span>
                      <div>
                        <strong>{page.title}</strong>
                        <small>{pageBlocks.length} bloques</small>
                      </div>
                    </button>
                    <div className="notion-page-actions">
                      <button className="icon-button" type="button" onClick={() => startPageEdit(page)} aria-label="Editar pagina"><Edit3 size={14} /></button>
                      <button className="icon-button" type="button" onClick={() => removePage(page)} aria-label="Eliminar pagina"><Trash2 size={14} /></button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div className="notion-alerts">
          <div className="panel-header compact-header">
            <div>
              <p className="eyebrow">Alarmas</p>
              <h3>Próximos vencimientos</h3>
            </div>
            <Bell size={16} />
          </div>
          {reminderBlocks.map((block) => (
            <button key={block.id} className="notion-alert-row" onClick={() => setActivePageId(block.pageId)}>
              <span className={`priority ${block.priority || "media"}`}>{block.priority || "media"}</span>
              <strong>{block.title}</strong>
              <small>{block.reminderDate ? `Aviso ${formatDate(block.reminderDate)}` : `Fecha ${formatDate(block.dueDate)}`}</small>
            </button>
          ))}
          {reminderBlocks.length === 0 && <p className="muted-note">Sin alarmas en los próximos 21 días.</p>}
        </div>
      </aside>

      <section className="panel notion-editor">
        <div className="notion-page-hero">
          <div>
            <p className="eyebrow">Roadmap de boda</p>
            <h3>{selectedPage.title}</h3>
            <p>{selectedPage.description}</p>
          </div>
          <div className="notion-page-kpis">
            <div>
              <strong>{blocksForPage.length}</strong>
              <span>bloques en pagina</span>
            </div>
            <div>
              <strong>{openBlocks.length}</strong>
              <span>pendientes globales</span>
            </div>
            <div>
              <strong>{pendingPayments.length}</strong>
              <span>pagos activos</span>
            </div>
          </div>
        </div>

        <div className="notion-toolbar">
          <div style={{ position: "relative", flex: "1 1 260px" }}>
            <Search size={16} style={{ position: "absolute", left: "11px", top: "12px", color: "var(--slate-grey)" }} />
            <input value={query} onChange={(eventInput) => setQuery(eventInput.target.value)} placeholder="Buscar en esta fase..." style={{ paddingLeft: "34px" }} />
          </div>
          <select value={filterType} onChange={(eventInput) => setFilterType(eventInput.target.value as "all" | WorkspaceBlockType)} style={{ width: "170px" }}>
            <option value="all">Todos los bloques</option>
            {Object.entries(blockLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="notion-view-toggle" role="group" aria-label="Vista del workspace">
            {viewModes.map((view) => (
              <button
                key={view.id}
                type="button"
                className={viewMode === view.id ? "active" : ""}
                onClick={() => setViewMode(view.id)}
              >
                {view.icon}
                {view.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={addBlock} className="notion-create">
          <select value={draft.type} onChange={(eventInput) => {
            updateDraft({ type: eventInput.target.value as WorkspaceBlockType });
            setDraftError("");
          }} aria-label="Tipo de bloque">
            {Object.entries(blockLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <input value={draft.title} onChange={(eventInput) => updateDraft({ title: eventInput.target.value })} placeholder="Añadir tarea, nota, pago o hito..." aria-label="Título del bloque" />
          <input value={draft.owner} onChange={(eventInput) => updateDraft({ owner: eventInput.target.value })} placeholder="Responsable" aria-label="Responsable" />
          <input type="date" value={draft.dueDate} onChange={(eventInput) => updateDraft({ dueDate: eventInput.target.value })} aria-label="Fecha límite" />
          <input type="date" value={draft.reminderDate} onChange={(eventInput) => updateDraft({ reminderDate: eventInput.target.value })} aria-label="Fecha de aviso" />
          <select value={draft.priority} onChange={(eventInput) => updateDraft({ priority: eventInput.target.value as BlockDraft["priority"] })} aria-label="Prioridad">
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
          {draft.type === "vendor" && (
            <select value={draft.vendorId} onChange={(eventInput) => updateDraft({ vendorId: eventInput.target.value })} aria-label="Proveedor vinculado">
              <option value="">Sin proveedor</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
              ))}
            </select>
          )}
          {draft.type === "payment" && (
            <input
              inputMode="decimal"
              value={draft.amount}
              onChange={(eventInput) => {
                updateDraft({ amount: eventInput.target.value });
                setDraftError("");
              }}
              placeholder="Importe"
              aria-label="Importe"
            />
          )}
          {draftError && <p className="field-error">{draftError}</p>}
          <textarea value={draft.body} onChange={(eventInput) => updateDraft({ body: eventInput.target.value })} placeholder="Notas, contexto, acuerdos o instrucciones..." />
          <button type="submit" className="primary-button" aria-label="Crear bloque">
            <Plus size={16} /> Añadir
          </button>
        </form>

        {viewMode === "list" && (
        <div className="notion-block-list">
          {blocksForPage.map((block) => {
            const vendor = block.vendorId ? vendors.find((item) => item.id === block.vendorId) : undefined;
            const done = isDone(block);
            const editing = editingId === block.id;
            const overdue = !done && block.dueDate && dateDistance(block.dueDate) < 0;
            const className = [
              "notion-block",
              done ? "done" : "",
              overdue ? "overdue" : "",
              focusedBlockId === block.id ? "focused" : ""
            ].filter(Boolean).join(" ");

            return (
              <article key={block.id} className={className}>
                <button className="notion-check" onClick={() => toggleBlock(block)} aria-label="Cambiar estado">
                  {done ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                </button>
                <div className="notion-block-main">
                  {editing ? (
                    <div className="notion-edit">
                      <select value={editDraft.type} onChange={(eventInput) => {
                        updateEditDraft({ type: eventInput.target.value as WorkspaceBlockType });
                        setEditError("");
                      }} aria-label="Editar tipo de bloque">
                        {Object.entries(blockLabels).map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <input value={editDraft.title} onChange={(eventInput) => updateEditDraft({ title: eventInput.target.value })} aria-label="Editar título" />
                      <input value={editDraft.owner} onChange={(eventInput) => updateEditDraft({ owner: eventInput.target.value })} aria-label="Editar responsable" />
                      <input type="date" value={editDraft.dueDate} onChange={(eventInput) => updateEditDraft({ dueDate: eventInput.target.value })} aria-label="Editar fecha límite" />
                      <input type="date" value={editDraft.reminderDate} onChange={(eventInput) => updateEditDraft({ reminderDate: eventInput.target.value })} aria-label="Editar fecha de aviso" />
                      <select value={editDraft.priority} onChange={(eventInput) => updateEditDraft({ priority: eventInput.target.value as BlockDraft["priority"] })} aria-label="Editar prioridad">
                        <option value="alta">Alta</option>
                        <option value="media">Media</option>
                        <option value="baja">Baja</option>
                      </select>
                      {editDraft.type === "vendor" && (
                        <select value={editDraft.vendorId} onChange={(eventInput) => updateEditDraft({ vendorId: eventInput.target.value })} aria-label="Editar proveedor vinculado">
                          <option value="">Sin proveedor</option>
                          {vendors.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                          ))}
                        </select>
                      )}
                      {editDraft.type === "payment" && (
                        <input
                          inputMode="decimal"
                          value={editDraft.amount}
                          onChange={(eventInput) => {
                            updateEditDraft({ amount: eventInput.target.value });
                            setEditError("");
                          }}
                          aria-label="Editar importe"
                        />
                      )}
                      {editError && <p className="field-error">{editError}</p>}
                      <textarea value={editDraft.body} onChange={(eventInput) => updateEditDraft({ body: eventInput.target.value })} aria-label="Editar notas" />
                      <div className="notion-edit-actions">
                        <button className="primary-button" type="button" onClick={() => saveEdit(block)} aria-label="Guardar bloque">
                          <Save size={15} /> Guardar
                        </button>
                        <button className="secondary-button" type="button" onClick={() => setEditingId("")} aria-label="Cancelar edición">
                          <X size={15} /> Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="notion-block-top">
                        <span className="pill">{blockIcons[block.type]} {blockLabels[block.type]}</span>
                        {block.priority && <span className={`priority ${block.priority}`}>{block.priority}</span>}
                        {block.status && <span className="pill">{block.status}</span>}
                        {block.amount && <span className="pill">{currency(block.amount)}</span>}
                        {overdue && <span className="priority alta">vencido</span>}
                      </div>
                      <h4>{block.title}</h4>
                      {block.body && <p>{block.body}</p>}
                      <div className="notion-block-meta">
                        {block.owner && <span>{block.owner}</span>}
                        {block.dueDate && <span>Fecha {formatDate(block.dueDate)}</span>}
                        {block.reminderDate && <span><Bell size={12} /> Aviso {formatDate(block.reminderDate)}</span>}
                        {vendor && <span>{vendor.name}</span>}
                      </div>
                    </>
                  )}
                </div>
                <div className="notion-block-actions">
                  {!editing && (
                    <button className="icon-button" onClick={() => startEdit(block)} aria-label="Editar bloque">
                      <Edit3 size={15} />
                    </button>
                  )}
                  <button className="icon-button" onClick={() => deleteWorkspaceBlock(block.id)} aria-label="Eliminar bloque">
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            );
          })}

          {blocksForPage.length === 0 && (
            <div className="empty-state compact">Esta fase todavía no tiene bloques con los filtros actuales.</div>
          )}
        </div>
        )}

        {viewMode === "kanban" && (
          <div className="notion-kanban">
            {kanbanBlocks.map((column) => (
              <section key={column.id} className="notion-kanban-column">
                <div className="notion-kanban-header">
                  <div>
                    <strong>{column.title}</strong>
                    <small>{column.description}</small>
                  </div>
                  <span>{column.blocks.length}</span>
                </div>
                <div className="notion-kanban-stack">
                  {column.blocks.map((block) => {
                    const tone = dueTone(block);
                    return (
                      <article key={block.id} className={`notion-mini-card ${tone}`}>
                        <div className="notion-block-top">
                          <span className="pill">{blockIcons[block.type]} {blockLabels[block.type]}</span>
                          {block.priority && <span className={`priority ${block.priority}`}>{block.priority}</span>}
                        </div>
                        <h4>{block.title}</h4>
                        {block.body && <p>{block.body}</p>}
                        <div className="notion-block-meta">
                          {block.owner && <span>{block.owner}</span>}
                          {block.dueDate && <span>Fecha {formatDate(block.dueDate)}</span>}
                          {block.reminderDate && <span><Bell size={12} /> Aviso {formatDate(block.reminderDate)}</span>}
                        </div>
                        <div className="notion-mini-actions">
                          <button className="secondary-button" type="button" onClick={() => toggleBlock(block)}>
                            {isDone(block) ? "Reabrir" : "Cerrar"}
                          </button>
                          <button className="icon-button" type="button" onClick={() => { setViewMode("list"); startEdit(block); }} aria-label="Editar bloque">
                            <Edit3 size={15} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                  {column.blocks.length === 0 && <div className="empty-state compact">Sin bloques.</div>}
                </div>
              </section>
            ))}
          </div>
        )}

        {viewMode === "calendar" && (
          <div className="notion-calendar">
            {calendarBlocks.map((block) => {
              const tone = dueTone(block);
              return (
                <article key={block.id} className={`notion-calendar-row ${tone}`}>
                  <div className="notion-date-card">
                    <strong>{block.dueDate ? new Date(`${block.dueDate}T00:00:00`).toLocaleDateString("es-ES", { day: "2-digit" }) : "--"}</strong>
                    <span>{block.dueDate ? new Date(`${block.dueDate}T00:00:00`).toLocaleDateString("es-ES", { month: "short" }) : "sin fecha"}</span>
                  </div>
                  <div>
                    <div className="notion-block-top">
                      <span className="pill">{blockIcons[block.type]} {blockLabels[block.type]}</span>
                      {block.status && <span className="pill">{block.status}</span>}
                      {block.priority && <span className={`priority ${block.priority}`}>{block.priority}</span>}
                    </div>
                    <h4>{block.title}</h4>
                    <p>{block.reminderDate ? `Aviso: ${formatDate(block.reminderDate)}` : "Sin aviso configurado"}</p>
                  </div>
                  <button className="icon-button" type="button" onClick={() => { setViewMode("list"); startEdit(block); }} aria-label="Editar bloque">
                    <Edit3 size={15} />
                  </button>
                </article>
              );
            })}
            {calendarBlocks.length === 0 && <div className="empty-state compact">No hay fechas ni avisos en esta fase.</div>}
          </div>
        )}
      </section>
    </div>
  );
}
