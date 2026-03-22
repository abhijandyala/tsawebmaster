const KEY = 'clt-recent-resources';
const MAX = 20;

export function getLocalRecentIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

export function pushLocalRecent(resourceId: string): void {
  if (typeof window === 'undefined') return;
  const cur = getLocalRecentIds().filter((id) => id !== resourceId);
  cur.unshift(resourceId);
  localStorage.setItem(KEY, JSON.stringify(cur.slice(0, MAX)));
}
