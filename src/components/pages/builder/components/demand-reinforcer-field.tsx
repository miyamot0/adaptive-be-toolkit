// ── Demand Reinforcer Field Component ──────────────────────────────────────────

import { Label } from "#/components/ui/label.tsx";
import { Input } from "#/components/ui/input.tsx";

/**
 * Props for the DemandReinforcerField component.
 */
interface DemandReinforcerFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Renders a field for configuring the reinforcer label in demand tasks.
 */
export function DemandReinforcerField({
  value,
  onChange,
}: DemandReinforcerFieldProps) {
  return (
    <>
      <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
        Reinforcer
      </h3>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="d-reinforcer">Reinforcer Label</Label>
        <Input
          id="d-reinforcer"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Coffee"
        />
        <p className="text-xs text-muted-foreground">
          The item or reward participants earn in the adaptive purchase task.
        </p>
      </div>
    </>
  );
}
