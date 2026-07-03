"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, type ReactNode } from "react";
import type {
  Lead, Client, Event, Vendor, VendorPrice, EventService,
  Task, CalendarItem, DocumentRecord, Communication,
  ParejaProfile, Reunion, ChecklistItemRecord, EmailRecord,
  WorkspacePage, WorkspaceBlock, NotificationRecord
} from "@/lib/types";
import {
  leads as seedLeads,
  clients as seedClients,
  events as seedEvents,
  vendors as seedVendors,
  vendorPrices as seedVendorPrices,
  eventServices as seedEventServices,
  tasks as seedTasks,
  calendarItems as seedCalendarItems,
  documents as seedDocuments,
  communications as seedCommunications,
  parejaProfiles as seedParejaProfiles,
  reuniones as seedReuniones,
  checklistItems as seedChecklistItems,
  emailRecords as seedEmailRecords,
  workspacePages as seedWorkspacePages,
  workspaceBlocks as seedWorkspaceBlocks,
  notificationRecords as seedNotificationRecords
} from "@/lib/seed";

// --------------- helpers ---------------
function generateId(): string {
  return "item-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
}

function load<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* quota exceeded — silently fail */ }
}

function mergeSeedRecords<T extends { id: string }>(key: string, stored: T[], seed: T[]): T[] {
  const storedIds = new Set(stored.map((item) => item.id));
  const missingSeed = seed.filter((item) => !storedIds.has(item.id));
  if (missingSeed.length === 0) return stored;
  const next = [...stored, ...missingSeed];
  save(key, next);
  return next;
}

function mergeSeedVendorImages(storedVendors: Vendor[]): Vendor[] {
  const seedById = new Map(seedVendors.map((vendor) => [vendor.id, vendor]));
  let changed = false;

  const next = storedVendors.map((vendor) => {
    const seedVendor = seedById.get(vendor.id);
    if (!seedVendor?.images?.length) return vendor;

    const currentImages = vendor.images || [];
    const mergedImages = [...seedVendor.images, ...currentImages].filter((url, index, all) => all.indexOf(url) === index);
    const sameImages = mergedImages.length === currentImages.length && mergedImages.every((url, index) => url === currentImages[index]);

    if (sameImages) return vendor;
    changed = true;
    return { ...vendor, images: mergedImages };
  });

  if (changed) save(STORAGE_KEYS.vendors, next);
  return next;
}

// --------------- state ---------------
interface AppState {
  leads: Lead[];
  clients: Client[];
  events: Event[];
  vendors: Vendor[];
  vendorPrices: VendorPrice[];
  eventServices: EventService[];
  tasks: Task[];
  calendarItems: CalendarItem[];
  documents: DocumentRecord[];
  communications: Communication[];
  parejaProfiles: ParejaProfile[];
  reuniones: Reunion[];
  checklistItems: ChecklistItemRecord[];
  emailRecords: EmailRecord[];
  workspacePages: WorkspacePage[];
  workspaceBlocks: WorkspaceBlock[];
  notificationRecords: NotificationRecord[];
  initialized: boolean;
}

type CollectionKey = keyof Omit<AppState, "initialized">;

type Action =
  | { type: "INIT"; state: Omit<AppState, "initialized"> }
  | { type: "ADD"; collection: CollectionKey; item: Record<string, unknown> }
  | { type: "UPDATE"; collection: CollectionKey; item: Record<string, unknown> }
  | { type: "DELETE"; collection: CollectionKey; id: string };

type IdentifiableRecord = Record<string, unknown> & { id: string };

const STORAGE_PREFIX = "nomad_";

