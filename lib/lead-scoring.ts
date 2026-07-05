import type { Lead, LeadPriority } from "@/lib/types";

const SOON_DAYS = 120;

export function scoreLead(input: Pick<Lead, "budget" | "guests" | "eventDate" | "location" | "requestedService">): {
  priority: LeadPriority;
  score: number;
  reasons: string[];
  nextAction: string;
} {
  const reasons: string[] = [];
  let score = 0;
  const daysToEvent = daysUntil(input.eventDate);

  if (/pais vasco|gipuzkoa|guipuzcoa|alava|bizkaia|canarias|las palmas|gran canaria/i.test(input.location)) {
    score += 25;
    reasons.push("Zona alineada con la operativa principal.");
  }
  if (input.budget >= 30000) {
    score += 25;
    reasons.push("Presupuesto suficiente para organizacion integral con margen de maniobra.");
  } else if (input.budget >= 18000) {
    score += 15;
    reasons.push("Presupuesto viable con alcance acotado.");
  }
  if (/integral|organizacion|proveedores/i.test(input.requestedService)) {
    score += 25;
    reasons.push("Servicio de alto valor y mayor ahorro operativo para Nomad.");
  } else if (/coordinacion|dia b/i.test(input.requestedService)) {
    score += 15;
    reasons.push("Encaja con coordinacion, pero con menor profundidad comercial.");
  }
  if (input.guests >= 80 && input.guests <= 180) {
    score += 15;
    reasons.push("Tamano de boda dentro del rango operativo mas comodo.");
  } else if (input.guests > 200) {
    score += 5;
    reasons.push("Evento grande: requiere revisar complejidad logistica.");
  }
  if (daysToEvent <= SOON_DAYS) {
    score += 10;
    reasons.push("Fecha cercana: conviene responder y filtrar rapido.");
  }

  const priority: LeadPriority = score >= 70 ? "alta" : score >= 45 ? "media" : "baja";
  const nextAction =
    priority === "alta"
      ? "Preparar respuesta personalizada y proponer reunion esta semana."
      : priority === "media"
        ? "Enviar email de encaje y pedir dos datos clave antes de presupuestar."
        : "Responder con disponibilidad limitada y validar presupuesto/alcance.";

  return { priority, score, reasons, nextAction };
}

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - startOfDay(new Date()).getTime()) / 86_400_000);
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
