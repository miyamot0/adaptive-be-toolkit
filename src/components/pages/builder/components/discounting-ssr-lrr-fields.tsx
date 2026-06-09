// ── Discounting SSR/LLR Fields Component ───────────────────────────────────────

import { Label } from "#/components/ui/label.tsx";
import { Input } from "#/components/ui/input.tsx";

/**
 * Props for the DiscountingSSRLRRFields component.
 */
interface DiscountingSSRLRRFieldsProps {
  ssr: string;
  setSsr: (value: string) => void;
  llr: string;
  setLlr: (value: string) => void;
}

/**
 * Renders fields for configuring the Smaller-Sooner and Larger-Later reinforcer values.
 */
export function DiscountingSSRLRRFields({
  ssr,
  setSsr,
  llr,
  setLlr,
}: DiscountingSSRLRRFieldsProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-ssr">Smaller-Sooner Reinforcer (SSR)</Label>
        <Input
          id="c-ssr"
          type="number"
          min="1"
          value={ssr}
          onChange={(e) => setSsr(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Immediate reward amount (e.g., $5 now). Lower SSR relative to LLR
          increases patience.
        </p>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-llr">Larger-Later Reinforcer (LLR)</Label>
        <Input
          id="c-llr"
          type="number"
          min="1"
          value={llr}
          onChange={(e) => setLlr(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Delayed reward amount (e.g., $10 later). Higher LLR relative to SSR
          encourages waiting.
        </p>
      </div>
    </>
  );
}
