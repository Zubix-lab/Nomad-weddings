import { scoreLead } from "./lead-scoring";
import {
  getOfficialBudgetDraft,
  getOfficialEventBrief,
  getOfficialLeadReply,
  getOfficialRunbook,
  getOfficialVendorMatches
} from "./official-agent";
import type { CalendarItem, Lead, LeadPriority, VendorMatch } from "./types";

export { scoreLead };

export async function draftReplyForLead(leadId: string) {
  return getOfficialLeadReply(leadId);
}

export async function matchVendors(eventId: string, category: string): Promise<VendorMatch[]> {
  return (await getOfficialVendorMatches(eventId, category)) ?? [];
}

export async function budgetDraft(eventId: string) {
  return getOfficialBudgetDraft(eventId);
}

export async function eventBrief(eventId: string) {
  return getOfficialEventBrief(eventId);
}

export async function runbook(eventId: string) {
  return getOfficialRunbook(eventId);
}

export function detectCalendarConflicts(items: CalendarItem[] = []) {
  return items.flatMap((item, index) => {
    return items.slice(index + 1).flatMap((other) => {
      const sameOwner = item.owner === other.owner || item.owner === "Nomad" || other.owner === "Nomad";
      const overlaps = new Date(item.startsAt) < new Date(other.endsAt) && new Date(other.startsAt) < new Date(item.endsAt);
      return sameOwner && overlaps
        ? [{ first: item.title, second: other.title, owner: item.owner === "Nomad" ? other.owner : item.owner }]
        : [];
    });
  });
}

export type LeadScore = {
  priority: LeadPriority;
  score: number;
  reasons: string[];
  nextAction: string;
};

export type LeadScoreInput = Pick<Lead, "budget" | "guests" | "eventDate" | "location" | "requestedService">;
