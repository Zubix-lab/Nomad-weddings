"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type {
  CalendarItem,
  ChecklistItemRecord,
  Client,
  Communication,
  CompanyFinanceRecord,
  DocumentRecord,
  EmailRecord,
  Event,
  EventService,
  Lead,
  NotificationRecord,
  ParejaProfile,
  Reunion,
  Task,
  Vendor,
  VendorPrice,
  WorkspaceBlock,
  WorkspacePage
} from "@/lib/types";
import { getFirebaseClients } from "@/lib/firebase";
import {
  clearFirestoreCollections,
  EMPTY_COLLECTIONS,
  FIRESTORE_COLLECTIONS,
  importCollectionsToFirestore,
  subscribeToFirestoreCollections,
  upsertFirestoreRecord,
  deleteFirestoreRecord,
  uploadVendorImage,
  type AppCollectionKey,
  type AppCollections
} from "@/lib/firestore-store";
import { officialVendorPriceSeed, officialVendorSeed } from "@/lib/vendor-seed";

type PersistenceMode = "firestore" | "local";
type PersistenceStatus = "connecting" | "ready" | "error";

interface AppState extends AppCollections {
  initialized: boolean;
  persistenceMode: PersistenceMode;
  persistenceStatus: PersistenceStatus;
  persistenceError: string;
}

type CollectionKey = AppCollectionKey;
type IdentifiableRecord = Record<string, unknown> & { id: string };

export interface BackupPayload {
  app: "nomad-weddings";
  version: 1;
  exportedAt: string;
  collections: AppCollections;
}

export interface ImportBackupResult {
  importedCollections: number;
  importedRecords: number;
}

export interface SeedVendorsResult {
  vendorsAdded: number;
  pricesAdded: number;
}

type Action =
  | { type: "INIT"; state: AppCollections; mode: PersistenceMode; status: PersistenceStatus; error?: string }
  | { type: "SYNC_COLLECTION"; collection: CollectionKey; records: IdentifiableRecord[] }
  | { type: "ADD"; collection: CollectionKey; item: IdentifiableRecord }
  | { type: "UPDATE"; collection: CollectionKey; item: IdentifiableRecord }
  | { type: "DELETE"; collection: CollectionKey; id: string }
  | { type: "SET_STATUS"; status: PersistenceStatus; error?: string }
  | { type: "REPLACE_ALL"; state: AppCollections }
  | { type: "CLEAR_ALL" };

const STORAGE_PREFIX = "nomad_official_";
const STORAGE_KEYS: Record<CollectionKey, string> = FIRESTORE_COLLECTIONS.reduce((acc, key) => {
  acc[key] = `${STORAGE_PREFIX}${key}`;
  return acc;
}, {} as Record<CollectionKey, string>);

const EMPTY_STATE: AppState = {
  ...EMPTY_COLLECTIONS,
  initialized: false,
  persistenceMode: "local",
  persistenceStatus: "connecting",
  persistenceError: ""
};

function generateId(): string {
  return "item-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
}

function loadLocalCollection<K extends CollectionKey>(key: K): AppCollections[K] {
  if (typeof window === "undefined") return [] as AppCollections[K];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    if (!raw) return [] as AppCollections[K];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ([] as AppCollections[K]);
  } catch {
    return [] as AppCollections[K];
  }
}

function loadLocalCollections(): AppCollections {
  return FIRESTORE_COLLECTIONS.reduce((acc, key) => {
    acc[key] = loadLocalCollection(key) as never;
    return acc;
  }, { ...EMPTY_COLLECTIONS });
}

function saveLocalCollection(collectionKey: CollectionKey, data: unknown[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEYS[collectionKey], JSON.stringify(data));
  } catch {
    // Local persistence is a fallback; Firestore remains the source of truth when configured.
  }
}

function saveLocalCollections(collections: AppCollections): void {
  FIRESTORE_COLLECTIONS.forEach((collectionKey) => {
    saveLocalCollection(collectionKey, collections[collectionKey] as unknown[]);
  });
}

function clearLocalCollections(): void {
  if (typeof window === "undefined") return;
  FIRESTORE_COLLECTIONS.forEach((collectionKey) => localStorage.removeItem(STORAGE_KEYS[collectionKey]));
}

