import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  type Firestore,
  type Unsubscribe
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes, type FirebaseStorage } from "firebase/storage";
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

export interface AppCollections {
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
  companyFinanceRecords: CompanyFinanceRecord[];
}

export type AppCollectionKey = keyof AppCollections;

export const FIRESTORE_COLLECTIONS: AppCollectionKey[] = [
  "leads",
  "clients",
  "events",
  "vendors",
  "vendorPrices",
  "eventServices",
  "tasks",
  "calendarItems",
  "documents",
  "communications",
  "parejaProfiles",
  "reuniones",
  "checklistItems",
  "emailRecords",
  "workspacePages",
  "workspaceBlocks",
  "notificationRecords",
  "companyFinanceRecords"
];

export const EMPTY_COLLECTIONS: AppCollections = {
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
  companyFinanceRecords: []
};

type AnyRecord = Record<string, unknown> & { id: string };

export function subscribeToFirestoreCollections(
  db: Firestore,
  onCollection: <K extends AppCollectionKey>(collectionKey: K, records: AppCollections[K]) => void,
  onError: (error: Error) => void
): Unsubscribe {
  const unsubscribers = FIRESTORE_COLLECTIONS.map((collectionKey) => {
    return onSnapshot(
      collection(db, collectionKey),
      (snapshot) => {
        const records = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as AppCollections[typeof collectionKey];
        onCollection(collectionKey, records);
      },
      (error) => onError(error)
    );
  });

  return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
}

export async function upsertFirestoreRecord<T extends AnyRecord>(
  db: Firestore,
  collectionKey: AppCollectionKey,
  item: T
): Promise<void> {
  const { id, ...payload } = item;
  await setDoc(doc(db, collectionKey, id), payload, { merge: true });
}

export async function deleteFirestoreRecord(
  db: Firestore,
  collectionKey: AppCollectionKey,
  id: string
): Promise<void> {
  await deleteDoc(doc(db, collectionKey, id));
}

export async function importCollectionsToFirestore(db: Firestore, collectionsPayload: AppCollections): Promise<void> {
  await Promise.all(
    FIRESTORE_COLLECTIONS.flatMap((collectionKey) =>
      collectionsPayload[collectionKey].map((item) => upsertFirestoreRecord(db, collectionKey, item as unknown as AnyRecord))
    )
  );
}

export async function clearFirestoreCollections(db: Firestore): Promise<void> {
  const snapshots = await Promise.all(FIRESTORE_COLLECTIONS.map((collectionKey) => getDocs(collection(db, collectionKey))));
  await Promise.all(snapshots.flatMap((snapshot) => snapshot.docs.map((item) => deleteDoc(item.ref))));
}

export async function exportCollectionsFromFirestore(db: Firestore): Promise<AppCollections> {
  const entries = await Promise.all(
    FIRESTORE_COLLECTIONS.map(async (collectionKey) => {
      const snapshot = await getDocs(collection(db, collectionKey));
      return [
        collectionKey,
        snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))
      ] as const;
    })
  );

  return entries.reduce((acc, [collectionKey, records]) => {
    acc[collectionKey] = records as never;
    return acc;
  }, { ...EMPTY_COLLECTIONS });
}

export async function uploadVendorImage(storage: FirebaseStorage, vendorId: string, file: File): Promise<string> {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
  const imageRef = ref(storage, `vendors/${vendorId}/${safeName}`);
  await uploadBytes(imageRef, file, { contentType: file.type || "image/jpeg" });
  return getDownloadURL(imageRef);
}
