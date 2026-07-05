import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { getFirebaseClients } from "@/lib/firebase";

export async function readApiCollection<T>(collectionKey: string): Promise<T[]> {
  const clients = getFirebaseClients();
  if (!clients) return [];

  const snapshot = await getDocs(collection(clients.db, collectionKey));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as T[];
}

export async function writeApiDocument<T extends { id: string }>(collectionKey: string, item: T): Promise<void> {
  const clients = getFirebaseClients();
  if (!clients) return;

  const { id, ...payload } = item;
  await setDoc(doc(clients.db, collectionKey, id), payload, { merge: true });
}