function parseBackupPayload(payload: unknown): AppCollections {
  if (!payload || typeof payload !== "object") {
    throw new Error("El archivo no es un backup valido.");
  }

  const candidate = payload as Partial<BackupPayload>;
  if (candidate.app !== "nomad-weddings" || candidate.version !== 1 || !candidate.collections || typeof candidate.collections !== "object") {
    throw new Error("El backup no pertenece a Nomad Weddings o usa una version no compatible.");
  }

  const collections = candidate.collections as Partial<Record<CollectionKey, unknown>>;
  return FIRESTORE_COLLECTIONS.reduce((acc, collectionKey) => {
    const value = collections[collectionKey];
    acc[collectionKey] = (Array.isArray(value) ? value : []) as never;
    return acc;
  }, { ...EMPTY_COLLECTIONS });
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "INIT":
      return {
        ...state,
        ...action.state,
        initialized: true,
        persistenceMode: action.mode,
        persistenceStatus: action.status,
        persistenceError: action.error || ""
      };

    case "SYNC_COLLECTION":
      saveLocalCollection(action.collection, action.records);
      return {
        ...state,
        [action.collection]: action.records,
        initialized: true,
        persistenceStatus: "ready",
        persistenceError: ""
      };

    case "ADD": {
      const current = state[action.collection] as unknown as IdentifiableRecord[];
      const index = current.findIndex((item) => item.id === action.item.id);
      const next = index >= 0 ? current.map((item) => (item.id === action.item.id ? action.item : item)) : [...current, action.item];
      saveLocalCollection(action.collection, next);
      return { ...state, [action.collection]: next };
    }

    case "UPDATE": {
      const current = state[action.collection] as unknown as IdentifiableRecord[];
      const next = current.map((item) => (item.id === action.item.id ? action.item : item));
      saveLocalCollection(action.collection, next);
      return { ...state, [action.collection]: next };
    }

    case "DELETE": {
      const current = state[action.collection] as unknown as IdentifiableRecord[];
      const next = current.filter((item) => item.id !== action.id);
      saveLocalCollection(action.collection, next);
      return { ...state, [action.collection]: next };
    }

    case "SET_STATUS":
      return { ...state, persistenceStatus: action.status, persistenceError: action.error || "" };

    case "REPLACE_ALL":
      saveLocalCollections(action.state);
      return { ...state, ...action.state, initialized: true, persistenceStatus: "ready", persistenceError: "" };

    case "CLEAR_ALL":
      clearLocalCollections();
      return { ...state, ...EMPTY_COLLECTIONS, initialized: true, persistenceStatus: "ready", persistenceError: "" };

    default:
      return state;
  }
}