const STORAGE_KEYS: Record<CollectionKey, string> = {
  leads: STORAGE_PREFIX + "leads",
  clients: STORAGE_PREFIX + "clients",
  events: STORAGE_PREFIX + "events",
  vendors: STORAGE_PREFIX + "vendors",
  vendorPrices: STORAGE_PREFIX + "vendorPrices",
  eventServices: STORAGE_PREFIX + "eventServices",
  tasks: STORAGE_PREFIX + "tasks",
  calendarItems: STORAGE_PREFIX + "calendarItems",
  documents: STORAGE_PREFIX + "documents",
  communications: STORAGE_PREFIX + "communications",
  parejaProfiles: STORAGE_PREFIX + "parejaProfiles",
  reuniones: STORAGE_PREFIX + "reuniones",
  checklistItems: STORAGE_PREFIX + "checklistItems",
  emailRecords: STORAGE_PREFIX + "emailRecords",
  workspacePages: STORAGE_PREFIX + "workspacePages",
  workspaceBlocks: STORAGE_PREFIX + "workspaceBlocks",
  notificationRecords: STORAGE_PREFIX + "notificationRecords",
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "INIT":
      return { ...action.state, initialized: true };

    case "ADD": {
      const current = state[action.collection] as unknown as IdentifiableRecord[];
      const incomingId = (action.item as { id?: string }).id;
      const existingIndex = incomingId ? current.findIndex((item) => item.id === incomingId) : -1;
      const next =
        existingIndex >= 0
          ? current.map((item, index) => (index === existingIndex ? action.item : item))
          : [...current, action.item];
      save(STORAGE_KEYS[action.collection], next);
      return { ...state, [action.collection]: next };
    }

    case "UPDATE": {
      const current = state[action.collection] as unknown as IdentifiableRecord[];
      const next = current.map((i) => (i.id === (action.item as { id: string }).id ? action.item : i));
      save(STORAGE_KEYS[action.collection], next);
      return { ...state, [action.collection]: next };
    }

    case "DELETE": {
      const current = state[action.collection] as unknown as IdentifiableRecord[];
      const next = current.filter((i) => i.id !== action.id);
      save(STORAGE_KEYS[action.collection], next);
      return { ...state, [action.collection]: next };
    }

    default:
      return state;
  }
}

// --------------- context value ---------------
interface AppContextValue extends AppState {
  // Vendors
  addVendor: (v: Omit<Vendor, "id"> & { id?: string }) => string;
  updateVendor: (v: Vendor) => void;
  deleteVendor: (id: string) => void;
  // VendorPrices
  addVendorPrice: (p: Omit<VendorPrice, "id"> & { id?: string }) => string;
  updateVendorPrice: (p: VendorPrice) => void;
  // Leads
  addLead: (l: Omit<Lead, "id"> & { id?: string }) => string;
  updateLead: (l: Lead) => void;
  deleteLead: (id: string) => void;
  // Clients
  addClient: (c: Omit<Client, "id"> & { id?: string }) => string;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  // Events
  addEvent: (e: Omit<Event, "id"> & { id?: string }) => string;
  updateEvent: (e: Event) => void;
  deleteEvent: (id: string) => void;
  // EventServices
  addEventService: (s: Omit<EventService, "id"> & { id?: string }) => string;
  updateEventService: (s: EventService) => void;
  deleteEventService: (id: string) => void;
  // Tasks
  addTask: (t: Omit<Task, "id"> & { id?: string }) => string;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  // CalendarItems
  addCalendarItem: (c: Omit<CalendarItem, "id"> & { id?: string }) => string;
  // Documents
  addDocument: (d: Omit<DocumentRecord, "id"> & { id?: string }) => string;
  // Communications
  addCommunication: (c: Omit<Communication, "id"> & { id?: string }) => string;
  // ParejaProfiles
  addParejaProfile: (p: Omit<ParejaProfile, "id"> & { id?: string }) => string;
  updateParejaProfile: (p: ParejaProfile) => void;
  deleteParejaProfile: (id: string) => void;
  // Reuniones
  addReunion: (r: Omit<Reunion, "id"> & { id?: string }) => string;
  updateReunion: (r: Reunion) => void;
  deleteReunion: (id: string) => void;
  // ChecklistItems
  addChecklistItem: (i: Omit<ChecklistItemRecord, "id"> & { id?: string }) => string;
  updateChecklistItem: (i: ChecklistItemRecord) => void;
  deleteChecklistItem: (id: string) => void;
  // EmailRecords
  addEmailRecord: (e: Omit<EmailRecord, "id"> & { id?: string }) => string;
  // Workspace
  addWorkspacePage: (p: Omit<WorkspacePage, "id"> & { id?: string }) => string;
  updateWorkspacePage: (p: WorkspacePage) => void;
  deleteWorkspacePage: (id: string) => void;
  addWorkspaceBlock: (b: Omit<WorkspaceBlock, "id"> & { id?: string }) => string;
  updateWorkspaceBlock: (b: WorkspaceBlock) => void;
  deleteWorkspaceBlock: (id: string) => void;
  // Notifications
  addNotificationRecord: (n: Omit<NotificationRecord, "id"> & { id?: string }) => string;
  updateNotificationRecord: (n: NotificationRecord) => void;
  deleteNotificationRecord: (id: string) => void;
  // Utility
  generateId: () => string;
  resetToSeed: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const EMPTY_STATE: AppState = {
  leads: [],
  clients: [],
  events: [],
  vendors: [],
  vendorPrices: [],
  eventServices: [],
  tasks: [],
  calendarItems: [],
  documents: [],
  communications: [],
  parejaProfiles: [],
  reuniones: [],
  checklistItems: [],
  emailRecords: [],
  workspacePages: [],
  workspaceBlocks: [],
  notificationRecords: [],
  initialized: false,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);

