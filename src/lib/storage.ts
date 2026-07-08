const STORAGE_PREFIX = "steady.";

export const KEYS = {
  doses: STORAGE_PREFIX + "doses",
  weights: STORAGE_PREFIX + "weights",
  glucose: STORAGE_PREFIX + "glucose",
  food: STORAGE_PREFIX + "food",
  markers: STORAGE_PREFIX + "markers",
  progressPhotos: STORAGE_PREFIX + "progressPhotos",
} as const;

const LEGACY_FACE_PHOTO_KEY = STORAGE_PREFIX + "markers.face";

export function migrateLegacyFacePhoto(): void {
  const legacy = loadValue<string | null>(LEGACY_FACE_PHOTO_KEY, null);
  if (!legacy) return;
  const existing = loadList<{ id: string }>(KEYS.progressPhotos);
  if (existing.length === 0) {
    saveList(KEYS.progressPhotos, [{ id: uid(), createdAt: Date.now(), photo: legacy }]);
  }
  localStorage.removeItem(LEGACY_FACE_PHOTO_KEY);
}

export function loadList<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("Failed to load", key, err);
    return [];
  }
}

export function saveList<T>(key: string, list: T[]): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    return true;
  } catch (err) {
    console.error("Failed to save", key, err);
    return false;
  }
}

export function loadValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error("Failed to load", key, err);
    return fallback;
  }
}

export function saveValue<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error("Failed to save", key, err);
    return false;
  }
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function todayISO(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

export function addDays(isoDate: string, days: number): Date {
  const d = new Date(isoDate + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(isoDate?: string): string {
  if (!isoDate) return "—";
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDateShort(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00");
  if (isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function sortByDateDesc<T extends { date: string; createdAt: number }>(list: T[]): T[] {
  return [...list].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : (a.createdAt || 0) < (b.createdAt || 0) ? 1 : -1,
  );
}

export function sortByDateAsc<T extends { date: string; createdAt: number }>(list: T[]): T[] {
  return [...list].sort((a, b) =>
    a.date > b.date ? 1 : a.date < b.date ? -1 : (a.createdAt || 0) > (b.createdAt || 0) ? 1 : -1,
  );
}
