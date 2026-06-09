// ── Algorithm Settings Field Component ───────────────────────────────────────────

import { Label } from "#/components/ui/label.tsx";
import { Input } from "#/components/ui/input.tsx";

/**
 * Props for the AlgorithmSettingsField component.
 */
interface AlgorithmSettingsFieldProps {
  value: string;
  onChange: (value: string) => void;
  idPrefix: string;
}

/**
 * Renders a field for configuring algorithm settings with a minimum floor value.
 * Ensures values don't go below the specified minimum threshold.
 */
export function AlgorithmSettingsField({
  value,
  onChange,
  idPrefix,
}: AlgorithmSettingsFieldProps) {
  const minValue = "0.01";

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`${idPrefix}-entropy`}>Entropy Threshold</Label>
      <Input
        id={`${idPrefix}-entropy`}
        type="number"
        min={minValue}
        max="0.5"
        step="0.01"
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          // Apply minimum floor to prevent values below 0.01
          if (newValue && parseFloat(newValue) < parseFloat(minValue)) {
            onChange(minValue);
          } else {
            onChange(newValue);
          }
        }}
      />
      <p className="text-xs text-muted-foreground">
        Entropy threshold for adaptive stopping (0.01 = stop early when beliefs
        concentrate, 0.5 = run many trials). Minimum: 0.01
      </p>
    </div>
  );
}
