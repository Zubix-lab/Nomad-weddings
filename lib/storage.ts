function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getCollection<T>(key: string, fallback: T[] = []): T[] {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function setCollection<T>(key: string, data: T[]): void {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage", e);
  }
}

export function getItem<T extends { id: string }>(key: string, id: string): T | undefined {
  const collection = getCollection<T>(key);
  return collection.find((item) => item.id === id);
}

export function addItem<T extends { id: string }>(key: string, item: T): void {
  const collection = getCollection<T>(key);
  collection.push(item);
  setCollection(key, collection);
}

export function updateItem<T extends { id: string }>(key: string, item: T): void {
  const collection = getCollection<T>(key);
  const index = collection.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    collection[index] = item;
    setCollection(key, collection);
  }
}

export function deleteItem(key: string, id: string): void {
  const collection = getCollection<{ id: string }>(key);
  const filtered = collection.filter((item) => item.id !== id);
  setCollection(key, filtered);
}

export function generateId(): string {
  return "item-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7);
}
