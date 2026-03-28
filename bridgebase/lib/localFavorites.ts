const KEY = 'clt-favorite-ids';

export function getLocalFavoriteIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]).filter((x) => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

export function setLocalFavoriteIds(ids: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    /* quota / private mode */
  }
}

export function addLocalFavorite(resourceId: string): void {
  const cur = getLocalFavoriteIds().filter((id) => id !== resourceId);
  cur.unshift(resourceId);
  setLocalFavoriteIds(cur);
}

export function removeLocalFavorite(resourceId: string): void {
  setLocalFavoriteIds(getLocalFavoriteIds().filter((id) => id !== resourceId));
}

export function toggleLocalFavorite(resourceId: string): boolean {
  const ids = getLocalFavoriteIds();
  if (ids.includes(resourceId)) {
    removeLocalFavorite(resourceId);
    return false;
  }
  addLocalFavorite(resourceId);
  return true;
}
