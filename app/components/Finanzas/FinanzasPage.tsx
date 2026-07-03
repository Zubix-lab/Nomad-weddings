"use client";

import React, { useMemo } from "react";
import { AlertTriangle, CheckCircle2, CreditCard, WalletCards } from "lucide-react";
import { useApp } from "@/context/AppContext";
import type { Event, WorkspaceBlock } from "@/lib/types";

function currency(value: number): string {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value);
}

function paymentState(payment: WorkspaceBlock): "vencido" | "pagado" | "pendiente" {
  if (payment.status === "pagado") return "pagado";
  if (payment.dueDate && new Date(`${payment.dueDate}T00:00:00`) < new Date("2026-07-03T00:00:00")) return "vencido";
  return "pendiente";
}

export function FinanzasPage({ activeEventId, events }: { activeEventId: string; events: Event[] }) {
  const { workspaceBlocks, eventServices, vendors } = useApp();
  const event = events.find((item) => item.id === activeEventId) || events[0];
  const eventId = event?.id || "";

  const workspacePayments = useMemo(
    () => workspaceBlocks.filter((block) => block.eventId === eventId && block.type === "payment"),
    [workspaceBlocks, eventId]
  );

  const serviceSpend = eventServices.filter((service) => service.eventId === eventId);
  const contractedSpend = serviceSpend.reduce((sum, service) => sum + Number(service.estimatedCost), 0);
  const workspacePaymentTotal = workspacePayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const pendingPayments = workspacePayments.filter((payment) => paymentState(payment) === "pendiente");
  const overduePayments = workspacePayments.filter((payment) => paymentState(payment) === "vencido");
  const paidPayments = workspacePayments.filter((payment) => paymentState(payment) === "pagado");

  return (
    <div style={{ display: "grid", gap: "18px" }}>
      <section className="screen-grid">
        <Metric label="Presupuesto boda" value={currency(event?.totalBudget || 0)} detail={event?.name || "Sin boda activa"} icon={<WalletCards size={18} />} />
        <Metric label="Servicios estimados" value={currency(contractedSpend)} detail={`${serviceSpend.length} partidas vinculadas`} icon={<CreditCard size={18} />} />
        <Metric label="Pagos workspace" value={currency(workspacePaymentTotal)} detail={`${paidPayments.length} pagados · ${workspacePayments.length} creados en Notion`} icon={<CheckCircle2 size={18} />} />
        <Metric label="Alertas pago" value={overduePayments.length} detail={`${pendingPayments.length} próximos pagos`} icon={<AlertTriangle size={18} />} />
      </section>

      <section className="panel full">
        <div className="panel-header">
          <div>
            <p className="eyebrow">Finanzas conectadas</p>
            <h3>Pagos creados desde Notion</h3>
          </div>
          <div className="panel-action"><CreditCard size={18} /></div>
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
              </tr>
            </thead>
            <tbody>
              {workspacePayments.map((payment) => {
                const state = paymentState(payment);
                return (
                  <tr key={payment.id}>
                    <td>
                      <strong>{payment.title}</strong>
                      {payment.body && <p style={{ margin: "4px 0 0", color: "var(--slate-grey)", fontSize: "12px" }}>{payment.body}</p>}
                    </td>
                    <td><span className={state === "vencido" ? "priority alta" : state === "pagado" ? "priority baja" : "priority media"}>{state}</span></td>
                    <td>{payment.dueDate || "Sin fecha"}</td>
                    <td>{payment.reminderDate || "Sin aviso"}</td>
                    <td>{payment.owner || "Nomad"}</td>
                    <td><strong>{currency(Number(payment.amount || 0))}</strong></td>
                  </tr>
                );
              })}
              {workspacePayments.length === 0 && (
                <tr>
                  <td colSpan={6}>No hay pagos creados en Notion para esta boda.</td>
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
            <h3>Compromisos económicos por proveedor</h3>
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
