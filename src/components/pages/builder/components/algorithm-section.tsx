// ── Algorithm Section Component ────────────────────────────────────────────────

import { Checkbox } from "#/components/ui/checkbox.tsx";
import { Input } from "#/components/ui/input.tsx";
import { Label } from "#/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select.tsx";
import { AlgorithmThreshold } from "#/types/survey.js";

/**
 * Props for the AlgorithmSection component.
 */
interface AlgorithmSectionProps {
  algorithm: AlgorithmThreshold;
  setAlgorithm: (v: AlgorithmThreshold) => void;
  maxTrials: string;
  setMaxTrials: (v: string) => void;
  beta: string;
  setBeta: (v: string) => void;
  compound: boolean;
  setCompound: (v: boolean) => void;
  idPrefix: string;
}

/**
 * Renders the algorithm configuration section of the form.
 * Handles stopping rule selection and related parameters for both
 * MaximumIteration and RegretMin algorithms.
 */
export function AlgorithmSection({
  algorithm,
  setAlgorithm,
  maxTrials,
  setMaxTrials,
  beta,
  setBeta,
  compound,
  setCompound,
  idPrefix,
}: AlgorithmSectionProps) {
  return (
    <>
      <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
        Algorithm
      </h3>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-algo`}>Stopping Rule</Label>
        <Select
          value={algorithm}
          onValueChange={(v) => setAlgorithm(v as AlgorithmThreshold)}
        >
          <SelectTrigger id={`${idPrefix}-algo`} className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={AlgorithmThreshold.RegretMin}>
              Entropy Plateau (Adaptive Stopping)
            </SelectItem>
            <SelectItem value={AlgorithmThreshold.MaximumIteration}>
              Maximum Iterations (Fixed Trial Count)
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Algorithm for informing the questions presented.
        </p>
      </div>

      {algorithm === AlgorithmThreshold.MaximumIteration && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={`${idPrefix}-maxtrials`}>Number of Questions</Label>
          <Input
            id={`${idPrefix}-maxtrials`}
            type="number"
            min="5"
            max="100"
            step="1"
            value={maxTrials}
            onChange={(e) => setMaxTrials(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Default: 20. Minimum: 5.
          </p>
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-beta`}>
          Beta{" "}
          <span className="font-normal text-muted-foreground">
            (suppression rate)
          </span>
        </Label>
        <Input
          id={`${idPrefix}-beta`}
          type="number"
          min="0.01"
          max="0.95"
          step="0.01"
          value={beta}
          onChange={(e) => setBeta(e.target.value)}
          placeholder="0.25"
        />
        <p className="text-xs text-muted-foreground">
          Lower values concentrate beliefs more aggressively each trial.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id={`${idPrefix}-compound`}
          checked={compound}
          onCheckedChange={(v) => setCompound(v === true)}
        />
        <Label htmlFor={`${idPrefix}-compound`}>
          Exponential belief suppression (β<sup>k</sup>)
        </Label>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        Off: beliefs × β per trial. On: beliefs × β<sup>k</sup>, where k is the
        trial number — suppression intensifies with each question.
      </p>
    </>
  );
}
