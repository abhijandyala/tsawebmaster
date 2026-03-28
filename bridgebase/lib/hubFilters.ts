import type { Resource, FilterState, Category, Cost, Format, Audience } from '@/lib/types';

export const DEFAULT_HUB_FILTERS: FilterState = {
  search: '',
  categories: [],
  neighborhood: '',
  cost: '',
  format: '',
  audience: '',
  openNow: false,
  sort: 'relevant',
};

const CATEGORY_VALUES: Category[] = [
  'Food Assistance',
  'Housing',
  'Healthcare',
  'Mental Health',
  'Education',
  'Jobs',
  'Transportation',
  'Youth Programs',
  'Emergency Help',
];

function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)));
}

/** Best-effort “open now” from free-text hours (call ahead for exact times). */
export function resourceAppearsOpenNow(r: Resource): boolean {
  const text = `${r.hours} ${r.availabilitySummary || ''}`;
  if (/\b(24\s*-?\s*h|24\/7|always open|open daily|every day|7\s*days|open now)\b/i.test(text)) return true;

  const now = new Date();
  const dow = now.getDay();
  const t = now.getHours() + now.getMinutes() / 60;
  const weekday = dow >= 1 && dow <= 5;

  if (weekday && /mon\s*[–-]\s*fri|monday\s*[–-]\s*friday|weekdays|m\s*[\u2013\-]\s*f\b/i.test(text)) {
    if (t >= 8 && t < 18) return true;
  }
  if (/daily|each day|breakfast|lunch|dinner/i.test(text) && t >= 7 && t < 20) return true;
  if ((dow === 0 || dow === 6) && /\b(sat|sun|weekend)\b/i.test(text) && t >= 9 && t < 17) return true;

  return false;
}

function relevanceScore(r: Resource, q: string): number {
  const words = q.split(/\s+/).filter((w) => w.length > 1);
  if (words.length === 0) return 0;
  const name = r.name.toLowerCase();
  const desc = r.description.toLowerCase();
  const cat = r.category.toLowerCase();
  let score = 0;
  for (const w of words) {
    if (name.startsWith(w)) score += 12;
    else if (name.includes(w)) score += 8;
    else if (cat.includes(w)) score += 5;
    else if (desc.includes(w)) score += 3;
    else if (r.tags.some((t) => t.toLowerCase().includes(w))) score += 4;
    else if (r.services.some((s) => s.toLowerCase().includes(w))) score += 4;
  }
  return score;
}

export function filterHubResources(
  items: Resource[],
  filters: FilterState,
  opts?: { userLat?: number | null; userLng?: number | null }
): Resource[] {
  let out = [...items];
  const q = filters.search.trim().toLowerCase();

  if (q) {
    out = out.filter((r) => {
      const hay = [
        r.name,
        r.organizationName,
        r.description,
        r.longDescription,
        r.category,
        r.city,
        r.neighborhood,
        r.eligibility,
        ...r.tags,
        ...r.services,
        ...r.languages,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const words = q.split(/\s+/).filter((w) => w.length > 0);
      return words.every((w) => hay.includes(w));
    });
  }

  if (filters.categories.length > 0) {
    out = out.filter((r) => filters.categories.includes(r.category));
  }

  if (filters.neighborhood) {
    const needle = filters.neighborhood.toLowerCase();
    out = out.filter((r) => {
      const hood = (r.neighborhood || '').toLowerCase();
      const city = r.city.toLowerCase();
      return hood.includes(needle) || needle.includes(hood) || city.includes(needle);
    });
  }

  if (filters.cost) {
    out = out.filter((r) => r.cost === filters.cost);
  }

  if (filters.format) {
    out = out.filter((r) => r.format === filters.format);
  }

  const audienceFilter = filters.audience;
  if (audienceFilter) {
    out = out.filter((r) => r.audience.includes(audienceFilter));
  }

  if (filters.openNow) {
    out = out.filter((r) => resourceAppearsOpenNow(r));
  }

  const lat = opts?.userLat;
  const lng = opts?.userLng;
  const hasGeo = lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng);

  if (filters.sort === 'alphabetical') {
    out.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.sort === 'nearby') {
    if (hasGeo) {
      out.sort((a, b) => {
        const da = a.coordinates
          ? haversineKm(lat!, lng!, a.coordinates.lat, a.coordinates.lng)
          : 1e9;
        const db = b.coordinates
          ? haversineKm(lat!, lng!, b.coordinates.lat, b.coordinates.lng)
          : 1e9;
        return da - db;
      });
    } else {
      out.sort((a, b) => {
        if (!!a.coordinates !== !!b.coordinates) return a.coordinates ? -1 : 1;
        return a.name.localeCompare(b.name);
      });
    }
  } else {
    out.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if (q) {
        const sa = relevanceScore(a, q);
        const sb = relevanceScore(b, q);
        if (sa !== sb) return sb - sa;
      }
      return a.name.localeCompare(b.name);
    });
  }

  return out;
}

export function filtersToSearchParams(f: FilterState): URLSearchParams {
  const sp = new URLSearchParams();
  const s = f.search.trim();
  if (s) sp.set('q', s);
  f.categories.forEach((c) => sp.append('cat', c));
  if (f.neighborhood) sp.set('area', f.neighborhood);
  if (f.cost) sp.set('cost', f.cost);
  if (f.format) sp.set('format', f.format);
  if (f.audience) sp.set('audience', f.audience);
  if (f.openNow) sp.set('open', '1');
  if (f.sort && f.sort !== 'relevant') sp.set('sort', f.sort);
  return sp;
}

const COSTS: Cost[] = ['Free', 'Low-cost', 'Varies'];
const FORMATS: Format[] = ['In-person', 'Online', 'Hybrid'];
const AUDIENCES: Audience[] = ['Youth', 'Families', 'Seniors', 'General'];

export function parseHubSearchParams(sp: URLSearchParams): Partial<FilterState> {
  const out: Partial<FilterState> = {};
  const q = sp.get('q');
  if (q) out.search = q;

  const cats = sp.getAll('cat').filter((c): c is Category => CATEGORY_VALUES.includes(c as Category));
  if (cats.length) out.categories = cats;

  const area = sp.get('area');
  if (area) out.neighborhood = area;

  const cost = sp.get('cost');
  if (cost && COSTS.includes(cost as Cost)) out.cost = cost as Cost;

  const format = sp.get('format');
  if (format && FORMATS.includes(format as Format)) out.format = format as Format;

  const audience = sp.get('audience');
  if (audience && AUDIENCES.includes(audience as Audience)) out.audience = audience as Audience;

  if (sp.get('open') === '1') out.openNow = true;

  const sort = sp.get('sort');
  if (sort === 'alphabetical' || sort === 'nearby' || sort === 'relevant') out.sort = sort;

  return out;
}

export function mergeHubFilters(base: FilterState, partial: Partial<FilterState>): FilterState {
  return {
    search: partial.search !== undefined ? partial.search : base.search,
    categories: partial.categories !== undefined ? partial.categories : base.categories,
    neighborhood: partial.neighborhood !== undefined ? partial.neighborhood : base.neighborhood,
    cost: partial.cost !== undefined ? partial.cost : base.cost,
    format: partial.format !== undefined ? partial.format : base.format,
    audience: partial.audience !== undefined ? partial.audience : base.audience,
    openNow: partial.openNow !== undefined ? partial.openNow : base.openNow,
    sort: partial.sort !== undefined ? partial.sort : base.sort,
  };
}
