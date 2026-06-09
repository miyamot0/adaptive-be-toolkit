// ── Demand Entropy Field Component ──────────────────────────────────────────────

import { Label } from "#/components/ui/label.tsx";
import { Input } from "#/components/ui/input.tsx";

/**
 * Props for the DemandEntropyField component.
 */
interface DemandEntropyFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Renders a conditional field for configuring the entropy threshold in demand tasks.
 * Only shown when using the RegretMin algorithm. Controls when the algorithm stops
 * based on belief concentration (0 = never stop, 0.5 = stop immediately).
 */
export function DemandEntropyField({
  value,
  onChange,
}: DemandEntropyFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="d-entropy">Entropy Threshold</Label>
      <Input
        id="d-entropy"
        type="number"
        min="0"
        max="0.5"
        step="0.01"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-muted-foreground">
        Controls when algorithm stops based on belief concentration (0 = never
        stop, 0.5 = stop immediately). Default: 0.25
      </p>
    </div>
  );
}
