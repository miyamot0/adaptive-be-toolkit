// ── Section Heading Component ──────────────────────────────────────────────────

/**
 * Renders a section heading with consistent styling.
 * Used to visually separate different configuration groups within the form.
 */
export function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
      {children}
    </h3>
  );
}
