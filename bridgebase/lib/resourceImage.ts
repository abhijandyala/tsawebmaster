import type { Category } from '@/lib/types';

/** Category hero gradients using forest / blue / olive / mustard — not flat green */
const GRADIENTS: Record<Category, string> = {
  'Food Assistance': 'from-[#447CB3]/90 via-[#50692B]/85 to-[#23361D]/95',
  Housing: 'from-[#23361D]/90 via-[#447CB3]/75 to-[#D4D8EC]/40',
  Healthcare: 'from-[#447CB3]/85 to-[#23361D]/90',
  'Mental Health': 'from-[#50692B]/80 via-[#447CB3]/70 to-[#23361D]/90',
  Education: 'from-[#BBB857]/75 via-[#447CB3]/65 to-[#23361D]/88',
  Jobs: 'from-[#23361D]/88 to-[#447CB3]/80',
  Transportation: 'from-[#447CB3]/80 to-[#50692B]/85',
  'Youth Programs': 'from-[#BBB857]/70 via-[#447CB3]/60 to-[#23361D]/85',
  'Emergency Help': 'from-[#b03d32]/85 to-[#23361D]/90',
};

export function resourceImageGradient(category: Category): string {
  return GRADIENTS[category] ?? 'from-[#447CB3]/80 via-[#50692B]/75 to-[#23361D]/90';
}

export function resourceCoverSrc(resource: {
  imageUrl?: string;
  imageUrls?: string[];
}): string | null {
  if (resource.imageUrls?.length) return resource.imageUrls[0]!;
  if (resource.imageUrl) return resource.imageUrl;
  return null;
}
