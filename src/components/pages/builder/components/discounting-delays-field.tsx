// ── Discounting Delays Field Component ──────────────────────────────────────────

import { Label } from "#/components/ui/label.tsx";
import { Input } from "#/components/ui/input.tsx";

/**
 * Props for the DiscountingDelaysField component.
 */
interface DiscountingDelaysFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Renders a field for configuring custom delay levels in discounting tasks.
 * When left blank, uses the default multi-scale delay ladder.
 */
export function DiscountingDelaysField({
  value,
  onChange,
}: DiscountingDelaysFieldProps) {
  return (
    <>
      <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
        Delay Levels
      </h3>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-delays">
          Custom Delays{" "}
          <span className="font-normal text-muted-foreground">
            (comma-separated, optional)
          </span>
        </Label>
        <Input
          id="c-delays"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Leave blank for default multi-scale delay ladder"
        />
        <p className="text-xs text-muted-foreground">
          Must contain at least 8 values (days) if provided. Example:{" "}
          <code className="font-mono">1,7,14,30,90,180,365,730</code>
        </p>
      </div>
    </>
  );
}