  // Initialize from localStorage or seed data
  useEffect(() => {
    dispatch({
      type: "INIT",
      state: {
        leads: load<Lead>(STORAGE_KEYS.leads, seedLeads),
        clients: load<Client>(STORAGE_KEYS.clients, seedClients),
        events: load<Event>(STORAGE_KEYS.events, seedEvents),
        vendors: mergeSeedVendorImages(load<Vendor>(STORAGE_KEYS.vendors, seedVendors)),
        vendorPrices: load<VendorPrice>(STORAGE_KEYS.vendorPrices, seedVendorPrices),
        eventServices: load<EventService>(STORAGE_KEYS.eventServices, seedEventServices),
        tasks: load<Task>(STORAGE_KEYS.tasks, seedTasks),
        calendarItems: load<CalendarItem>(STORAGE_KEYS.calendarItems, seedCalendarItems),
        documents: load<DocumentRecord>(STORAGE_KEYS.documents, seedDocuments),
        communications: load<Communication>(STORAGE_KEYS.communications, seedCommunications),
        parejaProfiles: load<ParejaProfile>(STORAGE_KEYS.parejaProfiles, seedParejaProfiles),
        reuniones: load<Reunion>(STORAGE_KEYS.reuniones, seedReuniones),
        checklistItems: load<ChecklistItemRecord>(STORAGE_KEYS.checklistItems, seedChecklistItems),
        emailRecords: load<EmailRecord>(STORAGE_KEYS.emailRecords, seedEmailRecords),
        workspacePages: mergeSeedRecords(STORAGE_KEYS.workspacePages, load<WorkspacePage>(STORAGE_KEYS.workspacePages, seedWorkspacePages), seedWorkspacePages),
        workspaceBlocks: mergeSeedRecords(STORAGE_KEYS.workspaceBlocks, load<WorkspaceBlock>(STORAGE_KEYS.workspaceBlocks, seedWorkspaceBlocks), seedWorkspaceBlocks),
        notificationRecords: load<NotificationRecord>(STORAGE_KEYS.notificationRecords, seedNotificationRecords),
      },
    });
  }, []);

  // Generic CRUD factory
  const add = useCallback(
    <T extends { id?: string }>(collection: CollectionKey, item: T): string => {
      const id = item.id || generateId();
      const withId = { ...item, id } as unknown as Record<string, unknown>;
      dispatch({ type: "ADD", collection, item: withId });
      return id;
    },
    []
  );

