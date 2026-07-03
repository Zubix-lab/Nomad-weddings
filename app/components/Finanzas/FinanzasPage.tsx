"use client";

import React, { useMemo, useState } from "react";
import { AlertTriangle, BellPlus, CheckCircle2, CreditCard, FileText, RotateCcw, Trash2, WalletCards } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Event, WorkspaceBlock } from "@/lib/types";

const TODAY = new Date("2026-07-03T00:00:00");

type PaymentDraft = {
  title: string;
  amount: string;
  dueDate: string;
  reminderDate: string;
  owner: string;
  pageId: string;
};

const emptyPaymentDraft: PaymentDraft = {
  title: "",
  amount: "",
  dueDate: "",
  reminderDate: "",
  owner: "Nomad",
  pageId: "",
};

function currency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function paymentState(payment: WorkspaceBlock): "vencido" | "pagado" | "pendiente" {
  if (payment.status === "pagado") return "pagado";
  if (payment.dueDate && new Date(`${payment.dueDate}T00:00:00`) < TODAY) return "vencido";
  return "pendiente";
}

function formatInputDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function addDays(date: string, days: number): string {
  const nextDate = date ? new Date(`${date}T00:00:00`) : new Date(TODAY);
  nextDate.setDate(nextDate.getDate() + days);
  return formatInputDate(nextDate);
}

function reminderForDueDate(dueDate: string): string {
  if (!dueDate) return "";
  return addDays(dueDate, -7);
}

