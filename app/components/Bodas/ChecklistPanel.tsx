"use client";

import React, { useState } from "react";
import type { ChecklistItemRecord } from "@/lib/types";
import { checklistTemplate } from "@/lib/checklistTemplate";
import { Plus, Trash, Check, Undo, AlertCircle, Sparkles } from "lucide-react";
import { Modal } from "../UI/Modal";

interface ChecklistPanelProps {
  eventId: string;
  checklistItems: ChecklistItemRecord[];
  onSave: (item: Omit<ChecklistItemRecord, "id"> & { id?: string }) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES = [
  "12-10 meses",
  "9-7 meses",
  "6-4 meses",
  "3-2 meses",
  "1 mes",
  "Semana de la boda",
  "Día B"
];

export function ChecklistPanel({ eventId, checklistItems, onSave, onDelete }: ChecklistPanelProps) {
  const eventTasks = checklistItems.filter((item) => item.eventId === eventId);
  const completedTasks = eventTasks.filter((t) => t.completada);
  
  const completionPercentage = eventTasks.length > 0
    ? Math.round((completedTasks.length / eventTasks.length) * 100)
    : 0;

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [categoria, setCategoria] = useState(CATEGORIES[0]);
  const [prioridad, setPrioridad] = useState<"alta" | "media" | "baja">("media");
  const [responsable, setResponsable] = useState("");
  const [fechaLimite, setFechaLimite] = useState("");
  const [editingItem, setEditingItem] = useState<ChecklistItemRecord | undefined>(undefined);

  const handleInitTemplate = () => {
    // Generate checklist from checklistTemplate
    checklistTemplate.forEach((tmpl) => {
      onSave({
        eventId,
        templateItemId: tmpl.id,
        titulo: tmpl.titulo,
        descripcion: tmpl.descripcion,
        categoria: tmpl.categoria,
        completada: false,
        prioridad: tmpl.prioridad,
        responsable: "Nomad",
        fechaLimite: ""
      });
    });
  };

  const handleToggle = (task: ChecklistItemRecord) => {
    onSave({
      ...task,
      completada: !task.completada
    });
  };

  const openCreateModal = () => {
    setEditingItem(undefined);
    setTitulo("");
    setDescripcion("");
    setCategoria(CATEGORIES[0]);
    setPrioridad("media");
    setResponsable("Nomad");
    setFechaLimite("");
    setIsFormOpen(true);
  };

  const openEditModal = (task: ChecklistItemRecord) => {
    setEditingItem(task);
    setTitulo(task.titulo);
    setDescripcion(task.descripcion || "");
    setCategoria(task.categoria);
    setPrioridad(task.prioridad);
    setResponsable(task.responsable || "");
    setFechaLimite(task.fechaLimite || "");
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: editingItem?.id,
      eventId,
      templateItemId: editingItem?.templateItemId,
      titulo,
      descripcion,
      categoria,
      completada: editingItem?.completada || false,
      prioridad,
      responsable,
      fechaLimite: fechaLimite || undefined
    });
    setIsFormOpen(false);
  };

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Progress Bar & Setup */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "between",
          alignItems: "center",
          gap: "16px",
          background: "var(--surface-low)",
          padding: "16px",
          borderRadius: "8px",
          border: "1px solid var(--line)"
        }}
      >
        <div style={{ flex: 1, minWidth: "200px" }}>
          <div style={{ display: "flex", justifyContent: "between", fontSize: "14px", fontWeight: "bold", color: "var(--primary)", marginBottom: "6px" }}>
            <span>Progreso del Checklist</span>
            <span style={{ marginLeft: "auto" }}>{completionPercentage}% ({completedTasks.length} de {eventTasks.length})</span>
          </div>
          <div style={{ height: "8px", background: "var(--surface-container)", borderRadius: "999px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                background: "var(--primary)",
                width: `${completionPercentage}%`,
                transition: "width 0.3s ease"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
          {eventTasks.length === 0 && (
            <button
              className="secondary-button"
              onClick={handleInitTemplate}
              style={{ display: "inline-flex", gap: "6px", alignItems: "center", background: "var(--primary-soft)", color: "var(--primary)", borderColor: "var(--outline-variant)" }}
            >
              <Sparkles size={16} /> Cargar Plantilla Base (~35 tareas)
            </button>
          )}
          <button
            className="primary-button"
            onClick={openCreateModal}
            style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}
          >
            <Plus size={16} /> Nueva Tarea
          </button>
        </div>
      </div>

      {eventTasks.length === 0 ? (
        <div className="empty-state" style={{ minHeight: "220px" }}>
          <div style={{ display: "grid", gap: "10px", placeItems: "center", maxWidth: "400px" }}>
            <AlertCircle size={32} style={{ color: "var(--slate-grey)" }} />
            <h3>Lista de tareas vacía</h3>
            <p style={{ margin: 0, fontSize: "13px" }}>
              Carga la plantilla de planificación recomendada por Nomad Weddings (12 meses de planificación) o crea tareas personalizadas para esta boda.
            </p>
            <button className="primary-button" onClick={handleInitTemplate} style={{ marginTop: "10px" }}>
              Cargar Plantilla Base
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {CATEGORIES.map((cat) => {
            const catTasks = eventTasks.filter((t) => t.categoria === cat);
            if (catTasks.length === 0) return null;

            return (
              <div key={cat} style={{ background: "var(--pure-white)", border: "1px solid var(--line)", borderRadius: "8px", padding: "16px" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "15px", fontFamily: '"Source Serif 4", Georgia, serif', color: "var(--primary)", borderBottom: "1px solid var(--surface-low)", paddingBottom: "6px" }}>
                  {cat}
                </h4>

                <div style={{ display: "grid", gap: "8px" }}>
                  {catTasks.map((task) => (
                    <div
                      key={task.id}
                      style={{
                        display: "flex",
                        alignItems: "start",
                        gap: "12px",
                        padding: "10px",
                        background: task.completada ? "var(--surface-low)" : "transparent",
                        border: "1px solid var(--surface-container)",
                        borderRadius: "6px",
                        transition: "all 0.2s"
                      }}
                    >
                      {/* Checkbox */}
                      <button
                        onClick={() => handleToggle(task)}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "4px",
                          border: `2px solid ${task.completada ? "var(--primary)" : "var(--outline)"}`,
                          background: task.completada ? "var(--primary)" : "transparent",
                          color: "white",
                          display: "grid",
                          placeItems: "center",
                          cursor: "pointer",
                          padding: 0,
                          flexShrink: 0,
                          marginTop: "2px"
                        }}
                        aria-label={task.completada ? "Marcar como pendiente" : "Marcar como completada"}
                      >
                        {task.completada && <Check size={14} />}
                      </button>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }} onClick={() => openEditModal(task)}>
                        <strong
                          style={{
                            fontSize: "14px",
                            color: task.completada ? "var(--slate-grey)" : "var(--ink)",
                            textDecoration: task.completada ? "line-through" : "none",
                            cursor: "pointer"
                          }}
                        >
                          {task.titulo}
                        </strong>
                        {task.descripcion && (
                          <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "var(--slate-grey)", lineHeight: "1.4" }}>
                            {task.descripcion}
                          </p>
                        )}
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "6px" }}>
                          <span
                            className={`priority ${task.prioridad}`}
                            style={{
                              fontSize: "9px",
                              padding: "1px 5px",
                              minHeight: "auto",
                              background: task.prioridad === "alta" ? "var(--error-soft)" : "var(--surface-low)",
                              color: task.prioridad === "alta" ? "var(--error)" : "var(--slate-grey)"
                            }}
                          >
                            {task.prioridad.toUpperCase()}
                          </span>
                          {task.responsable && (
                            <span style={{ fontSize: "10px", color: "var(--slate-grey)" }}>
                              Resp: <strong>{task.responsable}</strong>
                            </span>
                          )}
                          {task.fechaLimite && (
                            <span style={{ fontSize: "10px", color: "var(--slate-grey)" }}>
                              Límite: <strong>{new Date(task.fechaLimite).toLocaleDateString("es-ES")}</strong>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <button
                        className="mini-button"
                        style={{
                          border: 0,
                          background: "transparent",
                          color: "var(--error)",
                          opacity: 0.7,
                          padding: "4px",
                          marginLeft: "auto"
                        }}
                        onClick={() => onDelete(task.id)}
                        title="Eliminar tarea"
                      >
                        <Trash size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title={editingItem ? "Editar Tarea" : "Nueva Tarea"}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Título de la tarea *
            <input value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ej. Contratar floristería..." />
          </label>

          <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
            Descripción o detalles
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Introduce detalles sobre los requisitos o especificaciones de la tarea..."
              style={{ minHeight: "60px", padding: "8px", borderRadius: "8px", border: "1px solid var(--line)", fontFamily: "inherit" }}
            />
          </label>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Fase / Plazo de tiempo *
              <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Prioridad
              <select value={prioridad} onChange={(e) => setPrioridad(e.target.value as "alta" | "media" | "baja")}>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
              </select>
            </label>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Responsable
              <input value={responsable} onChange={(e) => setResponsable(e.target.value)} placeholder="Ej. Nomad, Novia, Novio" />
            </label>
            <label style={{ display: "grid", gap: "6px", color: "var(--muted)", fontSize: "13px", fontWeight: "700" }}>
              Fecha límite
              <input type="date" value={fechaLimite} onChange={(e) => setFechaLimite(e.target.value)} />
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
            <button className="secondary-button" type="button" onClick={() => setIsFormOpen(false)}>Cancelar</button>
            <button className="primary-button" type="submit">Guardar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
