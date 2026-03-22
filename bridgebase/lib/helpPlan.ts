import { SearchResult } from './searchService';

export interface SavedResource {
  id: string;
  name: string;
  category: string;
  address: string;
  phone?: string;
  website?: string;
  cost?: string;
  notes?: string;
  savedAt: string;
}

const STORAGE_KEY = 'charlotte-connect-help-plan';

export function getSavedResources(): SavedResource[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveResource(result: SearchResult, notes?: string): void {
  const saved = getSavedResources();
  
  if (saved.some(r => r.id === result.id)) {
    return;
  }
  
  const newResource: SavedResource = {
    id: result.id,
    name: result.name,
    category: result.category,
    address: result.location.address,
    phone: result.phone,
    website: result.website,
    cost: result.cost,
    notes,
    savedAt: new Date().toISOString(),
  };
  
  saved.push(newResource);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  
  window.dispatchEvent(new CustomEvent('help-plan-updated'));
}

export function removeResource(id: string): void {
  const saved = getSavedResources();
  const filtered = saved.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  window.dispatchEvent(new CustomEvent('help-plan-updated'));
}

export function updateNotes(id: string, notes: string): void {
  const saved = getSavedResources();
  const index = saved.findIndex(r => r.id === id);
  
  if (index !== -1) {
    saved[index].notes = notes;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }
}

export function clearPlan(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('help-plan-updated'));
}

export function isResourceSaved(id: string): boolean {
  return getSavedResources().some(r => r.id === id);
}

export function generateShareUrl(): string {
  const saved = getSavedResources();
  const encoded = btoa(JSON.stringify(saved.map(r => r.id)));
  return `${window.location.origin}/my-plan?shared=${encoded}`;
}
