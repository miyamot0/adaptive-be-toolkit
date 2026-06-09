// ── Field Row Component ────────────────────────────────────────────────────────

/**
 * Renders a field row wrapper for form fields.
 * Provides consistent vertical spacing and layout for individual input groups.
 */
export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-1.5">{children}</div>;
}