interface AppContextValue extends AppState {
  addVendor: (v: Omit<Vendor, "id"> & { id?: string }) => string;
  updateVendor: (v: Vendor) => void;
  deleteVendor: (id: string) => void;
  uploadVendorImages: (vendorId: string, files: File[]) => Promise<string[]>;
  addVendorPrice: (p: Omit<VendorPrice, "id"> & { id?: string }) => string;
  updateVendorPrice: (p: VendorPrice) => void;
  addLead: (l: Omit<Lead, "id"> & { id?: string }) => string;
  updateLead: (l: Lead) => void;
  deleteLead: (id: string) => void;
  addClient: (c: Omit<Client, "id"> & { id?: string }) => string;
  updateClient: (c: Client) => void;
  deleteClient: (id: string) => void;
  addEvent: (e: Omit<Event, "id"> & { id?: string }) => string;
  updateEvent: (e: Event) => void;
  deleteEvent: (id: string) => void;
  addEventService: (s: Omit<EventService, "id"> & { id?: string }) => string;
  updateEventService: (s: EventService) => void;
  deleteEventService: (id: string) => void;
  addTask: (t: Omit<Task, "id"> & { id?: string }) => string;
  updateTask: (t: Task) => void;
  deleteTask: (id: string) => void;
  addCalendarItem: (c: Omit<CalendarItem, "id"> & { id?: string }) => string;
  addDocument: (d: Omit<DocumentRecord, "id"> & { id?: string }) => string;
  addCommunication: (c: Omit<Communication, "id"> & { id?: string }) => string;
  addParejaProfile: (p: Omit<ParejaProfile, "id"> & { id?: string }) => string;
  updateParejaProfile: (p: ParejaProfile) => void;
  deleteParejaProfile: (id: string) => void;
  addReunion: (r: Omit<Reunion, "id"> & { id?: string }) => string;
  updateReunion: (r: Reunion) => void;
  deleteReunion: (id: string) => void;
  addChecklistItem: (i: Omit<ChecklistItemRecord, "id"> & { id?: string }) => string;
  updateChecklistItem: (i: ChecklistItemRecord) => void;
  deleteChecklistItem: (id: string) => void;
  addEmailRecord: (e: Omit<EmailRecord, "id"> & { id?: string }) => string;
  addWorkspacePage: (p: Omit<WorkspacePage, "id"> & { id?: string }) => string;
  updateWorkspacePage: (p: WorkspacePage) => void;
  deleteWorkspacePage: (id: string) => void;
  addWorkspaceBlock: (b: Omit<WorkspaceBlock, "id"> & { id?: string }) => string;
  updateWorkspaceBlock: (b: WorkspaceBlock) => void;
  deleteWorkspaceBlock: (id: string) => void;
  addNotificationRecord: (n: Omit<NotificationRecord, "id"> & { id?: string }) => string;
  updateNotificationRecord: (n: NotificationRecord) => void;
  deleteNotificationRecord: (id: string) => void;
  addCompanyFinanceRecord: (r: Omit<CompanyFinanceRecord, "id"> & { id?: string }) => string;
  updateCompanyFinanceRecord: (r: CompanyFinanceRecord) => void;
  deleteCompanyFinanceRecord: (id: string) => void;
  generateId: () => string;
  resetToSeed: () => void;
  seedOfficialVendors: () => SeedVendorsResult;
  exportBackup: () => BackupPayload;
  importBackup: (payload: unknown) => ImportBackupResult;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, EMPTY_STATE);
  const firebaseClients = useMemo(() => getFirebaseClients(), []);

  useEffect(() => {
    if (!firebaseClients) {
      dispatch({ type: "INIT", state: loadLocalCollections(), mode: "local", status: "ready" });
      return;
    }

    dispatch({ type: "INIT", state: EMPTY_COLLECTIONS, mode: "firestore", status: "connecting" });
    return subscribeToFirestoreCollections(
      firebaseClients.db,
      (collectionKey, records) => {
        dispatch({ type: "SYNC_COLLECTION", collection: collectionKey, records: records as unknown as IdentifiableRecord[] });
      },
      (error) => {
        dispatch({ type: "SET_STATUS", status: "error", error: error.message });
      }
    );
  }, [firebaseClients]);

  const persist = useCallback(
    (collection: CollectionKey, item: IdentifiableRecord) => {
      if (!firebaseClients) return;
      upsertFirestoreRecord(firebaseClients.db, collection, item).catch((error) => {
        dispatch({ type: "SET_STATUS", status: "error", error: error.message });
      });
    },
    [firebaseClients]
  );

  const deleteRemote = useCallback(
    (collection: CollectionKey, id: string) => {
      if (!firebaseClients) return;
      deleteFirestoreRecord(firebaseClients.db, collection, id).catch((error) => {
        dispatch({ type: "SET_STATUS", status: "error", error: error.message });
      });
    },
    [firebaseClients]
  );

  const add = useCallback(
    <T extends { id?: string }>(collection: CollectionKey, item: T): string => {
      const id = item.id || generateId();
      const withId = { ...item, id } as unknown as IdentifiableRecord;
      dispatch({ type: "ADD", collection, item: withId });
      persist(collection, withId);
      return id;
    },
    [persist]
  );

  const update = useCallback(
    (collection: CollectionKey, item: IdentifiableRecord) => {
      dispatch({ type: "UPDATE", collection, item });
      persist(collection, item);
    },
    [persist]
  );

  const remove = useCallback(
    (collection: CollectionKey, id: string) => {
      dispatch({ type: "DELETE", collection, id });
      deleteRemote(collection, id);
    },
    [deleteRemote]
  );

  const value: AppContextValue = {
    ...state,
    addVendor: (v) => add("vendors", v),
    updateVendor: (v) => update("vendors", v as unknown as IdentifiableRecord),
    deleteVendor: (id) => remove("vendors", id),
    uploadVendorImages: async (vendorId, files) => {
      if (!firebaseClients) {
        throw new Error("Firebase Storage no esta configurado. Anade las variables NEXT_PUBLIC_FIREBASE_*.");
      }
      const urls = await Promise.all(files.map((file) => uploadVendorImage(firebaseClients.storage, vendorId, file)));
      const vendor = state.vendors.find((item) => item.id === vendorId);
      if (vendor) {
        update("vendors", { ...vendor, images: [...(vendor.images || []), ...urls] } as unknown as IdentifiableRecord);
      }
      return urls;
    },
    addVendorPrice: (p) => add("vendorPrices", p),
    updateVendorPrice: (p) => update("vendorPrices", p as unknown as IdentifiableRecord),
    addLead: (l) => add("leads", l),
    updateLead: (l) => update("leads", l as unknown as IdentifiableRecord),
    deleteLead: (id) => remove("leads", id),
    addClient: (c) => add("clients", c),
    updateClient: (c) => update("clients", c as unknown as IdentifiableRecord),
    deleteClient: (id) => remove("clients", id),
    addEvent: (e) => add("events", e),
    updateEvent: (e) => update("events", e as unknown as IdentifiableRecord),
    deleteEvent: (id) => remove("events", id),
    addEventService: (s) => add("eventServices", s),
    updateEventService: (s) => update("eventServices", s as unknown as IdentifiableRecord),
    deleteEventService: (id) => remove("eventServices", id),
    addTask: (t) => add("tasks", t),
    updateTask: (t) => update("tasks", t as unknown as IdentifiableRecord),
    deleteTask: (id) => remove("tasks", id),
    addCalendarItem: (c) => add("calendarItems", c),
    addDocument: (d) => add("documents", d),
    addCommunication: (c) => add("communications", c),
    addParejaProfile: (p) => add("parejaProfiles", p),
    updateParejaProfile: (p) => update("parejaProfiles", p as unknown as IdentifiableRecord),
    deleteParejaProfile: (id) => remove("parejaProfiles", id),
    addReunion: (r) => add("reuniones", r),
    updateReunion: (r) => update("reuniones", r as unknown as IdentifiableRecord),
    deleteReunion: (id) => remove("reuniones", id),
    addChecklistItem: (i) => add("checklistItems", i),
    updateChecklistItem: (i) => update("checklistItems", i as unknown as IdentifiableRecord),
    deleteChecklistItem: (id) => remove("checklistItems", id),
    addEmailRecord: (e) => add("emailRecords", e),
    addWorkspacePage: (p) => add("workspacePages", p),
    updateWorkspacePage: (p) => update("workspacePages", p as unknown as IdentifiableRecord),
    deleteWorkspacePage: (id) => remove("workspacePages", id),
    addWorkspaceBlock: (b) => add("workspaceBlocks", b),
    updateWorkspaceBlock: (b) => update("workspaceBlocks", b as unknown as IdentifiableRecord),
    deleteWorkspaceBlock: (id) => remove("workspaceBlocks", id),
    addNotificationRecord: (n) => add("notificationRecords", n),
    updateNotificationRecord: (n) => update("notificationRecords", n as unknown as IdentifiableRecord),
    deleteNotificationRecord: (id) => remove("notificationRecords", id),
    addCompanyFinanceRecord: (r) => add("companyFinanceRecords", r),
    updateCompanyFinanceRecord: (r) => update("companyFinanceRecords", r as unknown as IdentifiableRecord),
    deleteCompanyFinanceRecord: (id) => remove("companyFinanceRecords", id),
    generateId,
    seedOfficialVendors: () => {
      const existingVendorIds = new Set(state.vendors.map((vendor) => vendor.id));
      const existingPriceIds = new Set(state.vendorPrices.map((price) => price.id));
      const vendorsToAdd = officialVendorSeed.filter((vendor) => !existingVendorIds.has(vendor.id));
      const pricesToAdd = officialVendorPriceSeed.filter((price) => !existingPriceIds.has(price.id));

      vendorsToAdd.forEach((vendor) => {
        const item = vendor as unknown as IdentifiableRecord;
        dispatch({ type: "ADD", collection: "vendors", item });
        persist("vendors", item);
      });

      pricesToAdd.forEach((price) => {
        const item = price as unknown as IdentifiableRecord;
        dispatch({ type: "ADD", collection: "vendorPrices", item });
        persist("vendorPrices", item);
      });

      return {
        vendorsAdded: vendorsToAdd.length,
        pricesAdded: pricesToAdd.length
      };
    },
    exportBackup: () => ({
      app: "nomad-weddings",
      version: 1,
      exportedAt: new Date().toISOString(),
      collections: FIRESTORE_COLLECTIONS.reduce((acc, collection) => {
        acc[collection] = state[collection] as never;
        return acc;
      }, { ...EMPTY_COLLECTIONS })
    }),
    importBackup: (payload) => {
      const importedState = parseBackupPayload(payload);
      dispatch({ type: "REPLACE_ALL", state: importedState });
      if (firebaseClients) {
        importCollectionsToFirestore(firebaseClients.db, importedState).catch((error) => {
          dispatch({ type: "SET_STATUS", status: "error", error: error.message });
        });
      }
      return {
        importedCollections: FIRESTORE_COLLECTIONS.length,
        importedRecords: FIRESTORE_COLLECTIONS.reduce((total, collection) => total + importedState[collection].length, 0)
      };
    },
    resetToSeed: () => {
      dispatch({ type: "CLEAR_ALL" });
      if (firebaseClients) {
        clearFirestoreCollections(firebaseClients.db).catch((error) => {
          dispatch({ type: "SET_STATUS", status: "error", error: error.message });
        });
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
