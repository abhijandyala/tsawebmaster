/** Fixed rail width (matches Tailwind ml-16 = 4rem) */
export const SIDEBAR_RAIL_PX = 64;

/** Sidebar width when hovered / expanded */
export const SIDEBAR_EXPANDED_PX = 220;

/**
 * Extra left inset for the app column so content stays clear when the rail expands
 * (expanded sidebar draws over this many pixels past the reserved margin).
 */
export const SIDEBAR_OVERLAY_INSET_PX = SIDEBAR_EXPANDED_PX - SIDEBAR_RAIL_PX;

