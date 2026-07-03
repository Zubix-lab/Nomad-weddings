"use client";

import React, { useMemo, useState } from "react";
import { AlarmClock, Bell, CalendarClock, CheckCircle2, CreditCard, FileText, WalletCards } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { CalendarItem, Event, NotificationRecord, WorkspaceBlock } from "@/lib/types";

const TODAY = new Date("2026-07-03T00:00:00");
const DAY_MS = 86_400_000;

type AgendaKind = "all" | "calendar" | "deadline" | "reminder" | "payment";
type AgendaRange = "all" | "late" | "week" | "month";

type AgendaItem = {
  id: string;
  date: string;
  kind: Exclude<AgendaKind, "all">;
  title: string;
  body?: string;
  owner?: string;
  priority?: WorkspaceBlock["priority"];
  status?: WorkspaceBlock["status"];
  amount?: number;
  block?: WorkspaceBlock;
  calendar?: CalendarItem;
};

type NotificationItem = AgendaItem & {
  sourceId: string;
  sourceType: NotificationRecord["sourceType"];
  record?: NotificationRecord;
};

function currency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "numeric" });
}

function daysUntil(value: string): number {
  return Math.ceil((new Date(`${value}T00:00:00`).getTime() - TODAY.getTime()) / DAY_MS);
}

function isoDateFromToday(days: number): string {
  return new Date(TODAY.getTime() + days * DAY_MS).toISOString().split("T")[0];
}

function isDone(block: WorkspaceBlock): boolean {
  return ["hecha", "pagado", "contratado"].includes(String(block.status));
}

function agendaTone(item: AgendaItem): "late" | "soon" | "normal" {
  const distance = daysUntil(item.date);
  if (distance < 0 && (!item.block || !isDone(item.block))) return "late";
  if (distance <= 7) return "soon";
  return "normal";
}

function buildWorkspaceItems(blocks: WorkspaceBlock[]): AgendaItem[] {
  return blocks.flatMap((block) => {
    const items: AgendaItem[] = [];

    if (block.reminderDate) {
      items.push({
        id: `${block.id}-reminder`,
        date: block.reminderDate,
        kind: "reminder",
        title: block.title,
        body: block.body,
        owner: block.owner,
        priority: block.priority,
        status: block.status,
        amount: block.amount,
        block
      });
    }

    if (block.dueDate && block.dueDate !== block.reminderDate) {
      items.push({
        id: `${block.id}-due`,
        date: block.dueDate,
        kind: block.type === "payment" ? "payment" : "deadline",
        title: block.title,
        body: block.body,
        owner: block.owner,
        priority: block.priority,
        status: block.status,
        amount: block.amount,
        block
      });
    }

    return items;
  });
}

