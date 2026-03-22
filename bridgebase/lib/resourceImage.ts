import type { Category } from '@/lib/types';

const GRADIENTS: Record<Category, string> = {
  'Food Assistance': 'from-emerald-800/90 to-green-950/90',
  Housing: 'from-sky-900/90 to-blue-950/90',
  Healthcare: 'from-rose-900/90 to-red-950/90',
  'Mental Health': 'from-violet-900/90 to-purple-950/90',
  Education: 'from-amber-800/90 to-orange-950/90',
  Jobs: 'from-teal-800/90 to-cyan-950/90',
  Transportation: 'from-slate-700/90 to-slate-900/90',
  'Youth Programs': 'from-fuchsia-800/90 to-pink-950/90',
  'Emergency Help': 'from-red-800/90 to-red-950/90',
};

export function resourceImageGradient(category: Category): string {
  return GRADIENTS[category] ?? 'from-[#23361D]/90 to-[#50692B]/90';
}

export function resourceCoverSrc(resource: {
  imageUrl?: string;
  imageUrls?: string[];
}): string | null {
  if (resource.imageUrls?.length) return resource.imageUrls[0]!;
  if (resource.imageUrl) return resource.imageUrl;
  return null;
}
