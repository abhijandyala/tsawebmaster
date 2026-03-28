'use client';

/**
 * Single mount point for Google Translate. The widget must stay in the DOM (not `display: none`)
 * so the hidden <select class="goog-te-combo"> exists for programmatic language changes.
 */
export function GoogleTranslateMount() {
  return (
    <div
      id="google_translate_element"
      className="google-translate-root"
      aria-hidden
    />
  );
}