export function AgendaPage({
  activeEventId,
  events,
  onOpenNotion,
  onOpenFinance
}: {
  activeEventId: string;
  events: Event[];
  onOpenNotion: (pageId?: string, blockId?: string) => void;
  onOpenFinance: (paymentId?: string) => void;
}) {
  const {
    calendarItems,
    workspaceBlocks,
    notificationRecords,
    updateWorkspaceBlock,
    addNotificationRecord,
    updateNotificationRecord
  } = useApp();
  const [kindFilter, setKindFilter] = useState<AgendaKind>("all");
  const [rangeFilter, setRangeFilter] = useState<AgendaRange>("month");

  const event = events.find((item) => item.id === activeEventId) || events[0];
  const eventId = event?.id || "";
  const eventBlocks = useMemo(
    () => workspaceBlocks.filter((block) => block.eventId === eventId),
    [workspaceBlocks, eventId]
  );

  const agendaItems = useMemo(() => {
    const calendarAgenda: AgendaItem[] = calendarItems
      .filter((item) => !item.eventId || item.eventId === eventId)
      .map((item) => ({
        id: `calendar-${item.id}`,
        date: item.startsAt.split("T")[0],
        kind: "calendar",
        title: item.title,
        owner: item.owner,
        calendar: item
      }));

    return [...calendarAgenda, ...buildWorkspaceItems(eventBlocks)]
      .sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime());
  }, [calendarItems, eventBlocks, eventId]);

  const filteredItems = useMemo(() => {
    return agendaItems.filter((item) => {
      const distance = daysUntil(item.date);
      const matchesKind = kindFilter === "all" || item.kind === kindFilter;
      const matchesRange =
        rangeFilter === "all" ||
        (rangeFilter === "late" && distance < 0) ||
        (rangeFilter === "week" && distance >= 0 && distance <= 7) ||
        (rangeFilter === "month" && distance >= 0 && distance <= 30);
      return matchesKind && matchesRange;
    });
  }, [agendaItems, kindFilter, rangeFilter]);

  const paymentItems = agendaItems.filter((item) => item.kind === "payment" && item.block?.status !== "pagado");
  const overdueItems = agendaItems.filter((item) => daysUntil(item.date) < 0 && (!item.block || !isDone(item.block)));
  const weekItems = agendaItems.filter((item) => {
    const distance = daysUntil(item.date);
    return distance >= 0 && distance <= 7;
  });
  const pendingAmount = paymentItems.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const notificationItems = useMemo(() => {
    return agendaItems
      .filter((item) => {
        const distance = daysUntil(item.date);
        const relevant = distance <= 14 || item.kind === "payment";
        const open = !item.block || !isDone(item.block);
        return relevant && open;
      })
      .map<NotificationItem>((item) => {
        const sourceId = item.block?.id || item.calendar?.id || item.id;
        const sourceType: NotificationRecord["sourceType"] = item.block ? "workspace" : "calendar";
        const record = notificationRecords.find((notification) => notification.eventId === eventId && notification.sourceId === sourceId && notification.sourceType === sourceType);
        return { ...item, sourceId, sourceType, record };
      })
      .filter((item) => {
        if (!item.record) return true;
        if (item.record.status === "dismissed") return false;
        if (item.record.status === "snoozed" && item.record.snoozedUntil) {
          return daysUntil(item.record.snoozedUntil) <= 0;
        }
        return true;
      })
      .sort((a, b) => new Date(`${a.date}T00:00:00`).getTime() - new Date(`${b.date}T00:00:00`).getTime());
  }, [agendaItems, eventId, notificationRecords]);

  const hiddenNotificationCount = notificationRecords.filter((notification) => notification.eventId === eventId && notification.status !== "active").length;

  const closeBlock = (block: WorkspaceBlock) => {
    if (block.type === "payment") {
      updateWorkspaceBlock({ ...block, status: block.status === "pagado" ? "programado" : "pagado" });
      return;
    }
    if (block.type === "vendor") {
      updateWorkspaceBlock({ ...block, status: block.status === "contratado" ? "pendiente" : "contratado" });
      return;
    }
    updateWorkspaceBlock({ ...block, status: block.status === "hecha" ? "pendiente" : "hecha" });
  };

  const openSource = (item: AgendaItem) => {
    if (!item.block) {
      onOpenNotion();
      return;
    }

    if (item.block.type === "payment") {
      onOpenFinance(item.block.id);
      return;
    }

    onOpenNotion(item.block.pageId, item.block.id);
  };

  const setNotificationState = (item: NotificationItem, status: NotificationRecord["status"]) => {
    const next: Omit<NotificationRecord, "id"> = {
      eventId,
      sourceId: item.sourceId,
      sourceType: item.sourceType,
      status,
      snoozedUntil: status === "snoozed" ? isoDateFromToday(7) : undefined,
      dismissedAt: status === "dismissed" ? isoDateFromToday(0) : undefined,
      updatedAt: new Date().toISOString()
    };

    if (item.record) {
      updateNotificationRecord({ ...item.record, ...next });
    } else {
      addNotificationRecord(next);
    }
  };

  return (
    <div className="agenda-layout">
      <section className="screen-grid agenda-metrics">
        <Metric label="Esta semana" value={weekItems.length} detail="hitos, avisos y pagos" icon={<CalendarClock size={18} />} />
        <Metric label="Vencidos" value={overdueItems.length} detail="requieren revision" icon={<AlarmClock size={18} />} />
        <Metric label="Pagos pendientes" value={currency(pendingAmount)} detail={`${paymentItems.length} pagos activos`} icon={<WalletCards size={18} />} />
        <Metric label="Notificaciones" value={notificationItems.length} detail={`${hiddenNotificationCount} ocultas`} icon={<Bell size={18} />} />
      </section>

      <section className="panel agenda-main">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Agenda operativa</p>
            <h3>{event?.name || "Boda activa"}</h3>
          </div>
          <div className="agenda-actions">
            <button className="secondary-button" onClick={() => onOpenNotion()}><FileText size={15} /> Notion</button>
            <button className="secondary-button" onClick={() => onOpenFinance()}><CreditCard size={15} /> Finanzas</button>
          </div>
        </div>

        <div className="agenda-toolbar">
          <select value={kindFilter} onChange={(eventInput) => setKindFilter(eventInput.target.value as AgendaKind)} aria-label="Filtrar tipo de agenda">
            <option value="all">Todos</option>
            <option value="calendar">Calendario</option>
            <option value="deadline">Fechas limite</option>
            <option value="reminder">Avisos</option>
            <option value="payment">Pagos</option>
          </select>
          <select value={rangeFilter} onChange={(eventInput) => setRangeFilter(eventInput.target.value as AgendaRange)} aria-label="Filtrar rango de agenda">
            <option value="month">Proximos 30 dias</option>
            <option value="week">Esta semana</option>
            <option value="late">Vencidos</option>
            <option value="all">Todo</option>
          </select>
        </div>

        <div className="agenda-list">
          {filteredItems.map((item) => {
            const tone = agendaTone(item);
            const done = item.block ? isDone(item.block) : false;
            return (
              <article key={item.id} className={`agenda-row ${tone} ${done ? "done" : ""}`}>
                <div className="agenda-date">
                  <strong>{new Date(`${item.date}T00:00:00`).toLocaleDateString("es-ES", { day: "2-digit" })}</strong>
                  <span>{new Date(`${item.date}T00:00:00`).toLocaleDateString("es-ES", { month: "short" })}</span>
                </div>
                <div className="agenda-row-main">
                  <div className="notion-block-top">
                    <span className="pill">{item.kind}</span>
                    {item.priority && <span className={`priority ${item.priority}`}>{item.priority}</span>}
                    {item.status && <span className="pill">{item.status}</span>}
                    {item.amount && <span className="pill">{currency(item.amount)}</span>}
                  </div>
                  <h4>{item.title}</h4>
                  {item.body && <p>{item.body}</p>}
                  <small>{formatDate(item.date)}{item.owner ? ` - ${item.owner}` : ""}</small>
                </div>
                <div className="agenda-row-actions">
                  <button className="secondary-button" type="button" onClick={() => openSource(item)}>
                    {item.kind === "payment" ? <CreditCard size={15} /> : <FileText size={15} />} Origen
                  </button>
                  {item.block && (
                    <button className={done ? "secondary-button" : "primary-button"} onClick={() => closeBlock(item.block as WorkspaceBlock)}>
                      <CheckCircle2 size={15} /> {done ? "Reabrir" : "Cerrar"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}

          {filteredItems.length === 0 && <div className="empty-state compact">No hay elementos para este filtro.</div>}
        </div>
      </section>

      <aside className="panel agenda-side">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Centro de avisos</p>
            <h3>Notificaciones</h3>
          </div>
          <Bell size={18} />
        </div>

        <div className="agenda-priority-list">
          {notificationItems.slice(0, 7).map((item) => (
            <article key={item.id} className={agendaTone(item) === "late" ? "agenda-priority-card late" : "agenda-priority-card"}>
              <span className={item.kind === "payment" ? "priority media" : agendaTone(item) === "late" ? "priority alta" : "priority baja"}>{item.kind}</span>
              <strong>{item.title}</strong>
              <small>{formatDate(item.date)}{item.amount ? ` - ${currency(Number(item.amount))}` : ""}</small>
              <div className="notification-actions">
                <button className="secondary-button" type="button" onClick={() => setNotificationState(item, "snoozed")}>Posponer</button>
                <button className="secondary-button" type="button" onClick={() => setNotificationState(item, "dismissed")}>Descartar</button>
                <button className="icon-button" type="button" onClick={() => openSource(item)} aria-label="Abrir origen">
                  <FileText size={14} />
                </button>
              </div>
            </article>
          ))}
          {notificationItems.length === 0 && <p className="muted-note">Bandeja limpia. Los avisos pospuestos volveran cuando toque.</p>}
        </div>
      </aside>
    </div>
  );
}

function Metric({ label, value, detail, icon }: { label: string; value: string | number; detail: string; icon: React.ReactNode }) {
  return (
    <section className="metric">
      <div className="metric-icon">{icon}</div>
      <p>{label}</p>
      <strong>{value}</strong>
      <span>{detail}</span>
    </section>
  );
}
