// ── Demand Prices Field Component ───────────────────────────────────────────────

import { Label } from "#/components/ui/label.tsx";
import { Input } from "#/components/ui/input.tsx";

/**
 * Props for the DemandPricesField component.
 */
interface DemandPricesFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Renders a field for configuring custom price levels in demand tasks.
 * When left blank, uses the default 63-point price ladder.
 */
export function DemandPricesField({ value, onChange }: DemandPricesFieldProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="d-prices">
          Custom Prices{" "}
          <span className="font-normal text-muted-foreground">
            (comma-separated, optional)
          </span>
        </Label>
        <Input
          id="d-prices"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Leave blank for default 63-point price ladder"
        />
        <p className="text-xs text-muted-foreground">
          Must contain at least 8 values if provided. Example:{" "}
          <code className="font-mono">0.1,0.5,1,5,10,20,30,50</code>
        </p>
      </div>
    </>
  );
}
