// ── Discounting Reinforcer Field Component ──────────────────────────────────────

import { Label } from "#/components/ui/label.tsx";
import { Input } from "#/components/ui/input.tsx";

/**
 * Props for the DiscountingReinforcerField component.
 */
interface DiscountingReinforcerFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Renders a field for configuring the reinforcer label in discounting tasks.
 */
export function DiscountingReinforcerField({
  value,
  onChange,
}: DiscountingReinforcerFieldProps) {
  return (
    <>
      <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
        Reinforcer Information
      </h3>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-reinforcer">Reinforcer Label</Label>
        <Input
          id="c-reinforcer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Dollars"
        />
        <p className="text-xs text-muted-foreground">
          The reward participants choose between in the discounting task (e.g.,
          $50 now vs. $100 later).
        </p>
      </div>
    </>
  );
}