export function FinanzasPage({
  activeEventId,
  events,
  onOpenNotion,
  focusPaymentId = ""
}: {
  activeEventId: string;
  events: Event[];
  onOpenNotion: (pageId?: string, blockId?: string) => void;
  focusPaymentId?: string;
}) {
  const {
    workspaceBlocks,
    workspacePages,
    eventServices,
    vendors,
    addWorkspacePage,
    addWorkspaceBlock,
    updateWorkspaceBlock,
    deleteWorkspaceBlock
  } = useApp();
  const [draft, setDraft] = useState<PaymentDraft>(emptyPaymentDraft);
  const event = events.find((item) => item.id === activeEventId) || events[0];
  const eventId = event?.id || "";

  const eventPages = useMemo(
    () => workspacePages.filter((page) => page.eventId === eventId).sort((a, b) => a.order - b.order),
    [workspacePages, eventId]
  );

  const workspacePayments = useMemo(
    () => workspaceBlocks
      .filter((block) => block.eventId === eventId && block.type === "payment")
      .sort((a, b) => {
        const aTime = a.dueDate ? new Date(`${a.dueDate}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
        const bTime = b.dueDate ? new Date(`${b.dueDate}T00:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
        return aTime - bTime;
      }),
    [workspaceBlocks, eventId]
  );

  const serviceSpend = eventServices.filter((service) => service.eventId === eventId);
  const contractedSpend = serviceSpend.reduce((sum, service) => sum + Number(service.estimatedCost), 0);
  const workspacePaymentTotal = workspacePayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pendingPayments = workspacePayments.filter((payment) => paymentState(payment) === "pendiente");
  const overduePayments = workspacePayments.filter((payment) => paymentState(payment) === "vencido");
  const paidPayments = workspacePayments.filter((payment) => paymentState(payment) === "pagado");
  const pendingTotal = pendingPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const overdueTotal = overduePayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const paidTotal = paidPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const updateDraft = (patch: Partial<PaymentDraft>) => {
    setDraft((current) => {
      const next = { ...current, ...patch };
      if (patch.dueDate && !current.reminderDate) next.reminderDate = reminderForDueDate(patch.dueDate);
      return next;
    });
  };

  const ensurePaymentPage = (): string => {
    const selectedPage = eventPages.find((page) => page.id === draft.pageId);
    if (selectedPage) return selectedPage.id;

    const financePage = eventPages.find((page) => /finanzas|pago|presupuesto/i.test(page.title));
    if (financePage) return financePage.id;

    return addWorkspacePage({
      eventId,
      title: "Finanzas y pagos",
      icon: "💳",
      description: "Pagos operativos, avisos de vencimiento y compromisos economicos.",
      order: eventPages.length + 1,
    });
  };

  const handleCreatePayment = (submitEvent: React.FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const title = draft.title.trim();
    const amount = Number(draft.amount);
    if (!eventId || !title || Number.isNaN(amount) || amount <= 0) return;

    addWorkspaceBlock({
      pageId: ensurePaymentPage(),
      eventId,
      type: "payment",
      title,
      body: "Creado desde Finanzas.",
      owner: draft.owner.trim() || "Nomad",
      dueDate: draft.dueDate || undefined,
      reminderDate: draft.reminderDate || undefined,
      amount,
      status: "programado",
      priority: amount >= 3000 ? "alta" : "media",
      createdAt: new Date().toISOString(),
    });

    setDraft(emptyPaymentDraft);
  };

  const togglePayment = (payment: WorkspaceBlock) => {
    updateWorkspaceBlock({
      ...payment,
      status: payment.status === "pagado" ? "programado" : "pagado",
    });
  };

  const postponeReminder = (payment: WorkspaceBlock) => {
    updateWorkspaceBlock({
      ...payment,
      reminderDate: addDays(payment.reminderDate || formatInputDate(TODAY), 7),
      status: payment.status === "pagado" ? payment.status : "programado",
    });
  };

  return (
    <div style={{ display: "grid", gap: "18px" }}>
      <section className="screen-grid">
        <Metric label="Presupuesto boda" value={currency(event?.totalBudget || 0)} detail={event?.name || "Sin boda activa"} icon={<WalletCards size={18} />} />
        <Metric label="Servicios estimados" value={currency(contractedSpend)} detail={`${serviceSpend.length} partidas vinculadas`} icon={<CreditCard size={18} />} />
        <Metric label="Pagos workspace" value={currency(workspacePaymentTotal)} detail={`${paidPayments.length} pagados · ${workspacePayments.length} creados en Notion`} icon={<CheckCircle2 size={18} />} />
        <Metric label="Alertas pago" value={currency(overdueTotal)} detail={`${pendingPayments.length} proximos · ${currency(pendingTotal)} pendiente`} icon={<AlertTriangle size={18} />} />
      </section>

      <section className="panel full">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Finanzas conectadas</p>
            <h3>Pagos creados desde Notion</h3>
          </div>
          <button className="secondary-button" type="button" onClick={() => onOpenNotion()}>
            <FileText size={15} /> Abrir Notion
          </button>
        </div>

        <form className="finance-create-form" onSubmit={handleCreatePayment}>
          <input
            value={draft.title}
            onChange={(inputEvent) => updateDraft({ title: inputEvent.target.value })}
            placeholder="Nuevo pago: reserva, señal, proveedor..."
            aria-label="Nombre del pago"
          />
          <input
            value={draft.amount}
            onChange={(inputEvent) => updateDraft({ amount: inputEvent.target.value })}
            placeholder="Importe"
            inputMode="decimal"
            aria-label="Importe del pago"
          />
          <input
            type="date"
            value={draft.dueDate}
            onChange={(inputEvent) => updateDraft({ dueDate: inputEvent.target.value })}
            aria-label="Fecha de vencimiento"
          />
          <input
            type="date"
            value={draft.reminderDate}
            onChange={(inputEvent) => updateDraft({ reminderDate: inputEvent.target.value })}
            aria-label="Fecha de aviso financiero"
          />
          <select value={draft.owner} onChange={(inputEvent) => updateDraft({ owner: inputEvent.target.value })} aria-label="Responsable del pago">
            <option value="Nomad">Nomad</option>
            <option value="Pareja">Pareja</option>
            <option value="Aritz">Aritz</option>
            <option value="Irene">Irene</option>
            <option value="Soraya">Soraya</option>
          </select>
          <select value={draft.pageId} onChange={(inputEvent) => updateDraft({ pageId: inputEvent.target.value })} aria-label="Pagina Notion destino">
            <option value="">Pagina Notion automatica</option>
            {eventPages.map((page) => (
              <option key={page.id} value={page.id}>{page.icon} {page.title}</option>
            ))}
          </select>
          <button className="primary-button" type="submit">Añadir pago</button>
        </form>

        <div className="finance-summary">
          <span><strong>{currency(pendingTotal)}</strong> pendiente</span>
          <span><strong>{currency(overdueTotal)}</strong> vencido</span>
          <span><strong>{currency(paidTotal)}</strong> pagado</span>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Pago</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th>Aviso</th>
                <th>Responsable</th>
                <th>Importe</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {workspacePayments.map((payment) => {
                const state = paymentState(payment);
                return (
                  <tr key={payment.id} className={focusPaymentId === payment.id ? "finance-row focused" : "finance-row"}>
                    <td>
                      <strong>{payment.title}</strong>
                      {payment.body && <p style={{ margin: "4px 0 0", color: "var(--slate-grey)", fontSize: "12px" }}>{payment.body}</p>}
                    </td>
                    <td><span className={state === "vencido" ? "priority alta" : state === "pagado" ? "priority baja" : "priority media"}>{state}</span></td>
                    <td>{payment.dueDate || "Sin fecha"}</td>
                    <td>{payment.reminderDate || "Sin aviso"}</td>
                    <td>{payment.owner || "Nomad"}</td>
                    <td><strong>{currency(Number(payment.amount || 0))}</strong></td>
                    <td>
                      <div className="finance-actions">
                        <button className="mini-button" type="button" onClick={() => onOpenNotion(payment.pageId, payment.id)} aria-label="Abrir pago en Notion">
                          <FileText size={14} />
                        </button>
                        <button className="mini-button" type="button" onClick={() => togglePayment(payment)} aria-label={payment.status === "pagado" ? "Reabrir pago" : "Marcar pago como pagado"}>
                          {payment.status === "pagado" ? <RotateCcw size={14} /> : <CheckCircle2 size={14} />}
                        </button>
                        <button className="mini-button" type="button" onClick={() => postponeReminder(payment)} aria-label="Posponer aviso una semana">
                          <BellPlus size={14} />
                        </button>
                        <button className="mini-button danger" type="button" onClick={() => deleteWorkspaceBlock(payment.id)} aria-label="Eliminar pago">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {workspacePayments.length === 0 && (
                <tr>
                  <td colSpan={7}>No hay pagos creados en Notion para esta boda.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel full">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Servicios y proveedores</p>
            <h3>Compromisos economicos por proveedor</h3>
          </div>
          <div className="panel-action"><WalletCards size={18} /></div>
        </div>
        <div className="service-grid">
          {serviceSpend.map((service) => {
            const vendor = service.vendorId ? vendors.find((item) => item.id === service.vendorId) : undefined;
            return (
              <div key={service.id} className="service-row">
                <div>
                  <strong>{service.category}</strong>
                  <p>{vendor?.name || "Proveedor pendiente"}</p>
                </div>
                <span className="pill">{service.status}</span>
                <strong>{currency(Number(service.estimatedCost))}</strong>
              </div>
            );
          })}
        </div>
      </section>
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