  const update = useCallback(
    (collection: CollectionKey, item: Record<string, unknown>) => {
      dispatch({ type: "UPDATE", collection, item });
    },
    []
  );

  const remove = useCallback(
    (collection: CollectionKey, id: string) => {
      dispatch({ type: "DELETE", collection, id });
    },
    []
  );

  const value: AppContextValue = {
    ...state,
    // Vendors
    addVendor: (v) => add("vendors", v),
    updateVendor: (v) => update("vendors", v as unknown as Record<string, unknown>),
    deleteVendor: (id) => remove("vendors", id),
    // VendorPrices
    addVendorPrice: (p) => add("vendorPrices", p),
    updateVendorPrice: (p) => update("vendorPrices", p as unknown as Record<string, unknown>),
    // Leads
    addLead: (l) => add("leads", l),
    updateLead: (l) => update("leads", l as unknown as Record<string, unknown>),
    deleteLead: (id) => remove("leads", id),
    // Clients
    addClient: (c) => add("clients", c),
    updateClient: (c) => update("clients", c as unknown as Record<string, unknown>),
    deleteClient: (id) => remove("clients", id),
    // Events
    addEvent: (e) => add("events", e),
    updateEvent: (e) => update("events", e as unknown as Record<string, unknown>),
    deleteEvent: (id) => remove("events", id),
    // EventServices
    addEventService: (s) => add("eventServices", s),
    updateEventService: (s) => update("eventServices", s as unknown as Record<string, unknown>),
    deleteEventService: (id) => remove("eventServices", id),
    // Tasks
    addTask: (t) => add("tasks", t),
    updateTask: (t) => update("tasks", t as unknown as Record<string, unknown>),
    deleteTask: (id) => remove("tasks", id),
    // Calendar
    addCalendarItem: (c) => add("calendarItems", c),
    // Documents
    addDocument: (d) => add("documents", d),
    // Communications
    addCommunication: (c) => add("communications", c),
    // ParejaProfiles
    addParejaProfile: (p) => add("parejaProfiles", p),
    updateParejaProfile: (p) => update("parejaProfiles", p as unknown as Record<string, unknown>),
    deleteParejaProfile: (id) => remove("parejaProfiles", id),
    // Reuniones
    addReunion: (r) => add("reuniones", r),
    updateReunion: (r) => update("reuniones", r as unknown as Record<string, unknown>),
    deleteReunion: (id) => remove("reuniones", id),
    // ChecklistItems
    addChecklistItem: (i) => add("checklistItems", i),
    updateChecklistItem: (i) => update("checklistItems", i as unknown as Record<string, unknown>),
    deleteChecklistItem: (id) => remove("checklistItems", id),
    // EmailRecords
    addEmailRecord: (e) => add("emailRecords", e),
    // Workspace
    addWorkspacePage: (p) => add("workspacePages", p),
    updateWorkspacePage: (p) => update("workspacePages", p as unknown as Record<string, unknown>),
    deleteWorkspacePage: (id) => remove("workspacePages", id),
    addWorkspaceBlock: (b) => add("workspaceBlocks", b),
    updateWorkspaceBlock: (b) => update("workspaceBlocks", b as unknown as Record<string, unknown>),
    deleteWorkspaceBlock: (id) => remove("workspaceBlocks", id),
    // Notifications
    addNotificationRecord: (n) => add("notificationRecords", n),
    updateNotificationRecord: (n) => update("notificationRecords", n as unknown as Record<string, unknown>),
    deleteNotificationRecord: (id) => remove("notificationRecords", id),
    // Utility
    generateId,
    resetToSeed: () => {
      if (typeof window !== "undefined") {
        Object.values(STORAGE_KEYS).forEach((key) => {
          localStorage.removeItem(key);
        });
        window.location.reload();
      }
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
